// 公共
import * as common from '../common.game.js';
// 组件
import Components from '../components.game.js';

export default class AmmoMovementSystem extends ecs.System {
    static get name() {
        return 'AmmoMovementSystem';
    }

    constructor() {
        super();
    }

    onLoad() {

    }

    onUpdate() {
        this.move();
    }

    onReceive(data) {}

    // 移动
    move() {
        const ammoMap = this._ecs.entityManager.getMap('Ammo');

        if (!ammoMap || ammoMap.size === 0) {
            return;
        }

        for (const ammoEntity of ammoMap.values()) {
            const ammoTween = ammoEntity.getComp(Components.Tween);

            if (ammoTween.enabled) {
                const ammoPosition = ammoEntity.getComp(Components.Position);

                const { x, y } = common.tween(ammoPosition, ammoTween, ammoTween.speed);

                ammoEntity.setCompsState(Components.Position, {
                    x,
                    y
                });

                if (ammoPosition.x === ammoTween.x && ammoPosition.y === ammoTween.y) {
                    ammoEntity.setCompsState(Components.Tween, {
                        enabled: false
                    });

                    ammoEntity.setCompsState(Components.Owner, {
                        enabled: false
                    });
                }
            }
        }
    }
}