<template>
  <div class="goods">
  <div class="scroll-nav-wrapper">
    <cube-scroll-nav  :side="true" >
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
          :key="good.type"
          :label="good.type"
          :title="good.type"
        >
          <ul>
            <li
              v-for="food in good.items"
              :key="food.id"
              class="food-item"
            >
                                         
              <div class="icon"  v-if="food.haslabel=='no'">
                <img width="57" height="57" :src="food.image" @click="selectFood(food)">
              </div>
              
        
              <div class="icon" v-else>
                <img width="57" height="57" :src="food.image" @click="selectAttr(food)">
              </div>
          
             
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">DDDD</p>
                <div class="extra">
                  <span class="count">月售12份</span><span>好评率89%</span>
                </div>
                <div class="price">
                  <span class="now" v-if="food.price_span">
                  ￥{{ food.price_span }}
                  </span>
                  <span class="now" v-else>
                  ￥{{ food.counts[0].price }}
                  </span>
                  
                  
                </div>
                
                
                <div class="cart-control-wrapper" v-if="food.haslabel=='no'">
                  <addcart @add="onAdd"  :food="food"></addcart>
                </div>
                 <div class="cart-control-wrapper" v-else>
                   <div class="cartcontrol">
                   <div class="cart-decrease" v-show="food.selectedCount>0" @click="selectAttr(food)">
                     <span class="inner icon-remove_circle_outline"></span>
                   </div>
                   <div class="cart-count" v-show="food.selectedCount>0">{{food.selectedCount}}</div>
                    <div class="cart-add icon-add_circle" @click="selectAttr(food)"></div>
                  </div>
                 </div>
                
                
                
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
     
    </cube-scroll-nav>
  </div>
  
   <!-- :key="componentKey" -->
   <div class="shop-cart-wrapper">
      <mycart
        ref="shopCart" 
        :selectFoods="selectFoods" 
        :delivery_set="delivery_set"  
        :min_delivery_price="min_delivery_price" 
        :max_delivery_distance="max_delivery_distance"
        :chooseModel="chooseModel"
        :eventstatus="eventstatus"
        :orderPrice="orderPrice" > </mycart>
    </div>
    
 </div>
</template>

<script>
import { getShopMers } from '../api'
import addcart from './addToCart/cart-control'
import mycart from './shop-cart/MyCart'
import Bubble from './bubble/bubble'

