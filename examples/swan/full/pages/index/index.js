const { version } = require('../../weconsole/main/index');
Page({
    data: {
        version,
        message: 'hi WeConsole',
        enableDebug: swan.getSystemInfoSync().enableDebug
    },
    copy(e) {
        swan.setClipboardData({
            data: e.currentTarget.dataset.url
        });
    }
});
