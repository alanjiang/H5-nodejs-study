<template>
  <transition
    name="move"
    @after-leave="afterLeave"
  >
    <div class="my" v-show="visible">
    
      <cube-scroll ref="scroll">
        <div class="my-content">
         
            <img src="../../assets/user.jpg" >
           
            
            <div class="left">
              <div class="title">
                 白天不懂夜的黑
              </div>
              <div class="title-small">
                 会员号：13926003676
              </div>
              <div class="score">
                 <span class="score-caption">累积积分</span>  <span class="score-value">10</span>
              </div>
              <div class="title-small-s">
                  微信用户
              </div>
            </div>
          
         
        </div>
        <div class="order">
        <cube-scroll ref="scroll2">
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
              <span class="status-caption">当前订单状态</span> <span class="status"> 已付款 </span>
          </div>
          
          <div class="caption">
             
              <div class="mer-left">
                 <img  class="mer-img" src="../../assets/dish.jpg">
                 <span class="mer-detail">
                  <span class="mer-name">蕃茄炒蛋(大份，有机食品,质量是可靠，放心使用)</span>
                   <span class="mer-num">数量: 1</span>
                 </span>
              </div>
              <div class="mer-right">
                 ¥42
              </div> 
              
          </div>
          <div class="split"> </div>
          <div class="caption">
             
              <div class="mer-left">
                 <img  class="mer-img" src="../../assets/dish.jpg">
                 <span class="mer-detail">
                  <span class="mer-name">蕃茄炒蛋(大份，有机食品,质量是可靠，放心使用)</span>
                   <span class="mer-num">数量: 1</span>
                 </span>
              </div>
              <div class="mer-right">
                ¥42
              </div> 
             
          </div>
           <div class="split"> </div>
          <div class="caption">
             
              <div class="mer-left">
                 <img  class="mer-img" src="../../assets/dish.jpg">
                 <span class="mer-detail">
                  <span class="mer-name">蕃茄炒蛋(大份，有机食品,质量是可靠，放心使用)</span>
                   <span class="mer-num">数量: 1</span>
                 </span>
              </div>
              <div class="mer-right">
                ¥42
              </div> 
              
          </div>
          <div class="split"> </div>
          <div class="caption">
             
              <div class="mer-left">
                 <img  class="mer-img" src="../../assets/dish.jpg">
                 <span class="mer-detail">
                  <span class="mer-name">蕃茄炒蛋(大份，有机食品,质量是可靠，放心使用)</span>
                   <span class="mer-num">数量: 1</span>
                 </span>
              </div>
              <div class="mer-right">
                ¥6212342.50
              </div> 
              
          </div>
          
          <div class="caption-right">
            <span class="total-price">
             
               共4份 &nbsp;&nbsp;小计¥235.00
          
            </span>
          </div>
          
          <div class="split-dashed"> </div>
          <div class="dianxiaoer">
             <img  class="dianxiaoer-img" src="../../assets/dianxiaoer.jpeg">
             <span class="dianxiaoer-msg"> 
             
              <span class="msg">客官请耐心等待，店小二正在火速上菜中... </span>
             
             </span>
          </div>
          
        </cube-scroll>   
        </div>
        
        
      </cube-scroll>
        
        <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
       </div> 
    </div>
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
      message: {
        type:String
      }
    },
    
    data() {
      return {
        message:'Hello dian!'
        
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
    background-image:url(assets/bg01.jpg)
    background-repeat: repeat
    background-position: 0 0
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
