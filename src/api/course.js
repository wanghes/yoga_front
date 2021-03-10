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