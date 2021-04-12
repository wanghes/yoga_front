import request from '@/utils/request'


export function all(params) {
    return request({
        url: '/admin/card/all',
        method: 'get',
        params
    });
}


export function list(params) {
    return request({
        url: '/admin/card/list',
        method: 'get',
        params
    });
}

export function add(data) {
    return request({
        url: '/admin/card/add',
        method: 'post',
        data
    });
}

export function query(params) {
    return request({
        url: '/admin/card/query',
        method: 'get',
        params
    })
}




export function update(data) {
	return request({
		url: '/admin/card/update',
		method: 'put',
		data
	})
}

export function updateStatus(data) {
	return request({
		url: '/admin/card/status',
		method: 'put',
		data
	})
}

export function deleteItem(params) {
    return request({
        url: '/admin/card/delete',
        method: 'delete',
        params
    })
}



export function list_by_card_id(params) {
    return request({
        url: '/admin/cardbind/list_by_card_id',
        method: 'get',
        params
    });
}


export function cardBindAdd(data) {
    return request({
        url: '/admin/cardbind/add',
        method: 'post',
        data
    });
}