export default {
  name: 'Goods',
  props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
  components: {
      Bubble,
      addcart,
      mycart 
    },
   
  data () {
    return {
      
       order: {},
       selectedFood: {},
       default() {
          return {}
       },
       scrollOptions: {
          click: false,
          directionLockThreshold: 0
        },
       // start 需要动态变更的数据，props中只存放静态数据
        orderPrice: 0,
        chooseModel:'到店自取',
        eventstatus: 1,
        orderFoods: [],
        //end 需要动态变更的数据，props中只存放静态数据
        componentKey: 0,
        myComp: undefined,
        shopCartStickyComp: undefined,
        foodComp: undefined,
        attrComp: undefined,
        shopCartBallComp: undefined
     }
  },
  
  computed: {
      // 从 Home.vue绑定过来的属性
      member_authen () {
        return this.data.member_authen
      },
      delivery_set () {
      
        return this.data.delivery_set
      }, 
      
      min_delivery_price () {
      
        return this.data.min_delivery_price
      }, 
      
      max_delivery_distance () {
      
        return this.data.max_delivery_distance
      }, 
    
      goods() { //商品由 Home.vue页面传给子组件 Goods.vue
        return this.data.goods
      },
      selectFoods() {
        console.log('=>selectFoods 自动刷新<=');
        let foods = []  // 商品选中后,count属性累加
        // 商品选中后,count属性累加
         this.goods.forEach((good) => {
           good.items.forEach((food) => { 
             if (food.selectedCount > 0) {
                foods.push(food)
              }
          });
        });
       
        return foods;
      },
     
      
      
      barTxts() {
        let txts = []
        //按类型 
        this.goods.forEach((good) => {
          var items = good.items;

          var type = good.type
          var name = good.type
          
          let count = 0
          items.forEach((food) => {
            count += food.selectedCount 
       
          });
           txts.push({
            type,
            name,
            count
          });
        });
        return txts;
      }
    },
  
  
  
  methods: {
    calOrderPrice (orderFoods) {
           let total = 0
           orderFoods.forEach((food) => {
           
           food.counts.forEach((fd) =>{
              total += Number((fd.count*fd.price).toFixed(2));
           });
          
           });
       
        return total.toFixed(2);
      },
    //不允许新增商品 
    freezeFoods()
    {
       this.goods.forEach((good) => {
           good.items.forEach((food) => { 
              food.active='frozen'
          });
        });
    
    
    },
    
    unfreezeFoods()
    {
       this.goods.forEach((good) => {
           good.items.forEach((food) => { 
              food.active='active'
          });
        });
    
    
    },
     //将购物车清空 
     clearCart () {
     
      this.goods.forEach((good) => {
           good.items.forEach((food) => { 
             if (food.selectedCount > 0) {
                
                food.selectedCount=0;
                var size = food.counts.length;
                for(var i=0 ; i< size; i++ ){
                  food.counts[i].count = 0; 
                }
              }
          });
        });
     
     },
     caclCount(col){
           var count = 0;
           col.forEach((food) => {
             count += food.count
          });
          return count;
      },
     buy (food) {
       
       this.selectedFood = food;
       var target = {"_prevClass":"cart-add icon-add_circle"};
       this.$refs.shopCart.drop(target)
       this.selectAttr(food);
     
     },
     
     resetSelectFoods() {

        // 只负责商品数量的更新
         this.goods.forEach((good) => {
           good.mers.forEach((food) => { //good.mers: 为规格商品保留
             if (food.count && food.count > 0) {
             
                if(food.symbol){
                   var t =  this.selectFoods.find(t=>t.symbol == food.symbol && t.id == food.id);
                   if(!t){
                      this.selectFoods.push(food);
                   }else{
                      t.count = food.count;
                   }
                   
                }else{
                   var t = this.selectFoods.find(t=> t.id == food.id);
                   if(!t){
                     this.selectFoods.push(food);
                   }else{
                      t.count = food.count;
                   }
                }
               
              } // food.count > 0 才放入selectFoods集合中
          });
        });
          this.componentKey += 1;
      },
     

    _getShopMers(){
       
        getShopMers({
          shopid: 2299
        }).then((res) => {
          
           if(res.status != 200){
             
             this.showMsg(1000,'==>服务器请求未响应，请检查网络环境<==');
             return false;
           }
          
           //console.log(JSON.stringify(res.data));
           var result =  res.data 
           var sorts = []
           if (result.resCode == '0'){
              var items  = result.items;
              items.forEach(item=>{
             
                //console.log('=>item symbol:'+item.symbol);
             
                sorts.push(item.sort);
              });
                            
              let types = new Set(sorts)
             
              var mers = [] 
              types.forEach(type => {
                 mers.push({"type":type,"items":[]});
              });
               //所有的商品遍历,items: 所有的商品列表, mers: [{"type":xx,"items":[],"mers":[]},...]
              items.forEach(item=>{
                   //按商品种类Map遍历Map<k:sort,v:[]>
                   for( var i = 0; i <mers.length; i++){
                       var mer = mers[i];
                        
                       
                       if (item.sort == mer.type){
                          
                           var m = {'id':item.id, 'name': item.name,'sort': item.sort,'image':item.image, 'haslabel':'','counts':[], 'selectedCount':0,'unit':item.unit};          
                
                           if (item.mer_attr_price.length > 0 ){//有规格商品
                              m.haslabel = 'yes';
                              m.price_span = item.price_span;
                              m.attrs = item.attrs;
                              m.mer_attr_price = item.mer_attr_price;
                              item.mer_attr_price.forEach(t => {
                                 item.label = t.label;
                                 item.price = t.price; //用mer_attr_price中的价格
                                 item.symbol = t.symbol;
                                 m.counts.push({'price':item.price,'label':item.label,'symbol':item.symbol,'count':0});
                                 
                               });
                           }else{//没有规格的商品
                                m.haslabel = 'no';
                                m.counts.push({'price':item.price,'count':0});
                             
                           }
                            mer.items.push(m); 
                            break;
                       }//end of item.sort == mer.type
                     
                   }// end of mers for 
                  
              });// 完成对mers更新
                 
              this.goods = mers;
              
              
              if( result.member_authen  ){
                  this.$emit('syncHead',result.member_authen,result.shop);
                  
                  //alert('==>Goods事件已发出<==');
              }
             
              
              
             
           }else{
              this.showMsg(1000,result.resMsg);
              
           }    
            
        })
      
      },
     
      //消息方法    
       showMsg(ms,msg ) {
         const toast = this.$createToast({
           time: ms,
           txt: msg
         });
         toast.show();
       },
      
       //规格窗口
      selectAttr(food) {
        this.selectedFood = food
        this.showAttr()
        this.showShopCartBall()
      },
      //无规格商品才会使用
      selectFood(food) {
          this.selectedFood = food
          this.showFood()
          this.showShopCartBall()
      },
      //food.vue中的addFoold事件,this.$emit(EVENT_ADD, target)
      //监听 cart-controll.vue中的事件
      onAdd (target) { //不执行具体的逻辑
           
         
          this.$refs.shopCart.drop(target)
         
      },
      
      
      
      showAttr() {
        this.attrComp = this.attrComp || this.$createAttr({
          $props: {
            food: 'selectedFood',
            selectFoods:'selectFoods' //传入购物车数据
          },
          $events: {
            add: (target) => {
              
              this.shopCartBallComp.drop(target)
            },
            leave: (fd) => {
              
              this.hideShopCartBall()
              // 仅仅让componentKey自增即可解决。
              //this.componentKey++;
            }
          }
        })
        this.attrComp.show()
      },
      //createAPI
       showFood() {
        this.foodComp = this.foodComp || this.$createFood({
          $props: {
            food: 'selectedFood'
          },
          $events: {
            add: (target) => {
              this.shopCartBallComp.drop(target)
              
            },
            leave: () => {
              this.hideShopCartBall()
            }
          }
        })
        this.foodComp.show()
      },
      /*
      showShopCartSticky() {
        this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectFoods',
            fold: true,
            delivery_set: 'delivery_set',
            min_delivery_price: 'min_delivery_price',
            max_delivery_distance: 'max_delivery_distance'
           
           
          }
        })
       
        this.shopCartStickyComp.show()
       
       
      },
      hideShopCartSticky() {
        this.shopCartStickyComp.hide()
      },
      */
      
      showShopCartBall() {
        this.shopCartBallComp = this.shopCartBallComp || this.$createShopCartBall({
          $props: {
            selectFoods: 'selectFoods',
            fold: true
            
           
           
          }
        })
        this.shopCartBallComp.show()
      },
      hideShopCartBall() {
        this.shopCartBallComp.hide()
      },
      
     
      //start 我当前的订单 , //order, this.orderFoods,this.chooseModel,'mycart'
      showMe (order,orderFoods,chooseModel,flag) {
      
     
       this.closeOtherWin(); //关闭有可能打开的窗口
       this.myComp = this.myComp || this.$createMy({
          $props: {
             member_authen: this.member_authen,
             order: this.order,
             foods: this.orderFoods,
             chooseModel: this.chooseModel
   
          },
          $events: {
            
            leave: () => {
              
                this.hideShopCartBall();
            }
          }
        })
        this.myComp.show()
        
        this.showShopCartBall();
        
       
      
      
      },
      
      //end 我当前的订单
      closeOtherWin () {
      
         if(this.myComp) // close my.vue
         {
          this.myComp.hide()
          this.myComp = undefined
         }
         if(this.shopCartBallComp) //close shop-cart-ball.vue
         {
           this.shopCartBallComp.hide()
           this.shopCartBallComp=undefined
         }
         
         if(this.foodComp) // food.vue
         {
            this.foodComp.hide()
            this.foodComp=undefined
         }
        
         if(this.attrComp) // attr.vue
         {
            this.attrComp.hide()
            this.attrComp=undefined
         }
        
      } //end of 关闭相关窗口
      
   },
   
   created() {
     
     
      //cart-control-label.vue中的 openAttr事件
      this.$bus.on('openAttr', (val) => {
               
             this.selectAttr(val);
                
       });
       //order, this.orderFoods,this.chooseModel,'mycart'
       this.$bus.on('openMe', (v1,v2,v3,v4) => {
       if (v1.id ){
          this.order = v1;
       }
       if(v2 && v2.length > 0){
           this.orderFoods = v2
           this.orderPrice = this.calOrderPrice(v2);
       }     
        if(v4 == 'mycart'){ //下了新订单
                this.eventstatus=2
                this.clearCart();
                this.freezeFoods();
               
        } 
         //打开 my.vue窗口
         this.showMe(v1,v2,v3,v4);
        
  
                
       });
       //消费模式选择, MyCart.vue 
       this.$bus.on('chooseModelChange', (val) => {
               
               this.chooseModel = val;
              
                
       });
       
       
      

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
    .shop-cart-wrapper
      position: absolute
      left: 0
      bottom: 0
      z-index: 200
      width: 100%
      height: 48px
      
      
  
</style>
