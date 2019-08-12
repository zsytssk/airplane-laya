import ecs from 'ecs/ecs';
import Systems from 'game/systems.game';
import { Honor } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { basic, keycode } from './config';
import { bulletUI, enemyUI, Player } from './item';
import { PoolManager } from './Pool.manager';

export default class GameScene extends ui.scenes.gameUI {
    private _ammoMap: Map<string, Laya.Sprite>;
    private _enemyMap: Map<string, Laya.Sprite>;
    private player = new Player();
    private bulletPool = new PoolManager(bulletUI);
    private enemyPool = new PoolManager(enemyUI);
    private panel = new Laya.Box();
    constructor() {
        super();
        // 玩家组件

        // 弹药
        this._ammoMap = new Map();
        // 敌方
        this._enemyMap = new Map();

        this.addChild(this.panel);
        this.addChild(this.player);
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
        ecs.init({
            ui: this,
            keyCode: keycode,
            Systems,
        } as any);
    }

    // 初始化事件
    public initEvent() {
        this.panel.on(Laya.Event.MOUSE_DOWN, this, (evt: Laya.Event) => {
            ecs.input.set(ecs.input.keyCode.MOVE, {
                x: evt.stageX,
                y: evt.stageY,
            });
        });

        this.panel.on(Laya.Event.MOUSE_UP, this, (evt: Laya.Event) => {
            ecs.input.set(ecs.input.keyCode.MOVE, {
                x: evt.stageX,
                y: evt.stageY,
            });
        });
    }

    // 开始游戏
    public gameStart() {
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
                width: playerSize.width,
                height: playerSize.height,
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
    public updateUI(state = {}) {
        for (const name in state) {
            if (typeof this[name] === 'function') {
                const data = state[name];

                this[name](data);
            }
        }
    }

    // 创建玩家
    public createPlayer(data) {
        const { id, name } = data;
        const vec = this.convertCoordinate(data.x, data.y);

        this.player.setBasicInfo({
            id,
            name,
        });

        this.player.pos(vec.x, vec.y);

        Laya.timer.loop(100, this, () => {
            this.openFire();
        });
        Laya.timer.loop(1000, this, () => {
            this.enemyFactory();
        });
    }

    // 更新玩家
    public updatePlayer(data) {
        const vec = this.convertCoordinate(data.x, data.y);

        this.player.pos(vec.x, vec.y);
    }

    // 创建敌方
    public createEnemy(data) {
        const vec = this.convertCoordinate(data.x, data.y);
        const enemy = this.enemyPool.request();
        enemy.pos(vec.x, vec.y);
        this.addChild(enemy);

        this._enemyMap.set(data.eid, enemy);
    }

    // 更新敌方
    public updateEnemy(data) {
        if (!this._enemyMap.has(data.eid)) {
            return;
        }

        const vec = this.convertCoordinate(data.x, data.y);
        const enemy = this._enemyMap.get(data.eid);
        enemy.pos(vec.x, vec.y);
    }

    // 销毁敌方
    public destroyEnemy(data) {
        if (!this._enemyMap.has(data.eid)) {
            return;
        }

        const enemy = this._enemyMap.get(data.eid);
        this._enemyMap.delete(data.eid);
        this.enemyPool.recover(enemy);
    }

    // 创建弹药
    public createAmmo(data) {
        const ammo = this.bulletPool.request();
        const vec = this.convertCoordinate(data.x, data.y);
        ammo.pos(vec.x, vec.y);
        this.addChild(ammo);

        this._ammoMap.set(data.eid, ammo);
    }

    // 更新弹药
    public updateAmmo(data) {
        if (!this._ammoMap.has(data.eid)) {
            return;
        }

        const vec = this.convertCoordinate(data.x, data.y);
        const ammo = this._ammoMap.get(data.eid);
        ammo.pos(vec.x, vec.y);
    }

    // 销毁弹药
    public destroyAmmo(data) {
        if (!this._ammoMap.has(data.eid)) {
            return;
        }

        const ammo = this._ammoMap.get(data.eid);

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
