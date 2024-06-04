import rxjs, { Observable, Subject } from 'rxjs';
import Transformer from "./base"
import ollama from 'ollama'


const prompt = `
the output will use as post
re-phrase the following text in english
the output should be in english
the output should minimize the number of words
the output should contain just result without any explanation
`

class Translator extends Transformer<string> {
    async transform(value: string, html: string) {

        if(!value) return value
        const response = await ollama.chat({model: 'phi3', messages: [{ role: 'user', content: prompt }]})


        return response.message.content
    }
}



export default Translator