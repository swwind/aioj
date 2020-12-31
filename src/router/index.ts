import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';
import About from '@/views/About.vue';
import Help from '@/views/Help.vue';
import Regions from '@/components/Regions.vue';
import RegionView from '@/components/RegionView.vue';
import PostView from '@/components/PostView.vue';
import UserView from '@/components/UserView.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Problems from '@/components/Problems.vue';
import ProblemView from '@/components/ProblemView.vue';

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
    props: true,
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
    props: true,
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

export default routes;
