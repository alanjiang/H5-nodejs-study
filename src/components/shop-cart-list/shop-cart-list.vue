<template>
  <transition name="fade" appear>
    <cube-popup
      :mask-closable=true
      v-show="visible"
      @mask-click="maskClick"
      position="bottom"
      type="shop-cart-list"
      :z-index=90
    >
      <transition
        name="move"
        appear
        @after-leave="afterLeave"
      >
        <div v-if="visible">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <cube-scroll class="list-content" ref="listContent">
            <ul>
           
              <li
                class="food"
                v-for="(food,index) in selectFoods"
                :key="index"
              >
              
               <!-- 无规格显示 -->
               <div v-if="food.haslabel == 'no'">
                  <span class="name">{{food.name}}</span>
                  <span class ="label"></span>
                  <div class="price">
                    <span>￥{{showTotalPrice(food)}}</span>
                   </div>
                  <div class="cart-control-wrapper">
                     <mycart @add="onAdd" :food="food"></mycart>
                   </div>
               </div>
               
               <!-- 有规格显示 -->
               <div v-else>
                  <span class="name">{{food.name}}</span>
                  <span class ="label"> 
                    {{ showLabel(food) }}
                  </span>
                  <div class="price">
                    <span>￥ {{ showTotalPrice(food) }}</span>
                   </div>
                  <div class="cart-control-wrapper">
                     
                     <mycartlabel @add="notify" @remove="notify"  :food="food"></mycartlabel>
                   </div>
               </div>
               
               
               
              </li>
            </ul>
          </cube-scroll>
        </div>
      </transition>
    </cube-popup>
  </transition>
</template>

<script>
  import mycart from '../addToCart/cart-control'
  import mycartlabel from '../addToCart/cart-control-label'
  import popupMixin from '../../common/mixins/popup'

  const EVENT_SHOW = 'show'
  const EVENT_ADD = 'add'
  const EVENT_LEAVE = 'leave'

  export default {
    name: 'shop-cart-list',
    mixins: [popupMixin],
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      }
    },
    created() {
      this.$on(EVENT_SHOW, () => {
        this.$nextTick(() => {
         
             this.$refs.listContent.refresh()
          
          
        })
      })
    },
    methods: {
      //有规格组件cart-control-label.vue, add 事件处理
      notify (target) {
         
           this.hide();
      },
      // 有规格商品显示
      showLabel( food ){
          
         var str = '';
         food.counts.forEach((item)=>{
             if(item.count>0){
              str = str+item.label.split(':')[1]+'x'+item.count+' '
             }
             
         
         });
          
          return str;
         
      }, 
      
     
       // 有规格商品显示
      showTotalPrice( food ){
          
         var price = 0;
         food.counts.forEach((item)=>{
             if(item.count>0){
                price = Number((item.count*item.price).toFixed(2));
             }
            
         
         });
          
          return price.toFixed(2);
         
      }, 
      
      
      
      
      
      onAdd(target) {
        this.$emit(EVENT_ADD, target)
      },
      afterLeave() {
        this.$emit(EVENT_LEAVE)
      },
      maskClick() {
        this.hide()
      },
      empty() {
        this.dialogComp = this.$createDialog({
          type: 'confirm',
          content: '清空购物车？',
          $events: {
            confirm: () => {
              this.selectFoods.forEach((food) => {
                food.selectedCount = 0
                if(food.haslabel=='yes'){//有规格的商品counts中的数量清空
                    var num = food.counts.length;
                    for (var i=0; i<num; i++){
                    
                      food.counts[i].count == 0; 
                    
                    }
                }
              })
              this.hide()
            }
          }
        })
        this.dialogComp.show()
      }
    },
    components: {
       mycart,
       mycartlabel 
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  .cube-shop-cart-list
    bottom: 48px
    &.fade-enter, &.fade-leave-active
      opacity: 0
    &.fade-enter-active, &.fade-leave-active
      transition: all .3s ease-in-out
    .move-enter, .move-leave-active
      transform: translate3d(0, 100%, 0)
    .move-enter-active, .move-leave-active
      transition: all .3s ease-in-out
    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background: $color-background-ssss
      display: flex
      flex-direction: row
      .title
        width: 200px
        font-size: $fontsize-medium
        color: $color-dark-grey
        margin-right: auto
      .empty
        
        font-size: $fontsize-small
        color: $color-blue

    .list-content
      padding: 0 18px
      max-height: 217px
      overflow: hidden
      background: $color-white
      
      .food
        position: relative
        padding: 12px 0
        box-sizing: border-box
        display: flex
        flex-direction: row
        .name
          line-height: auto
          font-size: $fontsize-small
          color: $color-dark-grey
          width: 100px
          word-wrap:break-word
          padding: 2px 5px
          display: inline-block
        .label
          line-height: auto
          font-size: $fontsize-small-ss
          color: $color-dark-orange
          width: 120px
          word-wrap:break-word
          padding: 2px 5px
          display: inline-block
        .price
          line-height: auto
          font-weight: 700
          font-size: $fontsize-medium
          color: $color-red
          width: 120px
          margin-right: auto
          word-wrap:break-word
          padding: 2px 5px
          display: inline-block
        .cart-control-wrapper
          display: inline-block
          position: absolute
          right: 0
          bottom: 6px

</style>
