export interface EventHandler<T = any> {
    (type: string, data?: T);
}
export interface IEventEmitter<T = any> {
    on: (type: string, handler: EventHandler<T>) => any;
    once: (type: string, handler: EventHandler<T>) => any;
    off: (type: string, handler?: EventHandler<T>) => any;
    emit: (type: string, data?: T) => any;
    destory: () => any;
}

export type WcListFilterHandler<T = any> = (item: T, index: number, list: T[]) => any;

export type AnyFunction = (...args: any[]) => any;
export type AnyClass = new (...args: any[]) => any;

export type EmptyObject = Record<string, never>;

export type AnyObject = Record<string | number | symbol, any>;
