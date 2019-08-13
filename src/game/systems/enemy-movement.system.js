// 公共
import * as common from '../common.game.js';
// 组件
import Components from '../components.game.js';
import { System } from 'ecs/ecs';

export default class EnemyMovementSystem extends System {
    static get name() {
        return 'EnemyMovementSystem';
    }

    onLoad() {}

    onUpdate() {
        this.move();
    }

    // 移动
    move() {
        const enemyMap = this._ecs.entityManager.getMap('Enemy');

        if (!enemyMap || enemyMap.size === 0) {
            return;
        }

        for (const enemyEntity of enemyMap.values()) {
            const enemyTween = enemyEntity.getComp(Components.Tween);

            if (enemyTween.enabled) {
                const enemyPosition = enemyEntity.getComp(Components.Position);

                const { x, y } = common.tween(
                    enemyPosition,
                    enemyTween,
                    enemyTween.speed,
                );

                enemyEntity.setCompsState(Components.Position, {
                    x,
                    y,
                });

                if (
                    enemyPosition.x === enemyTween.x &&
                    enemyPosition.y === enemyTween.y
                ) {
                    enemyEntity.setCompsState(Components.Tween, {
                        enabled: false,
                    });

                    enemyEntity.setCompsState(Components.Owner, {
                        enabled: false,
                    });
                }
            }
        }
    }
}
