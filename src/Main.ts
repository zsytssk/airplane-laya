import honor from 'honor';
import GameConfig from './GameConfig';
import './ui/layaMaxUI';
import GameScene from 'view/game';

declare global {
    interface Window {
        CDN_VERSION: string;
    }
}

async function main() {
    await honor.run(GameConfig, {
        defaultVersion: window.CDN_VERSION,
    });

    GameScene.preEnter();
}
main();
