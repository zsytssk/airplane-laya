import { ECS } from './ecs';

// 系统消息中介
export class Mediator {
    private _ecs: ECS;
    private _list = [];
    constructor(ecs: ECS) {
        this._ecs = ecs;
        // 初始化
        this.init();
    }

    // 初始化
    private init() {
        this._ecs.worker.onmessage = message => {
            const data = message.data;

            this._collector(data);
        };
    }

    /*
     * 更新
     * @param (number) dt 上一帧时间间隔
     */
    public update(dt: number) {
        if (this._list.length === 0) {
            return;
        }

        const list = Array.from(this._list);
        this._list = [];

        list.map(obj => {
            if (this._ecs.systemManager.has(obj.system)) {
                this._ecs.systemManager.get(obj.system).receive(obj.data);
            }
        });
    }

    // 清空队列
    public clear() {
        this._list = [];
    }

    /*
     * 收集
     * @param (object) data 数据
     * param.system (string) 系统名称
     * param.data (object) 传递数据
     */
    private _collector(data) {
        this._list.push(data);
    }

    // 筛选
    private _filter() {}

    // 执行
    private _execute() {}
}
