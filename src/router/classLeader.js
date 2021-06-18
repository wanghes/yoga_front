import Layout from '@/layout';
// 课代表专用的
const onlineClass = [
    {
        path: '/course',
        component: Layout,
        redirect: '/course/index',
        alwaysShow: true,
        meta: {
            title: '线上课程',
            icon: 'example'
        },
        children: [
            {
                path: 'cate', // 系列课添加
                component: () => import('@/views/online_course/cate'),
                name: 'course_cate',
                meta: {
                    title: '课程分类',
                    icon: 'list',
                }
            }, 
            {
                path: 'index',
                component: () => import('@/views/online_course/index'),
                name: 'alone',
                meta: {
                    title: '单课',
                    noCache: false,
                    icon: 'education',
                }
            }, 
            {
                path: 'add',
                component: () => import('@/views/online_course/add'),
                name: 'courseAdd',
                meta: {
                    title: '新建单课',
                    noCache: true
                },
                hidden: true
            }, 
            {
                path: 'detail/:id', // 单课详情
                component: () => import('@/views/online_course/detail'),
                name: 'detail',
                meta: {
                    title: '课程优化',
                    icon: 'component'
                },
                hidden: true
            }, 
            {
                path: 'many_index', // 系列课列表
                component: () => import('@/views/online_course/many_index'),
                name: 'many_index',
                meta: {
                    title: '系列课',
                    icon: 'component',
                }
            }, 
            {
                path: 'many_detail/:id', // 系列课详情
                component: () => import('@/views/online_course/many_detail'),
                name: 'many_detail',
                meta: {
                    title: '编辑课程',
                    icon: 'component'
                },
                hidden: true
            }, 
            {
                path: 'many_panel', // 系列课详情
                component: () => import('@/views/online_course/many_panel'),
                name: 'many_panel',
                meta: {
                    title: '系列课详情',
                    icon: 'component'
                },
                hidden: true
            }
        ]
    }
]


export default onlineClass;