import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import * as url from 'url';

export async function saveUrl(url: string, folder: string) {
    let new_url: string;
    let name: string;
    name = name || getUrlFileName(new_url);

    const file_path = path.resolve(folder, name);
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(file_path);
        const get = new_url.indexOf('https') === -1 ? http.get : https.get;

        get(new_url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(); // close() is async, call cb after close completes.
                resolve();
            });
        }).on('error', err => {
            fs.unlink(file_path, () => {
                reject(err.message);
            });
        });
    });
}

export async function getUrl(url: string) {
    const res: string = await new Promise((resolve, reject) => {
        const get = url.indexOf('https') === -1 ? http.get : https.get;

        get(url, response => {
            let res = '';
            response.on('error', err => {
                return reject(err);
            });

            response.on('data', chunk => {
                res += chunk.toString('utf-8');
            });

            response.on('close', () => {
                resolve(res);
            });
        }).on('error', err => {
            reject(err.message);
        });
    });

    return res;
}

export function getUrlFileName(url_path: string) {
    const parsed = url.parse(url_path);
    let name = path.basename(parsed.pathname);
    if (name.indexOf('.') === -1) {
        name += '.txt';
    }

    return name;
}
