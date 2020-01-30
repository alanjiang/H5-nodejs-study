<template>
  <transition
    name="move"
    @after-leave="afterLeave"
  >
    <div class="my" v-show="visible">
    
         <div class="order-current">
             Hello
         </div>
         <div class="order-history">
         
            History Orders
         
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
       
  .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 2px
          font-size: $fontsize-large-xx
          color: $color-dark-orange

 
</style>
