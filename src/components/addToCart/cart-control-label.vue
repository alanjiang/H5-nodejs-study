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
<!--  cart-control-label 仅在 shop-cart-list.vue中使用，处理有规格的商品 -->
<script>
  const EVENT_ADD = 'add';
  const EVENT_REMOVE = 'remove';
  export default {
    name: 'mycartlabel',
    props: {
      food: {
        type: Object
      }
    },
    
    data() {
    
        return {}  
    },
    
  
    methods: {
      //（+） 加商品到购物车的动作，所有的非规格商品购物车逻辑的唯一入口
      addToCart(event) {
          //frozen,有定单没有支付，不再允许新增商品至购物车
          if(this.food.active && this.food.active=='frozen'){
          
            this.showMsg(1000,'您目前有定单未处理，请处理定单后再购买')
            return
          }
            //将事件冒泡给cart-control-list.vue 组件
            this.$emit(EVENT_ADD, event.target)
            
            this.$bus.emit('openAttr',this.food);
      
      },
      decrease(event) {
          //将事件冒泡给cart-control-list.vue 组件
          this.$emit(EVENT_REMOVE, event.target)
         
          this.$bus.emit('openAttr',this.food);
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
