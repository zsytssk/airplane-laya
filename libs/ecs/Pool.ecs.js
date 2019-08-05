// 对象池
export class Pool {
    constructor(ecs) {
        // ecs
        this._ecs = ecs;

        // 对象池集合
        this._poolMap = new Map();

        // 允许缓存的最大数量
        this._maxCount = 600;
    }

    /*
     * 设置对象池容量
     * @param (number) val 缓存对象数量
     */
    set resize(val) {
        this._maxCount = val;

        for (let pool of this._poolMap.values()) {
            pool.length = val;
        }
    }

    /*
     * 获取对象池中的对象，如果没有，则返回null
     * @param (string) sign 标识
     * @return (object) item 对象
     */
    get(sign) {
        const pool = this.getPool(sign);
        const item = pool.length ? pool.shift() : null;

        if (item) {
            item['__InPool'] = false;
        }

        return item;
    }

    /*
     * 获取对象池中的对象，如果没有，则返回创建一个新的对象
     * @param (string) sign 标识
     * @param (function) cls 类
     */
    getByClass(sign, cls) {
        const pool = this.getPool(sign);
        const item = pool.length ? pool.shift() : new cls();

        item["__InPool"] = false;

        return item;
    }

    /*
     * 回收对象到对象池
     * @param (string) sign 标识
     * @param (object) item 对象
     */
    put(sign, item) {
        if (item['__InPool']) {
            return;
        }

        item['__InPool'] = true;

        const pool = this.getPool(sign);

        if (pool.length >= this._maxCount) {
            pool.shift();
        }
    }

    /*
     * 获取当前缓冲池的可用对象数量
     * @param (string) sign 标识
     * @return (number) nums 可用对象数量
     */
    size(sign) {
        let nums = 0;

        if (this._poolMap.has(sign)) {
            const pool = this._poolMap.get(sign);

            nums = pool.length;
        }

        return nums;
    }

    /*
     * 获取对象池，如果没有，则创建新对象池
     * @param (string) sign 标识
     * @return (array) pool 对象池
     */
    getPool(sign) {
        let pool = this._poolMap.get(sign);

        if (!Array.isArray(pool)) {
            pool = [];

            this._poolMap.set(sign, pool);
        }

        return pool;
    }

    /*
     * 清除对象池的对象，并移除对象池
     * @param (string) sign 标识
     */
    clearBySign(sign) {
        if (this._poolMap.has(sign)) {
            const pool = this.getPool(sign);

            pool.length = 0;

            this._poolMap.delete(sign);
        }
    }

    // 清楚所有对象池的对象，并移除所有对象池
    clear() {
        for (let pool of this._poolMap.values()) {
            pool.length = 0;
        }

        this._poolMap.clear();
    }
}