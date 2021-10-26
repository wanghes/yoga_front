import request from '@/utils/request'
import axios from 'axios';
import { UPLOADBASEURL } from "@/config";

export function query(params) {
    return request({
        url: '/admin/venues/query',
        method: 'get',
        params
    });
}

export function add(data) {
	return request({
		url: '/admin/venues/add',
		method: 'post',
		data
	})
}

export function update(data) {
	return request({
		url: '/admin/venues/edit',
		method: 'put',
		data
	})
}

export function uploadAloneCover(formData) {
    return axios.post(`${UPLOADBASEURL}/upload/venues`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}


export function queryLook(params) {
    return request({
        url: '/admin/manager/getlook',
        method: 'get',
        params
    });
}

export function updateLook(data) {
	return request({
		url: '/admin/manager/look',
		method: 'put',
		data
	})
}

