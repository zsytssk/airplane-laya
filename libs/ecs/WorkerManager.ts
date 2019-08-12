// web worker管理器
export class WorkerManager {
    constructor(ecs) {
        // ecs
        this._ecs = ecs;

        // worker构建函数集合
        this._WorkerMap = new Map();
        // worker对象集合
        this._workerMap = new Map();
    }

    /*
     * 检测是否已注册
     * @param (string) name 名称
     * @return (boolean) isRegister 是否已注册
     */
    _preRegister(name) {
        if (this.has(name)) {
            console.warn('The worker has been registered.');

            return true;
        }

        return false;
    }

    /*
     * 注册
     * @param (string) name 名称
     * @param (function) worker 构造函数
     */
    register(name, worker) {
        if (this._preRegister(name)) {
            return this;
        }

        const Workers = [...this._WorkerMap];

        Workers.push([name, worker]);

        this._WorkerMap = new Map(Workers);
    }

    /*
     * 开启
     * @param (string) name 名称
     * @param (string) cmd 命令
     * @param (function) fun 回调函数
     */
    open(name, cmd, fun) {
        if (typeof fun !== 'function') {
            return;
        }

        const Worker = this._WorkerMap.get(name);

        if (Worker === undefined) {
            return;
        }

        if (this.has(name)) {
            this.addlistener(name, cmd, fun);

            return;
        }

        const worker = new Worker();
        const listener = new Map();

        listener.set(cmd, [fun]);

        worker.onmessage = message => {
            const data = message.data;

            for (const [cmd, funs] of listener) {
                if (cmd === data.cmd) {
                    for (const fun of funs) {
                        fun(data.data);
                    }
                }
            }
        };

        this._workerMap.set(name, {
            worker,
            listener,
        });
    }

    /*
     * 监听
     * @param (string) name 名称
     * @param (string) cmd 命令
     * @param (function) fun 回调函数
     */
    addlistener(name, cmd, fun) {
        const listener = this.get(name).listener;

        if (!listener.has(cmd)) {
            listener.set(cmd, []);
        }

        const funs = listener.get(cmd);
        funs.push(fun);

        listener.set(cmd, funs);
    }

    /*
     * 发送
     * @param (string) name 名称
     * @param (object) data 数据
     */
    send(name, data) {
        if (!this.has(name)) {
            return;
        }

        const worker = this.get(name).worker;

        worker.postMessage(data);
    }

    /*
     * 获取
     * @param (string) name 名称
     * @return (object) worker 当前worker
     */
    get(name) {
        return this._workerMap.get(name);
    }

    /*
     * 检测是否存在
     * @param (string) name 名称
     */
    has(name) {
        return this._workerMap.has(name);
    }

    /*
     * 关闭
     * @param (string) name 名称
     */
    close(name) {
        if (!this.has(name)) {
            console.warn('Close worker error.');

            return;
        }

        const worker = this.get(name).worker;

        worker.postMessage({
            cmd: 'stop',
        });

        this._workerMap.delete(name);
    }

    // 关闭所有
    closeAll() {
        for (const { worker } of this._workerMap.values()) {
            worker.postMessage({
                cmd: 'stop',
            });
        }

        this._workerMap.clear();
    }
}
