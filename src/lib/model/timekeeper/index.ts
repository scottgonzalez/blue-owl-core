import type {
    ModelEvents,
    ModelOptions,
} from '@lib/model/index';

import Model from '@lib/model/index';

export type TimekeeperEvents = ModelEvents;
export type TimekeeperOptions = ModelOptions<Timekeeper>;

export default class Timekeeper extends Model<TimekeeperOptions> {
    protected override get debuggerName() {
        return `timekeeper:${this.platform}`;
    }

    protected _initialize() {
        // Do nothing
    }

    public override on<T extends keyof TimekeeperEvents>(type: T, listener: TimekeeperEvents[T]): this {
        return super.on(type, listener);
    }

    public oneMinuteClock() {
        this.debug('one minute');
        this.owlcms.oneMinuteClock({ platform: this.platform });
    }

    public startClock() {
        this.debug('start');
        this.owlcms.startClock({ platform: this.platform });
    }

    public stopClock() {
        this.debug('stop');
        this.owlcms.stopClock({ platform: this.platform });
    }

    public twoMinuteClock() {
        this.debug('two minute');
        this.owlcms.twoMinuteClock({ platform: this.platform });
    }
}
