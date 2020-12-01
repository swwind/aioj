import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';
import About from '@/views/About.vue';
import Regions from '@/components/Regions.vue';
import RegionView from '@/components/RegionView.vue';
import PostView from '@/components/PostView.vue';
import UserView from '@/components/UserView.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';

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
    component: About,
    meta: {
      title: 'About - AIOJ',
    },
  }, {
    path: '/r',
    name: 'Forum',
    component: Regions,
    meta: {
      title: 'Forum - AIOJ',
    },
  }, {
    path: '/r/:region',
    name: 'Region',
    component: RegionView,
    meta: {
      title: 'Region - AIOJ',
    },
    props: (route) => ({
      region: route.params.region,
    }),
  }, {
    path: '/r/:region/:pid',
    name: 'Post',
    component: PostView,
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
    component: UserView,
    props: (route) => ({
      username: route.params.username,
    }),
    beforeEnter(route) {
      route.meta.title = `User ${route.params.username} - AIOJ`;
    },
  }, {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login - AIOJ',
    },
  }, {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Register - AIOJ',
    },
  }, {
    path: '/:a(.*)',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Not Found - AIOJ',
    },
  },
];

export default routes;
