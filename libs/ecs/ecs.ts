import { ComponentManager } from './ComponentManager';
import { Entity } from './Entity';
import { EntityManager } from './EntityManager';
import { Input } from './input';
import { Mediator } from './Mediator';
import { Pool } from './Pool';
import { SystemManager } from './SystemManager';
import Observer from './observer';

export { Component } from './Component';
export { System } from './System';

export class ECS {
    // 观察者, 用来派发数据的改变
    public observer: Observer;
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
     * 初始化
     * @param {object} ui UI
     * @param {object} Workers worker类列表
     * @param {object} Systems 系统类列表
     * @param {object} keyCode 输入码
     */
    public init({ observer, Systems, keyCode }) {
        this.observer = observer;
        if (keyCode) {
            this.input.keyCode = keyCode;
        }

        if (Systems) {
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

    public createEntity(entityName = 'default', entity_id?: string) {
        return new Entity(this, entityName, entity_id);
    }
}
