import request from '@/utils/request'

export function list(params) {
    return request({
        url: '/admin/venues/list',
        method: 'get',
        params
    });
}

export function add(data) {
	return request({
		url: '/admin/venues/add',
		method: 'post',
		data
	})
}
