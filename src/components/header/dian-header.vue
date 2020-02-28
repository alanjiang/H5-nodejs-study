<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar" v-if="shop.objectKey">
       <img  :src="shop.objectKey" width="60" height="60">
      </div>
      <div class="avatar" v-else>
       <img  src="../../assets/shop_default.jpg" width="60" height="60">
      </div>
      <div class="content">
        <div class="title">
          
          <span class="name" v-show="shop.shop_name">{{ shop.shop_name }}</span>
        </div>
        <!--
        <div class="description" v-show="shop.objectKey">
         专注点餐收银整体解决方案提供商
        </div>
        -->
        
        <div class="support">
          <span class="text" v-if="shop.delivery_set==2 && shop.min_delivery_price">
              本店支持到店扫码下单、配送 
          </span>
          <span class="text" v-else>
              本店支持扫码下单
          </span>
        </div>
        
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">
        {{ shop.shop_discription }}
      </span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background" v-if="shop.objectKey" >
       <img  :src="shop.objectKey" width="100%" height="100%">
    </div>
     <div class="background" v-else>
        <img src="../../assets/shop_default.jpg" width="100%" height="100%">
     </div>
    
     <div class="my-account">
         <div class="avatar" v-if="member_authen.headimgurl">
           <img :src="member_authen.headimgurl" width="45" height="45" @click.stop="showMe">
         </div>
         <div class="avatar" v-else>
           <img src="../../assets/visit.jpg" width="45" height="45">
         </div>
         
         <span class="my-detail" v-if="member_authen.unionid">我的资料<i class="icon-keyboard_arrow_right" @click.stop="showMe"></i></span>
        
         <span class="my-detail" v-else>访客<i class="icon-keyboard_arrow_right" ></i></span>
        
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
 
  export default {
    name: 'dheader',
     props: {
      member_authen: {
        type: Object,
        default() {
          return {}
        }
      },
      shop: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    

    methods: {
     showMe(event) {
       //Goods.vue统一打开, order, this.orderFoods,this.data.chooseModel,'mycart'
        this.$bus.emit('openMe', {},[],'','header');//order: {} 空的对象
      },
      
      showMsg(ms,msg ) {
        const toast = this.$createToast({
          time: ms,
          txt: msg
        })
        toast.show()
      }
      
       
     },
     
     created() {
       this.$bus.on('syncHead', (member,shop) => {
             //alert('<=receive from Goods.vue=>');
             this.member_authen = member;
             this.shop = shop;
                
       });
    
     }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  
  @import "../../common/stylus/variable"

  .header
    position: fixed
    left: 0
    top: 0
    right: 0
    width: 100%
    overflow: hidden
    color: $color-white
    background: $color-background-ss
    .content-wrapper
      position: relative
      display: flex
      align-items: center
      padding: 24px 12px 18px 24px
      .avatar
        flex: 0 0 64px
        width: 64px
        margin-right: 5px
        img
          border-radius: 50%
      .content
        flex: 1
        .title
          display: flex
          align-items: left
          margin-bottom: 8px
          
          .name
            height: 30px 
            max-width:200px
            overflow: hidden
            margin-left: 6px
            font-size: $fontsize-large
            font-weight: bold
        .description
          margin-bottom: 8px
          line-height: 12px
          font-size: $fontsize-small
        .support
          display: flex
          align-items: center
          .support-ico
            margin-right: 4px
          .text
            line-height: 12px
            font-size: $fontsize-small-s
    .my-account
        position: absolute
        right: 12px
        bottom: 35px
        display: flex
        flex-direction: column
        align-items:center;
        justify-content:center ;
        width: 60px
        height: 70px
        text-align: center
        .avatar
           width: 45px
           height: 45px
           img
             border-radius: 50%
        .my-detail
          line-height: 12px
          padding: 1px
          font-size: $fontsize-small-s
        .icon-keyboard_arrow_right
         
          line-height: 12px
          font-size: $fontsize-small-s
      .support-count
        position: absolute
        right: 12px
        bottom: 14px
        display: flex
        align-items: center
        padding: 0 8px
        height: 24px
        line-height: 24px
        text-align: center
        border-radius: 14px
        background: $color-background-sss
        .count
          font-size: $fontsize-small-s
        .icon-keyboard_arrow_right
          margin-left: 2px
          line-height: 24px
          font-size: $fontsize-small-s

    .bulletin-wrapper
      position: relative
      display: flex
      align-items: center
      height: 25px
      line-height: 25px
      padding: 0 3px
      background: $color-background-sss
      .bulletin-title
        flex: 0 0 22px
        width: 22px
        height: 12px
        margin-right: 4px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        flex: 1
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        font-size: $fontsize-small-s
      .icon-keyboard_arrow_right
        flex: 0 0 10px
        width: 10px
        font-size: $fontsize-small-s
      .icon-keyboard_arrow_right
        flex: 0 0 10px
        width: 10px
        font-size: $fontsize-small-s
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(10px)
</style>
