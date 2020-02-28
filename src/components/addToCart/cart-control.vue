<template>
<div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.selectedCount>0" @click.stop="decrease">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.selectedCount>0">{{food.selectedCount}}</div>
    <div class="cart-add icon-add_circle" @click.stop="addToCart"></div>
    
  </div>
</template>
<script>
  const EVENT_ADD = 'add';
  import { setGlobal,getGlobal,removeGlobal } from '../../api'
  export default {
    name: 'mycart',
    props: {
      food: {
        type: Object
      }
    },
    
    data() {
       //必须写一个空的返回值，否则有异常
      return { 
      
      }
         
    },
    
    methods: {
      //（+） 加商品到购物车的动作，所有的非规格商品购物车逻辑的唯一入口
      addToCart(event) {
          //frozen,有定单没有支付，不再允许新增商品至购物车
          if(this.food.active && this.food.active=='frozen'){
          
            this.showMsg(1000,'您目前有定单未处理，请处理定单后再购买')
            return
          }
      
      
          /*
           数据微调即可：
            数量由count变成数组
           (1) 有规格的
           {'id':xx,'name':xx,'image':xxx, 'haslabel':'no', 'selectedCount': xx
              'counts':[ {'label':XX,'symbol':XX,'price':XX,'count':xx},...]
           }
           (2) 无规格
            { 'id':xx,'name':xx,'image':xxx, 'haslabel':'no', 'selectedCount':yy
              'counts':[ {'price':XX,'count':XX}]
           }
          
          */
         
           //针对无规格商品
            if (this.food.selectedCount == 0) {
              this.$set(this.food, 'selectedCount', 1);
              this.food.counts[0].count =1;
             }else {
              this.food.selectedCount++;
              this.food.counts[0].count++;
            }
            this.$emit(EVENT_ADD, event.target) 
           
      },
      decrease() {
        
          if (this.food.selectedCount > 0) {
              this.food.selectedCount--;
              this.food.counts[0].count--;
          }
          
      },
       //消息方法    
       showMsg(ms,msg ) {
         const toast = this.$createToast({
           time: ms,
           txt: msg
         });
         toast.show();
       }
   
    } //end of methods
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
