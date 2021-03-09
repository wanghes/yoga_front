import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/admin/AdminLogin/login',
        method: 'post',
        data
    })
}

export function getInfo(admin_user_id) {
    return request({
        url: '/admin/manager/info',
        method: 'get',
        params: {
            admin_user_id
        }
    })
}

export function logout() {
    return request({
        url: '/admin/manager/logout',
        method: 'post'
    });
}


export function getHello(params) {
    return request({
        url: '/admin/hello/' + params.name,
        method: 'get'
    });
}


