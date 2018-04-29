import _ from 'lodash'
import Store from 'weex-store'
import { stream, alert } from '~/mixins'

export default new Store({
    name: 'index',
    state () {
        return {
            user: null,
            info : {
                a: 'b'
            },
        }
    },
    getters: {
        user (state) {
            return state.user
        }
    },
    actions: {
        async login ({commit, dispatch}, args) {
            let { status, ok, statusText, data, headers } = await stream('app.!login.login', {
                body: args
            })
            if (_.get(data, 'payload.code') == 200) {
                commit('SET_USER', _.get(data, 'payload.info'))
                return data
            }
            alert(_.get(data, 'payload.info.password', '登陆失败！'))
            return data
        },
        logout ({ commit }) {
            commit("SET_USER", null)
        }
    },
    mutations: {
        SET_USER (state, data) {
            state.user = data
        },
        SET_USER_SEX (state,data) {
            state.user.user_info.sex = data
        },
        SET_USER_NAME (state,data) {
            state.user.user_info.name = data
        },
        SET_USER_BIRTHDAY (state,data) {
            state.user.user_info.birthday = data
        },
        SET_INFO (state, data) {
            state.info.a = data
        }
    }
})