import Layout from '@/layout';
// 老师专用
const OfflineClass = [
    {
        path: '/',
        component: Layout,
        redirect: '/subscribe/index',
        alwaysShow: true,
        meta: {
            title: '线下课程',
            icon: 'example'
        },
        children: [
            {
                path: '/membercard/index',
                component: () => import('@/views/member_card/index'),
                name: 'member_card_index',
                meta: {
                    title: '会员卡管理',
                    icon: 'example',
                    noCache: true
                }
            },
            {
                path: 'index',
                component: () => import('@/views/offline_course/index'),
                name: "offline_course_index",
                meta: {
                    title: '课程管理',
                    icon: 'tree-table'
                }
            },
            {
                path: '/subscribe/index',
                component: () => import('@/views/subscribe/index'),
                name: '排课管理首页',
                meta: {
                    title: '排课管理',
                    icon: 'tree',
                    noCache: true
                }
            },
            {
                path: 'tuanke/add',
                component: () => import('@/views/offline_course/tuanke/add'),
                name: "offline_tuanke_add",
                meta: {
                    title: '新建团课',
                    icon: 'form',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'tuanke/edit/:id',
                component: () => import('@/views/offline_course/tuanke/edit'),
                name: "offline_tuanke_edit",
                meta: {
                    title: '编辑团课',
                    icon: 'edit',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'banke/add',
                component: () => import('@/views/offline_course/banke/add'),
                name: "offline_banke_add",
                meta: {
                    title: '新建班课',
                    icon: 'form',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'banke/edit/:id',
                component: () => import('@/views/offline_course/banke/edit'),
                name: "offline_banke_edit",
                meta: {
                    title: '编辑班课',
                    icon: 'edit',
                    noCache: true
                },
                hidden: true
            },
            
            {
                path: 'adviser/add',
                component: () => import('@/views/offline_course/adviser/add'),
                name: "offline_course_adviser_add",
                meta: {
                    title: '会籍添加',
                    icon: 'peoples',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'adviser/edit/:id',
                component: () => import('@/views/offline_course/adviser/edit'),
                name: "offline_course_adviser_edit",
                meta: {
                    title: '会籍编辑',
                    icon: 'peoples',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'teacher/detail/:id',
                component: () => import('@/views/offline_course/teachers/detail'),
                name: "offline_course_teacher_detail",
                meta: {
                    title: '老师信息',
                    icon: 'peoples',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'teacher/add',
                component: () => import('@/views/offline_course/teachers/add'),
                name: "offline_course_teacher_add",
                meta: {
                    title: '老师添加',
                    icon: 'peoples',
                    noCache: true
                },
                hidden: true
            },
            {
                path: '/card/add',
                component: () => import('@/views/card/add'),
                name: 'card_add',
                meta: {
                    title: '卡种类添加',
                    noCache: true
                },
                hidden: true
            },
            {
                path: '/card/edit/:id',
                component: () => import('@/views/card/edit'),
                name: 'card_edit',
                meta: {
                    title: '卡种类编辑',
                    noCache: true
                },
                hidden: true
            }
        ]
    },
    {
        path: '/membercard',
        component: Layout,
        children: [
            {
                path: 'operate/:card_no',
                component: () => import('@/views/member_card/card_operate'),
                name: 'member_card_operate',
                meta: {
                    title: '会员卡操作',
                    icon: 'example',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'detail/:card_no',
                component: () => import('@/views/member_card/detail'),
                name: 'member_card_detail',
                meta: {
                    title: '会员卡详情',
                    icon: 'example',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'add/:member_id',
                component: () => import('@/views/member_card/add'),
                name: 'member_card_add',
                meta: {
                    title: '会员办卡',
                    icon: 'user',
                    noCache: true
                },
                hidden: true
            }
        ],
    },
    {
        path: '/book',
        component: Layout,
        redirect: '/book/tuanke/index',
        children: [
            {
                path: 'tuanke/index/:schedule_id',
                component: () => import('@/views/book/tuanke/index'),
                name: 'book_tuanke_index',
                meta: {
                    title: '用户预约团课',
                    icon: 'user',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'sijiao/index/:schedule_id',
                component: () => import('@/views/book/sijiao/index'),
                name: 'book_sijiao_index',
                meta: {
                    title: '用户预约私教课',
                    icon: 'user',
                    noCache: true
                },
                hidden: true
            }
        ]
    }
]

export default OfflineClass;