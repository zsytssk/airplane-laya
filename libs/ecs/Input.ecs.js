// 输入组件
export class Input {
    constructor(ecs) {
        // ecs
        this._ecs = ecs;

        // code 集合
        this._codeMap = new Map();

        this._keyCode = {};

        // 输入集合
        this._inputMap = new Map();
    }

    /*
     * 设置keycode
     * @param (object) obj keycode
     */
    set keyCode(obj) {
        const keyCode = typeof obj === 'string' ? JSON.parse(obj) : obj;

        this._keyCode = keyCode;

        for (let key of Object.keys(keyCode)) {
            const code = keyCode[key];

            this._codeMap.set(code, key);
        }
    }

    /*
     * 获取keycode
     * @return (object) keyCode keyCode
     */
    get keyCode() {
        return this._keyCode;
    }

    /*
     * 获取
     * @param (string) code keycode
     * @return (object) data 输入数据
     */
    get(code) {
        const data = this._inputMap.get(code);

        this.remove(code);

        return data;
    }

    /*
     * 获取所有
     * @return (object) inputMap 输入集合
     */
    getAll() {
        return this._inputMap;
    }

    /*
     * 设置
     * @param (string) code keycode
     * @param (object) data 输入数据
     */
    set(code, data) {
        if (!this._codeMap.has(code)) {
            console.warn('Key Code does not exist using the name');

            return;
        }

        // console.log(code, data || this._codeMap.get(code));

        this._inputMap.set(code, data || this._codeMap.get(code));
    }

    /*
     * 检测
     * @param (string) code keycode
     * @return (boolean) isExist keycode是否存在
     */
    has(code) {
        return this._inputMap.has(code);
    }

    /*
     * 移除
     * @param (string) code keycode
     */
    remove(code) {
        this._inputMap.delete(code);
    }

    // 清空
    clear() {
        this._keyCode = null;

        this._codeMap.clear();

        this._inputMap.clear();
    }
}