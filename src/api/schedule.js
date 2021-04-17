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


export function teacher_courses(params) {
    return request({
        url: '/admin/schedule/teacher_courses',
        method: 'get',
        params
    })
}


export function updateStatus(data) {
	return request({
		url: '/admin/schedule/status',
		method: 'put',
		data
	})
}

export function deleteClass(params) {
    return request({
        url: '/admin/schedule/delete',
        method: 'delete',
        params
    })
}