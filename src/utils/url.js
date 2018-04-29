import _ from 'lodash'

const __getFileRootPath = (ext) => {
    let images = ['png', 'jpg', 'gif'];
    let fonts = ['ttf'];
    let script = ['vue', 'js', 'html']
    if (!ext) {
        return images.concat(fonts, script)
    } else if (images.includes(ext)) {
        return 'images'
    } else if (fonts.includes(ext)) {
        return 'fonts'
    } else if (script.includes(ext)) {
        return 'pages'
    }
    return ''
}

const __inImgExt = (ext, exts = []) => {
    if (!Array.isArray(exts)) {
        exts = [exts];
    }
    return exts.concat(__getFileRootPath()).includes(ext)
}

export default {
    getUrlSearch(url,name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = url.slice(url.indexOf('?')+1).match(reg);
        if (r != null) {
            try {
                return decodeURIComponent(r[2]);
            } catch (_e) {
                return null;
            }
        }
        return null;
    },
    getUrl(filename, path = '', host = '') {
        let nativeBase;
        let bundleUrl = weex.config.bundleUrl;
        let isAndroidAssets = bundleUrl.indexOf('file://assets/') >= 0;
        let isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0;
        
        if (Array.isArray(path)) {
            let [path2 = '', host2 = host] = path
            path = path2
            host = host2
        } else if (typeof path == 'object') {
            let {path: path2 = '', host: host2 = host} = path
            path = path2
            host = host2
        }
        
        if (isAndroidAssets) {
            nativeBase = 'file://assets/dist/';
        } else if (isiOSAssets) {
            nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1);
        } else {
            let matches = /\/\/([^\/]+?)\//.exec(bundleUrl);
            let matchFirstPath = /\/\/.+\/([^\/]+?)\//.exec(bundleUrl);
            if (matches && matches.length >= 2) {
                host = matches[1];
            }
            if (matchFirstPath && matchFirstPath.length >= 2) {
                path = matchFirstPath[1]
            }
            nativeBase = 'http://' + host + '/';
        }

        // in Native
        filename = filename.split('.')
        
        let fileext = ''
        if (filename.length >= 2) {
            fileext = filename.pop()
            fileext = fileext.toLocaleLowerCase()
            filename = [filename.join('.')]
        }
    
        let pathLength = _.trimStart(filename[0], '/').split('/').length

        if (typeof navigator !== 'undefined' && (navigator.appCodeName === 'Mozilla' || navigator.product === 'Gecko')) {
            // check if in weexpack project    
            if (path === 'web' || path === 'dist') {
                filename.unshift('/dist/' + filename.shift())
                filename.push(fileext = __inImgExt(fileext) 
                    ? fileext 
                    : 'js')
            } else {
                // webpack web 测试路径
                filename.push(fileext = __inImgExt(fileext) 
                    ? fileext 
                    : 'html')
                if (_.isEmpty(path) && pathLength >= 2 || pathLength >= 2) {
                    filename[0] = ['/' + _.trim(__getFileRootPath(fileext), '/'), _.trimStart(filename[0], '/')].join('/')
                }
            }
            return filename.join('.');
        }

        filename.push(fileext = __inImgExt(fileext) 
            ? fileext 
            : 'js')

        if (path !== 'dist') {
            if (filename[0].substring(0, 1) === '/') {
                path = pathLength >= 2 
                    ? 'dist/' + __getFileRootPath(fileext)
                    : 'dist'
            } else {
                path = ['dist/' + __getFileRootPath(fileext), '/', _.trim(path, '/')].join('')
            }
        } else if (pathLength >= 2) {
            path += '/' + __getFileRootPath(fileext)
        } else {
            //// 特殊路径 - 针对 android
            switch (__getFileRootPath(fileext)) {
                case 'images':
                    path = [path, 'images'].join('/')
                    break;
            }
        }
        
        filename[0] = _.trimStart(filename[0], '/')
        return [_.trimEnd(nativeBase, '/'), path, filename.join('.')].join('/')
    }
}