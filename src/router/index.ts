import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'AIFuckingSystem - An open AI online judging system',
      description: 'AIFuckingSystem is an open AI online judging system, try to figure out your AI is much better than others!',
    },
  }, {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
    meta: {
      title: 'About - AIFuckingSystem',
    },
  }, {
    path: '/r',
    name: 'Forum',
    component: () => import(/* webpackChunkName: "login" */ '@/components/Regions.vue'),
    meta: {
      title: 'Forum - AIFuckingSystem',
    },
  }, {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/components/Login.vue'),
    meta: {
      title: 'Login - AIFuckingSystem',
    },
  }, {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "login" */ '@/components/Register.vue'),
    meta: {
      title: 'Register - AIFuckingSystem',
    },
  }, {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Not Found - AIFuckingSystem',
    },
  }, {
    path: '/:a(.*)',
    redirect: {
      name: 'NotFound'
    },
  },
];

export default routes;
