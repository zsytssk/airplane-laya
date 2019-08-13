import { ECS } from './ecs';
import { System } from './System';

type MsgItem = {
    system: Ctor<System>;
    data: any;
};
/** 系统消息中介 */
export class Mediator {
    private _ecs: ECS;
    private _list: MsgItem[] = [];
    constructor(ecs: ECS) {
        this._ecs = ecs;
    }

    /*
     * 收集
     * @param (object) data 数据
     * param.system (string) 系统名称
     * param.data (object) 传递数据
     */
    public collect(data: MsgItem) {
        this._list.push(data);
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
}
