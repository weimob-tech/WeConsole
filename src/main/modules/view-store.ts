import type { MpViewInstance } from 'typescript-mp-component';
import { wcScopeSingle } from '../config';

export const saveView = (vw: any) => {
    const store = wcScopeSingle('MpViewInstances', () => []) as Array<MpViewInstance | undefined>;
    const removeIndexList = wcScopeSingle('MpViewInstanceRemoveIndexList', () => []) as Array<number>;
    let index = removeIndexList.shift();
    index = index === undefined ? store.length : index;
    vw.__wcStoreIndex__ = index;
    store[index] = vw;
};
export const removeView = (vw: any) => {
    if (!('__wcStoreIndex__' in vw)) {
        return;
    }
    const store = wcScopeSingle('MpViewInstances', () => []) as Array<MpViewInstance | undefined>;
    store[vw.__wcStoreIndex__] = undefined;
    const removeIndexList = wcScopeSingle('MpViewInstanceRemoveIndexList', () => []) as Array<number>;
    removeIndexList.push(vw.__wcStoreIndex__);
};
export const getViewList = () => {
    return wcScopeSingle('MpViewInstances', () => []) as Array<MpViewInstance | undefined>;
};
