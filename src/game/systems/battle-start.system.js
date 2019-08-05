// 组件
import Components from '../components.game.js';

// 对战开始
export default class BattleStartSystem extends ecs.System {
    static get name() {
        return 'BattleStartSystem';
    }

    constructor() {
        super();
    }

    onLoad() {}

    onUpdate() {}

    onReceive(data) {
        this.spawnWorldEntity(data.world);

        this.spawnPlayerEntity(data.player);
    }

    /*
     * 组装世界实体
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    spawnWorldEntity({ width, height }) {
        const worldShape = new Components.Shape({
            width,
            height,
        });

        const worldEntity = new ecs.Entity('World').addComp(worldShape);
    }

    /*
     * 组装玩家实体
     * @param {string} id ID
     * @param {string} name 姓名
     * @param {number} level 等级
     * @param {number} healthPoint 当前血量
     * @param {number} maxHealthPoint 最大血量
     * @param {number} model 型号
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {number} x x轴位置
     * @param {number} y y轴位置
     * @param {number} speed 移动速度
     */
    spawnPlayerEntity({
        id,
        name,
        level,
        healthPoint,
        maxHealthPoint,
        model,
        width,
        height,
        x,
        y,
        speed,
    }) {
        const playerOwner = new Components.Owner(id, true);
        const playerProp = new Components.BasicsProp({
            name,
            level,
            healthPoint,
            maxHealthPoint,
            model,
        });
        const playerShape = new Components.Shape({
            width,
            height,
        });
        const playerPosition = new Components.Position(x, y);
        const playerTween = new Components.Tween({
            x,
            y,
            speed,
        });

        const playerEntity = new ecs.Entity('Player')
            .addComp(playerOwner)
            .addComp(playerProp)
            .addComp(playerShape)
            .addComp(playerPosition)
            .addComp(playerTween);
    }
}
