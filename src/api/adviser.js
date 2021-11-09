import request from '@/utils/request'
import axios from 'axios';
import { UPLOADBASEURL } from "@/config";


export function list(data) {
    return request({
        url: '/admin/adviser/list',
        method: 'post',
        data
    });
}


export function allList(data) {
    return request({
        url: '/admin/adviser/alllist',
        method: 'post',
        data
    });
}

export function query(data) {
    return request({
        url: '/admin/adviser/query',
        method: 'post',
        data
    })
}


export function add(data) {
	return request({
		url: '/admin/adviser/add',
		method: 'post',
		data
	})
}

export function update(data) {
	return request({
		url: '/admin/adviser/update',
		method: 'put',
		data
	})
}

export function deleteItem(params) {
    return request({
        url: '/admin/adviser/delete',
        method: 'delete',
        params
    })
}

export function updateStatus(data) {
	return request({
		url: '/admin/adviser/status',
		method: 'put',
		data
	})
}

export function uploadHead(formData) {
    return axios.post(`${UPLOADBASEURL}/upload/teacher_head`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

