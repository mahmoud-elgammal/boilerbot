import Transformer from "./base"

class Trimmer extends Transformer<string> {
    async transform(value: string, html: string) {
        if (!value) return value
        return value.trim()
    }
}

export default Trimmer