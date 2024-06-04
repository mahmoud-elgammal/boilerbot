import "reflect-metadata";
import puppeteer, { Browser, HTTPRequest, Page, type CookieParam } from "puppeteer";
import rxjs from "rxjs";
import Token from "./structures/token";
import { load } from "cheerio";
import Post from "./structures/post";

interface IConfig {
    browser?: Browser;
    url?: string;
}

class Timeline {
    client: VKClient;
    constructor(client: VKClient) {
        this.client = client
    }

    async posts(config: { limit: number }) {
        await this.client.page.goto('https://vk.com')

        // wait for 100 ms
        await new Promise(r => setTimeout(r, 1000))

        await this.client.page.evaluate(async () => {
            await new Promise((resolve, reject) => {
              let totalHeight = 0;
              const distance = 100; // distance to scroll each step
              const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
        
                if (totalHeight >= scrollHeight) {
                  clearInterval(timer);
                  resolve(0);
                }
              }, 100); // scroll interval in ms
            });
          });

        const $ = load(await this.client.page.content())
        const elements = await $('.feed_row')

        return Promise.all(elements.toArray().map(async (element) => {
            const header = $(element).find('.PostHeader')
            const url = $(header).find('a.PostHeaderSubtitle__link').attr('href') || ''

            const content = $(element).find('.post_info')
            const description = $(content).find('.wall_post_text').text()
            return await Post.create({ description, url })
        }))
    }
}

class Interceptor {

    private client: BaseClient;

    constructor(client: BaseClient) {
        this.client = client
    }

    async intercept(request: HTTPRequest) {
        if (request.url().match(/^(https:\/\/login\.vk\.com)/)) {
            await request.abort();
            return
        }
        await request.continue()
    }
}

export class Credentials {
    cookies: CookieParam[]

    constructor(cookies: CookieParam[]) {
        this.cookies = cookies
    }

    static load(plain: string) {
        const cookies = []

        const raws = plain
        .trim()
        .split('\n')
        .filter(r => r.length > 0)
        .filter(r => r[0] !== '#')
        .map(r => r.trim());
        for (const raw of raws) {
            const [domain, flag1, path, secure, expiration, name, value] = raw.split('\t');

            cookies.push({
                name: name,
                value: value,
                domain: domain,
                path: path,
                secure: secure === 'TRUE',
                expires: parseInt(expiration),
                httpOnly: flag1 === 'TRUE'
            });
        }

        return new Credentials(cookies)
    }

    async authorize(page: Page) {
        await page.setCookie(...this.cookies);
    }

    async logout() {

    }
}


class BaseClient {
    private browser!: Browser;
    public page!: Page;

    private interceptors!: Interceptor[];           // for handle requests
    private pipelines!: rxjs.Observable<unknown>;   // for data response
    private BASE_URL!: string;

    constructor(config: IConfig = {}) {
        this.interceptors = [];
    }

    async initialize(config?: IConfig) {
        this.browser = config?.browser || (await puppeteer.launch({
            headless: false,
        }));

        this.page = await this.browser.newPage();
        this.BASE_URL = config?.url || "https://boilerbot.com";

        this.interceptors.push(new Interceptor(this));
        await this.page.setRequestInterception(true);
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0');

        for (const interceptor of this.interceptors) {
            await this.page.on('request', interceptor.intercept.bind(interceptor));
        }

        this.bootstrap();
        return this
    }

    async close() {
        await this.browser.close();
    }

    use(interceptor: Interceptor) {
        this.interceptors.push(interceptor);
        return this
    }


    bootstrap() {
        // implement the start up here
    }

}

class VKClient extends BaseClient {
    // public timeline!: Timeline;

    // bootstrap() {
    //     this.timeline = new Timeline(this);
    // }

    async authorize(credentials: Credentials) {
        this.page.setCookie(...credentials.cookies);
        await this.page.goto('https://vk.com')
        // throw error if not authorize
        return
    }

    get timeline() {
        return new Timeline(this)
    }
}

export default VKClient;