//得到字符总数  
const getChars = function (str) {  
    var i = 0;  
    var c = 0.0;  
    var unicode = 0;  
    var len = 0;  
    if (str == null || str == "") {  
        return 0;  
    }  
    len = str.length;  
    for(i = 0; i < len; i++) {  
            unicode = str.charCodeAt(i);  
        if (unicode < 127) { //判断是单字符还是双字符  
            c += 1;  
        } else {  //chinese  
            c += 2;  
        }  
    }  
    return c;  
}  
  
export const strlen = function (str) {  
    return getChars(str);  
}  

//截取字符  
export const substring = function (str, startp, endp = -1) {  
    let i = 0,
        c = 0,
        unicode=0,
        rstr = '';  
    let len = str.length;  
    let sblen = strlen(str);  
    
    if (startp < 0) {  
        startp = sblen + startp;  
    }  
  
    if (endp < 1) {  
        endp = sblen + endp;// - ((str.charCodeAt(len-1) < 127) ? 1 : 2);  
    }  
    // 寻找起点  
    for(i = 0; i < len; i++) {  
        if (c >= startp) {  
            break;  
        }  
        let unicode = str.charCodeAt(i);  
        if (unicode < 127) {  
            c += 1;  
        } else {  
            c += 2;  
        }  
    }  
  
    // 开始取  
    for(i = i; i < len; i++) {  
        let unicode = str.charCodeAt(i);  
        if (unicode < 127) {  
            c += 1;  
        } else {  
            c += 2;  
        }  
        rstr += str.charAt(i);  
  
        if (c >= endp) {  
            break;  
        }  
    }  
  
    return rstr;  
}  

// var chara = 'ni你2好1啊！'  
// js_self = chara.substr(4);  
// test = sb_substr(chara,4);  
// alert("js_self:"+js_self+"ext:"+test);  
  
export const mbstrlen = function (str) {  
    var len = 0;  
    for(var i = 0; i < str.length; i++) {  
        len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;  
    }  
    return len;  
}

export default {
    strlen,
    substring,
    mbstrlen
}