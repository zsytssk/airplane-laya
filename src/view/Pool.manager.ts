// 对象池管理器
export class PoolManager {
    private _pool: Laya.Sprite[] = [];
    private _list: Laya.Sprite[] = [];
    private ctor: typeof Laya.Sprite;
    constructor(ctor: typeof Laya.Sprite) {
        this.ctor = ctor;
    }

    /*
     * 获取
     * @return {object} result
     */
    public request() {
        if (this._pool.length < 1) {
            return new this.ctor();
        }

        const node = this._pool.pop();

        if (node) {
            node.active = true;
        }

        this._list.push(node);

        return node;
    }

    /*
     * 回收
     * @param {object} node 节点
     * @param {boolean} isDelete  是否删除
     */
    public recover(node, isDelete = true) {
        if (node.active) {
            node.active = false;
        }

        if (node.parent) {
            node.removeSelf();
        }

        if (isDelete) {
            this._list = this._list.filter(item => {
                return item !== node;
            });
        }

        this._pool.push(node);
    }

    // 重置
    public reset() {
        for (const node of this._list.values()) {
            this.recover(node, false);
        }

        this._list = [];
    }

    // 获取预制资源尺寸
    public getSize() {
        return {
            width: 100,
            height: 100,
        };
    }
}
