import { ui } from 'ui/layaMaxUI';

export class Player extends ui.scenes.playerUI {
    private missile: Laya.Sprite[] = [];
    private gun = new Laya.Sprite();
    private _uid: any;
    private _uname: any;
    constructor() {
        super();
        this._uid = null;
        this._uname = null;
    }

    /*
     * 获取基础信息
     * @param {object} result
     */
    public getBasicInfo() {
        return {
            uid: this._uid,
            uname: this._uname,
        };
    }

    /*
     * 设置基础信息
     * @param {number} id ID
     * @param {string} name 名称
     */
    public setBasicInfo({ id, name }) {
        this._uid = id;
        this._uname = name;
    }

    /*
     * 获取火力信息
     * @param {number} type 类型 0: 机枪, 1: 机枪&导弹
     */
    public getFirepowerInfo(type = 0) {
        const arr = [];
        const { x, y } = this.gun;
        let pos = this.localToGlobal(new Laya.Point(x, y));

        arr.push({
            model: 0,
            x: pos.x,
            y: pos.y,
            id: this._uid,
        });

        if (type > 0) {
            for (const node of this.missile) {
                const { x, y } = node;
                pos = this.localToGlobal(new Laya.Point(x, y));

                arr.push({
                    model: 1,
                    x: pos.x,
                    y: pos.y,
                    id: this._uid,
                });
            }
        }

        return arr;
    }
}
