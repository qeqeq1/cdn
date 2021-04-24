// 数组方式加载js
var loadScript = function (list, callback) {
    var loaded = 0;
    var loadNext = function () {
        loadSingleScript(list[loaded], function () {
            loaded++;
            if (loaded >= list.length) {
                callback();
            }
            else {
                loadNext();
            }
        })
    };
    loadNext();
};

/**
 * @desc 加载单个js
 * @param src
 * @param callback
 */
var loadSingleScript = function (src, callback) {
    if (src.indexOf('http://') > -1 || src.indexOf('https://') > -1) {
        // TODO
    } else if (src.indexOf('support') > -1) {
        src = '../' + src;
    } else if (src.indexOf('preview') > -1) {
        src = src.replace('preview/', '');
    } else if (src.indexOf('plugins') > -1 && src.indexOf('evk_extends_plugins') === -1) {
        src = '../' + src;
    }

    var script = document.createElement('script');
    script.async = false;
    script.src = src;
    script.addEventListener('load', function () {
        callback && callback();
    }, false);
    document.body.appendChild(script);
};

const config = window.xfConfig;
const host = (
    config.editorBranch === 'master'
        || config.editorBranch === 'beta'
        || config.editorBranch === 'feat'
        || config.editorBranch === 'xftrade_prod'
        || config.editorBranch === '363-feature-access_hykb'
            ) ? config.ossHost : config.ossTestHost;

// 将libs.js转成blobUrl 方便创建时寻路线程复用
fetch(`${host}/developer/editor/player/${window.xfConfig.editorBranch}/${window.xfConfig.editorVersion}/libs.js`, { method: 'GET', mode: 'cors'})
.then(function (response) {
    return response.blob();
})
.then(function (blob) {
    const libsblobUrl = URL.createObjectURL(blob);
    loadScript([
        libsblobUrl,
        `${host}/developer/editor/player/${window.xfConfig.editorBranch}/${window.xfConfig.editorVersion}/app.js`,
        `refTable.js`,
        `effects.js`
    ], () => {
        const sub = window.xfConfig.environment == 'beta' ? 'evk_extends_plugins_beta' : 'evk_extends_plugins';
        loadSingleScript(`${config.ossHost}/${sub}/extends.js`);
    })
});
