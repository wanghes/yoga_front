import request from '@/utils/request'


export function list(params) {
    return request({
        url: '/admin/bill/list',
        method: 'get',
        params
    });
}
