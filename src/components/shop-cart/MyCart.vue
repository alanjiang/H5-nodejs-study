<template>
  <div>
    <div class="shopcart" ref="cart">
      <div class="content" >
        <div class="content-left">
          <div class="logo-wrapper" @click="toggleList">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">
              <bubble :num="totalCount"></bubble>
            </div>
           
          </div>
          
          
          <div class="price" v-show="eventstatus==1" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="price"  v-show="eventstatus==2" :class="{'highlight':true}">￥{{orderPrice}}</div>
          
          <div class="desc" @click="showChooseModel">
              {{ chooseModel}}
          </div>
        </div>
        <div  class="content-right" > 
           
         <div  v-show="eventstatus==2"   class="pay" :class="payClass"   @click="pay">
             {{payDesc}}
          </div>
          <div  v-show="eventstatus==1" class="pay" :class="payClass"  @click="order_make">
            {{payDesc}}
          </div>
           
         
          
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball,index) in balls" :key="index">
          <transition
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {makeOrder} from   '../../api'
  import Bubble from '../bubble/bubble'
  const BALL_LEN = 10
  const innerClsHook = 'inner-hook'

  function createBalls() {
    let balls = []
    for (let i = 0; i < BALL_LEN; i++) {
      balls.push({show: false})
    }
    return balls
  }

  export default {
    name: 'mycart',
    props: {
      //当前订单中的商品
      
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      
      delivery_set: {
        type: Number,
        default() {
          return 1
        }
      },
      min_delivery_price: {
        type: Number,
        default() {
          return 0
        }
      },
      max_delivery_distance: {
        type: Number,
        default() {
          return 0
        }
      },
     
      sticky: {
        type: Boolean,
        default: false
      },
      fold: {
        type: Boolean,
        default: true
      }
      
      
    },
   
    data() {
      return {
        balls: createBalls(),
        listFold: this.fold,
        isSubmit: false,
        chooseModel:'到店自取',
        orderPrice: 0, 
        eventstatus: 1
      }
      
    },
    created() {
          this.dropBalls = []
          this.$on('show', () => {
            this.$nextTick(() => {
             this.$refs.cart.refresh()
          })
      })
    },
    computed: {
      
      
      comsumpData(){
        
         if(this.delivery_set == 2 && this.min_delivery_price ){
            return [{'type':1,'content':'到店自取'},{'type':2,'content':'外卖配送','min_delivery_price':this.min_delivery_price,'max_delivery_distance':this.max_delivery_distance}]
         }
         return [{'type':1,'content':'到店自取'}]
         
      
      },
     
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
           
           food.counts.forEach((fd) =>{
              total += Number((fd.count*fd.price).toFixed(2));
           });
          
        })
        return total.toFixed(2);
      },
      totalCount() {
        let count = 0
        this.selectFoods.forEach((food) => {
           food.counts.forEach((fd) =>{
             count += fd.count
           });
        })
        return count
      },
      
      
      
      
      payDesc() {
          if(this.eventstatus == 2){
               return '去支付'
          }
          if( !(this.delivery_set == 2 && this.min_delivery_price && this.chooseModel == '外卖配送')){
             return '去下单'
          }
           if (this.model == '到店自取' ){
             return '去下单'
          }
          if (this.totalPrice === 0) {
             return `￥${this.min_delivery_price}元起送`
          } else if (this.totalPrice < this.min_delivery_price) {
            let diff = (this.min_delivery_price - this.totalPrice).toFixed(2)
            return `还差￥${diff}元起送`
          } else {
            if(this.eventstatus == 1){
               return '去下单'
            }
            
           
          }
        
      },
      payClass() {
        
        if(this.eventstatus == 1)
        {
        
             if (!this.totalCount) 
             {
                return 'not-enough'
             } else 
             {
               return 'enough'
             }
        } 
        if(this.eventstatus == 2)
        {
             return 'pay-btn'
        } 
        
        
       
      }
    },
    methods: {
    
     calOrderPrice (orderFoods) {
           let total = 0
           orderFoods.forEach((food) => {
           
           food.counts.forEach((fd) =>{
              total += Number((fd.count*fd.price).toFixed(2));
           });
          
        })
        
        return total.toFixed(2);
      },
    
    
     preOrder() {
          
          //商家支持外卖
          if( this.delivery_set == 2 && this.min_delivery_price){
              if(this.chooseModel == '外卖配送')//用户选取配送
              {
                 let diff = this.totalPrice-this.min_delivery_price
                 if (diff >= 0){ 
                    return true; //可以提交订单
                 }
                 return false;
              }else { //用户未选取配送
                 
                  return true; //到店自取没有限制条件
              }
          }else{ //商家没有设置送，或者配送参数没有设置
             return true;
          }
          
          
      },
    
     showChooseModel () {
       
        if (this.delivery_set == 2 && this.min_delivery_price){
           this.showDelivery();
        }
        
     
     },
      // 弹出到店还是外卖提示
      showDelivery() {
      this.$createActionSheet({
        title: '消费选择',
        data: this.comsumpData,
        onSelect: (item, index) => {
            //props 中的数据无法修改
            this.chooseModel =  item.content;
            //同步Goods.vue
            this.$bus.emit('chooseModelChange', item.content);
            
           
        },
        onCancel: () => {
           
        }
      }).show()
    
    },
  
  
       //消息方法    
       showMsg(ms,msg ) {
         const toast = this.$createToast({
           time: ms,
           txt: msg
         });
         toast.show();
       },
      
      toggleList() {
        if (this.listFold) {
          if (!this.totalCount) {
            return
          }
          this.listFold = false
          this._showShopCartList()
          this._showShopCartSticky()
        } else {
          this.listFold = true
          this._hideShopCartList()
        }
      },
      pay (e) {
      
         this.showMsg(1000,'地址没有设置');
         //order, this.orderFoods,this.data.chooseModel,'mycart'
         this.$bus.emit('openMe', {}, [],this.chooseModel,'pay');//4个参数,pay: 已处于付款阶段
      
      },
      //下单操作 {id, name, image, unit, symbol, label, count, price}
      order_make(e) {
        if(!this.preOrder()){ //未达到下单的条件
           return false;
        }
        console.log('=>购物车数据:'+JSON.stringify(this.selectFoods));
        if (this.selectFoods.length == 0){
           this.showMsg(1000,'您尚未购挑选商品' ) 
           return false;
        }
        
        
        var datas = [];
        this.selectFoods.forEach((t)=> {
           
           t.counts.forEach((m)=>{
            
             if(m.symbol)
             {
               var mer = {'id':t.id,'name':t.name,'image':t.image, 'unit': t.unit, 'symbol': t.symbol,'label':t.label, 'count': m.count, 'price': m.price } 
               datas.push(mer)             
             }else{
                var mer = {'id':t.id,'name':t.name,'image':t.image, 'unit': t.unit, 'count': m.count, 'price': m.price } 
                datas.push(mer) 
             }
             
           
           });
           
        });
        var bean = {'mers': datas};
        this.isSubmit = true;
         //开始提交订单
         makeOrder(bean).then((res) => {
           
           if(res.status != 200){
             this.showMsg(1000,'==>服务器请求未响应，请检查网络环境<==');
             return false;
           }else{
             if(res.data.resCode=='999999'){
                this.showMsg(1000,'登陆超时，请重新扫码登录');
                return false;
             }else if(res.data.resCode=='0'){
                this.showMsg(1000,'下单成功');
                
                var order = res.data.order;//id,shopid,member_id,order_no ,req_time,order_status,total_price,unionid,type 
                //{'selectFoods':this.selectFoods,'order': order } 呈现给用户
                var orderFoods = []
                this.selectFoods.forEach((fd)=>{
                     orderFoods.push(fd);
                });
                 this.orderPrice = this.calOrderPrice (orderFoods);
                
                 this.selectFoods = [] //清空当前购物车
                
                 this.eventstatus=2;
                 
                 this.$bus.emit('openMe', order, orderFoods, this.chooseModel,'mycart');//3个参数
                
                 //	将数据传给 Goods.vue,my.vue
                
                
             }else{
             
                this.showMsg(1000,res.data.resMsg);
                return false;
             }
         }
       });
        e.stopPropagation()
        
      },
      
      getOrder () { //JSON = {"id":id,"total_price":total_price}
      
        
      
         //开始提交订单
         getOrderDetail(bean).then((res) => {
           
           if(res.status != 200){
             this.showMsg(1000,'服务器请求未响应，请检查网络环境');
             return false;
           }else{
             if(res.data.resCode=='999999'){
                this.showMsg(1000,'登陆超时，请重新扫码登录');
                return false;
             }else if(res.data.resCode=='0'){
                
             }else{
             
                this.showMsg(1000,res.data.resMsg);
                return false;
             }
         }
       });
      
      
      
      },
      //cart-control向购物车加商品触发
      drop(el) {
        //alert('=>MyCart drop this.chooseModel='+this.chooseModel);
        for (let i = 0; i < this.balls.length; i++) {
          const ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeDrop(el) {
       
        //object HTMLDivElement]
        const ball = this.dropBalls[this.dropBalls.length - 1]
        const rect = ball.el.getBoundingClientRect()
        
        const x = rect.left - 32
        const y = -(window.innerHeight - rect.top - 22)
        el.style.display = ''
        el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
      },
      dropping(el, done) {
        this._reflow = document.body.offsetHeight
        el.style.transform = el.style.webkitTransform = `translate3d(0,0,0)`
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`
        el.addEventListener('transitionend', done)
      },
      afterDrop(el) {
        const ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      _showShopCartList() {
        this.shopCartListComp = this.shopCartListComp || this.$createShopCartList({
          $props: {
            selectFoods: 'selectFoods'
          },
          $events: {
            leave: () => {
              this._hideShopCartSticky()
            },
            hide: () => {
              this.listFold = true
            },
            add: (el) => {
              this.shopCartStickyComp.drop(el)
            }
          }
        })
        this.shopCartListComp.show()
      },
      _showShopCartSticky() {
        //alert('=>MyCart _showShopCartSticky() this.chooseModel='+this.chooseModel);
        this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectFoods',
            delivery_set: 'delivery_set',
            min_delivery_price: 'min_delivery_price',
            max_delivery_distance: 'max_delivery_distance',
            chooseModel: this.chooseModel,
            orderPrice:  this.orderPrice,
            eventstatus: this.eventstatus,
            fold: 'listFold',
            list: this.shopCartListComp
          }
        })
        this.shopCartStickyComp.show()
      },
      _hideShopCartList() {
        const list = this.sticky ? this.$parent.list : this.shopCartListComp
        list.hide && list.hide()
      },
      _hideShopCartSticky() {
        this.shopCartStickyComp.hide()
      }
    },
    watch: {
      fold(newVal) {
        this.listFold = newVal
      },
      totalCount(count) {
        if (!this.fold && count === 0) {
          this._hideShopCartList()
        }
      },
      chooseModel:{//深度监听，可监听到对象、数组的变化
         handler(newVal, oldVal){
             //alert('--watch: chooseModel:'+this.chooseModel);
             //alert('newVal:'+newVal+',oldVal:'+oldVal);
         },
         deep:true //true 深度监听
      }
      
    },
    components: {
      Bubble
    }
    
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin"
  @import "../../common/stylus/variable"
  .shopcart
    height: 100%
    .content
      display: flex
      background: $color-background
      font-size: 0
      color: $color-light-grey
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: $color-background
         
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: $color-dark-grey
            &.highlight
              background: $color-blue
            .icon-shopping_cart
              line-height: 44px
              font-size: $fontsize-large-xxx
              color: $color-light-grey
              &.highlight
                color: $color-white
          .num
            position: absolute
            top: 0
            right: 0
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-weight: 700
          font-size: $fontsize-large
          &.highlight
            color: $color-white
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          text-align: center
          font-size: $fontsize-small
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-weight: 700
          font-size: $fontsize-small
          &.not-enough
            background: $color-dark-grey
          &.enough
            background: $color-green
            color: $color-white
          &.pay-btn
            background: $color-red
            color: $color-white
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $color-blue
          transition: all 0.4s linear
</style>
