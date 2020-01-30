<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
       <img src="http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114"  width="60" height="60">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">点了么</span>
        </div>
        <div class="description">
         专注点餐收银整体解决方案提供商
        </div>
        
        <div class="support">
          
          <span class="text">扫码点餐、外卖</span>
        </div>
        
      </div>
     
     
     
     
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-title"></span><span class="bulletin-text">123</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background" >
   
      <img src="http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114" width="100%" height="100%">
    </div>
     <div class="my-account">
         <div class="avatar">
           <img src="../../assets/user.jpg" width="45" height="45" @click.stop="showMe">
         </div>
         <span class="my-detail">我的资料<i class="icon-keyboard_arrow_right" @click.stop="showMe"></i></span>
        
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
 
  export default {
    name: 'dheader',
    
    methods: {
     showMe(event) {
        this.myComp = this.myComp || this.$createMy({
          $props: {
            message: 'Hello World'
          },
          $events: {
            add: (target) => {
               alert('add');
            },
            leave: () => {
              this.showMsg(1000,'阁下离开中...')
            }
          }
        })
        this.myComp.show()
      },
      
      showMsg(ms,msg ) {
      const toast = this.$createToast({
        time: ms,
        txt: msg
      })
      toast.show()
    }
      

     }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  
  @import "../../common/stylus/variable"

  .header
    position: relative
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
        margin-right: 16px
        img
          border-radius: 2px
      .content
        flex: 1
        .title
          display: flex
          align-items: center
          margin-bottom: 8px
          .brand
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
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
             border-radius: 15px
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
      height: 28px
      line-height: 28px
      padding: 0 8px
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
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(10px)
</style>
