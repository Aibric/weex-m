import _ from 'lodash'
import Store from 'weex-store'
import StoreIndex from '~/store/index'
import { stream, alert } from '~/mixins' 

export default new Store({
    name: 'module/cart',
    state () {
        return {
            goods: [],
            total: {
                count: 0,
                price: '0.00',
                weight: '0.0000'
            },
            carts: [],
            address: null
        }
    },
    getters: {
        goods (state) {
            return state.goods
        },
        total (state) {
            return state.total
        },
        carts (state) {
            if (_.isEmpty(state.carts)) {
                let carts = []
                _.forEach(state.goods, ({cart_id}) => {
                    carts.push(cart_id)
                })
                return carts
            }
            return _.values(state.carts)
        },
        address (state) {
            return state.address
        }
    },
    actions: {
        /**
         * 获取用户购物车列表
         * @param {*} param0 
         * @param {*} resize 
         */
        async getLists ({ commit, dispatch, mapGetters, state }, resize = false) {
            let rootUser = await StoreIndex.states('user')
            if ((resize || _.isEmpty(state.lists)) && rootUser) {
                try {
                    let lists = {}
                    let { status
                        , ok
                        , statusText
                        , data: { payload: { list
                                            , code } } } = await stream('app.!common.!cart.list')
                    if (code == 200) {
                        commit('SET_LIST_GOODS', list.goods)
                        commit('SET_LIST_TOTAL', list.total)
                        let { carts } = await mapGetters(['carts'])
                        if (!carts.length) {
                            if (!_.isArray(carts)) carts = []
                            _.forEach(list.goods, ({ cart_id }) => {carts.push(cart_id)})
                            ommit('SET_LIST_CARTS', carts)
                        }
                        await dispatch('total', carts)
                    }
                } catch (e) {
                    if (e.response && e.response.status === 401) {
                        throw new Error(e.response.messge || '获取购物车列表失败')
                    }
                }
            }
        },
        /**
         * 购物车商品添加 - 存在购物车中数量累加
         * @param {*} param0 
         * @param {*} args[] 要添加的商品
         * @param {*} status 是否自动选择最新加入的商品并计算价格 
         */
        async create ({ commit, dispatch, mapGetters, state }, args, status = false) {
            let rootUser = await StoreIndex.states('user')
            if (!rootUser || !Array.isArray(args)) return {}
            try {
                let { status, ok, statusText, data } = await stream('app.!common.!cart.create', {
                    body: {
                        items: args
                    }
                })
                if (_.get(data, 'payload.code') == 200) {
                    let carts = []
                    // 是否刷新列表
                    status && await dispatch('getLists')
                    // 商品数量更新
                    args.forEach(({gid, num, isSum = true}) => {
                        _.forEach(state.goods, ({cart_id, goods_id}, key) => {
                            if (goods_id == gid) {
                                if (isSum) {
                                    state.goods[key].number += num
                                } else {
                                    state.goods[key].number = num
                                }   
                            }
                            // 是否写入新添加的商品自动选择并计算价格
                            status && carts.push(cart_id)
                        })
                    })
                    if (!status) {
                        carts = (await mapGetters(['carts'])).carts
                    }
                    // 商品自动选择并计算价格
                    await dispatch('carts', carts)
                }
                return data
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    throw new Error(e.response.messge || '添加购物车商品失败')
                }
            }
        },
        /**
         * 购物车商品删除
         * @param {*} param0 
         * @param {*} cartId 
         */
        async delete ({ commit, dispatch, mapGetters, state }, ids, call) {
            let rootUser = await StoreIndex.states('user')
            if (!rootUser || !Array.isArray(ids)) return {}
            try {
                let { status, ok, statusText, data } = await stream('app.!common.!cart.delete', {
                    query: {
                        id: ids.join(',')
                    }
                })
                if (_.isFunction(call)) call(data)
                if (_.get(data, 'payload.code') != 200) return
                for (let key in state.goods) {
                    if (ids.includes(state.goods[key].cart_id)) delete state.goods[key]
                }
                let { carts } = await mapGetters(['carts'])
                _.forEach(carts, (cid, key) => {
                    if (ids.includes(cid)) _.remove(carts, (val) => val == cid)
                })
                commit('SET_LIST_GOODS', state.goods)
                dispatch('carts', carts)
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    throw new Error(e.response.messge ? e.response.messge : '删除购物车商品失败')
                }
            }
        },
        async carts ({ commit, dispatch, mapGetters, state }, carts) {
            // 选择商品计算商品价格
            commit('SET_LIST_CARTS', carts)
            await dispatch('total', carts)
        },
        async total ({ commit, dispatch, mapGetters, state }, carts) {
            let {data: { payload: { list, code } }, status, ok} = await stream("app.!common.!cart.total", {
                body: {
                    ids: carts.join(',')
                }
            })
            if (code == 200) {
                commit('SET_LIST_TOTAL', list.total)
            }
        },
        async emptyCart ({ commit }) {
            await commit('SET_LIST_GOODS', [])
            await commit('SET_LIST_CARTS', [])
            await commit('SET_LIST_TOTAL', {})
        }
    },
    mutations: {
        SET_LIST_GOODS (state, goods) {
            state.goods = goods
        },
        SET_LIST_TOTAL (state, total) {
            state.total = total
        },
        SET_LIST_CARTS (state, carts) {
            state.carts = carts
        },
        SET_ADDRESS (state, address) {
            state.address = address
        }
    }
})