import { App } from 'vue';

import Card from './Card.vue';
import Button from './Button.vue';
import Frame from './Frame.vue';
import Menu from './Menu.vue';
import Icon from './Icon.vue';
import Input from './Input.vue';
import Editor from './Editor.vue';
import Header from './Header.vue';
import Content from './Content.vue';
import Sidebar from './Sidebar.vue';
import ListedButton from './ListedButton.vue';
import ListedHr from './ListedHr.vue';
import Text from './Text.vue';

export default {
  install(app: App) {
    app.component('ui-card', Card);
    app.component('ui-button', Button);
    app.component('ui-frame', Frame);
    app.component('ui-menu', Menu);
    app.component('ui-icon', Icon);
    app.component('ui-input', Input);
    app.component('ui-editor', Editor);
    app.component('ui-header', Header);
    app.component('ui-content', Content);
    app.component('ui-sidebar', Sidebar);
    app.component('ui-listed-button', ListedButton);
    app.component('ui-listed-hr', ListedHr);
    app.component('ui-text', Text);
  },
};
