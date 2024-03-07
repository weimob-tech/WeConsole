const consoleType = {
    0: 'log',
    1: 'info',
    2: 'warn',
    3: 'error'
};
Component({
    data: {
        requesting: false,
        message: 'hi demo'
    },
    created() {
        this.storageIndex = 0;
        this.requestType = 0;
        this.consoleType = 0;
    },
    methods: {
        callWxMethod(e) {
            const method = e.currentTarget.dataset.method;
            if (method === 'console') {
                console[consoleType[this.consoleType]](
                    this.consoleType === 3 ? new Error(Date.now()) : Date.now(),
                    global
                );
                swan.showToast({
                    title: `已打印console.${consoleType[this.consoleType]}，请前往Console查看`,
                    icon: 'none'
                });
                this.consoleType++;
                this.consoleType = this.consoleType > 3 ? 0 : this.consoleType;
                return;
            }
            if (method === 'showToast') {
                swan.showToast({
                    title: `当前时间：${new Date().toLocaleString()}`,
                    icon: 'none'
                });
                return;
            }
            if (method === 'setStorageSync') {
                this.storageIndex++;
                const key = `s${this.storageIndex}`;
                swan.setStorageSync(key, this.storageIndex % 2 === 0 ? Date.now() : { value: Date.now() });
                swan.showToast({
                    title: `已设置「${key}」的数据，请前往Storage查看`,
                    icon: 'none'
                });
                return;
            }
            if (method === 'getStorage') {
                swan.getStorage({
                    key: `s${this.storageIndex}`,
                    success: (res) => {
                        swan.showToast({
                            title: `获取内容：${res.data}`,
                            icon: 'none'
                        });
                        console.log('getStorage success=', res);
                    },
                    fail: (res) => {
                        swan.showToast({
                            title: `获取失败：${res.errMsg}`,
                            icon: 'none'
                        });
                        console.error('getStorage fail=', res);
                    }
                });
                return;
            }
            if (method === 'removeStorage') {
                const k2 = `s${this.storageIndex}`;
                swan.removeStorage({
                    key: k2,
                    success: () => {
                        swan.showToast({
                            title: `已删除「${k2}」的数据`,
                            icon: 'none'
                        });
                        console.log('removeStorage success');
                    },
                    fail: (res) => {
                        swan.showToast({
                            title: `删除失败：${res.errMsg}`,
                            icon: 'none'
                        });
                        console.error('removeStorage fail=', res);
                    }
                });
                return;
            }
            if (method === 'request') {
                if (this.data.requesting) {
                    return;
                }
                const fire = () => {
                    this.setData({
                        requesting: true
                    });
                    const done = (res, fail) => {
                        this.requestType++;
                        this.requestType = this.requestType > 2 ? 0 : this.requestType;
                        console[fail ? 'error' : 'log'](`请求：${fail ? '失败' : '成功'}`, res);
                        this.setData({
                            requesting: false
                        });
                    };
                    const typeConfig = {
                        0: {
                            // 请求随机文案，仅供演示，请勿商用，感谢免费接口调用服务商，文档：https://api.uomg.com/doc-rand.avatar.html
                            url: 'https://api.uomg.com/api/rand.avatar?sort=%E5%A5%B3&format=json',
                            method: 'GET'
                        },
                        1: {
                            // 请求随机图片，仅供演示，请勿商用，感谢免费接口调用服务商，文档：https://api.uomg.com/doc-rand.qinghua.html
                            url: 'https://api.uomg.com/api/rand.qinghua',
                            method: 'POST',
                            data: {
                                format: 'json'
                            }
                        },
                        2: {
                            // 模拟接口报错情况，感谢免费接口调用服务商，文档：https://api.uomg.com/doc-rand.qinghua.html
                            url: 'https://api.uomg.com/api2222/rand.qinghua22222',
                            method: 'POST',
                            data: {
                                format: 'json'
                            }
                        }
                    };
                    swan.request({
                        ...typeConfig[this.requestType],
                        success: done,
                        fail: (res) => {
                            done(res, true);
                        }
                    });
                };

                if (swan.getSystemInfoSync().enableDebug || this.enableDebug) {
                    fire();
                    return;
                }

                swan.showModal({
                    title: '提示',
                    content:
                        '由于本小程序属于演示项目，未打开调试时无法正常发送请求，但你仍然可以查看到发送后的结果。为了更好的演示效果你可以选择打开调试，你的选择是？',
                    showCancel: true,
                    cancelText: '继续发送',
                    confirmText: '打开调试',
                    success: (res) => {
                        if (res.confirm) {
                            this.enableDebug = true;
                            swan.setEnableDebug({
                                enableDebug: true
                            });
                        } else {
                            fire();
                        }
                    }
                });

                return;
            }
        }
    }
});
