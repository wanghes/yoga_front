import venuesRoutes from '@/router/venues';
import teacherRoutes from '@/router/teacher';
import { constantRoutes } from '@/router';
import classLeaderRoutes from '@/router/classLeader';

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []
    routes.forEach(route => {
        const tmp = {
            ...route
        };
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp);
        }
    })
    return res
}

const state = {
    routes: [],
    addRoutes: []
}


const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    generateRoutes({
        commit
    }, role) {
        return new Promise(resolve => {
            let accessedRoutes
            if (role == 'venues') {
                // accessedRoutes = onlineClass.concat(offlineClass);
                accessedRoutes = venuesRoutes;
            } else if (role == 'teacher') {
                accessedRoutes = teacherRoutes;
            } else {
                accessedRoutes = classLeaderRoutes;
            }
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        });
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
