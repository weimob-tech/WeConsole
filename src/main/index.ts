import { Hooker } from '@/main/modules/hooker';
import { FormatApiMethodCallbackHook, FuncIDHook, MpProductHook, MpViewFactoryHook } from '@/main/modules/hooks';
import { MpProductController } from '@/main/modules/controller';
import type { MkFuncHook } from '@mpkit/types';
import type { WeFuncHookState } from '@/types/hook';
import { HookScope } from '@/types/common';
import { emit } from '@/main/modules/ebus';
import { WeConsoleEvents } from '@/types/scope';
import { wcScope, wcScopeSingle } from './config';
export * from '@/main/modules/ebus';
export { getUIConfig, setUIConfig, addCustomAction, removeCustomAction } from './config';

export { log, getWcControlMpViewInstances } from '@/main/modules/util';

const ProductController = wcScopeSingle<MpProductController>(
    'ProductController',
    () => new MpProductController()
) as MpProductController;

const HookerList = wcScopeSingle<Hooker[]>('HookerList', () => []) as Hooker[];

// ProductController.on("all", (type, data) => {
//     ((console as any).org || console).log(type, data);
// });

const ProductControllerHook: MkFuncHook<WeFuncHookState> = {
    before(state) {
        state.state.controller = ProductController;
    }
};

const initHooker = (scope: HookScope) => {
    if (scope === HookScope.Api) {
        HookerList.push(
            Hooker.for(HookScope.Api, [ProductControllerHook, FuncIDHook, FormatApiMethodCallbackHook, MpProductHook])
        );
        return;
    }
    if (scope === HookScope.Console) {
        HookerList.push(Hooker.for(HookScope.Console, [ProductControllerHook, FuncIDHook, MpProductHook]));
        return;
    }
    if (scope === HookScope.Component) {
        HookerList.push(Hooker.for(HookScope.Component, [ProductControllerHook, MpViewFactoryHook]));
        return;
    }
    if (scope === HookScope.Page) {
        HookerList.push(Hooker.for(HookScope.Page, [ProductControllerHook, MpViewFactoryHook]));
        return;
    }
    if (scope === HookScope.App) {
        HookerList.push(Hooker.for(HookScope.App, [ProductControllerHook, MpViewFactoryHook]));
    }
};

export const replace = (scope?: HookScope) => {
    if (!scope) {
        replace(HookScope.Console);
        replace(HookScope.Api);
        replace(HookScope.App);
        replace(HookScope.Page);
        replace(HookScope.Component);
        return;
    }
    const item = HookerList.find((item) => item.scope === scope);
    if (item) {
        item.replace();
        return;
    }
    initHooker(scope);
};
export const restore = (scope?: HookScope) => {
    if (!scope) {
        return HookerList.forEach((item) => item.restore());
    }
    const item = HookerList.find((item) => item.scope === scope);
    if (item) {
        item.restore();
    }
};

export const showWeConsole = () => {
    const scope = wcScope();
    scope.visible = true;
    emit(WeConsoleEvents.WcVisibleChange, scope.visible);
};
export const hideWeConsole = () => {
    const scope = wcScope();
    scope.visible = false;
    emit(WeConsoleEvents.WcVisibleChange, scope.visible);
};

export const version = 'VERSION';
console.log(`欢迎使用WeConsole v${version}，让小程序调试更高效！`);
