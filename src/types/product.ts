import { HookScope, MethodExecStatus, MpCookie, MpDetailKV, MpStackInfo, RequireId } from './common';

export interface MpProduct {
    id: string;
    /** 大类 */
    type: HookScope;
    /** 小类 */
    category?: string;
    request?: any[];
    time: number;
    status: MethodExecStatus;
    endTime?: number;
    response?: any[];
    execEndTime?: number;
    result?: any;
    eventTriggerPid?: string;
    eventHandlePid?: string;
    eventTriggerView?: any;
    stack?: MpStackInfo[];
}

export interface MpMaterial extends RequireId {
    /** 分类 */
    categorys?: string[];
    /** 索引字符串，可用于搜索 */
    indexs?: string[];
}

export interface MpApiMaterial extends MpMaterial {
    code?: number | string;
    name?: string;
    method?: string;
    nameDesc?: string;
    status: string;
    statusDesc?: string;
    startTime?: number;
    endTime?: number;
    time?: string;
    initiator?: string;
    initiatorDesc?: string;
}

export interface MpConsoleMaterialItem {
    type: 'str' | 'json' | 'br' | 'division';
    index: number;
    content?: string;
}

export interface MpConsoleMaterial extends MpMaterial {
    items?: MpConsoleMaterialItem[];
    method: string;
}

export interface MpApiDetail {
    id: string;
    general: MpDetailKV[];
    requestHeaders?: MpDetailKV[];
    responseHeaders?: MpDetailKV[];
    queryString?: string;
    queryStringParameters?: MpDetailKV[];
    formData?: MpDetailKV[];
    cookies?: MpCookie[];
    stack?: MpDetailKV[];
    originalRequestData?: any;
    response?: string;
    // arguments
    // requestRayload
}

export interface MpStorageMaterial extends MpMaterial {
    key: string;
    value: any;
}
