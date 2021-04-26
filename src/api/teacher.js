import request from '@/utils/request'
import axios from 'axios';
import { UPLOADBASEURL } from "@/config";


export function list(params) {
    return request({
        url: '/admin/teacher/list',
        method: 'get',
        params
    });
}

export function add(data) {
	return request({
		url: '/admin/teacher/add',
		method: 'post',
		data
	})
}

export function teacher_courses_price(data) {
	return request({
		url: '/admin/teacher/teacher_courses_price',
		method: 'post',
		data
	})
}


export function set_alone_price(data) {
	return request({
		url: '/admin/teacher/set_alone_price',
		method: 'put',
		data
	})
}

export function update(data) {
	return request({
		url: '/admin/teacher/update',
		method: 'put',
		data
	})
}

export function updateStatus(data) {
	return request({
		url: '/admin/teacher/status',
		method: 'put',
		data
	})
}

export function deleteTeacher(params) {
    return request({
        url: '/admin/teacher/delete',
        method: 'delete',
        params
    })
}

export function query(params) {
    return request({
        url: '/admin/teacher/query',
        method: 'get',
        params
    })
}

export function sijiao_cardinfo(params) {
    return request({
        url: '/admin/teacher/sijiao_cardinfo',
        method: 'get',
        params
    })
}

export function set_sijiao_cardinfo(data) {
	return request({
		url: '/admin/teacher/set_sijiao_cardinfo',
		method: 'put',
		data
	})
}






export function uploadHead(formData) {
    return axios.post(`${UPLOADBASEURL}/upload/teacher_head`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}



export function uploadIdCard(formData) {
    return axios.post(`${UPLOADBASEURL}/upload/teacher_id_card`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}



