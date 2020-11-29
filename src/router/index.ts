import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'AIOJ - An open AI online judging system',
      description: 'AIOJ is an open AI online judging system, try to figure out your AI is much better than others!',
    },
  }, {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
    meta: {
      title: 'About - AIOJ',
    },
  }, {
    path: '/r',
    name: 'Forum',
    component: () => import(/* webpackChunkName: "forum" */ '@/components/Regions.vue'),
    meta: {
      title: 'Forum - AIOJ',
    },
  }, {
    path: '/r/:region',
    name: 'Region',
    component: () => import(/* webpackChunkName: "region" */ '@/components/RegionView.vue'),
    meta: {
      title: 'Region - AIOJ',
    },
    props: (route) => ({
      region: route.params.region,
    }),
  }, {
    path: '/r/:region/:pid',
    name: 'Post',
    component: () => import(/* webpackChunkName: "post" */ '@/components/PostView.vue'),
    meta: {
      title: 'Region Post - AIOJ',
    },
    props: (route) => ({
      region: route.params.region,
      pid: route.params.pid,
    }),
  }, {
    path: '/u/:username',
    name: 'UserView',
    component: () => import(/* webpackChunkName: "userinfo" */ '@/components/UserView.vue'),
    props: (route) => ({
      username: route.params.username,
    }),
    beforeEnter(route) {
      route.meta.title = `User ${route.params.username} - AIOJ`;
    },
  }, {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/components/Login.vue'),
    meta: {
      title: 'Login - AIOJ',
    },
  }, {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '@/components/Register.vue'),
    meta: {
      title: 'Register - AIOJ',
    },
  }, {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Not Found - AIOJ',
    },
  }, {
    path: '/:a(.*)',
    redirect: {
      name: 'NotFound',
    },
  },
];

export default routes;
