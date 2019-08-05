// 系统消息中介
export class Mediator {
    constructor(ecs) {
        // ecs
        this._ecs = ecs;

        this._list = [];

        // 初始化
        this.init();
    }

    /*
     * 更新
     * @param (number) dt 上一帧时间间隔
     */
    update(dt) {
        if (this._list.length === 0) {
            return;
        }

        const list = Array.from(this._list);
        this._list = [];

        list.map((obj) => {
            if (this._ecs.systemManager.has(obj.system)) {
                this._ecs.systemManager.get(obj.system).receive(obj.data);
            }
        }); 
    }

    // 初始化
    init() {
        this._ecs.worker.onmessage = (message) => {
            const data = message.data;

            this._collector(data);
        };
    }

    // 清空队列
    clear() {
        this._list = [];
    }

    /*
     * 收集
     * @param (object) data 数据
     * param.system (string) 系统名称
     * param.data (object) 传递数据
     */
    _collector(data) {
        this._list.push(data);
    }

    // 筛选
    _filter() {

    }

    // 执行
    _execute() {

    }
}