import request from '@/utils/request'
import axios from 'axios';
import { UPLOADBASEURL } from "@/config";


export function many_list(params) {
    return request({
        url: '/admin/manycourse/list',
        method: 'get',
        params
    })
}

export function many_add(data) {
    return request({
        url: '/admin/manycourse/add',
        method: 'post',
        data
    })
}

export function many_done(data) {
    return request({
        url: '/admin/manycourse/done',
        method: 'post',
        data
    })
}

export function get_manycourse(params) {
    return request({
        url: '/admin/manycourse/get_course',
        method: 'get',
        params
    })
    
}

export function getSeriesCourses(params) {
    return request({
        url: '/admin/manycourse/get_series_courses_easy',
        method: 'get',
        params
    })
}

export function removeCourseFromSeries(data) {
    return request({
        url: '/admin/manycourse/remove_course_from_series',
        method: 'put',
        data
    })
}

export function openListen(data) {
    return request({
        url: '/admin/manycourse/open_listen',
        method: 'put',
        data
    })
}

export function updateCu(data) {
    return request({
        url: '/admin/manycourse/cu',
        method: 'put',
        data
    });
}


export function updateOnline(data) {
    return request({
        url: '/admin/manycourse/update_online',
        method: 'put',
        data
    })
}


export function closeListen(data) {
    return request({
        url: '/admin/manycourse/close_listen',
        method: 'put',
        data
    })
}


export function updateOrder(data) {
    return request({
        url: '/admin/manycourse/update_order',
        method: 'put',
        data
    })
}

export function updateManyJingpin(data) {
    return request({
        url: '/admin/manycourse/jingpin',
        method: 'put',
        data
    })
}



export function list(params) {
    return request({
        url: '/admin/course/list',
        method: 'get',
        params
    })
}

export function listByPid(params={}) {
    return request({
        url: '/admin/course/list_by_pid',
        method: 'get',
        params
    })
}


export function add(data) {
    return request({
        url: '/admin/course/add',
        method: 'post',
        data
    })
}

export function updateJingpin(data) {
    return request({
        url: '/admin/course/jingpin',
        method: 'put',
        data
    })
}

export function get_course(params) {
    return request({
        url: '/admin/course/get_course',
        method: 'get',
        params
    })
}


export function uploadAloneCover(formData) {
    return axios.post(`${UPLOADBASEURL}/course/upload_cover`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

export function done(data) {
    return request({
        url: '/admin/course/done',
        method: 'post',
        data
    })
}


export function updateStatus(data) {
	return request({
		url: '/admin/course/status',
		method: 'put',
		data
	})
}

export function deleteCourse(data) {
	return request({
		url: '/admin/course/delete',
		method: 'put',
		data
	})
}

export function getCates(params={}) {
    return request({
        url: '/admin/cate/list',
        method: 'get',
        params
    })
}

export function getCate(params={}) {
    return request({
        url: '/admin/cate/query',
        method: 'get',
        params
    })
}

export function addCate(data) {
    return request({
        url: '/admin/cate/add',
        method: 'post',
        data
    })
}

export function deleteCate(data) {
    return request({
        url: '/admin/cate/delete',
        method: 'delete',
        data
    })
}

export function renameCate(data) {
    return request({
        url: '/admin/cate/rename',
        method: 'put',
        data
    })
}

export function batchPids(data) {
    return request({
        url: '/admin/course/batch_pids',
        method: 'put',
        data
    })
}

// export function uploadVideo(formData) {
//     return request.post('/admin/course/upload_video', formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//     })
// }