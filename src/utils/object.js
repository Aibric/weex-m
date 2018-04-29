export default {
    isEmptyObject(e) {
        for (let t in e) return !1
        return !0
    },
    values (object) {
        let values = []
        for (let key in object) values.push(object[key])
        return values
    },
    value (object, key, defaults = undefined) {
        if (object[key]) return object[key]
        return defaults
    },
    key (object, val, defaults = undefined) {
        for (var key in object) if (object[key] === val) return key
        return defaults
    },
    hasValue (object, val, is = false) {
        for (let v of object) {
            if (is) {
                if (val === v) return true
            } else {
                if (val == v) return true
            }
            return false
        }
    },
    findValNoEmpty (object, filed) {
        for (let key in object) {
            if (['', undefined, NaN, false].indexOf(object[key][filed]) === -1) return true
        }
        return false
    },
    firstKey (object) {
        return Object.keys(object).shift()
    },
    first (object) {
        let key = this.firstKey(object)
        return {key: object[key]}
    },
    lastKey (object) {
        return Object.keys(object).pop()
    },
    last (object) {
        let key = this.lastKey(object)
        return {key: object[key]}
    },
    index (object, key) {
        if (typeof key === undefined) return Object.keys(object).length
        let index = 0;
        for (let keys in object) {
            if (keys === key) {
                return index
            } else {
                ++ index 
            }
        }
        return 0
    },
    /**
     * Deep copy the given object considering circular structure.
     * This function caches all nested objects and its copies.
     * If it detects circular structure, use cached copy to avoid infinite loop.
     *
     * @param {*} obj
     * @param {Array<Object>} cache
     * @return {*}
     */
    deepCopy (obj, cache = []) {
        // just return if obj is immutable value
        if (obj === null || typeof obj !== 'object') {
            return obj
        }
     
        // if obj is hit, it is in circular structure
        const hit = find(cache, c => c.original === obj)
        if (hit) {
            return hit.copy
        }
     
        const copy = Array.isArray(obj) ? [] : {}
        // put the copy into cache at first
        // because we want to refer it in recursive deepCopy
        cache.push({
            original: obj,
            copy
        })
     
        Object.keys(obj).forEach(key => {
            copy[key] = deepCopy(obj[key], cache)
        })
     
        return copy
     },
    /**
     * forEach for object
     */
    forEachValue (obj, fn) {
        Object.keys(obj).forEach(key => fn(obj[key], key))
    },
    isObject (obj) {
        return obj !== null && typeof obj === 'object'
    }
}