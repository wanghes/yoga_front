 const asyncRoutes = [
    {
        path: '/icon',
        component: Layout,
        hidden: true,
        meta: {
            title: '图标信息',
            icon: 'example'
        },
        children: [{
            path: 'index',
            component: () => import('@/views/icons/index'),
            name: 'Icons',
            meta: {
                title: '图标01',
                icon: 'video',
                noCache: true
            }
        }, {
            path: 'index2',
            component: () => import('@/views/dashboard'),
            name: 'video',
            meta: {
                title: '图标02',
                icon: 'icon',
                noCache: true
            }
        }]
    }
]

export default asyncRoutes;