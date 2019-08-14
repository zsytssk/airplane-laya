// 组件
import { System } from 'ecs/ecs';
import { EcsEvent } from 'game/ecsEvent';

// 渲染
export default class RenderSystem extends System {
    static get name() {
        return 'RenderSystem';
    }

    onLoad() {}

    onUpdate(dt) {
        const dirtyMap = this._ecs.entityManager.getDirty();
        const entityListMap = new Map();

        if (dirtyMap.size) {
            for (const [tag, dirty_comp] of dirtyMap.entries()) {
                const data = tag.split('@');
                const entityName = data[0];
                const entityId = data[1];

                const entity = this._ecs.entityManager.get(
                    entityName,
                    entityId,
                );

                if (!!entity) {
                    if (!entityListMap.has(entityName)) {
                        entityListMap.set(entityName, new Map());
                    }

                    const entityList = entityListMap.get(entityName);

                    entityList.set(entity, dirty_comp);
                }
            }

            if (entityListMap.size) {
                for (const [, entityList] of entityListMap) {
                    if (entityList.size) {
                        this._ecs.observer.publish(
                            EcsEvent.updateUI,
                            entityList,
                        );
                        entityList.clear();
                    }
                }

                entityListMap.clear();
            }
        }
    }

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
}
