import { promiseifyApi, wcScope } from '../../modules/util';
import { WeComponent } from '../mixins/component';
import EbusMixin from '../mixins/ebus';
import { getSystemInfo } from '../modules/util';
import type { MpNameValue } from '../../types/common';
import { getCustomActions } from '../modules/custom-action';
import { MainStateController } from './init';
import { WeConsoleEvents } from '../../types/scope';

const WcScope = wcScope();

const getSysTabs = (): MpNameValue<string>[] =>
    getCustomActions().map((item) => ({
        name: item.title || item.id,
        value: item.id
    }));

WeComponent(EbusMixin, {
    options: {
        multipleSlots: true
    },
    properties: {
        // 组件全屏化后，距离窗口顶部距离
        fullTop: String,
        // 刘海屏机型（如iphone12等）下组件全屏化后，距离窗口顶部距离
        adapFullTop: String,
        iconStyle: String,
        handStyle: String,
        customHand: Boolean,
        zIndex: {
            type: Number,
            value: 500
        },
        icon: {
            type: String,
            value: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5byA5Y+RaWNvbjwvdGl0bGU+CiAgICA8ZyBpZD0i5pa55qGI5bCd6K+VIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i55S75p2/IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzEuMDAwMDAwLCAtNzkuMDAwMDAwKSIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC01IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMS4wMDAwMDAsIDc5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTEyLDEuMyBDMTcuOTA5NDQ2OCwxLjMgMjIuNyw2LjA5MDU1MzE4IDIyLjcsMTIgQzIyLjcsMTQuNDY5Nzg0NCAyMS44NTk4MTQ0LDE2LjgxMjg2OTYgMjAuMzQ0MzkzMywxOC42OTg0MTE0IEMyMC4xMDIyMDYzLDE4Ljk5OTc0OTMgMTkuNjYxNTkyMywxOS4wNDc3MDA1IDE5LjM2MDI1NDUsMTguODA1NTEzNSBDMTkuMDU4OTE2NywxOC41NjMzMjY1IDE5LjAxMDk2NTQsMTguMTIyNzEyNSAxOS4yNTMxNTI0LDE3LjgyMTM3NDcgQzIwLjU3MDUwOTUsMTYuMTgyMjcxMyAyMS4zLDE0LjE0Nzg4OTUgMjEuMywxMiBDMjEuMyw2Ljg2Mzc1MTgzIDE3LjEzNjI0ODIsMi43IDEyLDIuNyBDNi44NjM3NTE4MywyLjcgMi43LDYuODYzNzUxODMgMi43LDEyIEMyLjcsMTcuMTM2MjQ4MiA2Ljg2Mzc1MTgzLDIxLjMgMTIsMjEuMyBDMTMuMzEzNDk3NywyMS4zIDE0LjU4NzQ0MTMsMjEuMDI3OTU5MSAxNS43NjEzNjc0LDIwLjUwODE1NTcgQzE2LjExNDg2MjksMjAuMzUxNjMxMiAxNi41MjgzMTU5LDIwLjUxMTMwNzggMTYuNjg0ODQwNCwyMC44NjQ4MDM0IEMxNi44NDEzNjQ5LDIxLjIxODI5OSAxNi42ODE2ODgzLDIxLjYzMTc1MTkgMTYuMzI4MTkyNywyMS43ODgyNzY0IEMxNC45NzY1OTc2LDIyLjM4Njc0OTkgMTMuNTA5Njc1NCwyMi43IDEyLDIyLjcgQzYuMDkwNTUzMTgsMjIuNyAxLjMsMTcuOTA5NDQ2OCAxLjMsMTIgQzEuMyw2LjA5MDU1MzE4IDYuMDkwNTUzMTgsMS4zIDEyLDEuMyBaIE0xMi45NDY3MDA0LDguMTgxMTczMzMgQzEzLjMyMDEyNjcsOC4yODEyMzI2IDEzLjU0MTczNDUsOC42NjUwNjg0NyAxMy40NDE2NzUyLDkuMDM4NDk0NzQgTDExLjczMzQ2OTUsMTUuNDEzNjA1MiBDMTEuNjMzNDEwMiwxNS43ODcwMzE1IDExLjI0OTU3NDQsMTYuMDA4NjM5MiAxMC44NzYxNDgxLDE1LjkwODU3OTkgQzEwLjUwMjcyMTgsMTUuODA4NTIwNyAxMC4yODExMTQxLDE1LjQyNDY4NDggMTAuMzgxMTczMywxNS4wNTEyNTg1IEwxMi4wODkzNzksOC42NzYxNDgwOCBDMTIuMTg5NDM4Myw4LjMwMjcyMTgxIDEyLjU3MzI3NDIsOC4wODExMTQwNiAxMi45NDY3MDA0LDguMTgxMTczMzMgWiBNOC43MjM0MDE4Nyw4LjcyMTQ3NDc3IEM4Ljk2OTQzMjE4LDguOTY3NTA1MDcgOC45OTQwMzUyMSw5LjM1MTExMjY0IDguNzk3MjEwOTYsOS42MjQ2NTg0IEw4LjcyMzQwMTg3LDkuNzExNDI0MjYgTDYuMzg5LDEyLjA0NCBMOC43MjM0MDE4NywxNC4zNzgzMjkgQzguOTY5NDMyMTgsMTQuNjI0MzU5MyA4Ljk5NDAzNTIxLDE1LjAwNzk2NjkgOC43OTcyMTA5NiwxNS4yODE1MTI2IEw4LjcyMzQwMTg3LDE1LjM2ODI3ODUgQzguNDc3MzcxNTcsMTUuNjE0MzA4OCA4LjA5Mzc2Mzk5LDE1LjYzODkxMTggNy44MjAyMTgyNCwxNS40NDIwODc2IEw3LjczMzQ1MjM4LDE1LjM2ODI3ODUgTDQuOTA1MDI1MjUsMTIuNTM5ODUxNCBDNC42NTg5OTQ5NSwxMi4yOTM4MjExIDQuNjM0MzkxOTIsMTEuOTEwMjEzNSA0LjgzMTIxNjE2LDExLjYzNjY2NzcgTDQuOTA1MDI1MjUsMTEuNTQ5OTAxOSBMNy43MzM0NTIzOCw4LjcyMTQ3NDc3IEM4LjAwNjgxOTM4LDguNDQ4MTA3NzYgOC40NTAwMzQ4Nyw4LjQ0ODEwNzc2IDguNzIzNDAxODcsOC43MjE0NzQ3NyBaIE0xNi4xMDgyMDg5LDguNjQ3NjY1NjcgTDE2LjE5NDk3NDcsOC43MjE0NzQ3NyBMMTkuMDIzNDAxOSwxMS41NDk5MDE5IEMxOS4yNjk0MzIyLDExLjc5NTkzMjIgMTkuMjk0MDM1MiwxMi4xNzk1Mzk4IDE5LjA5NzIxMSwxMi40NTMwODU1IEwxOS4wMjM0MDE5LDEyLjUzOTg1MTQgTDE2LjE5NDk3NDcsMTUuMzY4Mjc4NSBDMTUuOTIxNjA3NywxNS42NDE2NDU1IDE1LjQ3ODM5MjMsMTUuNjQxNjQ1NSAxNS4yMDUwMjUzLDE1LjM2ODI3ODUgQzE0Ljk1ODk5NDksMTUuMTIyMjQ4MiAxNC45MzQzOTE5LDE0LjczODY0MDYgMTUuMTMxMjE2MiwxNC40NjUwOTQ5IEwxNS4yMDUwMjUzLDE0LjM3ODMyOSBMMTcuNTM4LDEyLjA0NCBMMTUuMjA1MDI1Myw5LjcxMTQyNDI2IEMxNC45NTg5OTQ5LDkuNDY1MzkzOTYgMTQuOTM0MzkxOSw5LjA4MTc4NjM4IDE1LjEzMTIxNjIsOC44MDgyNDA2MiBMMTUuMjA1MDI1Myw4LjcyMTQ3NDc3IEMxNS40NTEwNTU2LDguNDc1NDQ0NDYgMTUuODM0NjYzMSw4LjQ1MDg0MTQzIDE2LjEwODIwODksOC42NDc2NjU2NyBaIiBpZD0i5b2i54q257uT5ZCIIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='
        }
    },
    data: {
        showIcon: MainStateController.getState('showIcon') ? true : WcScope.visable || false,
        inited: !!MainStateController.getState('handX'),
        handX: MainStateController.getState('handX') || '',
        handY: MainStateController.getState('handY') || '',
        visable: MainStateController.getState('visable') || false,
        mounted: MainStateController.getState('mounted') || false,
        pageVisable: true,
        fullScreen: MainStateController.getState('fullScreen') || false,
        activeTabIndex: MainStateController.getState('activeTabIndex') || 0,
        isFullScreenPhone: MainStateController.getState('isFullScreenPhone') || false,
        winWidth: MainStateController.getState('winWidth') || 0,
        winHeight: MainStateController.getState('winHeight') || 0,
        tabMountState: MainStateController.getState('tabMountState', {}),
        tabs: [
            {
                name: 'Console',
                value: 'console'
            },
            {
                name: 'Api',
                value: 'api'
            },
            {
                name: 'Component',
                value: 'component'
            },
            {
                name: 'Storage',
                value: 'storage'
            },
            {
                name: 'Other',
                value: 'other'
            }
        ],
        sysTabs: getSysTabs(),
        activeSysTab: MainStateController.getState('activeSysTab') || 0,
        sysTabMountState: MainStateController.getState('sysTabMountState', {})
    },
    methods: {
        noop() {},
        syncState() {
            const data = {
                showIcon: MainStateController.getState('showIcon') ? true : this.data.showIcon,
                inited: MainStateController.getState('inited') ? true : this.data.inited,
                handX: MainStateController.getState('handX') || this.data.handX,
                handY: MainStateController.getState('handY') || this.data.handY,
                visable:
                    typeof MainStateController.getState('visable') !== 'undefined'
                        ? MainStateController.getState('visable')
                        : this.data.visable,
                mounted:
                    typeof MainStateController.getState('mounted') !== 'undefined'
                        ? MainStateController.getState('mounted')
                        : this.data.mounted,
                fullScreen:
                    typeof MainStateController.getState('fullScreen') !== 'undefined'
                        ? MainStateController.getState('fullScreen')
                        : this.data.fullScreen,
                activeTabIndex:
                    typeof MainStateController.getState('activeTabIndex') !== 'undefined'
                        ? MainStateController.getState('activeTabIndex')
                        : this.data.activeTabIndex,
                isFullScreenPhone:
                    typeof MainStateController.getState('isFullScreenPhone') !== 'undefined'
                        ? MainStateController.getState('isFullScreenPhone')
                        : this.data.isFullScreenPhone,
                winWidth: MainStateController.getState('winWidth') || this.data.winWidth,
                winHeight: MainStateController.getState('winHeight') || this.data.winHeight,
                tabMountState: MainStateController.getState('tabMountState') || this.data.tabMountState,
                activeSysTab:
                    typeof MainStateController.getState('activeSysTab') !== 'undefined'
                        ? MainStateController.getState('activeSysTab')
                        : this.data.activeSysTab,
                sysTabMountState: MainStateController.getState('sysTabMountState') || this.data.sysTabMountState
            };
            this.updateData(data);
            this.getCanvasCtx().then((ctx) => {
                if (this.$wcComponentIsDeatoryed) {
                    return;
                }
                WcScope.CanvasContext = ctx;
                this.$wcEmit(WeConsoleEvents.WcCanvasContextReady, ctx);
            });
        },
        changeSysTab(e) {
            this.forceData({
                activeSysTab: e.detail,
                [`sysTabMountState.s${e.detail}`]: 1
            });
            MainStateController.setState('activeSysTab', e.detail);
            MainStateController.setState('sysTabMountState', JSON.parse(JSON.stringify(this.data.sysTabMountState)));
        },
        handMovableEnd(e) {
            const state = JSON.parse(e);
            wx.setStorage({
                key: 'wcconsole_xy',
                data: {
                    x: state.x,
                    y: state.y
                }
            });
            MainStateController.setState('handX', state.x + 'px');
            MainStateController.setState('handY', state.y + 'px');
            this.updateData({
                handX: state.x + 'px',
                handY: state.y + 'px'
            });
        },
        toggleVisable() {
            this.updateData({
                visable: !this.data.visable,
                mounted: true
            });
            MainStateController.setState('visable', this.data.visable);
            MainStateController.setState('mounted', this.data.mounted);
        },
        toggleZoom() {
            this.forceData({
                fullScreen: !this.data.fullScreen
            });
            MainStateController.setState('fullScreen', this.data.fullScreen);
            this.$wcEmit(WeConsoleEvents.WcMainComponentSizeChange);
        },
        close() {
            this.forceData({
                visable: false
            });
            MainStateController.setState('visable', this.data.visable);
        },
        setTab(e) {
            const activeTabIndex = parseInt(e.detail);
            this.forceData({
                activeTabIndex,
                [`tabMountState.s${activeTabIndex}`]: 1
            });
            MainStateController.setState('activeTabIndex', activeTabIndex);
            MainStateController.setState('tabMountState', JSON.parse(JSON.stringify(this.data.tabMountState)));
        },
        getCanvasCtx() {
            if (this.canvasCtx) {
                return Promise.resolve(this.canvasCtx);
            }

            return new Promise((resolve, reject) => {
                let retryCount = 0;
                const fire = () => {
                    this.createSelectorQuery()
                        .select('#canvas')
                        .fields({ node: true })
                        .exec((res) => {
                            if (res?.[0] && res?.[0]?.node) {
                                const canvas = res[0].node;
                                this.canvasCtx = canvas.getContext('2d');
                                resolve(this.canvasCtx);
                            } else {
                                retryCount++;
                                if (retryCount > 3 || this.$wcComponentIsDeatoryed) {
                                    return reject(new Error('无法获得canvas context'));
                                }
                                setTimeout(() => {
                                    fire();
                                }, 200);
                            }
                        });
                };
                fire();
            });
        },
        init() {
            let winPromise = Promise.resolve();
            if (!MainStateController.getState('winHeight')) {
                winPromise = getSystemInfo().then((res) => {
                    this.updateData({
                        isFullScreenPhone: res.statusBarHeight && res.statusBarHeight > 20,
                        winWidth: res.windowWidth - 20,
                        winHeight: res.windowHeight - 20
                    });
                    // 默认情况下，如果是打开调试时，才显示icon
                    if (!('visable' in WcScope)) {
                        MainStateController.setState('showIcon', !!(res as any).enableDebug);
                    } else {
                        MainStateController.setState('showIcon', WcScope.visable);
                    }
                    MainStateController.setState('winHeight', this.data.winHeight);
                    MainStateController.setState('winWidth', this.data.winWidth);
                    MainStateController.setState('isFullScreenPhone', this.data.isFullScreenPhone);
                });
            }
            let handPromise = Promise.resolve();
            if (!MainStateController.getState('handX')) {
                handPromise = promiseifyApi('getStorage', {
                    key: 'wcconsole_xy'
                })
                    .catch(() => Promise.resolve())
                    .then((res) => {
                        if (res?.data) {
                            this.updateData({
                                inited: true,
                                handX: res.data.x + 'px',
                                handY: res.data.y + 'px'
                            });
                            MainStateController.setState('handX', this.data.handX);
                            MainStateController.setState('handY', this.data.handY);
                            MainStateController.setState('inited', this.data.inited);
                            return;
                        }
                        this.updateData({
                            inited: true
                        });
                        MainStateController.setState('inited', this.data.inited);
                    });
            }
            return Promise.all([winPromise, handPromise]).then(() => {
                this.syncState();
            });
        }
    },
    attached() {
        this.$wcOn(WeConsoleEvents.WcVisableChange, (type, data) => {
            MainStateController.setState('showIcon', !!data);
            this.updateData({
                showIcon: !!data
            });
        });
        this.$wcOn(WeConsoleEvents.WcUIConfigChange, () => {
            // 刷新其他选项卡中的数据
            this.updateData({
                sysTabs: getSysTabs()
            });
        });

        (this as any).init();
    },
    detached() {
        this.$wcEmit(WeConsoleEvents.WcCanvasContextDestory);
        delete WcScope.CanvasContext;
    },
    pageLifetimes: {
        show() {
            this.syncState();
            this.updateData({
                pageVisable: true
            });
        },
        hide() {
            this.updateData({
                pageVisable: false
            });
        }
    }
});