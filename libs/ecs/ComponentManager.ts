import { ECS } from './ecs';
import { Component } from './Component';

type ComponentMap = Map<string, Component>;
// 组件管理器
export class ComponentManager {
    private _ecs: any;
    private _compMaps: Map<Ctor<Component>, ComponentMap>;
    constructor(ecs: ECS) {
        // ecs
        this._ecs = ecs;

        // 组件集合
        this._compMaps = new Map();
    }

    /*
     * 注册组件
     * @param (function) compClass 组件类
     */
    public register(compClass: Ctor<Component>) {
        if (this.getCompMap(compClass)) {
            return;
        }

        if (!this._compMaps.has(compClass)) {
            const compMap = new Map() as ComponentMap;
            this._compMaps.set(compClass, compMap);
        }
    }

    /*
     * 获取组件类集合
     * @param (function | string) compClass 组件类 | 组件名
     * @return (object) compMap 当前组件集合
     */
    public getCompMap(compClass: Ctor<Component>) {
        return this._compMaps.get(compClass);
    }

    /*
     * 获取组件
     * @param (function | string) compClass 组件类 | 组件名
     * @param (string) entityId 实体ID
     * @return (object) comp 当前组件
     */
    public get(compClass: Ctor<Component>, entityId: string) {
        const compMap = this.getCompMap(compClass);

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
    public getAll(entityId: string) {
        const comps = [] as Component[];

        for (const compMap of this._compMaps.values()) {
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
    public set(comp: Component, entityId: string) {
        this.register(comp.constructor as Ctor<Component>);

        const compMap = this.getCompMap(comp.constructor as Ctor<Component>);

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
    public has(compClass: Ctor<Component>, entityId: string) {
        const compMap = this.getCompMap(compClass);

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
    public remove(compClass: Ctor<Component>, entityId: string) {
        const compMap = this.getCompMap(compClass);

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
    public clear(entityId: string) {
        for (const compMap of this._compMaps.values()) {
            this._destroy(compMap, entityId);
        }
    }

    // 清空所有组件
    public clearAll() {
        for (const compMap of this._compMaps.values()) {
            compMap.clear();
        }

        this._compMaps.clear();
    }

    /*
     * 销毁组件
     * @param (object) compMap 组件集合
     * @param (string) entityId 实体ID
     */
    private _destroy(compMap: ComponentMap, entityId: string) {
        if (compMap.has(entityId)) {
            compMap.delete(entityId);
        }
    }
}
