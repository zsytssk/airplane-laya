/** 在class的fun执行之后执行fun */
export function injectAfter(ctor: any, fun_name: string, func: Func<any>) {
    const ori_fun = ctor[fun_name];
    ctor[fun_name] = function(...params) {
        const result = ori_fun.apply(this, [...params]);
        func(...params);
        return result;
    };
}
