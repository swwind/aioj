import { RouteRecordRaw, createRouter as _createRouter, createMemoryHistory, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import NotFound from '../views/NotFound.vue';
import About from '../views/About.vue';
import Help from '../views/Help.vue';
import Regions from '../components/Regions.vue';
import RegionView from '../components/RegionView.vue';
import PostView from '../components/PostView.vue';
import UserView from '../components/UserView.vue';
import BotView from '../components/BotView.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import BotList from '../components/BotList.vue';
import Problems from '../components/Problems.vue';
import ProblemView from '../components/ProblemView.vue';
import RoundCreate from '../components/RoundCreate.vue';
import RoundView from '../components/RoundView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  }, {
    path: '/about',
    name: 'About',
    component: About,
  }, {
    path: '/help',
    name: 'Help',
    component: Help,
  }, {
    path: '/r',
    name: 'Forum',
    component: Regions,
  }, {
    path: '/r/:region',
    name: 'Region',
    component: RegionView,
    props: true,
  }, {
    path: '/r/:region/:pid',
    name: 'Post',
    component: PostView,
    props: (route) => ({
      region: route.params.region,
      pid: Number(route.params.pid),
    }),
  }, {
    path: '/u/:username',
    name: 'UserView',
    component: UserView,
    props: true,
  }, {
    path: '/p',
    name: 'Problems',
    component: Problems,
  }, {
    path: '/p/:pid',
    name: 'ProblemView',
    component: ProblemView,
    props: (route) => ({
      pid: Number(route.params.pid),
    }),
  }, {
    path: '/b/list',
    name: 'BotList',
    component: BotList,
    props: (route) => ({
      pid: route.query.p,
      username: route.query.u,
    }),
  }, {
    path: '/b/:bid',
    name: 'BotView',
    component: BotView,
    props: (route) => ({
      bid: Number(route.params.bid),
    }),
  }, {
    path: '/s/create/:pid/:bid?',
    name: 'RoundCreate',
    component: RoundCreate,
    props: (route) => ({
      pid: Number(route.params.pid),
      bid: route.params.bid ? Number(route.params.bid) : undefined,
    }),
  }, {
    path: '/s/:rid',
    name: 'RoundView',
    component: RoundView,
    props: (route) => ({
      rid: Number(route.params.rid),
    }),
  }, {
    path: '/login',
    name: 'Login',
    component: Login,
  }, {
    path: '/register',
    name: 'Register',
    component: Register,
  }, {
    path: '/:a(.*)',
    name: 'NotFound',
    component: NotFound,
  },
];

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR
      ? createMemoryHistory()
      : createWebHistory(),
    routes,
  });
}
