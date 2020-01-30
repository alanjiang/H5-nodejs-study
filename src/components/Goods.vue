<template>
  <div class="goods">
  <div class="scroll-nav-wrapper">
    <cube-scroll-nav @change="changeHandler" :side="true" >
        <!-- slot start -->
         <template slot="bar" slot-scope="props">
          <cube-scroll-nav-bar
            direction="vertical"
            :labels="props.labels"
            :txts="barTxts"
            :current="props.current"
          >
            <template slot-scope="props">
              <div class="text">
                <support-ico
                  v-if="props.txt.type>=1"
                  :size=3
                  :type="props.txt.type"
                ></support-ico>
                <span>{{props.txt.name}}</span>
                <span class="num" v-if="props.txt.count">
                  <bubble :num="props.txt.count"></bubble>
                </span>
              </div>
            </template>
          </cube-scroll-nav-bar>
        </template>
        <!-- slot end -->
        
        
       <cube-scroll-nav-panel
          v-for="good in goods"
          :key="good.id"
          :label="good.name"
          :title="good.name"
        >
          <ul>
            <li
              v-for="food in good.foods"
              :key="food.id"
              class="food-item"
            >
              <div class="icon"  @click="selectFood(food)">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name"  @click="selectFood(food)">{{food.name}}</h2>
                <p class="desc">DDDD</p>
                <div class="extra">
                  <span class="count">月售12份</span><span>好评率89%</span>
                </div>
                <div class="price">
                  <span class="now">￥12.00</span>
                  
                </div>
                <div class="cart-control-wrapper">
                  <addcart :food="food" @add="onAdd"></addcart>
                </div>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
     
    </cube-scroll-nav>
  </div>
  
   <div class="shop-cart-wrapper">
      <mycart
        ref="shopCart"
        :select-foods="selectFoods"
        :delivery-price="12"
        :min-price="9"></mycart>
    </div>
    
 </div>
</template>

<script>

import addcart from './addToCart/cart-control'
import mycart from './shop-cart/MyCart'
import Bubble from './bubble/bubble'
import goodsData from '../datas/goods_list.json'
const goods = goodsData.goods

export default {
  name: 'Goods',
  components: {
      Bubble,
      addcart,
      mycart 
    },
    
   props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },  
  data () {
    return {
       goods: goods,
       selectedFood: {}
    }
  },
  
  computed: {
      
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      },
      barTxts() {
        let ret = []
        this.goods.forEach((good) => {
          const {type, name, foods} = good
          let count = 0
          foods.forEach((food) => {
            count += food.count || 0
          })
          ret.push({
            type,
            name,
            count
          })
        })
        return ret
      }
    },
  
  
  
  methods: {
    
    //父组件的方法
    selectFood(food) {
        this.selectedFood = food
        this.showFood()
        this.showShopCartSticky()
      },
      //food.vue中的addFoold事件,this.$emit(EVENT_ADD, target)
      onAdd (target) {
        this.$refs.shopCart.drop(target)
      },
      
      //createAPI
      showFood() {
        this.foodComp = this.foodComp || this.$createFood({
          $props: {
            food: 'selectedFood'
          },
          $events: {
            add: (target) => {
              this.shopCartStickyComp.drop(target)
            },
            leave: () => {
              this.hideShopCartSticky()
            }
          }
        })
        this.foodComp.show()
      },
      //createAPI
      showShopCartSticky() {
        this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectFoods',
            fold: true
          }
        })
        this.shopCartStickyComp.show()
      },
      hideShopCartSticky() {
        this.shopCartStickyComp.hide()
      }
      
      
      
   }   
      
      
   
}
</script>


<style lang="stylus" scoped>
  @import "../common/stylus/variable"
  .goods
    position: relative
    text-align: left
    height: 100%
    
    .scroll-nav-wrapper
      position: absolute
      width: 100%
      top: 0
      left: 0
      bottom: 48px
    >>> .cube-scroll-nav-bar
      width: 80px
      white-space: normal
     
      overflow: hidden
    >>> .cube-scroll-nav-bar-item
      padding: 0 10px
      display: flex
      align-items: center
      height: 56px
      line-height: 14px
      font-size: $fontsize-small
      background: $color-background-ssss
     
      .text
        flex: 1
        position: relative
      .num
        position: absolute
        right: -8px
        top: -10px
      .support-ico
        display: inline-block
        vertical-align: top
        margin-right: 4px
    >>> .cube-scroll-nav-bar-item_active
      background: $color-white
      color: $color-dark-grey
    >>> .cube-scroll-nav-panel-title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid $color-col-line
      font-size: $fontsize-small
      color: $color-grey
      background: $color-background-ssss
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      position: relative
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
        img
          height: auto
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: $fontsize-medium
          color: $color-dark-grey
        .desc, .extra
          line-height: 10px
          font-size: $fontsize-small-s
          color: $color-light-grey
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: $fontsize-medium
            color: $color-red
          .old
            text-decoration: line-through
            font-size: $fontsize-small-s
            color: $color-light-grey
      .cart-control-wrapper
        position: absolute
        right: 0
        bottom: 12px
    .shop-cart-wrapper
      position: absolute
      left: 0
      bottom: 0
      z-index: 50
      width: 100%
      height: 48px
      
  
</style>
