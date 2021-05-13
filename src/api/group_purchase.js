import request from '@/utils/request'
import axios from 'axios';
import { UPLOADBASEURL } from "@/config";

export function list(params) {
    return request({
        url: '/admin/group_purchase/list',
        method: 'get',
        params
    });
}

export function add(data) {
	return request({
		url: '/admin/group_purchase/add',
		method: 'post',
		data
	})
}

export function edit(data) {
	return request({
		url: '/admin/group_purchase/edit',
		method: 'put',
		data
	})
}

export function query(params) {
    return request({
        url: '/admin/group_purchase/query',
        method: 'get',
        params
    })
}

export function deleteItem(params) {
    return request({
        url: '/admin/group_purchase/delete',
        method: 'delete',
        params
    })
}

export function updateStatus(data) {
	return request({
		url: '/admin/group_purchase/status',
		method: 'put',
		data
	})
}

export function uploadCover(formData) {
    return axios.post(`${UPLOADBASEURL}/upload/upload_group_purchase_cover`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

