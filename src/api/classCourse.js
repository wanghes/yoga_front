import request from '@/utils/request'
import axios from 'axios';
import { UPLOADBASEURL } from "@/utils/config";

export function list(params) {
    return request({
        url: '/admin/classcourse/list',
        method: 'get',
        params
    });
}

export function add(data) {
	return request({
		url: '/admin/classcourse/add',
		method: 'post',
		data
	})
}

export function update(data) {
	return request({
		url: '/admin/classcourse/update',
		method: 'put',
		data
	})
}

export function updateStatus(data) {
	return request({
		url: '/admin/classcourse/status',
		method: 'put',
		data
	})
}


export function query(params) {
    return request({
        url: '/admin/classcourse/query',
        method: 'get',
        params
    })
}


export function queryPrice(params) {
    return request({
        url: '/admin/classcourse/price',
        method: 'get',
        params
    })
}

export function uploadBankeCover(formData) {
    return axios.post(`${UPLOADBASEURL}/upload/upload_banke_cover`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}



