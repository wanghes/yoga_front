import request from '@/utils/request'
import axios from 'axios';
import { UPLOADBASEURL } from "@/config";


export function all(data) {
    return request({
        url: '/admin/card/all',
        method: 'post',
        data
    });
}


export function list(data) {
    return request({
        url: '/admin/card/list',
        method: 'post',
        data
    });
}

export function add(data) {
    return request({
        url: '/admin/card/add',
        method: 'post',
        data
    });
}

export function query(data) {
    return request({
        url: '/admin/card/query',
        method: 'post',
        data
    })
}




export function update(data) {
	return request({
		url: '/admin/card/update',
		method: 'put',
		data
	})
}

export function updateStatus(data) {
	return request({
		url: '/admin/card/status',
		method: 'put',
		data
	})
}

export function deleteItem(params) {
    return request({
        url: '/admin/card/delete',
        method: 'delete',
        params
    })
}



export function list_by_card_id(data) {
    return request({
        url: '/admin/cardbind/list_by_card_id',
        method: 'post',
        data
    });
}


export function cardBindAdd(data) {
    return request({
        url: '/admin/cardbind/add',
        method: 'post',
        data
    });
}

export function uploadCardCover(formData) {
    return axios.post(`${UPLOADBASEURL}/upload/card_cover`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}





