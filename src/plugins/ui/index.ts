import { App } from 'vue';

import Card from './Card.vue';
import Button from './Button.vue';
import Frame from './Frame.vue';
import Menu from './Menu.vue';
import Icon from './Icon.vue';
import Input from './Input.vue';
import Editor from './Editor.vue';

export default {
  install(app: App) {
    app.component('ui-card', Card);
    app.component('ui-button', Button);
    app.component('ui-frame', Frame);
    app.component('ui-menu', Menu);
    app.component('ui-icon', Icon);
    app.component('ui-input', Input);
    app.component('ui-editor', Editor);
  },
};
