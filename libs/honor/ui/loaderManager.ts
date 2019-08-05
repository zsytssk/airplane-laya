import { ViewType, HonorLoadScene } from './view';
import { ResItem, loadRes } from 'honor/utils/loadRes';

type LoadingMap = Map<ViewType, HonorLoadScene>;

export class LoaderManagerCtor {
    private load_map = new Map() as LoadingMap;
    public loadScene(type: ViewType, url: string) {
        return new Promise((resolve, reject) => {
            const ctor = type === 'Scene' ? Laya.Scene : Laya.Dialog;
            ctor.load(
                url,
                Laya.Handler.create(this, _scene => {
                    resolve(_scene);
                    this.toggleLoading(type, false);
                }),
                Laya.Handler.create(this, this.setLoadProgress, [type], false),
            );
            this.toggleLoading(type, true);
        });
    }
    public load(res: ResItem[] | string[], type?: ViewType) {
        return new Promise(async (resolve, reject) => {
            this.toggleLoading(type, true);

            let load_progress_fn;
            if (type) {
                load_progress_fn = (val: number) => {
                    this.setLoadProgress(type, val);
                };
            }
            await loadRes(res, load_progress_fn);

            /** 如果显示loading, 最少显示500ms */
            this.toggleLoading(type, false);
            return resolve();
        });
    }

    public toggleLoading(type: ViewType, status: boolean) {
        if (!type) {
            return;
        }
        let time = 0;
        if (status === false) {
            time = 500;
        }
        clearTimeout(this[`${type}_timeout`]);
        this[`${type}_timeout`] = setTimeout(() => {
            this.setLoadViewVisible(type, status);
        }, time);
    }
    public async setLoadView(type: ViewType, url: string) {
        const ctor = type === 'Scene' ? Laya.Scene : Laya.Dialog;
        const scene: HonorLoadScene = await new Promise((resolve, reject) => {
            ctor.load(
                url,
                Laya.Handler.create(null, _scene => {
                    resolve(_scene);
                }),
            );
        });

        this.load_map.set(type, scene);
    }

    public setLoadViewVisible(type: ViewType, visible: boolean) {
        const load_scene = this.load_map.get(type);
        if (!load_scene) {
            return;
        }
        if (visible) {
            this.setLoadProgress(type, 0);
            load_scene.onShow();
        } else {
            load_scene.onHide();
        }
    }
    public setLoadProgress(type: ViewType, val: number) {
        const load_scene = this.load_map.get(type);
        if (!load_scene) {
            return;
        }
        load_scene.onProgress(val);
    }
}
