<template>
  <!-- start 规格专用 -->
  <div class="cartcontrol" v-if="food.symbol">
   
    
      <div class="cart-decrease" v-show="food.count>0" @click.stop="symbol_decrease">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
     
   
   <div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
   
      <div @click.stop="symbol_addToCart" class="cart-add icon-add_circle"></div>
  </div>
   <!-- end 规格专用 -->
   
  <div class="cartcontrol" v-else>
    <transition name="move">
    
      <div class="cart-decrease" v-show="food.count>0" @click.stop="decrease">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
     
    </transition>
   <div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
   
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
    
    data() {
    
        return{
          //start 规格参数
          selected1: -1,
          selected2: -1,
          attr_id1: null,
          attr_id2: null,
          count: 1,
          price: null,
          total_price: 0,
          remain: null,
          product: null,
          symbol: '',
          label:null,
          price_span: null,
          total_price: null
          //end 规格参数
          
      }
    },
    
    
    
    
    methods: {
      //（+） 加商品到购物车的动作，所有的非规格商品购物车逻辑的唯一入口
      addToCart(event) {
          
          if (!this.food.count) {
              this.$set(this.food, 'count', 1)
           } else {
             this.food.count++
          }
         
          this.$emit(EVENT_ADD, event.target)
         
          
      },
      decrease() {
        
          if (this.food.count && this.food.count > 0) {
             this.food.count--;
          }
          
         
      },
       
      //规格的数量由Goods.vue 管理,执行加减法,传对象给shop-cart-list.vue
      symbol_addToCart(event) {
          
          alert('--symbol_addToCart--');
          this.$set(this.food, 'count', 1)
          this.$set(this.food, 'flag', 'add') //减少的标志位
          
          this.$emit('handler', this.food)
          
          
      },
      // //规格的数量由Goods.vue 管理,执行加减法
      symbol_decrease () {
          alert('--symbol_decrease--');
          this.$set(this.food, 'count', 1)
          this.$set(this.food, 'flag', 'cut') //减少的标志位
          this.$emit('handler',this.food);
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
              //直接调用createAPI中窗体控件的方法
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
      },
      // end 商品有规格，显示商品详情页面
      
      //规格有二维时，点击不分先后
        //选取规格，及时调整单价、总价和库存,规格一维点击了
        chooseItem1(index,attr_id){
           this.attr_id1=attr_id;
           this.selected1=index;
           
          if(this.food.attrs.length == 2){
             var attr_name = this.food.attrs[0].attr_value+' '+this.food.attrs[1].attr_value;
            //二维已经选择了，需要计算价格,修复当用户先选择二维再选择一维时价格不变的BUG
             if(this.attr_id2 != null ){
                 
                 var target=this.food.mer_attr_price.find(item=> {
                 var s1=this.attr_id1+','+this.attr_id2;
                 var s2=this.attr_id2+','+this.attr_id1;
                 if( s1 == item.symbol  || s2 == item.symbol){
                     return true;
                  }});
                  if(target != null){
                     this.price=target.price;
                     this.remain=target.num;
                     this.symbol=target.symbol;
                     this.label = attr_name;
                 }
             }
             
              
          } 
          if(this.food.attrs.length == 1){
             var attr_name = this.food.attrs[0].attr_value;
             var target=this.food.mer_attr_price.find(item=> {
               if( attr_id == item.symbol ){
                  return true;
                }
            });
             
             if(target != null){
                  this.price=target.price;
                  this.remain=target.num;
                  this.symbol=target.symbol;
                  this.label = attr_name;
             }
             
             
          } 
          
            this.total_price=this.price*this.count;
            // start 价格区间更新为最终的价格
            if(this.food.attrs.length == 2 ){
                  if(this.attr_id1 != null  && this.attr_id2 != null){
                	  this.price_span = this.price;
                	  
                  }
             }
            if(this.food.attrs.length == 1){
                   if(this.attr_id1 !=null){
                     this.price_span = this.price;
                    
                  }
             }
             // end 价格区间更新为最终的价格  
        
        },
        
        //规格二维点击了
        chooseItem2(index,attr_id){ 
         this.attr_id2=attr_id;
         this.selected2=index;
         if(this.attr_id1 == null ) return;
         var target=this.food.mer_attr_price.find(item=> {
             var s1=this.attr_id1+','+this.attr_id2;
             var s2=this.attr_id2+','+this.attr_id1;
             if( s1 == item.symbol  || s2 == item.symbol){
                 
                  return true;
             }});
        if(target != null ){
           this.price=target.price;
           this.remain=target.num;
           this.symbol=target.symbol;
         }  
         this.total_price=this.price*this.count;
       
           // start 价格区间更新为最终的价格
            if(this.food.attrs.length == 2 ){
                  if(this.attr_id1 != null  && this.attr_id2 != null){
                	  this.price_span = this.price;
                	  this.food.price_span =  this.price;
                  }
             }
            if(this.food.attrs.length == 1){
                   if(this.attr_id1 != null){
                     this.price_span = this.price;
                     this.food.price_span =  this.price;
                  }
             }
             // end 价格区间更新为最终的价格  
      },
      
      //有规格就开启attr.vue 窗口 
      judgeAttrComplete() {
      
                if(!this.food.attrs){ //兼容 cart-control.vue中的事件
                   
                   return true;
                }
                if(this.food.attrs.length == 2 ){ //2
                  if(this.attr_id1 ==null  || this.attr_id2 == null){
                       // 调用组件Goods.vue来打开窗口,避免打开多个重叠窗口
                       this.$bus.emit('openAttr',this.food);
                       return false;
                  }
               }
               if(this.food.attrs.length == 1){//1
                   if(this.attr_id1 == null){
                     this.$bus.emit('openAttr',this.food);
                     return false;
                     
                  }
               }
               return true;
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
