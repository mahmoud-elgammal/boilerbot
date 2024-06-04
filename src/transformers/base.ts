import { EventEmitter } from 'events'
import { Subject } from 'rxjs'

class Transformer<T extends unknown> extends Subject<T> {

    async transform(value: string, html: string): Promise<T> {
        throw new Error('Not implemented')
    }
}

export default Transformer