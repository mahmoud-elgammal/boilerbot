import Transformer from "./base"

const regex = /^\d+(\.\d+)?$/

class FloatTransformer extends Transformer<number> {
    async transform(value: string, html: string): Promise<number> {

        if (regex.test(value)) {
            return parseFloat(value)
        }

        return 0
    }
}

export default FloatTransformer