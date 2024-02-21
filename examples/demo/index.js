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
                this.consoleType++;
                this.consoleType = this.consoleType > 3 ? 0 : this.consoleType;
                return;
            }
            if (method === 'showToast') {
                wx.showToast({
                    title: `当前时间：${new Date().toLocaleString()}`,
                    icon: 'none'
                });
                return;
            }
            if (method === 'setStorageSync') {
                this.storageIndex++;
                const key = `s${this.storageIndex}`;
                wx.setStorageSync(key, this.storageIndex % 2 === 0 ? Date.now() : { value: Date.now() });
                wx.showToast({
                    title: `已设置「${key}」的数据，请前往Storage查看`,
                    icon: 'none'
                });
                return;
            }
            if (method === 'getStorage') {
                const key = `s${this.storageIndex}`;
                wx.getStorage({
                    key,
                    success: (res) => {
                        wx.showToast({
                            title: `获取内容：${res.data}`,
                            icon: 'none'
                        });
                        console.log('getStorage result=', res);
                    }
                });
                return;
            }
            if (method === 'removeStorage') {
                const key = `s${this.storageIndex}`;
                wx.removeStorage({
                    key,
                    success: () => {
                        wx.showToast({
                            title: `已删除「${key}」的数据`,
                            icon: 'none'
                        });
                        console.log('removeStorage success');
                    }
                });
                return;
            }
            if (method === 'request') {
                if (this.data.requesting) {
                    return;
                }
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
                wx.request({
                    ...typeConfig[this.requestType],
                    success: done,
                    fail: (res) => {
                        done(res, true);
                    }
                });
                return;
            }
        }
    }
});