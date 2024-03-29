import type {
    Board,
} from 'johnny-five';
import type {
    Config,
} from '@scripts/config';

import connectBoard from '@lib/board';
import Owlcms from '@lib/owlcms';
import parseConfig from '@scripts/config';

export type Initializer = (options: InitializerOptions) => void;

export interface InitializerOptions {
    board: Board;
    config: Config;
    owlcms: Owlcms;
    platform: Config['platform'];
}

export default async (initializer: Initializer) => {
    const config = parseConfig();

    const owlcms = new Owlcms({
        mqttHost: config.mqttHost,
        mqttPassword: config.mqttPassword,
        mqttPort: config.mqttPort,
        mqttUsername: config.mqttUsername,
    });

    try {
        await owlcms.connect();

        const board = await connectBoard({
            port: config.serialPort,
        });

        initializer({
            board,
            config,
            owlcms,
            platform: config.platform,
        });
    } catch (error) {
        console.error(error);
        process.exitCode = 1;

        owlcms.disconnect();

        // If the process does not exit cleanly within five seconds, force close
        setTimeout(() => {
            process.exit(2);
        }, 5000);
    }
}
