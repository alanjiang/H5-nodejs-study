import Vue from 'vue'

// By default we import all the components.
// Only reserve the components on demand and remove the rest.
// Style is always required.
import {
  /* eslint-disable no-unused-vars */
  Input,
  Textarea,
  Select,
  Switch,
  Radio,
  Form,
  Button,
  Style,
  TabBar,
  Popup,
  Dialog,
  Scroll,
  Slide,
  ScrollNav,
  ScrollNavBar,
  Toast,
  ActionSheet
} from 'cube-ui'
import VueBus from 'vue-bus';
import VDistpicker from 'v-distpicker'

Vue.use(Button)
Vue.use(Input)
Vue.use(Select)
Vue.use(Switch)
Vue.use(Textarea)
Vue.use(Radio)
Vue.use(Form)
Vue.use(TabBar)
Vue.use(Popup)
Vue.use(Dialog)
Vue.use(Scroll)
Vue.use(Slide)
Vue.use(ScrollNav)
Vue.use(ScrollNavBar)
//VueBus组件传值
Vue.use(VueBus);
Vue.use(VDistpicker);
Vue.use(ActionSheet);
