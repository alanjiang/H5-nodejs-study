<template>
  <transition
    name="move"
    @after-leave="afterLeave"
  >
    <div class="food" v-show="visible">
      <cube-scroll ref="scroll" click="true">
        <div class="food-content" >
        
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div> <!-- end of class="image-header" -->
          
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <!-- start of  规格  -->
            <div class="detail">
            <div  v-for="(attr,index1) in food.attrs" :key="index1">
                 
                  <span class="scall"> {{attr.attr_key}} </span>
                  <ul>
                     <li v-for="(item,index) in attr.attr_values"  class="label"  :key="index"
                         :class="{label_active: index1 == 0 ? selected1 == index : selected2 == index}"  @click="index1 == 0 ? chooseItem1(index,item.attr_id):chooseItem2(index,item.attr_id)" >
                        {{ item.attr_value }}  
                     </li> 
                   </ul>
            </div>
            </div>
            <!-- end of  规格  -->
            <div class="price">
            
               <div v-if="valid">
                 <span class="now">￥{{ this.price }} /{{food.unit}} </span>
                  <span class="now">所选规格:{{this.label}}  </span>
                  <span class="select">购买数量：{{ getCount(this.symbol) }}   </span>
                  
               </div>
              
               <span class="now" v-else>￥ {{ food.price_span }}/{{food.unit}}  </span>
               
               
            </div>
            
             <div class="cart-control-wrapper">
              <!-- +,- 购物车增加、移除商品组件, 监听 cart-control中发出的事件 -->
              <addcartlabel @add="addFood"  @remove="removeFood" :food="food"></addcartlabel>
            </div>
           
            
           
          </div> <!-- end of class="content" --> 
          
          
         
          <div class="info" v-show="food.description">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.description}}</p>
          </div>
          
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <rating-select
              @select="onSelect"
              @toggle="onToggle"
              :selectType="selectType"
              :onlyContent="onlyContent"
              :ratings="ratings">
            </rating-select>
            <div class="rating-wrapper">
              <ul v-show="computedRatings && computedRatings.length">
                <li
                  v-for="(rating,index) in computedRatings"
                  class="rating-item border-bottom-1px"
                  :key="index"
                >
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                  </div>
                  <div class="time">{{format(rating.rateTime)}}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!computedRatings || !computedRatings.length">暂无评价</div>
            </div>
          </div>
        </div>
      </cube-scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import moment from 'moment'
  import addcartlabel from '../addToCart/cart-control-label'
  import RatingSelect from '../rating-select/rating-select'
  import Split from '../split/split'
  import ratingMixin from '../../common/mixins/rating'
  import popupMixin from '../../common/mixins/popup'
  import ratingsData from '../../datas/ratings_list.json'
  const ratings = ratingsData.ratings
  const EVENT_SHOW = 'show'
  const EVENT_ADD = 'add'
  const EVENT_LEAVE = 'leave'
  export default {
    name: 'attr',
    mixins: [ratingMixin, popupMixin],
    props: {
      food: {
        type: Object
      },
      selectFoods:{
        type: Array
        
      }
    },
    data() {
      return {
        desc: {
          all: '全部',positive: '推荐',negative: '吐槽'
          }, 
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
          total_price: null,
          valid: false
          
        }
       
    },
    computed: {
      ratings() {
        return this.food.ratings
      }
    },
    created() {
      this.$on(EVENT_SHOW, () => {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      })
    },
    methods: {
    
    
       
      getCount(symbol){
         console.log('symbol='+symbol);
         console.log(JSON.stringify(this.food.counts));
         var cur = this.food.counts.find((t)=>t.symbol == symbol);
         if(cur){
           
           //console.log(JSON.stringify(cur));
           return cur.count;
         }
         return 0;
      },
      afterLeave() {
        //用户离开后，清理规格的选择值
        this.selected1 = -1 ;
        this.selected2 = -1 ;
        this.attr_id1 = null;
        this.attr_id2 = null;
        this.price_span = null;
        this.total_price = null;
        this.valid = false;
        //返回时继续同步商品给Goods.vue
        //this.$emit(EVENT_LEAVE,this.food);
        
        
      },
      
      addFood(target) { 
         
         if(!this.judgeAttrComplete()){
           return;
         }
           
           this.food.symbol = this.symbol;
           this.food.label = this.label;
           this.food.attr_price = this.price;
           this.food.count = 1;
           var idx = -1;
           this.food.counts.forEach((curr,index,arr)=> {
              if(curr.symbol == this.symbol){
                 idx = index;
              }
            });
           
           
           if (idx == -1){
               this.showMsg(1000,'规格有问题' ); //始终不会发生
               return false;
           }
           //数量更新
           this.food.counts[idx].count = this.food.counts[idx].count+1;
           this.food.selectedCount =  this.food.selectedCount+1;
           
           this.$emit(EVENT_ADD, target);
           
        
      },
      removeFood(event){
           if(!this.judgeAttrComplete()){
              return;
           }
           this.food.symbol = this.symbol;
           this.food.label = this.label;
           this.food.attr_price = this.price;
           this.food.count = 1;
           var idx = -1;
           this.food.counts.forEach((curr,index,arr)=> {
              if(curr.symbol == this.symbol){
                 idx = index;
              }
            });
           
          
           if (idx == -1){
               this.showMsg(1000,'规格有问题' ); //始终不会发生
               return false;
           }
           //数量更新
           if(this.food.counts[idx].count > 0){
              this.food.counts[idx].count = this.food.counts[idx].count-1;
              this.food.selectedCount =  this.food.selectedCount-1;
           }
           
           
            
      
      },
      format(time) {
        return moment(time).format('YYYY-MM-DD hh:mm')
      },
      
        //规格有二维时，点击不分先后
        //选取规格，及时调整单价、总价和库存,规格一维点击了
        chooseItem1(index,attr_id){
           this.attr_id1=attr_id;
           this.selected1=index;
           
          if(this.food.attrs.length == 2){
            
             
            //二维已经选择了，需要计算价格,修复当用户先选择二维再选择一维时价格不变的BUG
             if(this.attr_id2 != null ){
                 
                 var target=this.food.mer_attr_price.find(item=> {
                 var s1=this.attr_id1+','+this.attr_id2;
                 var s2=this.attr_id2+','+this.attr_id1;
                 if( s1 == item.symbol  || s2 == item.symbol){
                     
                     return true;
                  }});
                  if(target != null){
                     var attr_name = this.food.attrs[0].attr_values.find(t=> t.attr_id == this.attr_id1)['attr_value']+':'+ this.food.attrs[1].attr_values.find(t=> t.attr_id == this.attr_id2)['attr_value']; 
                     
                     this.price=target.price;
                     this.remain=target.num;
                     this.symbol=target.symbol;
                     this.label = attr_name;
                     this.valid = true;
                 }
             }
             
              
          } 
          if(this.food.attrs.length == 1){
             
             var attr_name = this.food.attrs[0].attr_values.find(t=> t.attr_id == this.attr_id1)['attr_value'];
             
            
             //[{"attr_key":"份量","attr_key_en":"fenliang","attr_values":[{"attr_id":4696,"attr_value":"大份"},{"attr_id":4698,"attr_value":"小份"}]}]
            
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
                  this.valid = true;
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
      
      judgeAttrComplete() {
                if(this.food.attrs.length == 2 ){
                  if(this.attr_id1 ==null  || this.attr_id2 == null){
                       this.showMsg(1000,'规格没有全面选择' )
                       this.valid = false;
                       return false;
                  }
               }
               if(this.food.attrs.length == 1){
                   if(this.attr_id1 == null){
                     this.showMsg(1000,'规格没有选择' );
                     this.valid = false;
                     return false;
                     
                  }
               }
               this.valid = true;
              
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
       
    },

     components: {
      addcartlabel,
      RatingSelect,
      Split
      }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin.styl"
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: $color-white
    &.move-enter-active, &.move-leave-active
      transition: all 0.3s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: $fontsize-large-xx
          color: $color-white
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: $fontsize-medium
        font-weight: 700
        color: $color-dark-grey
      .detail
        width: 100%
        height: auto
        min-height: 25px
        padding: 3px 5px
        .scall
          font-size: $fontsize-small
          font-weight: 700
          color:  $color-orange
          margin-right: 12px
          height: 25px
          padding: 5px 5px
      ul
            padding: 2px 2px
            display: flex
            flex-direction: row
            .label, .label_active
              min-width: 90px
              width: auto
              height: 20px
              padding-top:2px
              text-align: center
              display: inline-block
              list-style:none
              cursor:pointer
              border-radius: 10px
              color: #000
              font-size: $fontsize-small
              margin-right: 8px
              background-color:$color-orange-opacity 
            li:hover
                 border: 1px solid red
                 border-radius: 10px
                 background-color:$color-orange
            .label_active
                 color:red
                 border:1px solid red
                 border-radius: 10px
                 background-color:$color-orange
                
      .price
        line-height: 24px
        font-weight: 700
        display: flex
        flex-direction: column
        .now
          font-size: 14px
          color: $color-red
          display: block
        .select
          display: block
          font-size: $fontsize-small-s
          color: $color-light-grey
      .cart-control-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: $fontsize-small-s
        color: $color-white
        background: $color-blue
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.3s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: $fontsize-medium
        color: $color-dark-grey
      .text
        line-height: 24px
        padding: 0 8px
        font-size: $fontsize-small
        color: $color-grey
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: $fontsize-medium
        color: $color-dark-grey
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          &:last-child
            border-none()
          .user
            position: absolute
            right: 0
            top: 16px
            display: flex
            align-items: center
            line-height: 12px
            .name
              margin-right: 6px
              font-size: $fontsize-small-s
              color: $color-light-grey
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: $fontsize-small-s
            color: $color-light-grey
          .text
            line-height: 16px
            font-size: $fontsize-small
            color: $color-dark-grey
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: $fontsize-small
            .icon-thumb_up
              color: $color-blue
            .icon-thumb_down
              color: $color-light-grey
        .no-rating
          padding: 16px 0
          font-size: $fontsize-small
          color: $color-light-grey
</style>