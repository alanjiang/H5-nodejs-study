<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop="decrease">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
   <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
   
      <div @click.stop="addToCart" class="cart-add icon-add_circle"></div>
  </div>
</template>

<script>
  const EVENT_ADD = 'add';
  import { setGlobal,getGlobal,removeGlobal } from '../../api'
  export default {
    name: 'cart-control',
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      //加商品到购物车的动作
      addToCart(event) {
          //让Goods.vue父组件来执行新增动作
          this.$emit(EVENT_ADD, event.target, this.food,'cart-control')
        /*
        alert('=>parent:'+JSON.stringify(this.$parent));
        if (this.food.attrs.length >= 1){ 
               
                 //this.selectFood();
                
        }else //没有规格的商品直接数量累加
        {
               if (!this.food.count) {
                 //this.#set(obj, key, value) 为对象添加一个属性
                 this.$set(this.food, 'count', 1)
               }else {
                  this.food.count++
               }
               
               //向父组件通讯
              if(event){
                 this.$emit(EVENT_ADD, event.target, this.food)
              }
         } */
         
           
      },
      decrease() {
         if (this.food.count) {
            this.food.count--
          }
      },
        
         // start 商品有规格，显示商品详情页面 
         selectFood() {
            
            this.showFood()
            this.showShopCartSticky()
         },
       
      showFood() {
        this.foodComp = this.foodComp || this.$createFood({
          $props: {
            food: 'food'
          },
          $events: {
            add: (target) => {
              this.shopCartStickyComp.drop(target);
            },
            leave: () => {
              this.hideShopCartSticky();
            
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
         // end 商品有规格，显示商品详情页面 
      
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"

  .cartcontrol
    display: flex
    align-items: center
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      .inner
        display: inline-block
        line-height: 24px
        font-size: $fontsize-large-xxx
        color: $color-blue
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      width: 12px
      line-height: 24px
      text-align: center
      font-size: $fontsize-small-s
      color: $color-grey
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: $fontsize-large-xxx
      color: $color-blue
</style>
