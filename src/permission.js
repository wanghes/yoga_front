import router from './router';
import store from './store';
import {
    Message
} from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {
    getToken
} from '@/utils/auth';
import getPageTitle from '@/utils/getPageTitle';

NProgress.configure({
    showSpinner: false
});

const whiteList = ['/login', '/auth-redirect', '/404'];

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    document.title = getPageTitle(to.meta.title);
    const hasToken = getToken();

    if (hasToken && !!window.venues) {
        if (to.path === '/login') {
            // 如果登陆了过了，直接跳转到首页
            next({
                path: '/'
            });
            NProgress.done();
        } else {
            // 通过获取用户的角色信息判断是否获得了权限
            const hasRoles = store.getters.role;
            if (hasRoles) {
                next();
            } else {
                try {
                    // 获取用户的角色信息
                    // note: 角色必须是一个对象数组，诸如：['admin']或者['developer','editor','thirdUser']
                    const {
                        role
                    } = await store.dispatch('user/getInfo');
                    
                    // 创建基于角色信息映射的可访问路由
                    const accessRoutes = await store.dispatch('permission/generateRoutes', role);
                    // 动态添加可访问路由
                    router.addRoutes(accessRoutes);
                        
                    // 确保addRoutes完成的hack方式, 之所以设置replace的值为true, 是让导航不留下历史记录
                    next({
                        ...to,
                        replace: true
                    });
                } catch (error) {
                    // 清除token信息，跳转登录页面重新登录
                    console.log(error)
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else if (hasToken && !window.venues) {
        next(false);
        Message.error("没有获取到场馆主信息，请查看网址是否输入有误")
        NProgress.done()
    } else {
        /* token不存在的情况 */
        if (whiteList.indexOf(to.path) !== -1) {
            // 如果路由在免登录的白名单中，那么直接跳转就可以了
            next()
        } else {
            // 其他页面没有权限直接访问，就直接跳转登录页面
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // 结束页面进度显示条
    NProgress.done()
})
