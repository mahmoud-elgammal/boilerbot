import { Attribute } from "../decorators/attribute";
import AttributeValue from "../shared/attribute";
import PathTransformer from "../transformers/path.transformer";
import Translator from "../transformers/translator.transformer";
import Trimmer from "../transformers/trimmer.transformer";
import Structure from "./base";

class Post extends Structure {

    @Attribute({
        default: "N/A",
        transformers: [Trimmer, Translator],
    })
    public description!: string

    @Attribute({
        default: "URL",
        transformers: [PathTransformer],
    })
    public url!: string


    async load(data: {
        description: string,
        url: string
    }) {

        for (const [key, value] of Object.entries(data)) {
            (this as any)[key]
            const attribute = Reflect.getMetadata(key, this) // auto generate when constructor is called
            await attribute.update(value)
        }
    }

    static async create(data: {
        description: string,
        url: string
    }) {
        const post = new Post()
        post.description = data.description
        post.url = data.url
        return post
    }
}


export default Post;