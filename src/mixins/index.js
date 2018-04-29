import _ from 'lodash'
import conf from '@/conf'
import globalConf from '@/global_conf'
import utilsUrl from '@/utils/url'
import { Utils } from 'weex-ui'
import { isFunction } from 'util';
import store from '@/store'

export const getUrl = utilsUrl.getUrl

const modal = weex.requireModule('modal')
const stream2 = weex.requireModule('stream');
const navigator2 = weex.requireModule('navigator')

let __rangeNumber = [];

const __dispatch  = (lst) => {
    _.each(lst, (val, key) => {
        if (val.pattern) {
            lst[key] = val.path.replace(/^\//, _.trimEnd(_.get(globalConf, 'HOST.value', '/'), '/') + (val.path === '/' ? '' : '/'))
        }
    })
    return lst
}

const __streamAlertError = (error, returns = {}) => {
    if (typeof error !== 'string') return returns
    modal.alert({
        message: error,
        duration: 0.3
    }, function (value) {
        console.log('alert callback', value)
    })
    return returns
}

const __streamOptions = (val, actions, urlPath, child) => {
    let API = _.get(conf, urlPath.join('.'), _.get(conf, urlPath.slice(0, 2).join('.'), false))
    //_.unset(API, child)
    if (actions.includes(val) || _.has(_.get(API, 'actions', {}), val)) {
        return API;
    }
    return false
}

const __initSetParames = (event, append = '') => {
    let queryParames = []
    if (_.isEmpty(event) && _.isEmpty(append)) return []
    if (append === '') {
        append = []
    } else {
        append = __initSetParames(append, '')
    }
    if (!_.isEmpty(event) && _.isObject(event) && !_.has(event, 'touchEvent')) {
        for (let key in event) {
            queryParames.push([
                key, 
                _.isObject(event[key]) 
                    ? JSON.stringify(event[key]) 
                    : event[key]
                ].join('='))
        }
        return queryParames.concat(append)
    } else if (_.isNumber(event) || _.isBoolean(event) || _.isString(event)) {
        return [event.toString()].concat(append)
    } else if (append !== '') {
        return append
    }
    return []
}

const __setParames = (event, append = '', prefix = '?') => {
    let parames = __initSetParames(event, append)
    return _.isEmpty(parames) 
        ? '' 
        : [ prefix, parames.join('&')].join('')
}

const streamRun  = async (API, _url, isAsync = false, resolve) => {
    let status = false
    if (status = ['post', 'put', 'path'].includes(API.method)) {
        API.headers = Object.assign({
            'Content-Type': 'application/x-www-form-urlencoded'
        }, API.headers)
    }
    let { user } = store.state
    if (user && user.token) {
        // API.headers = Object.assign({
        //     'access-token': user.token
        // }, API.headers) 
    }
    stream2.fetch({
        method: API.method,
        url: __dispatch({
            api: {
                pattern: /^(\/).*/,
                path: _url
            }
        }).api + __setParames(API.query, user && user.token 
            ? {'access-token': user.token}
            : ''),
        headers: API.headers,
        type: API.type,
        body: _.isObject(API.body) 
            ? __setParames(API.body, '', status ? '' : '?') // JSON.stringify(API.body)
            : API.body.toString()
        }, isAsync 
            ? args => resolve(args) 
            : API.callback, 
        API.progressCallback
    )
}

export const alert  = (...info) => {
    //if (typeof info !== 'string') return returns
    let message = ''
    let callback
    info.forEach((val) => {
        _.isFunction(val) && !_.isFunction(callback) 
            ? callback = val 
            : message += ( _.isString(val) 
                ? val 
                : JSON.stringify(val))
    })
    modal.alert({
        message: message,
        duration: 0.3
    }, callback ? callback : (value) => {
        console.log('alert callback', value)
    })
}

export const confirm = (
    message = 'Do you confirm ?',
    duration = 0.3, 
    okTitle = '确定', 
    cancelTitle = '取消', 
    callback = () => {},
    async = false, 
    resolve = () => {}) => {
        if (_.isFunction(message)) {
            callback = message;
            message = 'Do you confirm ?'
        } else if (_.isFunction(duration)) {
            callback = duration
            duration = 0.3
        } else if (_.isFunction(okTitle)) {
            callback = okTitle
            okTitle = true
        } else if (_.isFunction(cancelTitle)) {
            callback = cancelTitle
            cancelTitle = false
        }
    modal.confirm({
        message,
        duration,
        okTitle,
        cancelTitle  
    }, 
    (...args) => {
        switch (args[0]) {
            case okTitle:
                args.push(true)
                break;
            case cancelTitle:
            default:
                args.push(false)
                break;
        }
        callback(...args)
        async && resolve(args)
    })    
}

export const confirmAsync = (...args) => {
    let [
        message = 'Do you confirm ?',
        duration = 0.3, 
        okTitle = '确定', 
        cancelTitle = '取消', 
        callback = () => {}
    ] = args.slice(0, 5)
    return new Promise((resolve, reject) => {
        confirm(message
            , duration
            , okTitle
            , cancelTitle
            , callback
            , true
            , resolve)
    })
}

export const queryParames = (url = null, infos = false) => {
    let parames = {}
    url = _.isString(url) ? url : weex.config.bundleUrl
    let index = url.indexOf('?')
    if (index == -1) return parames
    let bundleUrl = decodeURI(url)
    let queryParames = bundleUrl.substring(index + 1)
    queryParames.split('&').forEach(val => {
        let parame = val.split('=')
        parames[parame[0]] = parame[1]
    })
    return infos 
        ? {url: url.substring(0, index), query: parames} 
        : parames
}

export const queryParame = (key, defaultVal = null, url = null) => {
    let parames = queryParames(url)
    return _.has(parames, key) ? parames[key] : defaultVal
}

export const streamHttp = (_url, API = {}) => {
    let methods   = ['get', 'post'];
    let types     = ['json', 'text', 'jsonp'];
    API = Object.assign({
        method: 'GET',
        type: 'JSON',
        headers: {},
        body: "",
        query: ""
    }, _.isObject(API) ? API : API)
    if (!types.includes(API.type.toLocaleLowerCase())) return __streamAlertError('stream 支持数据格式 JSON & JSONP & TEXT');
    if (!methods.includes(API.method.toLocaleLowerCase())) return __streamAlertError('stream 支持请求类型 GET & POST');
    if (isFunction(API.callback)) {
        return streamHttpRun(API, _url)   
    }
    return new Promise((resolve, reject) => {
        streamHttpRun(API, _url, true, resolve)
    })
}

export const streamHttpRun  = (API, _url, isAsync = false, resolve) => {
    let status = false
    if (status = ['post', 'put', 'path'].includes(API.method)) {
        API.headers = Object.assign({
            'Content-Type': 'application/x-www-form-urlencoded'
        }, API.headers)
    }
    stream2.fetch({
        method: API.method,
        url: _url + __setParames(API.query, '', _url.indexOf('?') > -1 ? '&' : '?'),
        headers: API.headers,
        type: API.type,
        body: _.isObject(API.body) 
            ? __setParames(API.body, '', status ? '' : '?') // JSON.stringify(API.body)
            : API.body.toString()
        }, isAsync 
            ? args => resolve(args) 
            : API.callback, 
        API.progressCallback
    )
}

export const stream = (url, options, progressCallback) => {
    let methods   = ['get', 'post'];
    let types     = ['json', 'text', 'jsonp'];
    let actions   = ['view', 'list', 'create', 'update', 'delete']
    let defaults  = {
        callback: false,
        progressCallback: () => {},
    }

    switch (typeof options) {
        case 'object':
            Object.assign(defaults, options)
            break;
        case 'function':
            defaults.callback = options
            break;
    }

    if (typeof url != 'string') return __streamAlertError('url 参数必须是字符串！');
    if (typeof progressCallback === 'function') options.progressCallback = progressCallback

    if (/^(http:\/\/|https:\/\/|\/\/).*?/.test(url)) {
        return streamHttp(url, Object.assign(defaults, options))
    }

    let urls = url.toLocaleLowerCase().split('.')
    if (urls.length < 2) return __streamAlertError('url 不正确！')

    let API = {}
    let action
    let _child = false
    let urlPath = ['API']
    let child = '_children'

    for (let key in urls) {
        let val = urls[key]
        let firstChar = val.substring(0,1)
        if ((parseInt(key) + 1) % 2 === 0 || _child) {
            if (firstChar !== '!') {
                action = val
                API = __streamOptions (val, actions, urlPath, child)
                break;
            }
            _child = true
            urlPath = urlPath.concat([child, val.substring(1)])
        } else if (key >= 1) {
            action = val
            API = __streamOptions (val, actions, urlPath, child)
            break;
        } else {
            urlPath = urlPath.concat([val])
        }
    }

    if (typeof API !== 'object') return __streamAlertError('API 接口定义错误！');
    API = _.merge(API, options)

    let _url = 'url'
    let _actions = _.get(API, 'actions', {})
    let _options = _.get(_actions, actions.includes(action) ? action.substring(0,1) : action)
    let _urls =_.get(API, _url, '')
    _url = [_.trimEnd(_urls, '/'), action].join('/');

    if (_options) {
        if (typeof _options === 'string') {
            _.set(API, 'method', _options)
        } else if (Array.isArray(_options)) {
            let [_method, _type, _headers, _body, _query] = _options
            Object.assign(API, {
                method: _method || API.method || 'GET',
                type: _type || API.type || 'JSON',
                headers: _headers || API.headers || {},
                body: _body || API.body || "",
                query: _query || API.query || ""
            })
        }
    }

    Object.assign(API, defaults)

    _.each(API, (val,key) => {
        if (typeof val === 'string') API[key] = API[key].toLocaleLowerCase()
    })

    if (!types.includes(API.type)) return __streamAlertError('stream 支持数据格式 JSON & JSONP & TEXT');
    if (!methods.includes(API.method)) return __streamAlertError('stream 支持请求类型 GET & POST');
    if (isFunction(API.callback)) {
        return streamRun(API, _url)   
    }
    return new Promise((resolve, reject) => {
        streamRun(API, _url, true, resolve)
    })
}


export const isIpx  = () => {
    return weex && (weex.config.env.deviceModel === 'iPhone10,3' || weex.config.env.deviceModel === 'iPhone10,6');
}


// 获取图片在三端上不同的路径
// e.g. 图片文件名是 test.jpg, 转换得到的图片地址为
// - H5      : /src/images/test.jpg OR http: //localhost:[port]/src/images/test.jpg
// - Android : local:///test
// - iOS     : ../images/test.jpg
export const imgPath = (name, isRange = false) => {
    let platform = weex.config.env.platform
    if (/^[http://|https://|//]{2}.*?/.test(name)) return name
    let path = ''
    if (Array.isArray(__rangeNumber) && !__rangeNumber.length && isRange) {
        __rangeNumber = ['?', `a=${parseInt((Math.random() + Math.random()) * 1000000).toString()}`]
    }
    switch(platform) {
        case 'Web':
            path = `/src/static/images/${name}`
            break;
        case 'android':
            // android 不需要后缀
            //return `local:///${name.substr(0, name.lastIndexOf('.'))}`
            path = getUrl(name);
            break;
        default:
            path = `../static/${name}`
    }

    return [path].concat(__rangeNumber).join('')
}

export const isAndroid = () => {
    return weex.config.env.platform === 'android'
}

export const isWeb = () => {
    return weex.config.env.platform === 'Web'
}

export const isIos = () => {
    return !['android', 'Web'].includes(weex.config.env.platform)
}

export const isWeiXin = () => {
    let ua = window.navigator.userAgent.toLowerCase();
    // console.log(ua);
    // mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
    return ua.match(/MicroMessenger/i) == 'micromessenger'
}

export const jump = (filename = '', event, callback = () => {}) => {
    let animated = true
    if (Array.isArray(filename)) {
        let [filename, animated = animated] = filename
    } else if (typeof filename === 'object') {
        let {filename, animated = animated} = filename
    }
    if (typeof event === 'function') {
        callback = event
    }
    if (/^(http:\/\/|https:\/\/|\/\/).*?/.test(filename)) {
        let pattern = /^(http:\/\/|https:\/\/|\/\/)?([a-zA-Z0-9\\-\\.]{0,61})(\/)?.*?/;
        if (pattern.exec(weex.config.bundleUrl)[2] !== pattern.exec(filename)[2]) return jumpWeb(filename, event, callback)
    }
    if (filename.indexOf('?') > -1) {
        let querys = queryParames(filename, true)
        filename = querys.url
        _.isObject(event) 
            ? Object.assign(event, querys.query || {}) 
            : event = querys.query || {}
    }
    filename = _.trimEnd(filename, '/').split('/')
    if (!filename.length) {
        filename.push('index')
    } else if (filename.length === 1) {
        filename[0] === '' && (filename[0] = '/index')
    } if (filename.length >= 2) {
        switch (filename[0]) {
            case './':
                break;
            case '':
                //filename.length > 2 && (filename[0] = '/pages')
        };
    }
    if (event === false) {
        return getUrl(filename.join('/'))
    }
    navigator2.push({
        url: getUrl(filename.join('/')) + __setParames(event, ''),
        animated: animated
    }, callback)
}

export const jumpWeb = (url = '/', animated = true, callback = () => {}) => {
    navigator2.push({
        url: getUrl('/webview') + __setParames({weburl: url}),
        animated: animated
    }, callback);
}

export const jumpHttp = (url = '/', animated = true, callback) => {
    if (isFunction(callback)) {
        return jumpHttpRun(url, animated, false, false, callback)
    }
    return new Promise((resolve, reject) => {
        jumpHttpRun(url, animated, true, resolve)
    })
}

export const jumpHttpRun = (url = '/', animated = true, isAsync = false, resolve, callback = () => {}) => {
    navigator2.push({
        url: url,
        animated: animated
    }, isAsync ? (...args) => {resolve(...args)} : callback);
}

export default {
    computed: {
        isAndroid,
        isWeb,
        isIos,
        isWeiXin
    },
    data: () => ({
        options: {
            
        },
        weexAndroidHeightDiff: 33
    }),
    methods: {
        getUrl,
        alert,
        confirm,
        confirmAsync,
        queryParames,
        queryParame,
        setParames: __setParames,
        stream,
        streamHttp,
        isIpx,
        imgPath,
        jump,
        jumpWeb,
        jumpHttp
    }
}