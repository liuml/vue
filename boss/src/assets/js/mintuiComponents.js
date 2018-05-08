/**
 * mint-ui 使用的组件引入
 */
import Vue from 'vue'
import {
  Toast,
  Indicator,
  Spinner,
  Loadmore,
  InfiniteScroll,
  Tabbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  Swipe,
  SwipeItem,
  Button,
  Cell,
  Header,
  Radio,
  Field,
  Picker,
  Popup,
  MessageBox,
  Actionsheet
} from 'mint-ui'
Vue.prototype.toast = Toast
Vue.prototype.indicator = Indicator
Vue.prototype.messageBox = MessageBox
Vue.use(InfiniteScroll)
Vue.component(Spinner.name, Spinner)
Vue.component(Loadmore.name, Loadmore)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Header.name, Header)
Vue.component(Radio.name, Radio)
Vue.component(Field.name, Field)
Vue.component(Picker.name, Picker)
Vue.component(Popup.name, Popup)
Vue.component(Actionsheet.name, Actionsheet)
