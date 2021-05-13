import request from '@/utils/request'
import axios from 'axios';
import { UPLOADBASEURL } from "@/config";


export function list(params) {
    return request({
        url: '/admin/focus/alllist',
        method: 'get',
        params
    });
}


export function query(params) {
    return request({
        url: '/admin/focus/query',
        method: 'get',
        params
    })
}


export function add(data) {
	return request({
		url: '/admin/focus/add',
		method: 'post',
		data
	})
}

export function update(data) {
	return request({
		url: '/admin/focus/update',
		method: 'put',
		data
	})
}

export function deleteItem(params) {
    return request({
        url: '/admin/focus/delete',
        method: 'delete',
        params
    })
}

export function updateStatus(data) {
	return request({
		url: '/admin/focus/status',
		method: 'put',
		data
	})
}

export function uploadCover(formData) {
    return axios.post(`${UPLOADBASEURL}/upload/focus`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

