import { Attribute } from "../decorators/attribute";
import Trimmer from "../transformers/trimmer.transformer";
import Structure from "./base";


class Token extends Structure {
    @Attribute({
        default: "N/A",
        transformers: [Trimmer],
    })

    public access!: string

    @Attribute()
    public refresh!: string
}


export default Token;