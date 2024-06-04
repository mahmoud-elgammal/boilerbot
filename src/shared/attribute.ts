import { Subject } from "rxjs"
import Transformer from "../transformers/base"
import type { IAttributeOptions } from "./attribute.options"

class Attribute {

    _value: any
    options: IAttributeOptions
    transformers: Subject<string>;

    constructor(options: IAttributeOptions) {
        this.options = options
        this.transformers = new Subject<string>()
        this._value = null

        if (options.transformers) {
            options.transformers.forEach(Transformer => {
                this.transformers.subscribe(async (value) => {
                    console.log(`[${Transformer.name}] start on point ${value} 🚀`)
                    const transform = new Transformer()
                    this._value = await transform.transform(value, '')
                })
            })
        }
    }

    set(value: any) {
        this.transformers.next(value)
        this._value = value
    }

    async update(value: any) {
        return value
    }

    get() {
        return this._value || this.options.default || null
    }
}

export default Attribute