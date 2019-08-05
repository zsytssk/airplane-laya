// 组件
import Components from '../components.game.js';

export default class OpenFireSystem extends ecs.System {
    static get name() {
        return 'OpenFireSystem';
    }

    constructor() {
        super();
    }

    onLoad() {}

    onUpdate() {}

    /*
     * @param {object} data 火力数据
     */
    onReceive(data) {
        for (const item of data.firepowers) {
            this.spawnAmmoEntity(item);
        }
    }

    /*
     * 组装弹药实体
     * @param {string} id ID
     * @param {number} damage 伤害
     * @param {number} model 型号
     * @param {number} x x轴位置
     * @param {number} y y轴位置
     * @param {number} speed 移动速度
     */
    spawnAmmoEntity({ id, damage = 0, model, x, y, speed }) {
        const worldEntity = this._ecs.entityManager.first('World');
        const worldShape = worldEntity.getComp(Components.Shape);

        const ammoOwner = new Components.Owner(id, true);
        const ammoProp = new Components.BasicsProp({
            healthPoint: damage,
            maxHealthPoint: damage,
            model,
        });
        const ammoPosition = new Components.Position(x, y);
        const ammoTween = new Components.Tween({
            x,
            y: 0,
            enabled: true,
            speed,
        });

        const ammoEntity = new ecs.Entity('Ammo')
            .addComp(ammoOwner)
            .addComp(ammoProp)
            .addComp(ammoPosition)
            .addComp(ammoTween);
    }
}
