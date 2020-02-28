<template>
  <transition
    name="move"
    @after-leave="afterLeave"
  >
    <div class="my" v-show="visible">
  
      <cube-scroll ref="scroll">
        <div class="my-content" >
            <img :src="member_authen.headimgurl" >
            <div class="left">
              <div class="title">
                 {{member_authen.nickname }}
              </div>
              <div class="title-small" v-if="member_authen.mobile">
                 会员号：{{member_authen.mobile }} 
              </div>
               <div class="title-small" v-else>
                 未认证会员
              </div>
              <div class="score">
                 <span class="score-caption">累积积分</span>  <span class="score-value">10</span>
              </div>
              <div class="title-small-s">
                  微信用户
              </div>
            </div> <!-- end of left -->
        </div> <!-- end of my-content -->
        
        <div class="order"> 
        
          <!-- start 配送选择 -->
          <div class="delivery-choose">
            <cube-checker
                       v-model="cm"
                       :options="options"
                       type="radio" />
                       
          </div> 
          <!-- end 配送选择 -->
        <cube-scroll ref="scroll2">
         
         
         <div v-if="order.id"> <!-- start of 订单呈现 -->
          <div class="caption">
           <span class="order-caption">当前订单号</span> <span class="order-no">2020012009086601</span>
          </div>
          <div class="caption">
           <span class="table-caption">桌位号</span> <span class="table-no"> A01桌 </span>
          </div>
          <div class="caption">
           <span class="line-caption"> 取餐号 </span> <span class="line-no"> 61 </span>
          </div>
           <div class="caption">
              <span class="status-caption">当前订单状态</span> 
              <span class="status" v-show="order.order_status == 2"> 已付款 </span>
              <span class="status" v-show="order.order_status == 1">待付款 </span>
          </div>
          
          <div v-for="food in foods">
          <div class="caption" >
             
              <div class="mer-left">
                 <img  class="mer-img" :src="food.image">
                 <span class="mer-detail">
                  <span class="mer-name" v-if="food.label">{{ food.name}} {{ food.label}}</span>
                  <span class="mer-name" v-else>{{ food.name}}</span>
                   <span class="mer-num">数量: {{ food.selectedCount }}</span>
                 </span>
              </div>
              <div class="mer-right">
                 ¥ {{ order.total_price }}
              </div> 
              
          </div>
          <div class="split"> </div>
          </div>
          
          <div class="caption-right">
            <span class="total-price">
               共4份 &nbsp;&nbsp;小计¥ {{order.total_price}}
            </span>
          </div>
          
          <div class="split-dashed"> </div>
          <div class="dianxiaoer">
             <img  class="dianxiaoer-img" src="../../assets/dianxiaoer.jpeg">
             <span class="dianxiaoer-msg"> 
             
              <span class="msg">客官请耐心等待，店小二正在火速上菜中... </span>
             
             </span>
          </div>
        
         </div> <!-- end of 订单呈现 --> 
         
         
         <div v-else class="no-order">
            <img src="../../assets/sad.png">
            
            <span>您当前还没有新定单 </span>
         </div>
          
        </cube-scroll>  
           
        </div> <!-- end of order -->
        
        
      </cube-scroll> <!-- end of  ref="scroll", 最外层 scroll -->
        
        <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
       </div> 
    </div> <!-- end of my -->
  </transition>
</template>

