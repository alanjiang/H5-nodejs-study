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
                  <addcart @add="onAdd" :food="food"></addcart>
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
  
   <div class="shop-cart-wrapper">
      <mycart
        ref="shopCart" :key="componentKey"
        :selectFoods="selectFoods"> </mycart>
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
  
  components: {
      Bubble,
      addcart,
      mycart 
    },
   
  data () {
    return {
       goods:[],
       selectedFood: {},
       default() {
          return {}
       },
       scrollOptions: {
          click: false,
          directionLockThreshold: 0
        },
       shopCartStickyComp: null,
       componentKey: 0
      
    }
  },
  
  computed: {
      
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
     
     
      
    // 更新集合[ {'type':'','items':[ {id,name,...count},...{..}]}, ... ]中的items集合对象中的count属性
    resetFoods(selectedFood){
    
         
          //this.selectedFood = selectedFood;
        
          this.goods.forEach(good => {
          var mers = good.mers;//这个为规格商品的保留项
          var foods = good.items;
          var type = good.type
          var name = good.type
          //重置good.mers集合中商品的count属性
          for (var i=0;i<mers.length;i++){
       
             if (selectedFood.symbol){ //同步过来的对象
                    
                    if (( selectedFood.id ==  mers[i].id ) && (selectedFood.symbol ==  mers[i].symbol) ) 
                    {
                         console.log('** symbol='+selectedFood.symbol+',label='+selectedFood.label+' ,更新前数量为:'+mers[i].count);
                         mers[i].symbol = selectedFood.symbol;
                         mers[i].label = selectedFood.label;
                         mers[i].attr_price = selectedFood.attr_price;
                        if ( mers[i].count){
                              if(selectedFood.flag == 'add'){
                                mers[i].count += 1;
                              }else{
                                 if(mers[i].count > 0){
                                     mers[i].count--;
                                     
                                 }
                              }
                        }else{ //购物车还没有的新规格
                             mers[i].count = 1;
                        }
                        
                         console.log('** symbol='+selectedFood.symbol+',label='+selectedFood.label+' ,数量更新为:'+mers[i].count);
                       
                         break;
                    }
                 
             }else //无规格
             {
                   if (selectedFood.id ==  mers[i].id ){
                      
                      if (mers[i].count){
                         mers[i].count = selectedFood.count;
                      } else {
                      
                           mers[i].count =1 ;
                      }
                       console.log('** 无规格 id:'+selectedFood.id+','+mers[i].count);  
                      break;
                  }
                 
             }
             
          } // 结束循环 mers 
          
           
            good.mers = mers;
           
            
        });
        
         
        
          this.resetSelectFoods();
          //删除集合中数量为0的元素
          this.selectFoods.splice(this.selectFoods.findIndex(item => item.count == 0), 1);
     
          if(this.shopCartStickyComp){
             this.shopCartStickyComp.update(this.selectFoods);
          }
          
          this.$refs.shopCart.updateSelectFoods(this.selectFoods);
         
          this.componentKey++;
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
                          
                           var m = {'id':item.id, 'name': item.name,'sort': item.sort,'image':item.image, 'haslabel':'','counts':[], 'selectedCount':0};          
                
                           if (item.mer_attr_price.length > 0 ){//有规格商品
                              m.haslabel = 'yes';
                              m.price_span = item.price_span;
                              m.attrs = item.attrs;
                              m.mer_attr_price = item.mer_attr_price;
                              item.mer_attr_price.forEach(t => {
                                 item.label = t.label;
                                 item.attr_price = t.price; //用mer_attr_price中的价格
                                 item.symbol = t.symbol;
                                 m.counts.push({'price':item.price,'label':item.label,'price':item.price,'symbol':item.symbol,'count':0});
                                 
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
              
              console.log(JSON.stringify(this.goods));
             
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
        this.showShopCartSticky()
      },
      selectFood(food) {
      
        if( !food.attrs || food.attrs.length == 0){
          this.selectedFood = food
          this.showFood()
          this.showShopCartSticky()  
          
            
        }
        else{
        
          this.selectedFood = food
          this.showAttr()
          this.showShopCartSticky()
        
        }
        
        
        
        
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
              
              this.shopCartStickyComp.drop(target)
            },
            leave: (fd) => {
              
              this.hideShopCartSticky()
              //this.selectedFood = fd;
              // 仅仅让componentKey自增即可解决。
              
              this.componentKey++;
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
      
      
      
      
      
   },
   
   created() {
     
      this._getShopMers()
      //cart-control-label.vue中的 openAttr事件
      this.$bus.on('openAttr', (val) => {
               
             this.selectAttr(val);
                
       });
       
  
     
    }
    
    /*
    watch: {
      selectFoods(newValue) {
         
          alert('=>selectFoods new value:'+newValue);
        
       },
       goods(newValue) {
         
          alert('=>goods new value:'+newValue);
        
       }
       
    },
    */
      
   
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
