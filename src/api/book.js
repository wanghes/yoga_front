import request from '@/utils/request'


export function list(params) {
    return request({
        url: '/admin/book/list',
        method: 'get',
        params
    });
}

export function add(data) {
    return request({
        url: '/admin/book/add',
        method: 'post',
        data
    });
}
export function cancel(data) {
	return request({
		url: '/admin/book/cancel',
		method: 'put',
		data
	})
}