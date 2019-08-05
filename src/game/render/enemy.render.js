// 组件
import Components from '../components.game.js';

/*
 * 玩家渲染
 * @param {object} ecs ecs框架
 * @param {object} render 渲染系统
 * @param {object} entitys 实体集合
 */
export default function renderEnemy(ecs, render, entitys) {
    for (const [entity, comps] of entitys) {
        if (!(!!ecs && !!render && !!entity && Array.isArray(comps) && comps.length)) {
            return;
        }

        const enemyOwner = entity.getComp(Components.Owner);
        const enemyProp = entity.getComp(Components.BasicsProp);
        const enemyPosition = entity.getComp(Components.Position);
        const enemyTween = entity.getComp(Components.Tween);

        const state = {};

        // 创建
        if (render.hasComps(['Owner', 'BasicsProp', 'Position', 'Tween'], comps)) {
            if (enemyOwner.enabled) {
                Object.assign(state, {
                    createEnemy: {
                        eid: entity.id,
                        id: enemyOwner.id,
                        x: enemyPosition.x,
                        y: enemyPosition.y,
                    }
                });
            }
        } else {
            // 更新位置
            if (render.hasComps(['Position'], comps)) {
                Object.assign(state, {
                    updateEnemy: {
                        eid: entity.id,
                        x: enemyPosition.x,
                        y: enemyPosition.y
                    }
                });
            }

            // 销毁
            if (render.hasComps(['Owner'], comps)) {
                if (!enemyOwner.enabled) {
                    Object.assign(state, {
                        destroyEnemy: {
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