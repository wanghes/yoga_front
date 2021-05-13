import request from '@/utils/request'
import axios from 'axios';
import { UPLOADBASEURL } from "@/config";

export function list(params) {
    return request({
        url: '/admin/flash_sale/list',
        method: 'get',
        params
    });
}

export function add(data) {
	return request({
		url: '/admin/flash_sale/add',
		method: 'post',
		data
	})
}


export function edit(data) {
	return request({
		url: '/admin/flash_sale/edit',
		method: 'put',
		data
	})
}



export function query(params) {
    return request({
        url: '/admin/flash_sale/query',
        method: 'get',
        params
    })
}

export function deleteItem(params) {
    return request({
        url: '/admin/flash_sale/delete',
        method: 'delete',
        params
    })
}

export function updateStatus(data) {
	return request({
		url: '/admin/flash_sale/status',
		method: 'put',
		data
	})
}

export function uploadCover(formData) {
    return axios.post(`${UPLOADBASEURL}/upload/upload_flash_sale_cover`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

