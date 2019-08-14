import { ECS } from 'ecs/ecs';
import Systems from 'game/systems.game';
import { Honor } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { basic, keycode } from './config';
import { bulletUI, enemyUI, Player, updateEnemy, updateAmmo } from './item';
import { PoolManager } from './Pool.manager';
import Observer from 'ecs/observer';
import { EcsEvent } from 'game/ecsEvent';
import { Entity } from 'ecs/Entity';
import { DirtyCompMap } from 'ecs/EntityManager';
import Owner from 'game/components/Owner';

export default class GameScene extends ui.scenes.gameUI {
    private _ammoMap: Map<string, Laya.Sprite>;
    private _enemyMap: Map<string, Laya.Sprite>;
    private player: Player;
    private bulletPool = new PoolManager(bulletUI);
    private enemyPool = new PoolManager(enemyUI);
    private panel = new Laya.Box();
    private observer: Observer;
    private ecs: ECS;
    constructor() {
        super();
        // 玩家组件

        // 弹药
        this._ammoMap = new Map();
        // 敌方
        this._enemyMap = new Map();

        this.addChild(this.panel);
    }
    public static async preEnter() {
        const game_scene = (await Honor.director.runScene(
            'scenes/game.scene',
        )) as GameScene;
        game_scene.start();
    }
    public onResize(width, height) {
        const { bg, panel } = this;
        bg.width = panel.width = this.width = width;
        bg.height = panel.height = this.height = height;
    }
    public start() {
        this.init();
        this.onResize(Laya.stage.width, Laya.stage.height);
        this.initEvent();
        this.gameStart();
    }

    // 初始化
    public init() {
        // 初始化ecs
        const ecs = new ECS();
        const observer = new Observer();
        ecs.init({
            observer,
            keyCode: keycode,
            Systems,
        } as any);
        this.ecs = ecs;
        this.observer = observer;
    }

    // 初始化事件
    public initEvent() {
        const { ecs, observer } = this;
        this.panel.on(Laya.Event.MOUSE_DOWN, this, (evt: Laya.Event) => {
            this.ecs.input.set(keycode.MOVE, {
                x: evt.stageX,
                y: evt.stageY,
            });
        });

        this.panel.on(Laya.Event.MOUSE_UP, this, (evt: Laya.Event) => {
            ecs.input.set(keycode.MOVE, {
                x: evt.stageX,
                y: evt.stageY,
            });
        });

        observer.subscribe(EcsEvent.updateUI, this.updateUI.bind(this));
    }

    // 开始游戏
    public gameStart() {
        const { ecs } = this;
        const screenSize = Laya.stage;
        const playerSize = this.player;

        ecs.send(Systems.BattleStartSystem, {
            world: {
                width: screenSize.width,
                height: screenSize.height,
            },
            player: {
                id: '0',
                name: 'EVANGELION',
                level: 1,
                healthPoint: 100,
                maxHealthPoint: 100,
                model: 1,
                width: 100,
                height: 100,
                x: screenSize.width / 2,
                y: screenSize.height - 100,
                speed: basic.PLAYER_SPEED,
            },
        });

        Laya.timer.frameLoop(1, this, () => {
            ecs.update(1);
        });
    }

    // 开火
    public openFire() {
        const { ecs } = this;

        const firepowers = this.player.getFirepowerInfo(1);

        for (const item of firepowers) {
            item.speed = basic.AMMO_SPEED;
        }

        ecs.send(Systems.OpenFireSystem, {
            firepowers,
        });
    }

    // 敌军
    public enemyFactory() {
        const { ecs } = this;

        const screenSize = Laya.stage;
        const enemySize = this.enemyPool.getSize();
        const { width: world_width, height: world_height } = this;
        const speed = this.random(basic.ENEMY_MIN_SPEED, basic.ENEMY_MAX_SPEED);
        const x = this.random(
            0,
            Math.floor(screenSize.width - enemySize.width),
        );
        const y = 0;

        ecs.send(Systems.EnemySpawnSystem, {
            id: '0',
            name: 'ANGEL',
            level: 1,
            healthPoint: 100,
            maxHealthPoint: 100,
            model: 1,
            width: enemySize.width,
            height: enemySize.height,
            world_height,
            world_width,
            x,
            y,
            speed,
        });
    }

    // 更新UI
    public updateUI(state: Map<Entity, DirtyCompMap>) {
        for (const [entity, attrs] of state) {
            const { name } = entity;
            if (name === 'Player') {
                this.updatePlayer(entity, attrs);
            }
            if (name === 'Ammo') {
                this.updateAmmo(entity, attrs);
            }
            if (name === 'Enemy') {
                this.updateEnemy(entity, attrs);
            }
        }
    }

    // 更新玩家
    public updatePlayer(entity: Entity, dirty_map: DirtyCompMap) {
        if (!this.player) {
            this.player = new Player(entity);
            this.addChild(this.player);
            Laya.timer.loop(100, this, () => {
                this.openFire();
            });
            Laya.timer.loop(1000, this, () => {
                this.enemyFactory();
            });
        }
        this.player.updateUI(dirty_map);
    }

    // 创建敌方
    public createEnemy(data: Entity) {
        const enemy = this.enemyPool.request();
        this.addChild(enemy);

        this._enemyMap.set(data.id, enemy);
        return enemy;
    }

    // 更新敌方
    public updateEnemy(entity: Entity, dirty_map: DirtyCompMap) {
        if (entity.is_terminate) {
            return this.destroyEnemy(entity);
        }
        let enemy = this._enemyMap.get(entity.id);
        if (!enemy) {
            enemy = this.createEnemy(entity);
        }
        updateEnemy(enemy as ui.scenes.enemyUI, dirty_map);
    }

    // 销毁敌方
    public destroyEnemy(entity: Entity) {
        if (!this._enemyMap.has(entity.id)) {
            return;
        }

        const enemy = this._enemyMap.get(entity.id);
        this._enemyMap.delete(entity.id);
        this.enemyPool.recover(enemy);
    }

    // 创建弹药
    public createAmmo(entity: Entity) {
        const ammo = this.bulletPool.request();
        this.addChild(ammo);

        this._ammoMap.set(entity.id, ammo);
        return ammo;
    }

    // 更新弹药
    public updateAmmo(entity: Entity, dirty_map: DirtyCompMap) {
        if (entity.is_terminate) {
            return this.destroyAmmo(entity);
        }
        let ammo = this._ammoMap.get(entity.id);
        if (!ammo) {
            ammo = this.createAmmo(entity);
        }
        updateAmmo(ammo as ui.scenes.enemyUI, dirty_map);
    }

    // 销毁弹药
    public destroyAmmo(entity: Entity) {
        if (!this._ammoMap.has(entity.id)) {
            return;
        }

        const ammo = this._ammoMap.get(entity.id);

        this.bulletPool.recover(ammo);
    }

    /*
     * 转换坐标
     * @param {number} x x轴坐标
     * @param {number} y y轴坐标
     * @return {object} result
     */
    public convertCoordinate(x, y) {
        const position = this.globalToLocal(new Laya.Point(x, y));
        return position;
    }

    /*
     * 获取指定范围随机整数
     */
    public random(min, max) {
        return Math.round(Math.random() * (max - min)) === 0
            ? min + 1
            : Math.round(Math.random() * (max - min)) + min;
    }
}
