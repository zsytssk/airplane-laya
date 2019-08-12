// 实体管理器
export class EntityManager {
    private _ecs: any;
    // 实体集合
    private _entityMaps: Map<string, any> = new Map();
    // 脏标记集合
    private _dirtyMaps: Map<string, any> = new Map();
    constructor(ecs) {
        // ecs
        this._ecs = ecs;
    }

    /*
     * 检查是否已注册
     * @param {string} entityName 实体名
     * @return {boolean} isRegister 是否已注册
     */
    public _preRegister(entityName) {
        if (this.getMap(entityName)) {
            return true;
        }

        return false;
    }

    /*
     * 注册
     * @param {string} entityName 实体名
     * @return {object} this chain
     */
    public register(entityName) {
        if (arguments.length > 1) {
            return this.registerMany(Array.from(arguments));
        }

        if (Array.isArray(entityName)) {
            return this.registerMany(entityName);
        }

        if (this._preRegister(entityName)) {
            return this;
        }

        if (typeof entityName !== 'string') {
            console.warn('The entity name parameter must be a string');

            return this;
        }

        if (!this._entityMaps.has(entityName)) {
            const entityMap = new Map();
            this._entityMaps.set(entityName, entityMap);
        }

        return this;
    }

    /*
     * 批量注册
     * @param {array} entityNames 实体名
     * @return {object} this chain
     */
    public registerMany(entityNames) {
        if (!Array.isArray(entityNames)) {
            console.warn('The entity names parameter must be an array');

            return this;
        }

        if (entityNames.length < 1) {
            console.warn(
                'The entity names array must contain at least one entityName to register',
            );

            return this;
        }

        entityNames.map(entityName => {
            this.register(entityName);
        });

        return this;
    }

    /*
     * 获取实体类集合
     * @param {string} entityName 实体名
     * @return {object} entityMap 实体集合
     */
    public getMap(entityName) {
        return this._entityMaps.get(entityName);
    }

    /*
     * 根据实体ID，获取实体
     * @param {string} entityName 实体名
     * @param {string} entityId 实体ID
     * @return {object} entity 实体
     */
    public get(entityName, entityId) {
        const entityMap = this.getMap(entityName);

        if (entityMap === undefined) {
            console.warn('Entity map does not exist using the name');

            return;
        }

        return entityMap.get(entityId);
    }

    /*
     * 根据组件类，获取实体
     * @param {string} entityId 实体ID
     * @param {array} compClasses 组件类
     * @return {array} entitys 实体
     */
    public filter(entityName, compClasses = []) {
        if (!Array.isArray(compClasses)) {
            console.warn('Component Classes must be an array');

            return;
        }

        const entityMap = this.getMap(entityName);

        if (entityMap === undefined) {
            console.warn('Entity map does not exist using the name');

            return;
        }

        const entitys = [];

        for (let entity of entityMap.values()) {
            const result = compClasses.filter(compClass => {
                return this._ecs.componentManager.has(compClass, entity.id);
            });

            if (result.length === compClasses.length) {
                entitys.push(entity);
            }
        }

        return entitys;
    }

    /*
     * 获取第一个实体
     * @param {string} entityName 实体名
     * @return {object} entity 实体
     */
    public first(entityName) {
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
    public find(entityName, compClass, data) {
        const entityMap = this.getMap(entityName);

        if (entityMap === undefined) {
            console.warn('Entity map does not exist using the name');

            return;
        }

        let result = null;

        for (let entity of entityMap.values()) {
            if (entity.hasComp(compClass)) {
                let isMatch = true;
                const comp = entity.getComp(compClass);

                for (let key in data) {
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
            console.warn('Entity map does not exist using the name');

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

        if (entityMap === undefined) {
            console.warn('Entity map does not exist using the name');

            return false;
        }

        return entityMap.has(entityId);
    }

    /*
     * 检查是否存在
     * @param {object} entity 实体实例
     * @return {boolean} isExist 实体是否存在
     */
    public hasEntity(entity) {
        return this.has(entity.name, entity.id);
    }

    /*
     * 销毁实体
     * @param {string} entityName 实体名
     * @param {string} entityId 实体ID
     * @return {object} this chain
     */
    public destroy(entityName, entityId) {
        const entityMap = this.getMap(entityName);

        if (entityMap === undefined) {
            console.warn('Entity map does not exist using the name');

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
    public destroyEntity(entity) {
        this.destroy(entity.name, entity.id);

        return this;
    }

    /*
     * 清空实体
     * @return {object} this chain
     */
    public clear() {
        for (let entityMap of this._entityMaps.values()) {
            for (let entity of entityMap.values()) {
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
    public setDirty(entityTag, compName, attrs = 'all') {
        let comps = null;

        if (this._dirtyMaps.has(entityTag)) {
            comps = this._dirtyMaps.get(entityTag);
        } else {
            comps = new Map();
        }

        if (comps.has(compName) && attrs !== 'all') {
            let oldAttrs = comps.get(compName);

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
