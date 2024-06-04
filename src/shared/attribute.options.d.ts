
export interface IAttributeOptions {
    /*
        Transformers can be used to convert values before they returned.
        For example, you can convert a string to a number.
    */
    transformers?: Array<new () => any>

    /*
        Validators can be used to validate values before they returned.
        For example, you can check if a value is greater than 0.
    */
    validators?: Array<(value: any) => boolean>

    /*
        Set this to true if you want to allow undefined values.
    */
    nullable?: boolean


    /*
        default is used to set the default value of the property.
    */
    default?: any
}