<script type="text/ecmascript-6">
  import popupMixin from '../../common/mixins/popup'
  const EVENT_SHOW = 'show'
  const EVENT_ADD = 'add'
  const EVENT_LEAVE = 'leave'

  export default {
    name: 'my',
    mixins: [popupMixin],
    props: {
      member_authen: {
        type:Object
      },
      
      //当前订单
      order: { 
        type:Object,
        default() {
          return {}
        }
      },
      foods: {
        type: Array,
        default() {
          return []
        }
      },
     chooseModel:{
       type: String,
       default: '到店自取'
     }
    },
    
    data() {
      return {
        cm: this.chooseModel,
        options: [
        {
          value: '到店自取',
          text: '到店自取'
        },
        {
          value: '外卖配送',
          text: '外卖配送'
        }
      ]
        
      }
    },
    
    created() {
      this.$on(EVENT_SHOW, () => {
        this.$nextTick(() => {
           this.$refs.scroll.refresh()
           this.$refs.scroll2.refresh()
        })
      })
    },
    methods: {
      afterLeave() {
        this.$emit(EVENT_LEAVE)
      }
     
    }
    
     
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin.styl"

  .my
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    width: 100%
    background-color: #f6f5ec
    padding:0
    .my-content
       position: absolute
       left:0.1em
       right:0.1em
       top: 5px
       background-color:$color-white
       border-radius: 10px
       height:160px
       img
            position: absolute
            top: 10px
            right: 30px
            width: 100px
            max-width: 100px
            border-radius:50%
       .left
           position: absolute
           top: 10px
           left: 10px
           width: auto
           max-width: 180px
           padding-top:25px
           .title
              word-wrap:break-word
              overflow:auto
              font-size: $fontsize-large
              font-weight: 300
              color: $color-dark-grey
           .title-small
              margin-top:3px
              word-wrap:break-word
              overflow:auto
              padding: 3px
              font-size: 12px
	          color: $color-light-grey-s
          .title-small-s
              margin-top:3px
              word-wrap:break-word
              overflow:auto
              padding: 3px
              font-size: 10px
              color: $color-dark-grey
          .score
             padding: 3px
             .score-caption
               display:inline-block
               font-size:$fontsize-large
               color: $color-dark-grey
             .score-value
               display:inline-block
               font-size: $fontsize-small
               color: $color-light-orange
    .order
       position: absolute
       left:0.1em
       right: 0.1em
       top: 180px
       height:380px
       background-color:$color-white
       border-radius: 10px  
       overflow:scroll
       .delivery-choose
         position:relative
         height: 25px
         padding:3px 3px
         font-size:$fontsize-large
       .no-order
         height: 300px
         display: flex
         flex-direction: column
         justify-content: center
         align-items: center
         font-size: 14px
         color: $color-dark-grey  
       .caption-right
         display: flex
         align-items: flex-end
         .total-price
            font-size: 14px
            display: block
            line-height:20px
            color: $color-dark-grey
            margin-left: auto
            padding: 10px 10px
           
       .caption 
         text-align: left
         display: flex
         flex: 1
         flex-direction:row
         padding-left:10px
         padding-top:5px
         
         .mer-left, .mer-right
            display: flex
            height: 80px
            vertical-align: top
         .mer-left
           margin-right: auto
         .mer-right
            font-size: 12px
            color: red
            padding-right:3px
         .mer-left
            .mer-img
              width: 50px
              height:50px
              display: block
            .mer-detail
               display: flex
               flex-direction: column
               .mer-name
                  
                   word-wrap:break-word
                   height:auto
                   width:200px
                   display: block
                   padding:2px
                   font-size: 13px
                   color: $color-light-grey
                   
               .mer-num
                   height:25px
                   padding:2px
                   display: block
                   font-size: 12px
                   color: $color-light-grey
         .order-caption,.table-caption,.line-caption,.status-caption
            font-size: 14px
            color: $color-dark-grey
           
         .order-caption, .order-no
            display:inline-block
            height:25px
            padding:3px
         .table-caption,.table-no
            display:inline-block
            height:25px
            padding:3px
            
         .line-caption,.line-no
            display:inline-block
            height:20px
            padding:3px
         .status-caption,.status
            display:inline-block
            height:20px
            padding:3px 
         .order-no, .table-no, .line-no, .status
            font-size: 13px
         .order-no
            color: $color-light-grey-s
         .table-no
            color: $color-light-grey-s
         .line-no
            color: $color-orange 
         .status
            color: $color-orange 
      .dianxiaoer
        text-align: left
        padding-bottom:20px
        .dianxiaoer-img
          width: 60px
          height:75px
          display: inline-block
          border-radius: 15px
        .dianxiaoer-msg
          padding-left:10px
          display: inline-block
          color: $color-light-grey
          font-size: $fontsize-small
        .dianxiaoer-img, .dianxiaoer-msg
          vertical-align: middle  
    .split-dashed
      height:1px
      color: gray
      margin-left:10px
      margin-right:10px
      border-bottom: 1px dashed #F2F2F2
      
    .split
      height:1px
      margin-left:10px
      margin-right:10px
      border-bottom: 1px dashed #F2F2F2
      
    &.move-enter-active, &.move-leave-active
      transition: all 0.3s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    
        
  .back
        position: absolute
        top: 10px
        left: 0
        z-index: 100
        .icon-arrow_lift
          display: block
          padding: 2px
          font-size: $fontsize-large-xx
          color: $color-dark-orange

 
</style>
