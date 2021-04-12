import request from '@/utils/request'


export function list(params) {
    return request({
        url: '/admin/order/list',
        method: 'get',
        params
    });
}

export function add(data) {
    return request({
        url: '/admin/order/add',
        method: 'post',
        data
    });
}
export function cancel(data) {
	return request({
		url: '/admin/order/cancel',
		method: 'put',
		data
	})
}