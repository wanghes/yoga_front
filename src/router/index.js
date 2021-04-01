import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layout';

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}


Vue.use(Router);

export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: '/dashboard',
            component: () => import('@/views/dashboard'),
            name: 'home',
            meta: {
                title: '概况',
                icon: 'dashboard',
                affix: true
            }
        }]
    },
    {
        path: '/course',
        component: Layout,
        redirect: '/course/index',
        alwaysShow: false,
        meta: {
            title: '线上课程',
            icon: 'example'
        },
        children: [{
            path: 'cate', // 系列课添加
            component: () => import('@/views/online_course/cate'),
            name: 'course_cate',
            meta: {
                title: '课程分类',
                icon: 'list',
            }
        }, {
            path: 'index',
            component: () => import('@/views/online_course/index'),
            name: 'alone',
            meta: {
                title: '单课',
                noCache: false,
                icon: 'education',
            }
        }, {
            path: 'add',
            component: () => import('@/views/online_course/add'),
            name: 'courseAdd',
            meta: {
                title: '新建单课'
            },
            hidden: true
        }, {
            path: 'detail/:id', // 单课详情
            component: () => import('@/views/online_course/detail'),
            name: 'detail',
            meta: {
                title: '课程优化',
                icon: 'component'
            },
            hidden: true
        }, {
            path: 'many_index', // 系列课列表
            component: () => import('@/views/online_course/many_index'),
            name: 'many_index',
            meta: {
                title: '系列课',
                icon: 'component',
            }
        }, {
            path: 'many_detail/:id', // 系列课详情
            component: () => import('@/views/online_course/many_detail'),
            name: 'many_detail',
            meta: {
                title: '编辑课程',
                icon: 'component'
            },
            hidden: true
        }, {
            path: 'many_panel', // 系列课详情
            component: () => import('@/views/online_course/many_panel'),
            name: 'many_panel',
            meta: {
                title: '系列课详情',
                icon: 'component'
            },
            hidden: true
        }]
    },
    {
        path: '/offline',
        component: Layout,
        redirect: '/offline/index',
        alwaysShow: false,
        meta: {
            title: '线下课程',
            icon: 'example'
        },
        children: [{
            path: 'index',
            component: () => import('@/views/offline_course/index'),
            name: "offline_course_index",
            meta: {
                title: '课程管理',
                icon: 'list'
            }
        },{
            path: 'tuanke/add',
            component: () => import('@/views/offline_course/tuanke/add'),
            name: "offline_tuanke_add",
            meta: {
                title: '新建团课',
                icon: 'form',
                noCache: true
            },
            hidden: true
        },{
            path: 'tuanke/edit/:id',
            component: () => import('@/views/offline_course/tuanke/edit'),
            name: "offline_tuanke_edit",
            meta: {
                title: '编辑团课',
                icon: 'edit',
                noCache: true
            },
            hidden: true
        },{
            path: 'banke/add',
            component: () => import('@/views/offline_course/banke/add'),
            name: "offline_banke_add",
            meta: {
                title: '新建班课',
                icon: 'form',
                noCache: true
            },
            hidden: true
        },{
            path: 'banke/edit/:id',
            component: () => import('@/views/offline_course/banke/edit'),
            name: "offline_banke_edit",
            meta: {
                title: '编辑班课',
                icon: 'edit',
                noCache: true
            },
            hidden: true
        },{
            path: 'teacher',
            component: () => import('@/views/offline_course/teachers/index'),
            name: "offline_course_teacher",
            meta: {
                title: '员工管理',
                icon: 'peoples',
                noCache: true
            }
        },{
            path: 'teacher/detail/:id',
            component: () => import('@/views/offline_course/teachers/detail'),
            name: "offline_course_teacher_detail",
            meta: {
                title: '老师管理',
                icon: 'peoples',
                noCache: true
            },
            hidden: true
        },{
            path: 'teacher/add',
            component: () => import('@/views/offline_course/teachers/add'),
            name: "offline_course_teacher_add",
            meta: {
                title: '老师添加',
                icon: 'peoples',
                noCache: true
            },
            hidden: true
        },{
            path: 'teacher/edit',
            component: () => import('@/views/offline_course/teachers/add'),
            name: "offline_course_teacher_edit",
            meta: {
                title: '老师编辑',
                icon: 'peoples',
                noCache: true
            },
            hidden: true
        }]
    },
    {
        path: '/subscribe',
        component: Layout,
        redirect: '/subscribe/index',
        meta: {
            title: '课程预约管理',
            icon: 'example'
        },
        alwaysShow: false,
        children: [{
            path: 'index',
            component: () => import('@/views/subscribe/index'),
            name: '排课管理首页',
            meta: {
                title: '排课管理',
                icon: 'list',
                noCache: true
            }
        },{
            path: 'room',
            component: () => import('@/views/room/index'),
            name: '教室',
            meta: {
                title: '教室管理',
                icon: 'list',
                noCache: true
            }
        }]
    },
    {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        hidden: true,
        children: [{
            path: 'index',
            component: () => import('@/views/dashboard'),
            name: 'Profile',
            meta: {
                title: 'Profile',
                icon: 'user',
                noCache: true
            }
        }]
    }
]

export const asyncRoutes = [
    {
        path: '/icon',
        component: Layout,
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
    },
    {
        path: '/example',
        component: Layout,
        redirect: '/example/list',
        name: 'Example',
        meta: {
            title: '文章相关',
            icon: 'example'
        },
        children: [{
            path: 'list',
            component: () => import('@/views/dashboard'),
            name: 'ListArticle',
            meta: {
                title: '文章列表',
                icon: 'list'
            }
        }, {
            path: 'create',
            component: () => import('@/views/dashboard'),
            name: 'CreateArticle',
            meta: {
                title: '创建文章',
                icon: 'edit'
            }
        },
        {
            path: 'edit/:id(\\d+)',
            component: () => import('@/views/dashboard'),
            name: 'EditArticle',
            meta: {
                title: '编辑文章',
                noCache: true,
                activeMenu: '/example/list'
            },
            hidden: true
        }]
    }
]


const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
