import * as TransportStream from 'winston-transport';
import { RemoteConsole } from 'vscode-languageserver';
import { LEVEL, MESSAGE } from 'triple-beam';

export class RemoteConsoleTransport extends TransportStream {
    private readonly _remoteConsole: RemoteConsole;

    constructor(remoteConsole: RemoteConsole, options?: TransportStream.TransportStreamOptions) {
        super(options);

        this._remoteConsole = remoteConsole;
    }

    log(info: any, next: () => void) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        const message = `${info[MESSAGE]}`;

        if (this._remoteConsole[info[LEVEL]]) {
            this._remoteConsole[info[LEVEL]](message);
        }
        else {
            this._remoteConsole.log(message);
        }

        next();
    }
}