import request from '@/utils/request'

export function list(params) {
    return request({
        url: '/admin/membercard/list',
        method: 'get',
        params
    });
}

export function cardno(params) {
    return request({
        url: '/admin/membercard/cardno',
        method: 'get',
        params
    })
}

export function query(params) {
    return request({
        url: '/admin/membercard/query',
        method: 'get',
        params
    })
}

export function queryCard(data) {
    return request({
        url: '/admin/membercard/query_card',
        method: 'post',
        data
    })
}

export function query_by_member(params) {
    return request({
        url: '/admin/membercard/query_by_member',
        method: 'get',
        params
    })
}

export function openCard(data) {
	return request({
		url: '/admin/membercard/open_card',
		method: 'put',
		data
	})
}

export function add(data) {
	return request({
		url: '/admin/membercard/add',
		method: 'post',
		data
	})
}

export function update(data) {
	return request({
		url: '/admin/membercard/update',
		method: 'put',
		data
	})
}
export function setDefaultCard(data) {
	return request({
		url: '/admin/membercard/default',
		method: 'put',
		data
	})
}



export function deleteItem(params) {
    return request({
        url: '/admin/membercard/delete',
        method: 'delete',
        params
    })
}