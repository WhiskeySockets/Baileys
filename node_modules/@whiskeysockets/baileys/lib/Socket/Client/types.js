import { EventEmitter } from 'events';
import { URL } from 'url';
export class AbstractSocketClient extends EventEmitter {
    constructor(url, config) {
        super();
        this.url = url;
        this.config = config;
        this.setMaxListeners(0);
    }
}
//# sourceMappingURL=types.js.map