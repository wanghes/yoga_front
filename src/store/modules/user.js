import {
    login,
    logout,
    getInfo
} from '@/api/user'
import {
    getToken,
    setToken,
    removeToken,
    removeAdminUserId,
    getAdminUserId,
    setAdminUserId,
    setIsAdmin,
    getIsAdmin
} from '@/utils/auth'
import router, {
    resetRouter
} from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    admin_user_id: getAdminUserId(),
    isAdmin: getIsAdmin(),
    roles: []
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_ADMIN_USER_ID: (state, admin_user_id) => {
        state.admin_user_id = admin_user_id
    },
    SET_IS_ADMIN: (state, isAdmin) => {
        state.isAdmin = isAdmin
    }
}

const actions = {
    // user login
    login({ commit, state }, userInfo) {
        const {
            username,
            password
        } = userInfo

        return new Promise((resolve, reject) => {
            login({
                username: username.trim(),
                password: password
            }).then(response => {
                const { data } = response
                commit('SET_TOKEN', data.admin_token);
                commit('SET_IS_ADMIN', data.is_admin);
                commit('SET_ADMIN_USER_ID', data.admin_user_id);
                setIsAdmin(data.is_admin);
                setAdminUserId(data.admin_user_id);
                setToken(data.admin_token);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 获取用户信息
    getInfo({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            let admin_user_id = getAdminUserId();
            console.log(state);
            getInfo(admin_user_id).then(response => {
                const {
                    data
                } = response
                
                if (!data) {
                    reject('Verification failed, please Login again.')
                }

                const roles = state.isAdmin ? ["admin"]: ["thirdUser"];
                const {
                    nickname,
                    avatar,
                    introduction
                } = data

                if (!roles || roles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }
                commit('SET_ROLES', roles)
                commit('SET_NAME', nickname)
                commit('SET_AVATAR', avatar)
                commit('SET_INTRODUCTION', introduction)
                data.roles = roles;
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            logout().then((data) => {
                commit('SET_TOKEN', '')
                //  commit('SET_ROLES', [])
                removeToken();
                removeAdminUserId();
                resetRouter();
                resolve();
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({
        commit
    }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },

    // dynamically modify permissions
    changeRoles({
        commit,
        dispatch
    }, role) {
        return new Promise(async resolve => {
            const token = role + '-token'

            commit('SET_TOKEN', token)
            setToken(token)

            const {
                roles
            } = await dispatch('getInfo')

            resetRouter()

            // generate accessible routes map based on roles
            const accessRoutes = await dispatch('permission/generateRoutes', roles, {
                root: true
            })

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            // reset visited views and cached views
            dispatch('tagsView/delAllViews', null, {
                root: true
            })

            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
