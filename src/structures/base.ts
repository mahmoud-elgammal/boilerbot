class Structure {
    constructor() {
        this.attributes
    }

    get attributes() {
        const keys = Reflect.getMetadataKeys(this)
        const store: any = {}

        for (const key of keys) {
            const value = Reflect.getMetadata(key, this)
            store[key] = value != null ? value.get() : value
        }

        return store
    }

    json(): string {
        return JSON.stringify(this.attributes, null)
    }

    toString(): string {
        const attributes = Object.entries(this.attributes).map(([key, value]) => `${key}="${String(value).slice(0, 20)}"`).join(" ")
        return `<${this.constructor.name} ${attributes} />`
    }
}

export default Structure;