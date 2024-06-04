import Transformer from "./base"
import path from 'path'

class PathTransformer extends Transformer<string> {
    async transform(value: string, html: string) {
        if (!value) return value
        return path.join('https://vk.com', value)
    }
}

export default PathTransformer