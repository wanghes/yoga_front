import request from '@/utils/request'
import axios from 'axios';
import { UPLOADBASEURL } from "@/config";

export function list(params) {
    return request({
        url: '/admin/agreecourse/list',
        method: 'get',
        params
    });
}

export function allList(params) {
    return request({
        url: '/admin/agreecourse/alllist',
        method: 'get',
        params
    });
}


export function add(data) {
	return request({
		url: '/admin/agreecourse/add',
		method: 'post',
		data
	})
}



export function update(data) {
	return request({
		url: '/admin/agreecourse/update',
		method: 'put',
		data
	})
}

export function updateStatus(data) {
	return request({
		url: '/admin/agreecourse/status',
		method: 'put',
		data
	})
}


export function query(params) {
    return request({
        url: '/admin/agreecourse/query',
        method: 'get',
        params
    })
}

export function uploadTuankeCover(formData) {
    return axios.post(`${UPLOADBASEURL}/upload/upload_tuanke_cover`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}



