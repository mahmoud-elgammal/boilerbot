import type { IAttributeOptions } from "../shared/attribute.options";
import AttributeValue from "../shared/attribute";


export function Attribute (options: IAttributeOptions = {}) {
    const attribute = new AttributeValue(options)
    return function(target: any, key: ClassFieldDecoratorContext | PropertyKey) {
        Reflect.defineMetadata(key, null, target)
        Object.defineProperty(target, key as PropertyKey, {
            configurable: true,
            enumerable: true,
            set: function(value) {
                const attribute = Reflect.getMetadata(key, this)
                if (!(attribute instanceof AttributeValue)) {
                    const attribute = new AttributeValue(options)
                    attribute.set(value)
                    Reflect.defineMetadata(key, attribute, this)
                } else {
                    attribute.set(value)
                }
            },
            get: function()  {
                const attribute = Reflect.getMetadata(key, this)

                if (!(attribute instanceof AttributeValue)) {
                    const attribute = new AttributeValue(options)
                    Reflect.defineMetadata(key, attribute, this)
                    return attribute.get()
                }

                return attribute.get()
            }
        })
    }
}