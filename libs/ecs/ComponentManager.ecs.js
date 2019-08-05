// 组件管理器
export class ComponentManager {
    constructor(ecs) {
        // ecs
        this._ecs = ecs;

        // 组件集合
        this._compMaps = new Map();
    }

    /*
     * 检测组件是否已注册
     * @param (function) compClass 组件类
     * @return (boolean) isRegister 是否已注册
     */
    _preRegister(compClass) {
        if (this.getMap(compClass)) {
            return true;
        }

        return false;
    }

    /*
     * 注册组件
     * @param (function) compClass 组件类
     */
    register(compClass) {
        if (this._preRegister(compClass)) {
            return;
        }

        const compName = compClass.name;

        if (compName === undefined) {
            console.warn('The component type does not have a name defined. i.e. a constructor name');

            return;
        }

        if (!this._compMaps.has(compName)) {
            const compMap = new Map();
            this._compMaps.set(compName, compMap);
        }
    }

    /*
     * 获取组件类集合
     * @param (function | string) compClass 组件类 | 组件名
     * @return (object) compMap 当前组件集合
     */
    getMap(compClass) {
        const compName = this._ecs.getClassName(compClass);

        return this._compMaps.get(compName);
    }

    /*
     * 获取组件
     * @param (function | string) compClass 组件类 | 组件名
     * @param (string) entityId 实体ID
     * @return (object) comp 当前组件
     */
    get(compClass, entityId) {
        const compMap = this.getMap(compClass);

        if (compMap === undefined) {

            return;
        }

        return compMap.get(entityId);
    }

    /*
     * 获取所有组件
     * @param (string) entityId 实体ID
     * @return (array) comps 所有组件
     */
    getAll(entityId) {
        const comps = [];

        for (let compMap of this._compMaps.values()) {
            if (compMap.has(entityId)) {
                const comp = compMap.get(entityId);

                comps.push(comp);
            }
        }

        return comps;
    }

    /*
     * 添加组件
     * @param (object) comp 组件实例
     * @param (string) entityId 实体ID
     */
    set(comp, entityId) {
        this.register(comp.constructor);

        const compMap = this.getMap(comp.constructor);

        if (compMap === undefined) {
            console.warn('Component map does not exist using the name');

            return;
        }

        compMap.set(entityId, comp);
    }

    /*
     * 检测组件是否存在
     * @param (function | string) compClass 组件类 | 组件名
     * @param (string) entityId 实体ID
     * @return (boolean) hasComp 是否存在
     */
    has(compClass, entityId) {
        const compMap = this.getMap(compClass);

        if (compMap === undefined) {
            // console.warn('Component map does not exist using the name');

            return false;
        }

        return compMap.has(entityId);
    }

    /*
     * 移除组件
     * @param (function | string) compClass 组件类 | 组件名
     * @param (string) entityId 实体ID
     */
    remove(compClass, entityId) {
        const compMap = this.getMap(compClass);

        if (compMap === undefined) {
            console.warn('Component map does not exist using the name');

            return;
        }

        this._destroy(compMap, entityId);
    }

    /*
     * 清空组件
     * @param (string) entityId 实体ID
     */
    clear(entityId) {
        for (let compMap of this._compMaps.values()) {
            this._destroy(compMap, entityId);
        }
    }

    // 清空所有组件
    clearAll() {
        for (let compMap of this._compMaps.values()) {
            for (let comp of compMap.values()) {
                comp.destroy();
            }

            compMap.clear();
        }

        this._compMaps.clear();
    }

    /*
     * 销毁组件
     * @param (object) compMap 组件集合
     * @param (string) entityId 实体ID
     */
    _destroy(compMap, entityId) {
        if (compMap.has(entityId)) {
            const comp = compMap.get(entityId);
            comp.destroy();

            compMap.delete(entityId);
        }
    }
}