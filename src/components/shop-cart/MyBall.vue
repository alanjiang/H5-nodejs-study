<template>
  <div>
    <div class="shopcart">
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
      chooseModel: {
        type: String,
        default() {
           return '到店自取'
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
        listFold: this.fold
       
        
      }
    },
    created() {
          this.dropBalls = []
    
    },
    computed: {
 
      totalCount() {
        let count = 0
        this.selectFoods.forEach((food) => {
           food.counts.forEach((fd) =>{
             count += fd.count
           });
        })
        return count
      }
    },
    methods: {
   
       //消息方法    
       showMsg(ms,msg ) {
         const toast = this.$createToast({
           time: ms,
           txt: msg
         });
         toast.show();
       },
      
      toggleList() 
      {
        if (this.listFold) 
        {
          if (!this.totalCount) 
          {
            return
          }
          this.listFold = false
          this._showShopCartList()
          this._showShopCartBall()
        } else 
        {
          this.listFold = true
          this._hideShopCartList()
        }
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
              this._hideShopCartBall()
            },
            hide: () => {
              this.listFold = true
            },
            add: (el) => {
              this.ShopCartBallComp.drop(el)
            }
          }
        })
        this.shopCartListComp.show()
      },
      _showShopCartBall() {
        //alert('=>MyCart _showShopCartBall() this.chooseModel='+this.chooseModel);
        this.ShopCartBallComp = this.ShopCartBallComp || this.$createShopCartBall({
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
        this.ShopCartBallComp.show()
      },
      _hideShopCartList() {
        const list = this.sticky ? this.$parent.list : this.shopCartListComp
        list.hide && list.hide()
      },
      _hideShopCartBall() {
        this.ShopCartBallComp.hide()
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
