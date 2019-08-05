type FuncVoid = () => void;
type Func<T> = (...params: any[]) => T;
type NotFunc<T> = T extends Function ? never : T;

type PropsOption<T> = { [key in keyof T]?: T[key] };
type Ctor<T> = new (...param: any[]) => T;

type AnyObj = {
    [key: string]: any;
};
