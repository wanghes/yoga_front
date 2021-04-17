import request from '@/utils/request'

export function list(params) {
    return request({
        url: '/admin/trainerschedule/list',
        method: 'get',
        params
    });
}
export function add(data) {
	return request({
		url: '/admin/trainerschedule/add',
		method: 'post',
		data
	})
}

export function update(data) {
	return request({
		url: '/admin/trainerschedule/update',
		method: 'put',
		data
	})
}

export function query(params) {
    return request({
        url: '/admin/trainerschedule/query',
        method: 'get',
        params
    })
}

export function updateStatus(data) {
	return request({
		url: '/admin/trainerschedule/status',
		method: 'put',
		data
	})
}

export function deleteClass(params) {
    return request({
        url: '/admin/trainerschedule/delete',
        method: 'delete',
        params
    })
}