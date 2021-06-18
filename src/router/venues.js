import Layout from '@/layout';
const Routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard',
                component: () => import('@/views/dashboard'),
                name: 'home',
                meta: {
                    title: '概况',
                    icon: 'dashboard',
                    affix: true
                }
            }
        ]
    },
    {
        path: '/venues',
        //name: 'venues',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import('@/views/venues/index'),
                meta: {
                    title: '场馆信息',
                    icon: 'example',
                    affix: true
                }
            }
        ]
    },
    {
        path: '/focus',
        component: Layout,
        redirect: '/focus/index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/focus/index'),
                name: 'focus_index',
                meta: {
                    title: '焦点图管理',
                    icon: 'component',
                    noCache: true
                }
            }
        ]
    },
    {
        path: '/actives',
        name: 'actives',
        redirect: '/actives/flash_sale',
        component: Layout,
        alwaysShow: true,
        meta: {
            title: '活动中心',
            icon: 'example'
        },
        children: [
            {
                path: 'flash_sale',
                component: () => import('@/views/actives/flash_sale'),
                name: "flash_sale",
                meta: {
                    title: '限时秒杀',
                    icon: 'tree-table'
                }
            },
            {
                path: 'flash_sale/operate',
                component: () => import('@/views/actives/flash_add_edit'),
                name: "flash_sale_operate",
                meta: {
                    title: '限时秒杀操作',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'group_purchase',
                component: () => import('@/views/actives/pintuan'),
                name: "group_purchase",
                meta: {
                    title: '拼团活动',
                    icon: 'tree-table'
                }
            },
            {
                path: 'group_purchase/operate',
                component: () => import('@/views/actives/pintuan_add_edit'),
                name: "group_purchase_operate",
                meta: {
                    title: '拼团活动操作',
                    noCache: true
                },
                hidden: true
            }
        ] 
    },
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
    },
    {
        path: '/offline',
        component: Layout,
        redirect: '/offline/index',
        alwaysShow: true,
        meta: {
            title: '线下课程',
            icon: 'example'
        },
        children: [
            {
                path: '/card/index',
                component: () => import('@/views/card/index'),
                name: 'card_index',
                meta: {
                    title: '卡种类列表',
                    icon: 'table',
                    noCache: true
                }
            },
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
                path: 'adviser',
                component: () => import('@/views/offline_course/adviser/index'),
                name: "offline_course_adviser",
                meta: {
                    title: '会籍管理',
                    icon: 'peoples',
                    noCache: true
                }
            },
            {
                path: 'teacher',
                component: () => import('@/views/offline_course/teachers/index'),
                name: "offline_course_teacher",
                meta: {
                    title: '老师管理',
                    icon: 'peoples',
                    noCache: true
                }
            },
            {
                path: 'room',
                component: () => import('@/views/room/index'),
                name: '教室',
                meta: {
                    title: '教室管理',
                    icon: 'chart',
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
        path: '/member',
        component: Layout,
        redirect: '/member/index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/member/index'),
                name: 'member_index',
                meta: {
                    title: '会员管理',
                    icon: 'user',
                    noCache: true
                }
            },
            {
                path: 'detail/:id',
                component: () => import('@/views/member/detail'),
                name: 'member_detail',
                meta: {
                    title: '会员详情',
                    icon: 'user',
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
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue')
    }
];

export default Routes;