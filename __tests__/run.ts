import VKClient, { Credentials } from "../src/client"
import Post from "../src/structures/post"
import Translator from "../src/transformers/translator.transformer"

// Instagram

const credentials = Credentials.load(`# Netscape HTTP Cookie File
# https://curl.haxx.se/rfc/cookie_spec.html
# This is a generated file! Do not edit.
`)


const start = async () => {
    const vk = new VKClient()

    // initialize th client
    await vk.initialize()
    await vk.authorize(credentials)

    // get posts
    const posts = await vk.timeline.posts({ limit: 10 })

    for (const post of posts) {
        console.log(post.toString())
    }
}




start()
