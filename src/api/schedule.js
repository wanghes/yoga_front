import request from '@/utils/request'

export function list(params) {
    return request({
        url: '/admin/schedule/list',
        method: 'get',
        params
    });
}
export function add(data) {
	return request({
		url: '/admin/schedule/add',
		method: 'post',
		data
	})
}

export function update(data) {
	return request({
		url: '/admin/schedule/update',
		method: 'put',
		data
	})
}

export function query(params) {
    return request({
        url: '/admin/schedule/query',
        method: 'get',
        params
    })
}



