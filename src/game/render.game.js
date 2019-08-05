/*
 * 渲染
 * renderPlayer - 玩家
 * renderAmmo - 弹药
 * renderEnemy - 敌方
 */
import renderPlayer from './render/player.render.js';
import renderAmmo from './render/ammo.render.js';
import renderEnemy from './render/enemy.render.js';

export default {
    player: renderPlayer,
    ammo: renderAmmo,
    enemy: renderEnemy,
};
