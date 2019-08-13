import { ECS } from './ecs';
import { Component } from './Component';
import { Entity } from './Entity';

type EntityMap = Map<string, Entity>;
/** 实体管理器 */
export class EntityManager {
    private _ecs: ECS;
    // 实体集合
    private _entityMaps: Map<string, EntityMap> = new Map();
    // 脏标记集合
    private _dirtyMaps: Map<string, EntityMap> = new Map();
    constructor(ecs: ECS) {
        // ecs
        this._ecs = ecs;
    }

    /*
     * 注册
     * @param {string} entityName 实体名
     * @return {object} this chain
     */
    public register(...entity_list: string[]) {
        for (const entityName of entity_list) {
            if (typeof entityName !== 'string') {
                console.warn('The entity name parameter must be a string');
                return;
            }

            if (this._entityMaps.has(entityName)) {
                return;
            }
            const entityMap = new Map();
            this._entityMaps.set(entityName, entityMap);
        }

        return;
    }

    /*
     * 获取实体类集合
     * @param {string} entityName 实体名
     * @return {object} entityMap 实体集合
     */
    public getMap(entityName: string) {
        return this._entityMaps.get(entityName);
    }

    /*
     * 根据实体ID，获取实体
     * @param {string} entityName 实体名
     * @param {string} entityId 实体ID
     * @return {object} entity 实体
     */
    public get(entityName: string, entityId: string) {
        const entityMap = this.getMap(entityName);

        if (entityMap === undefined) {
            console.warn('Entity map does not exist using the name');

            return;
        }

        return entityMap.get(entityId);
    }

    /*
     * 获取实体:> 匹配 name = entityName, 拥有特定类型的 compClasses
     * @param {string} entityId 实体ID
     * @param {array} compClasses 组件类
     * @return {array} entity_list 实体
     */
    public filter(
        entityName: string,
        compClasses: Array<Ctor<Component>> = [],
    ) {
        const entityMap = this.getMap(entityName);

        if (!entityMap) {
            console.warn(`cant find entityMap for name=${entityName} `);
            return;
        }

        const entity_list: Entity[] = [];

        for (const entity of entityMap.values()) {
            const result = compClasses.filter(compClass => {
                return this._ecs.componentManager.has(compClass, entity.id);
            });

            if (result.length === compClasses.length) {
                entity_list.push(entity);
            }
        }

        return entity_list;
    }

    /*
     * 获取第一个实体
     * @param {string} entityName 实体名
     * @return {object} entity 实体
     */
    public first(entityName: string) {
        const entityMap = this.getMap(entityName);

        if (entityMap === undefined) {
            // console.warn('Entity map does not exist using the name');

            return;
        }

        if (entityMap.size === 0) {
            return undefined;
        }

        const iter = entityMap.entries();
        const result = iter.next();

        return result.value[1];
    }

    /*
     * 根据条件查找实体
     * @param {string} entityId 实体ID
     * @param {function} compClass 组件类
     * @param {object} data 数据
     * @return {array} entitys 实体
     */
    public find(entityName: string, compClass: Ctor<Component>, data: any) {
        const entityMap = this.getMap(entityName);

        if (entityMap === undefined) {
            console.warn(`cant find entityMap for name=${entityName}`);

            return;
        }

        let result: Entity;

        for (const entity of entityMap.values()) {
            if (entity.hasComp(compClass)) {
                let isMatch = true;
                const comp = entity.getComp(compClass);

                for (const key in data) {
                    if (!data.hasOwnProperty(key)) {
                        continue;
                    }
                    if (!(comp[key] && comp[key] === data[key])) {
                        isMatch = false;
                        break;
                    }
                }

                if (isMatch) {
                    result = entity;
                }
            }
        }

        return result;
    }

    /*
     * 添加实体
     * @param {object} entity 实体实例
     * @return {object} entity 实体
     */
    public set(entity) {
        this.register(entity.name);

        const entityMap = this.getMap(entity.name);

        if (entityMap === undefined) {
            console.warn(`cant find entityMap for name=${entity.name}`);

            return this;
        }

        entityMap.set(entity.id, entity);

        return entity;
    }

    /*
     * 检查是否存在
     * @param {string} entityName 实体名
     * @param {string} entityId 实体ID
     * @return {boolean} isExist 实体是否存在
     */
    public has(entityName, entityId) {
        const entityMap = this.getMap(entityName);

        if (!entityMap) {
            console.warn(`cant find entityMap for name=${entityName}`);

            return false;
        }

        return entityMap.has(entityId);
    }

    /*
     * 检查是否存在
     * @param {object} entity 实体实例
     * @return {boolean} isExist 实体是否存在
     */
    public hasEntity(entity: Entity) {
        return this.has(entity.name, entity.id);
    }

    /*
     * 销毁实体
     * @param {string} entityName 实体名
     * @param {string} entityId 实体ID
     * @return {object} this chain
     */
    public destroy(entityName: string, entityId: string) {
        const entityMap = this.getMap(entityName);

        if (!entityMap) {
            console.warn(`cant find entityMap for name=${entityName}`);

            return this;
        }

        if (entityMap.has(entityId)) {
            const entity = entityMap.get(entityId);

            entity.destroy();

            entityMap.delete(entityId);
        }

        return this;
    }

    /*
     * 销毁实体
     * @param {object} entity 实体实例
     * @return {object} this chain
     */
    public destroyEntity(entity: Entity) {
        this.destroy(entity.name, entity.id);

        return this;
    }

    /*
     * 清空实体
     * @return {object} this chain
     */
    public clear() {
        for (const entityMap of this._entityMaps.values()) {
            for (const entity of entityMap.values()) {
                this._ecs.componentManager.clear(entity.id);
            }

            entityMap.clear();
        }

        this._entityMaps.clear();

        this.clearDirty();

        return this;
    }

    // 获取脏标记
    public getDirty() {
        const dirty = new Map();

        for (const [entityId, comps] of this._dirtyMaps.entries()) {
            const arr = [];

            for (const [compName, attrs] of comps.entries()) {
                if (Array.isArray(attrs)) {
                    arr.push(`${compName}@${attrs.join('-')}`);
                } else {
                    arr.push(`${compName}@${attrs}`);
                }
            }

            dirty.set(entityId, arr);
        }

        this._dirtyMaps.clear();

        return dirty;
    }

    /*
     * 设置脏标记
     * @param {string} entityTag 实体标识（entityName@entityId）
     * @param {string} compName 组件名称
     * @param {array} attrs 属性
     */
    public setDirty(entityTag: string, compName: string, attrs = 'all') {
        let comps = null;

        if (this._dirtyMaps.has(entityTag)) {
            comps = this._dirtyMaps.get(entityTag);
        } else {
            comps = new Map();
        }

        if (comps.has(compName) && attrs !== 'all') {
            const oldAttrs = comps.get(compName);

            if (oldAttrs !== 'all' && Array.isArray(attrs)) {
                attrs = oldAttrs.concat(attrs);

                // 除重复属性名
                attrs = new Set(attrs);
                attrs = [...attrs];

                comps.set(compName, attrs);
            }
        } else {
            comps.set(compName, attrs);
        }

        this._dirtyMaps.set(entityTag, comps);
    }

    /*
     * 清空脏标记
     * @return {object} this chain
     */
    public clearDirty() {
        this._dirtyMaps.clear();
    }
}
