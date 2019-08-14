import { ECS } from './ecs';
import { System } from './System';

/** 系统管理器 */
export class SystemManager {
    // ecs
    private _ecs: ECS;

    // 系统集合
    private _systemMap: Map<Ctor<System>, System> = new Map();
    constructor(ecs: ECS) {
        // ecs
        this._ecs = ecs;
    }

    /*
     * 检测系统是否已注册
     * @param (function) systemClass 系统类
     * @return (boolean) isRegister 是否已注册
     */
    private _preRegister(systemClass: Ctor<System>) {
        if (this.has(systemClass)) {
            console.warn('The system has been registered.');

            return true;
        }

        return false;
    }

    /*
     * 注册系统
     * @param (object) system 系统实例
     */
    public register(system: System) {
        if (this._preRegister(system.constructor as Ctor<System>)) {
            return this;
        }

        const systems = [...this._systemMap];

        systems.push([system.constructor as Ctor<System>, system]);

        this._systemMap = new Map(systems);

        system.initialize();
    }

    /*
     * 获取系统
     * @param (function | string) systemClass 系统类 | 系统名
     * @return (object) system 当前系统
     */
    public get(systemClass: Ctor<System>) {
        return this._systemMap.get(systemClass);
    }

    /*
     * 获取所有系统
     * @return (array) systems 所有系统
     */
    public getAll() {
        const systems = [];

        for (const system of this._systemMap.values()) {
            systems.push(system);
        }

        return systems;
    }

    /*
     * 检测系统是否存在
     * @param (function | string) systemClass 系统类 | 系统名
     */
    public has(systemClass: Ctor<System>) {
        return this._systemMap.has(systemClass);
    }

    /*
     * 激活系统
     * @param (function | string) systemClass 系统类 | 系统名
     */
    public enable(systemClass: Ctor<System>) {
        const system = this.get(systemClass);

        if (!system) {
            console.warn(`cant find system for ${systemClass}`);
            return;
        }

        system.enabled = true;
    }

    /*
     * 禁用系统
     * @param (function | string) systemClass 系统类 | 系统名
     */
    public disable(systemClass: Ctor<System>) {
        const system = this.get(systemClass);

        if (!system) {
            console.warn(`cant find system for ${systemClass}`);
            return;
        }

        system.enabled = false;
    }

    /*
     * 移除系统
     * @param (function | string) systemClass 系统类 | 系统名
     */
    public remove(systemClass: Ctor<System>) {
        const system = this.get(systemClass);

        if (!system) {
            console.warn(`cant find system for ${systemClass}`);
            return;
        }

        this._systemMap.delete(systemClass);
        system.uninitialize();
    }

    /** 清空系统 */
    public clear() {
        for (const [, system] of this._systemMap) {
            if (system) {
                system.uninitialize();
            }
        }

        this._systemMap.clear();
    }

    /*
     * 更新系统
     * @param (number) dt 帧间隔时间
     */
    public update(dt: number) {
        for (const [, system] of this._systemMap) {
            if (system && system.enabled && !system.started) {
                system.started = true;
            }
        }

        for (const [, system] of this._systemMap) {
            if (system && system.enabled && system.started) {
                system.update(dt);
            }
        }

        for (const [, system] of this._systemMap) {
            if (system && system.enabled && system.started) {
                system.lateUpdate(dt);
            }
        }
    }
}
