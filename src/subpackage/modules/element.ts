import { toHump, isApp, getMpViewType, getWcControlMpViewInstances } from '@/main/modules/util';
import type { MpAttrNode, MpElement } from '@/types/element';
import {
    getCurrentAppId,
    getCurrentAppVersion,
    getCurrentEnvVersion,
    supportSelectOwnerComponent
} from 'cross-mp-power';
import type { MpViewInstance } from 'typescript-mp-component';

const getGroup = (children: MpElement[]): MpElement[] => {
    const map: { [prop: string]: MpElement } = {};
    const res: MpElement[] = [];
    children.forEach((item: MpElement) => {
        if (!map[item.name]) {
            const el: MpElement = {
                id: item.name,
                name: item.name,
                group: true,
                attrs: [
                    {
                        name: 'count',
                        content: '0'
                    },
                    {
                        name: 'is',
                        content: item.attrs?.find((it) => it.name === 'is')?.content
                    }
                ],
                children: []
            };
            res.push(el);
            map[item.name] = el;
        }
        const attrs = map[item.name].attrs;
        if (parseInt(attrs[0].content as string) < 1) {
            attrs[0].content = String(parseInt(attrs[0].content as string) + 1);
            map[item.name].children?.push(item);
        }
    });
    res.forEach((item, index) => {
        if (item.attrs?.[0].content === '1') {
            res[index] = (item.children as MpElement[])[0];
        } else {
            item.attrs?.shift();
        }
    });
    return res;
};

const uniqFilter = <T = any>(list: T[], filter: (item: T) => boolean) => {
    const map = new Map();
    return list.reduce((sum: T[], item) => {
        if (filter(item) && !map.has(item)) {
            map.set(item, 1);
            sum.push(item);
        }
        return sum;
    }, []);
};

const isPage = (vm) => {
    // TODO: 适配多渠道与Component方式注册page的方式
    return getMpViewType(vm) === 'Page';
};

const getPageChildren = (page) => {
    return uniqFilter(getWcControlMpViewInstances(), (item) => isPageChild(item, page));
};

const getComponentChildren = (component) => {
    return uniqFilter(getWcControlMpViewInstances(), (item) => isComponentChild(item, component));
};

export const getChildrenElements = (vw: any, group?: string, getPages?: () => any[]): Promise<MpElement[]> => {
    let children: MpViewInstance[];

    if (isApp(vw)) {
        const pages = (getPages || getCurrentPages)() as any[];
        children = pages || [];
    } else if (isPage(vw)) {
        children = getPageChildren(vw);
    } else {
        children = getComponentChildren(vw);
    }

    return Promise.all(children.map((item) => getElement(item))).then((list) => {
        if (group) {
            return list;
        }
        return getGroup(list);
    });
};

export const getElement = (vw: any): MpElement => {
    const attrs = getElementAttrs(vw);
    const tagAttr = attrs.find((item) => item.name === 'tag') as MpAttrNode;
    const idAttr = attrs.find((item) => item.name === 'id') as MpAttrNode;
    const el: MpElement = {
        id: idAttr.content as string,
        name: tagAttr.content as string,
        attrs: attrs.length > 1 ? attrs.slice(1) : [],
        hasChild: tagAttr.content === 'App' ? true : hasChild(vw)
    };
    if (tagAttr.content === 'Component') {
        const componentPath = attrs.find((item) => item.name === 'is')?.content;
        const paths = componentPath?.split('/') || [];
        let name = toHump(
            paths[paths.length - 1] === 'index'
                ? paths[paths.length > 1 ? paths.length - 2 : 0]
                : paths[paths.length - 1]
        );
        if (name[0].toUpperCase() !== name[0]) {
            name = name[0].toUpperCase() + name.substr(1);
        }
        if (paths.length > 1 && paths[paths.length - 1] !== 'index') {
            let temp = toHump(paths[paths.length - 2]);
            if (temp[0].toUpperCase() !== temp[0]) {
                temp = temp[0].toUpperCase() + temp.substr(1);
            }
            if (temp !== name) {
                name = temp + name;
            }
        }

        el.name = name;
    }
    return el;
};

const isPageChild = (component: any, page: any): boolean => {
    if (BUILD_TARGET === 'qq') {
        return component.__wxWebviewId__ && page.__wxWebviewId__ && component.__wxWebviewId__ === page.__wxWebviewId__;
    }
    if (BUILD_TARGET === 'xhs') {
        return component.ownerComponent === page;
    }
    if (BUILD_TARGET === 'swan') {
        return component.pageinstance === page;
    }
    if (supportSelectOwnerComponent()) {
        return component.selectOwnerComponent() === page;
    }
    return true;
};

const isComponentChild = (component: any, parentComponent: any) => {
    if (BUILD_TARGET === 'xhs') {
        return component.ownerComponent === parentComponent;
    }
    if (BUILD_TARGET === 'swan') {
        return component.ownerId === parentComponent.nodeId;
    }
    if (supportSelectOwnerComponent()) {
        return component.selectOwnerComponent() === parentComponent;
    }
    return false;
};

const hasChild = (target: any): boolean => {
    const MpViewInstances = getWcControlMpViewInstances();
    if (isPage(target)) {
        return MpViewInstances.some((item) => isPageChild(item, target));
    }
    if (BUILD_TARGET === 'xhs') {
        return MpViewInstances.some((item) => (item as any).ownerComponent === target);
    }
    if (BUILD_TARGET === 'swan') {
        return MpViewInstances.some((item) => (item as any).ownerId === target.nodeId);
    }
    if (supportSelectOwnerComponent()) {
        return MpViewInstances.some((item) => item.selectOwnerComponent?.() === target && item !== target);
    }
    return false;
};

export const getElementId = (vm: any): string => {
    if (BUILD_TARGET === 'wx' || BUILD_TARGET === 'qq') {
        return vm.__wxExparserNodeId__;
    }
    if (BUILD_TARGET === 'my') {
        return vm.$id;
    }
    if (BUILD_TARGET === 'xhs') {
        return vm.nodeId || vm.pageId;
    }
    if (BUILD_TARGET === 'swan') {
        return vm.nodeId || vm.__wcMockId__;
    }
    // TODO: 其他渠道
    return '';
};

export const getElementLabel = (vm: any): string => {
    return vm.is || vm.componentPath || vm.route || vm.__route__ || vm.uri;
};

const getAppAttrs = () => {
    const attrs: MpAttrNode[] = [];
    attrs.push({
        name: 'tag',
        content: 'App'
    });
    attrs.push({
        name: 'id',
        content: getCurrentAppId()
    });
    attrs.push({
        name: 'env',
        content: getCurrentEnvVersion()
    });
    attrs.push({
        name: 'version',
        content: getCurrentAppVersion()
    });
    return attrs;
};

export const getElementAttrs = (vw: any): MpAttrNode[] => {
    if (isApp(vw)) {
        return getAppAttrs();
    }
    const attrs: MpAttrNode[] = [];
    const tagName = getMpViewType(vw);
    attrs.push({
        name: 'tag',
        content: tagName
    });
    attrs.push({
        name: 'id',
        content: getElementId(vw)
    });
    attrs.push({
        name: 'is',
        content: getElementLabel(vw)
    });
    return attrs;
};

export const findPageIns = (id: string): any => {
    return findComponentIns(id);
};
export const findComponentIns = (id: string): any => {
    return getWcControlMpViewInstances().find((item) => getElementId(item) === id);
};
