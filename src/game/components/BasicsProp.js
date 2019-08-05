// 弹药属性
export default class BasicsProp extends ecs.Component {
    static get name() {
        return 'BasicsProp';
    }

    /*
     * @param {string} name 姓名
     * @param {number} level 等级
     * @param {number} healthPoint 当前血量
     * @param {number} maxHealthPoint 最大血量
     * @param {number} model 型号
     */
    constructor({
        name = '',
        level = 1,
        healthPoint = 100,
        maxHealthPoint = 100,
        model = 1
    } = {}) {
        super();

        this.name = name;
        this.level = level;

        this.healthPoint = healthPoint;
        this.maxHealthPoint = maxHealthPoint;

        this.model = model;
    }
}