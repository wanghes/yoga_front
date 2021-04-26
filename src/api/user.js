import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/admin/manager/login',
        method: 'post',
        data
    })
}

export function getInfo(data) {
    return request({
        url: '/admin/manager/info',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: '/admin/manager/logout',
        method: 'post'
    });
}


