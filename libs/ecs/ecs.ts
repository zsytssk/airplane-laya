import { ComponentManager } from './ComponentManager';
import { Entity } from './Entity';
import { EntityManager } from './EntityManager';
import { Input } from './input';
import { Mediator } from './Mediator';
import { Pool } from './Pool';
import { SystemManager } from './SystemManager';

export { Component } from './Component';
export { System } from './System';

export class ECS {
    // UI
    public _ui = null;
    // 中介
    public mediator = new Mediator(this);

    // 输入
    public input = new Input(this);

    // 对象池
    public pool = new Pool(this);

    // 组件管理器
    public componentManager = new ComponentManager(this);

    // 实体管理器
    public entityManager = new EntityManager(this);

    // 系统管理器
    public systemManager = new SystemManager(this);

    /*
     * 设置UI
     * @param {object} obj UI
     */
    set ui(obj) {
        this._ui = obj;
    }

    /*
     * 获取UI
     * @return {object} UI UI
     */
    get ui() {
        return this._ui;
    }

    /*
     * 初始化
     * @param {object} ui UI
     * @param {object} Workers worker类列表
     * @param {object} Systems 系统类列表
     * @param {object} keyCode 输入码
     */
    public init({ ui, Systems, keyCode }) {
        if (!!ui) {
            this._ui = ui;
        }

        if (!!keyCode) {
            this.input.keyCode = keyCode;
        }

        if (!!Systems) {
            for (const name in Systems) {
                if (!Systems.hasOwnProperty(name)) {
                    continue;
                }
                this.systemManager.register(new Systems[name](this));
            }
        }
    }

    /*
     * 更新
     * @param {number} dt 帧间隔时间
     */
    public update(dt: number) {
        this.mediator.update(dt);

        this.systemManager.update(dt);
    }

    // 销毁
    public destroy() {
        this.ui = null;

        this.systemManager.clear();

        this.mediator.clear();

        this.entityManager.clear();

        this.pool.clear();
    }

    /*
     * 发送消息
     * @param {function | string} systemClass 系统类 | 系统类名
     * @param {object} data 数据
     */
    public send(systemClass, data) {
        this.mediator.collect({
            system: systemClass,
            data,
        });
    }

    /*
     * 获取类名
     * @param {function | string} ecsClass 类 | 类名
     * @return {string} className 类名
     */
    public getClassName(ecsClass) {
        const className =
            typeof ecsClass === 'function' ? ecsClass.name : ecsClass;

        return className;
    }

    /*
     * 获取uuid
     * @return {string} uuid 唯一标识
     */
    public getUUID() {
        const s = [];
        const hexDigits = '0123456789abcdef';
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        // bits 12-15 of the time_hi_and_version field to 0010
        s[14] = '4';
        // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = '-';

        return s.join('');
    }
    public createEntity(entityName = 'default', entity_id?: string) {
        return new Entity(this, entityName, entity_id);
    }
}
