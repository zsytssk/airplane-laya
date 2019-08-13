// 组件
import { System } from 'ecs/ecs';
// 渲染
import render from '../render.game.js';

// 渲染
export default class RenderSystem extends System {
    static get name() {
        return 'RenderSystem';
    }

    onLoad() {}

    onUpdate(dt) {
        const dirtyMap = this._ecs.entityManager.getDirty();
        const entitysMap = new Map();

        if (dirtyMap.size) {
            for (const [tag, comps] of dirtyMap.entries()) {
                const data = tag.split('@');
                const entityName = data[0];
                const entityId = data[1];

                const entity = this._ecs.entityManager.get(
                    entityName,
                    entityId,
                );

                if (!!entity) {
                    if (!entitysMap.has(entityName)) {
                        entitysMap.set(entityName, new Map());
                    }

                    const entitys = entitysMap.get(entityName);

                    entitys.set(entity, comps);
                }
            }

            if (entitysMap.size) {
                for (const [entityName, entitys] of entitysMap) {
                    const funName = `update${entityName}UI`;

                    if (
                        entitys.size &&
                        this.__proto__.hasOwnProperty(funName)
                    ) {
                        this[funName](entitys);

                        entitys.clear();
                    }
                }

                entitysMap.clear();
            }
        }
    }

    onReceive(data) {}

    /*
     * 检查组件是否存在
     * @param {array} comp 组件名
     * @param {array} comps 组件名称列表
     * @return {boolean} result 是否存在
     */
    hasComps(comp, comps) {
        if (Array.isArray(comp)) {
            const result = comp.filter(name => {
                const index = comps.findIndex(val => {
                    return val.indexOf(name) !== -1;
                });

                return index !== -1;
            });

            return result.length === comp.length;
        } else if (typeof comp === 'string') {
            const index = comps.findIndex(val => {
                return val.indexOf(comp) !== -1;
            });

            return index !== -1;
        }
    }

    /*
     * 获取组件属性
     * @param {array} comp 组件名
     * @param {array} comps 组件名称列表
     * @return {array} attrs 属性
     */
    gasCompAttrs(comp, comps) {
        let attrs = null;

        const index = comps.findIndex(val => {
            return val.indexOf(comp) !== -1;
        });

        if (index !== -1) {
            attrs = comps[index].split('@')[1];

            attrs = new Set(attrs.split('-'));
        }

        return attrs;
    }

    /*
     * 更新UI
     * @param {object} state 状态
     */
    updateUI(state) {
        this._ecs.ui.updateUI(state);
    }

    /*
     * 更新player状态
     * @param {object} entitys 实体集合
     */
    updatePlayerUI(entitys) {
        render.player(this._ecs, this, entitys);
    }

    /*
     * 更新ammo状态
     * @param {object} entitys 实体集合
     */
    updateAmmoUI(entitys) {
        render.ammo(this._ecs, this, entitys);
    }

    /*
     * 更新enemy状态
     * @param {object} entitys 实体集合
     */
    updateEnemyUI(entitys) {
        render.enemy(this._ecs, this, entitys);
    }
}
