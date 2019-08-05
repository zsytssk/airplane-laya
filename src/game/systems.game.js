/*
 * 流程相关系统
 * BattleStartSystem - 开始
 */
import BattleStartSystem from './systems/battle-start.system.js';

/*
 * 玩家相关系统
 * PlayerMovementSystem - 移动
 */
import PlayerMovementSystem from './systems/player-movement.system.js';

/*
 * 敌方相关系统
 * EnemySpawnSystem - 组装
 */
import EnemySpawnSystem from './systems/enemy-spawn.system.js';
import EnemyMovementSystem from './systems/enemy-movement.system.js';

/*
 * 火力相关系统
 * OpenFireSystem - 开火
 * AmmoMovementSystem - 弹药移动
 */
import OpenFireSystem from './systems/open-fire.system.js';
import AmmoMovementSystem from './systems/ammo-movement.system.js';

/*
 * 渲染相关系统
 * RenderSystem - 渲染
 */
import RenderSystem from './systems/render.system.js';

export default {
    BattleStartSystem,
    PlayerMovementSystem,
    EnemySpawnSystem,
    EnemyMovementSystem,
    OpenFireSystem,
    AmmoMovementSystem,
    RenderSystem,
};
