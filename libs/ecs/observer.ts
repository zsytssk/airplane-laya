/** 监听数据结构 */
export type SubscribeObj = {
    [key: string]: Func<void>;
};
/** 每一个event的数据 */
export type EventData = Array<{
    caller: any;
    callback: Func<any>;
    once?: boolean;
    off?: () => void;
}>;

/**
 * 发布订阅模块构造函数
 */
export default class Observer {
    protected events: Map<string, EventData> = new Map();

    constructor() {
        // todo
    }

    /**
     * 注册监听
     * @param event
     * @param callback
     * @param caller
     */
    public subscribe(
        event: string | SubscribeObj,
        callback?: any,
        caller?: any,
        once?: boolean,
        unshift?: boolean,
    ) {
        if (typeof event === 'object') {
            caller = callback;
            for (const event_key in event) {
                if (!event.hasOwnProperty(event_key)) {
                    continue;
                }
                this.subscribe(event_key, event[event_key], caller);
            }
            return;
        }
        let events = [];
        if (this.events.has(event)) {
            events = this.events.get(event);
        } else {
            this.events.set(event, events);
        }

        for (const temp of events) {
            if (caller === temp.caller && callback === temp.callback) {
                return;
            }
        }
        const off = () => {
            this.unSubscribe(event, callback, caller);
        };

        if (unshift) {
            events.unshift({ caller, callback, once, off });
        } else {
            events.push({ caller, callback, once, off });
        }
    }
    public getSubscribe(event: string) {
        return this.events.get(event);
    }

    /**
     * 取消监听，如果没有传 callback 或 caller，那么就删除所对应的所有监听
     * @param event
     * @param callback
     * @param caller
     */
    public unSubscribe(
        event: string | SubscribeObj,
        callback?: any,
        caller?: any,
    ) {
        if (typeof event === 'object') {
            caller = callback;
            for (const event_key in event) {
                if (!event.hasOwnProperty(event_key)) {
                    continue;
                }
                this.unSubscribe(event_key, event[event_key], caller);
            }
            return;
        }

        if (!this.events.has(event)) {
            return;
        }

        const events = this.events.get(event);
        let is_remove = false;
        for (let len = events.length, i = len - 1; i >= 0; i--) {
            if (
                events[i].callback === callback &&
                events[i].caller === caller
            ) {
                is_remove = true;
                events.splice(i, 1);
                break;
            }
        }

        if (!is_remove) {
            console.error(`cant unsubscribe for `, event);
        }
    }
    public unSubscribeAll(caller: any) {
        for (const events_item of this.events.values()) {
            // 尽量不要这么传参，效率低下
            for (let len = events_item.length, i = len - 1; i >= 0; i--) {
                if (events_item[i].caller === caller) {
                    events_item.splice(i, 1);
                }
            }
        }
    }
    /**
     * 发布消息
     * @param event
     * @param data
     */
    public publish(event: string, ...params: any[]) {
        if (this.events.has(event)) {
            const events = this.events.get(event);
            for (const event_data of events.concat([])) {
                const { callback, once, off } = event_data;
                if (typeof callback === 'function') {
                    callback.apply(event_data.caller, [...params]);
                }
                if (once) {
                    off();
                }
            }
        }
    }
    public clear() {
        this.events = new Map();
    }
}
