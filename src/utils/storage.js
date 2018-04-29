const storage = weex.requireModule('storage')
const getAllKeys = () => {
	console.time('* keys')
	return new Promise((resolve, reject) => {
		storage.getAllKeys((ret) => {
			const keys = ret.data

			if (keys instanceof Object) {
				resolve(keys)
				console.timeEnd('* keys')
			} else {
				reject(ret.result)
			}
		})
	})
}

const setItem = (key, value) => {
	console.time('* setItem')
	return new Promise((resolve, reject) => {
		storage.setItem(key, value, (ret) => {
			if (ret.result === 'success') {
				resolve()
				console.timeEnd('* setItem')
			} else {
				reject(ret.result)
			}
		})
	})
}

const getItem = (key) => {
	console.time('* getItem')
	return new Promise((resolve, reject) => {
		storage.getItem(key, (ret) => {
			if (ret.result === 'success') {
				resolve(ret.data)
				console.timeEnd('* getItem')
			} else {
				reject(ret.result)
			}
		})
	})
}

const removeItem = (key) => {
	console.time('* removeItem')
	return new Promise((resolve, reject) => {
		storage.removeItem(key, (ret) => {
			if (ret.result === 'success') {
				resolve()
				console.timeEnd('* removeItem')
			} else {
				reject(ret.result)
			}
		})
	})
}

export default {
    storage,
    getAllKeys,
    setItem,
    getItem,
    removeItem
}

// let _keys = []
// let len = 10

// getAllKeys()
//     .then(async (keys) => {
//         console.log('sync * getAllKeys', keys)
//         _keys = keys
//         // insert
//         if (keys && !keys.length) {
//             for (let i = 0; i < len; i++) {
//                 await setItem('k' + i, 'v-' + i)
//                 _keys.push('k' + i)
//             }
//         }
//     })
//     .then(async () => {
//         console.log('set done')

//         // get
//         if (_keys && _keys.length) {
//             for (let key of _keys) {
//                 await getItem(key)
//             }
//         }
//     })
//     .then(async () => {
//         console.log('get done')

//         // remove
//         if (_keys && _keys.length) {
//             for (let key of _keys) {
//                 await removeItem(key)
//             }
//         }

//         return getAllKeys()
//     })
//     .then((keys) => {
//         console.log('done', keys)
//     })
//     .catch((e) => {
//         console.error(e)
//     })