import request from '@/utils/request'

export function getRooms(params={}) {
    return request({
        url: '/admin/room/list',
        method: 'get',
        params
    })
}

export function getRoom(params={}) {
    return request({
        url: '/admin/room/query',
        method: 'get',
        params
    })
}

export function addRoom(data) {
    return request({
        url: '/admin/room/add',
        method: 'post',
        data
    })
}

export function deleteRoom(data) {
    return request({
        url: '/admin/room/delete',
        method: 'delete',
        data
    })
}

export function renameRoom(data) {
    return request({
        url: '/admin/room/rename',
        method: 'put',
        data
    })
}