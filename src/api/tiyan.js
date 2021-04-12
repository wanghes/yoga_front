import request from '@/utils/request'

export function list(params) {
    return request({
        url: '/admin/tiyan/list',
        method: 'get',
        params
    });
}
export function add(data) {
	return request({
		url: '/admin/tiyan/add',
		method: 'post',
		data
	})
}

export function updateStatus(data) {
	return request({
		url: '/admin/tiyan/status',
		method: 'put',
		data
	})
}

export function deleteItem(params) {
    return request({
        url: '/admin/tiyan/delete',
        method: 'delete',
        params
    })
}