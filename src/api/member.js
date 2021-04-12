import request from '@/utils/request'

export function list(params) {
    return request({
        url: '/admin/member/list',
        method: 'get',
        params
    });
}

export function query(params) {
    return request({
        url: '/admin/member/query',
        method: 'get',
        params
    })
}
export function add(data) {
	return request({
		url: '/admin/member/add',
		method: 'post',
		data
	})
}

export function update(data) {
	return request({
		url: '/admin/member/update',
		method: 'put',
		data
	})
}

export function deleteItem(params) {
    return request({
        url: '/admin/member/delete',
        method: 'delete',
        params
    })
}