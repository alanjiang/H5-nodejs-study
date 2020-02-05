<template>
  <transition
    name="move"
    @after-leave="afterLeave"
  >
    <div class="my" v-show="visible">
    
         <div class="order-current">
             为您呈上近期三个月内在本门店的消费定单
         </div>
         <div class="order-history">
         
            <div class="order-detail">
             
                <a href="#" class="title"> 订单号：201909011209120986 </a>
                <span class="price"> ¥126.00</span>
                 <span class="status">已付款</span>
                 
            </div>
            <div class="split"></div>
            
             <div class="order-detail">
             
                <span class="title"> 订单号：202001011209120909</span>
                <span class="price"> ¥312.00</span>
                 <span class="status">已付款</span>
            
            </div>
            
         
         </div>
    
    
      
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
    name: 'history',
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
    
    &.move-enter-active, &.move-leave-active
      transition: all 0.3s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    
    .order-current
      
      position:absolute
      top:10px
      left:0.2em
      right:0.2em
      
      padding:5px
      padding-top: 20px
      background-color:$color-white
      border-radius: 10px 
      height:60px
      
    .order-history
      position:absolute
      top:110px
      left:0.2em
      right:0.2em
      bottom:10px
      padding:5px
      background-color:$color-white
      border-radius: 10px
      .order-detail
      
        position: relative
        padding: 5px 15px
        display: flex
        flex-direction: row
        vertical-align: middle
        .title
          width:150px
          height:45px
          display: inline-block
          font-size: $fontsize-medium
          color: $color-dark-grey
        .price
           height:45px
           margin-right:auto
           display: inline-block
           font-size: $fontsize-medium
           color: $color-light-grey
        .status
          height:45px
          display: inline-block
          font-size: $fontsize-large
          color: $color-dark-orange 
          
  .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 2px
          font-size: $fontsize-large-xx
          color: $color-dark-orange

 .split
      height:1px
      margin-left:10px
      margin-right:10px
      border-bottom: 1px dashed #F2F2F2
</style>
