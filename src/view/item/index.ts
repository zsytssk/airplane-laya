import { ui } from 'ui/layaMaxUI';
import { DirtyCompMap } from 'ecs/EntityManager';
import Position from 'game/components/Position';
export { Player } from './player';

export const bulletUI = ui.scenes.bulletUI;
export const enemyUI = ui.scenes.enemyUI;

export function updateEnemy(
    enemy_ui: ui.scenes.enemyUI,
    dirty_map: DirtyCompMap,
) {
    for (const [comp] of dirty_map) {
        if (comp instanceof Position) {
            enemy_ui.pos(comp.x, comp.y);
        }
    }
}
export function updateAmmo(
    bullet_ui: ui.scenes.bulletUI,
    dirty_map: DirtyCompMap,
) {
    for (const [comp] of dirty_map) {
        if (comp instanceof Position) {
            bullet_ui.pos(comp.x, comp.y);
        }
    }
}
