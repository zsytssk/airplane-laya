// 组件
import Components from '../components.game.js';

/*
 * 玩家渲染
 * @param {object} ecs ecs框架
 * @param {object} render 渲染系统
 * @param {object} entitys 实体集合
 */
export default function renderAmmo(ecs, render, entitys) {
    for (const [entity, comps] of entitys) {
        if (!(!!ecs && !!render && !!entity && Array.isArray(comps) && comps.length)) {
            return;
        }

        const ammoOwner = entity.getComp(Components.Owner);
        const ammoProp = entity.getComp(Components.BasicsProp);
        const ammoPosition = entity.getComp(Components.Position);
        const ammoTween = entity.getComp(Components.Tween);

        const state = {};

        // 创建
        if (render.hasComps(['Owner', 'BasicsProp', 'Position', 'Tween'], comps)) {
            if (ammoOwner.enabled) {
                Object.assign(state, {
                    createAmmo: {
                        eid: entity.id,
                        id: ammoOwner.id,
                        x: ammoPosition.x,
                        y: ammoPosition.y,
                    }
                });
            }
        } else {
            // 更新位置
            if (render.hasComps(['Position'], comps)) {
                Object.assign(state, {
                    updateAmmo: {
                        eid: entity.id,
                        x: ammoPosition.x,
                        y: ammoPosition.y
                    }
                });
            }

            // 销毁
            if (render.hasComps(['Owner'], comps)) {
                if (!ammoOwner.enabled) {
                    Object.assign(state, {
                        destroyAmmo: {
                            eid: entity.id,
                        }
                    });

                    ecs.entityManager.destroyEntity(entity);
                }
            }
        }

        // 更新UI
        render.updateUI(state);
    }
}