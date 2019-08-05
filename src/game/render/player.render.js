// 组件
import Components from '../components.game.js';

/*
 * 玩家渲染
 * @param {object} ecs ecs框架
 * @param {object} render 渲染系统
 * @param {object} entitys 实体集合
 */
export default function renderPlayer(ecs, render, entitys) {
    for (const [entity, comps] of entitys) {
        if (!(!!ecs && !!render && !!entity && Array.isArray(comps) && comps.length)) {
            return;
        }

        const playerOwner = entity.getComp(Components.Owner);
        const playerProp = entity.getComp(Components.BasicsProp);
        const playerPosition = entity.getComp(Components.Position);
        const playerTween = entity.getComp(Components.Tween);

        const state = {};

        // 创建
        if (render.hasComps(['Owner', 'BasicsProp', 'Position', 'Tween'], comps)) {
            if (playerOwner.enabled) {
                Object.assign(state, {
                    createPlayer: {
                        id: playerOwner.id,
                        x: playerPosition.x,
                        y: playerPosition.y,
                        name: playerProp.name,
                        level: playerProp.level,
                        healthPoint: playerProp.healthPoint,
                        maxHealthPoint: playerProp.maxHealthPoint
                    }
                });
            }
        } else {
            // 更新位置
            if (render.hasComps(['Position'], comps)) {
                Object.assign(state, {
                    updatePlayer: {
                        id: playerOwner.id,
                        x: playerPosition.x,
                        y: playerPosition.y
                    }
                });
            }

            // 销毁
            if (render.hasComps(['Owner'], comps)) {
                if (!playerOwner.enabled) {
                    Object.assign(state, {
                        destroyPlayer: {
                            id: playerOwner.id
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