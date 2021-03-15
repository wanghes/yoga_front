import request from '@/utils/request'

export function list(params) {
    return request({
        url: '/admin/course/list',
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

export function get_config(params) {
    return request({
        url: '/admin/upload/ue_config',
        method: 'get',
        params
    })
}


export function get_course(params) {
    return request({
        url: '/admin/course/get_course',
        method: 'get',
        params
    })
}

export function uploadVideo(formData) {
    return request.post('/admin/course/upload_video', formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

export function uploadAloneCover(formData) {
    return request.post('/admin/course/upload', formData, {
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

export function getMainCourseStyle(params={}) {
    return request({
        url: '/admin/course/main_course_style',
        method: 'get',
        params
    })
}

export function getSubCourseStyle(params={}) {
    return request({
        url: '/admin/course/sub_course_style',
        method: 'get',
        params
    })
}

export function getAllCourseStyle(params={}) {
    return request({
        url: '/admin/course/course_styles',
        method: 'get',
        params
    })
}