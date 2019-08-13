// 公共
import * as common from '../common.game.js';
import { System } from 'ecs/ecs';
// 组件
import Components from '../components.game.js';

// 玩家移动
export default class PlayerMovementSystem extends System {
    static get name() {
        return 'PlayerMovementSystem';
    }

    onLoad() {}

    onUpdate(dt) {
        let data = null;

        if (this._ecs.input.has(this._ecs.input.keyCode.MOVE)) {
            data = this._ecs.input.get(this._ecs.input.keyCode.MOVE);
        }

        this.move(data);
    }

    /*
     * 移动
     * @param {object} data 数据
     */
    move(data) {
        const playerEntity = this._ecs.entityManager.find(
            'Player',
            Components.BasicsProp,
            { name: 'EVANGELION' },
        );

        if (!playerEntity) {
            return;
        }

        // 设置目标地点坐标
        if (
            data !== null &&
            data.hasOwnProperty('x') &&
            data.hasOwnProperty('y')
        ) {
            const playerShape = playerEntity.getComp(Components.Shape);

            const { x, y } = common.boundaryDetection(
                this._ecs,
                data.x,
                data.y,
                playerShape.width,
                playerShape.height,
            );

            playerEntity.setCompsState(Components.Tween, {
                enabled: true,
                x,
                y,
            });
        }

        // 向目标地点缓动
        const playerTween = playerEntity.getComp(Components.Tween);

        if (playerTween.enabled) {
            const playerPosition = playerEntity.getComp(Components.Position);

            const { x, y } = common.tween(
                playerPosition,
                playerTween,
                playerTween.speed,
            );

            playerEntity.setCompsState(Components.Position, {
                x,
                y,
            });

            if (
                playerPosition.x === playerTween.x &&
                playerPosition.y === playerTween.y
            ) {
                // 更新玩家缓动
                playerEntity.setCompsState(Components.Tween, {
                    enabled: false,
                });
            }
        }
    }
}
