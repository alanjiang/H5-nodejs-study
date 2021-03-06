import { createAPI } from 'cube-ui'
import Vue from 'vue'
import food from './components/food/food'
import attr from './components/food/attr'
import shopCartSticky from './components/shop-cart-sticky/shop-cart-sticky'
import shopCartList from './components/shop-cart-list/shop-cart-list'
import shopCartBall from './components/shop-cart-sticky/shop-cart-ball'
import my from './components/my/my'
import addressDialog from './components/address/address-add'
import history from './components/my/history'
import {Toast} from 'cube-ui'
createAPI(Vue, Toast)
createAPI(Vue, food)
createAPI(Vue, attr)
createAPI(Vue, shopCartSticky)
createAPI(Vue, shopCartBall)
createAPI(Vue, shopCartList)
createAPI(Vue, my)
createAPI(Vue, history)
createAPI(Vue, addressDialog)