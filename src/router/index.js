import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layout';

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
            title: '课程管理',
            icon: 'example'
        },
        children: [{
            path: 'index',
            component: () => import('@/views/course/index'),
            name: 'alone',
            meta: {
                title: '单课',
                noCache: false,
                icon: 'education',
            }
        },{
            path: 'detail/:id', // 单课详情
            component: () => import('@/views/course/detail'),
            name: 'aloneDetail',
            meta: {
                title: '课程优化',
                icon: 'component'
            },
            hidden: true
        },{
            path: 'many_index', // 系列课列表
            component: () => import('@/views/course/many_index'),
            name: 'many_index',
            meta: {
                title: '系列课',
                icon: 'component',
            }
        },{
            path: 'many_detail', // 系列课详情
            component: () => import('@/views/course/index'),
            name: 'manyDetail',
            hidden: true
        },{
            path: 'add',
            component: () => import('@/views/course/add'),
            name: 'courseAdd',
            meta: {
                title: '新建单课'
            },
            hidden: true
        }]
    },
    {
        path: '/documentation',
        component: Layout,
        children: [{
            path: 'index',
            component: () => import('@/views/dashboard'),
            name: 'Documentation',
            meta: {
                title: '文章中心',
                icon: 'documentation'   
            }
        }]
    },
    {
        path: '/guide',
        component: Layout,
        redirect: '/guide/index',
        children: [{
            path: 'index',
            component: () => import('@/views/dashboard'),
            name: 'Guide',
            meta: {
                title: '权威指南',
                icon: 'guide',
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
        },{
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
            },{
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
            }
        ]
    },
    {
        path: '/tab',
        component: Layout,
        children: [{
            path: 'index',
            component: () => import('@/views/dashboard'),
            name: 'Tab',
            meta: {
                title: '标签页面',
                icon: 'tab'
            }
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
