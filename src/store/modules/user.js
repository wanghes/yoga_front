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
    getIsAdmin,
    setRole,
    getRole,
    removeRole
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
    role: ''
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
    SET_ROLE: (state, role) => {
        state.role = role
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
            password,
            login_type,
            venues
        } = userInfo

        return new Promise((resolve, reject) => {
            login({
                login_type,
                venues,
                username: username.trim(),
                password: password
            }).then(response => {
                const { data } = response;
                let isAdmin = false;
                // 如果是场馆主则就是管理员
                if (data.role == "venues") {
                    isAdmin = true;
                }
                commit('SET_TOKEN', data.admin_token);
                commit('SET_IS_ADMIN', isAdmin);
                commit('SET_ADMIN_USER_ID', data.admin_user_id);
                
                setIsAdmin(isAdmin);
                setAdminUserId(data.admin_user_id);
                setToken(data.admin_token);
                setRole(data.role);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 获取用户信息
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            let admin_user_id = getAdminUserId();
            let role = getRole();
            getInfo({
                role,
                venues_id: window.venues,
                admin_user_id
            }).then(response => {
                const { data } = response

                if (!data) {
                    reject('Verification failed, please Login again.')
                }

                const {
                    nickname,
                    avatar,
                    introduction
                } = data
                commit('SET_ROLE', role);
                commit('SET_NAME', nickname)
                commit('SET_AVATAR', avatar)
                commit('SET_INTRODUCTION', introduction)
                data.role = role;
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout().then((data) => {
                commit('SET_TOKEN', '')
                commit('SET_ROLE', '')
                removeToken();
                removeRole();
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
            commit('SET_ROLE', '')
            removeToken()
            removeRole()
            removeAdminUserId()
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
