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
        path: '/test',
        component: () => import('@/views/temp/index'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: '/dashboard',
            component: () => import('@/views/HelloWorld'),
            name: 'home',
            meta: {
                title: '仪表盘',
                icon: 'dashboard',
                affix: true
            }
        }]
    },
    {
        path: '/pan',
        component: Layout,
        redirect: '/pan/dashboard1',
        meta: {
            title: '分类信息管理',
            icon: 'example'
        },
        children: [{
            path: 'dashboard1',
            component: () => import('@/views/HelloWorld'),
            name: 'Dashboard1',
            meta: {
                title: '仪表盘1',
                icon: 'password',
            }
        },{
            path: 'video',
            component: () => import('@/views/video'),
            name: 'video',
            meta: {
                title: 'H5视频',
                icon: 'video'
            }
        }]
    },
    {
        path: '/documentation',
        component: Layout,
        children: [{
            path: 'index',
            component: () => import('@/views/HelloWorld'),
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
            component: () => import('@/views/HelloWorld'),
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
            component: () => import('@/views/HelloWorld'),
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
            component: () => import('@/views/HelloWorld'),
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
                component: () => import('@/views/HelloWorld'),
                name: 'ListArticle',
                meta: {
                    title: '文章列表',
                    icon: 'list'
                }
            },{
                path: 'create',
                component: () => import('@/views/HelloWorld'),
                name: 'CreateArticle',
                meta: {
                    title: '创建文章',
                    icon: 'edit'
                }
            },
            {
                path: 'edit/:id(\\d+)',
                component: () => import('@/views/HelloWorld'),
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
            component: () => import('@/views/HelloWorld'),
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
