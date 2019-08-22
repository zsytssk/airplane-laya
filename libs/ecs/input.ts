import { ECS } from './ecs';

export type CodeMap = {
    [key: string]: number;
};
/** 输入组件 */
export class Input {
    // ecs
    protected _ecs: ECS;
    private _codeMap: Map<number, string> = new Map();

    // code 集合
    private _keyCode: CodeMap = {};

    // 输入集合
    private _inputMap: Map<number, any> = new Map();
    constructor(ecs: ECS) {
        this._ecs = ecs;
    }

    /*
     * 设置keycode
     * @param (object) obj keycode
     */
    set keyCode(code_map: CodeMap) {
        this._keyCode = code_map;

        for (const key of Object.keys(code_map)) {
            const code = code_map[key];
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
    public get(code: string) {
        const data = this._inputMap.get(code);

        this.remove(code);

        return data;
    }

    /*
     * 获取所有
     * @return (object) inputMap 输入集合
     */
    public getAll() {
        return this._inputMap;
    }

    /*
     * 设置
     * @param (string) code keycode
     * @param (object) data 输入数据
     */
    public set(code: number, data) {
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
    public has(code) {
        return this._inputMap.has(code);
    }

    /*
     * 移除
     * @param (string) code keycode
     */
    public remove(code) {
        this._inputMap.delete(code);
    }

    // 清空
    public clear() {
        this._keyCode = null;

        this._codeMap.clear();

        this._inputMap.clear();
    }
}
