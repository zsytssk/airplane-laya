import { walk } from './script/walk';
import { cp } from './script/main';

const src = `D:\\zsytssk\\github\\airplane\\assets\\script`;
const dist = `D:\\zsytssk\\github\\airplane-laya\\src\\game`;

async function main() {
    const files = await walk(src);

    for (const item of files) {
        if (item.indexOf('.meta') !== -1) {
            continue;
        }
        const dist_item = item.replace(src, dist);
        console.log(dist_item);
        await cp(item, dist_item);
    }
}

main();
