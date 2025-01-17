export interface MpEventTarget {
    dataset: {
        [prop: string]: any;
    };
}
export interface MpEvent<T = any> {
    type: string;
    target: MpEventTarget;
    currentTarget: MpEventTarget;
    detail?: T;
}
