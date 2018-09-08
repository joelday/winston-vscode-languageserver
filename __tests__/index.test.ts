import { RemoteConsoleTransport } from '../src';
import { RemoteConsole } from 'vscode-languageserver';
import { createLogger, Logger, format, config } from 'winston';

function createMockRemoteConsole() {
    return {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        log: jest.fn(),
    } as any as RemoteConsole;
}

function createWinstonLogger(remoteConsole: RemoteConsole) {
    return createLogger({
        level: 'debug',
        format: format.simple(),
        levels: config.cli.levels,
        transports: [
            new RemoteConsoleTransport(remoteConsole)
        ]
    });
}

describe('RemoteConsoleTransport', () => {
    it('emits messages to a RemoteConsole instance', () => {
        const mockConsole = createMockRemoteConsole();
        const logger = createWinstonLogger(mockConsole);
        logger.emit = jest.fn(logger.emit);

        logger.error('message', { text: 'hello' });
        logger.warn('message', { text: 'hello' });
        logger.info('message', { text: 'hello' });
        logger.debug('message', { text: 'hello' });

        expect(mockConsole.error).toHaveBeenCalledWith('error: message {\"text\":\"hello\"}');
        expect(mockConsole.warn).toHaveBeenCalledWith('warn: message {\"text\":\"hello\"}');
        expect(mockConsole.info).toHaveBeenCalledWith('info: message {\"text\":\"hello\"}');
        expect(mockConsole.log).toHaveBeenCalledWith('debug: message {\"text\":\"hello\"}');

        const promise = new Promise((r) => {
            setImmediate(() => {
                expect(logger.emit).toHaveBeenCalled();
                r();
            });
        })

        return promise;
    });
});