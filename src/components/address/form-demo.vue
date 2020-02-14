<template>
  <cube-scroll class="address-list" :options="addressScrollOptions">
    <div class="seller-content">
      <div class="overview">
          <div class="btn-control">
            <cube-button :primary="true" @click="showAddress">新增地址</cube-button>
            
          </div>
          <ul>
            <li v-for="(item,index) in datas" :key="index">
             <div class="title">
                <span v-if="item.default_set==2" class="choice">
                   <img  src="../../assets/address_default.png">
                </span>
                <span class="choice" v-else >
                  
                </span>
                <span class="name"> {{ item.name }} </span>
                <span class="mobile"> {{ item.mobile }} </span>
                
                
                
             </div>
             
             <div class="address-control">
                
             
                 <span class="address"> {{ item.address }} </span>
                 
                 <span class="default">
                   <img src="../../assets/edit.gif">
                  </span>
                 
             </div>
            
            </li>
          </ul>
      </div>
    </div>
  </cube-scroll>
</template>

<script>

  import star from '../star/star'
  export default {
    name:'address',
    data() {
      return {
        favorite: false,
        addressScrollOptions: {
          directionLockThreshold: 0,
          click: false
        },
        
        datas:[]
       
      }
    },
    created() {
      
       this.datas.push({'name':'张三','mobile':'13926003676', 'address':'广东省广州市荔湾区3201号','default_set':2});
       this.datas.push({'name':'王五','mobile':'13926003676', 'address':'广东省广州市荔湾区3201号','default_set':1});
       this.datas.push({'name':'赵六','mobile':'13926003676', 'address':'广东省广州市荔湾区3201号','default_set':1});
       this.datas.push({'name':'李四','mobile':'13926003676', 'address':'广东省广州市荔湾区3201号','default_set':1});
       this.datas.push({'name':'郭军','mobile':'13926003676', 'address':'广东省广州市荔湾区中国人民解放军第三家属招待所西门2000座3201号','default_set':1});
       this.datas.push({'name':'欧阳青云','mobile':'13926003676', 'address':'广东省广州市荔湾区3201号','default_set':1});
       
      
    },
    methods: {
      showAddress () {
      
       this.addressDialogComp = this.addressDialogComp || this.$createAddressDialog({
          $props: {
            message: 'Hello World'
          },
          $events: {
            add: (target) => {
               
            },
            leave: () => {
              this.showMsg(1000,'阁下离开中...')
            }
          }
        })
        this.addressDialogComp.show()
      
      
      
      }
    },
    components: {
      
      star
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  
  .address-list
    height: 100%
    
    background-color: $coloe-thick-gray
    .overview
      position: relative
      padding: 3px
      .btn-control
        text-align:center
        height:60px
        
      ul
        padding: 0
        list-style: none
        display: flex
        flex-direction: column
        li
          text-align: left
          padding-top: 5px
          text-decoration: none
          
          display:flex
          flex-direction: column
          background-color: $color-white
          border-radius: 5px
          margin-bottom: 3px
          
          .title
            display: flex
            flex-direction: row
            padding: 10px
            margin-bottom:3px
            box-sizing: border-box
            vertical-align: middle
            .choice 
                  display: inline-block
                  maring-right: 5px
                  vertical-align: middle
                  width: 30px
                  height: 25px
                  img
                    width: 24px
                    height: 24px
            .name
              padding-top: 4px
              display: inline-block
              font-size: $fontsize-large
              color: $color-light-grey
              width: 120px
              vertical-align: middle
            .mobile
              padding-top: 4px
              display: inline-block
              font-size: $fontsize-medium
              color: $color-light-grey
              vertical-align: middle 
          .address-control
               vertical-align: middle
               position: relative
               box-sizing: border-box
               width: 100%
               display: flex
               flex-direction: row
               padding: 3px
              
               flex-wrap: wrap
               font-size: 0
               
                   
               .address
                 vertical-align: middle
                 max-width:90%
                 text-align: left
                 display: inline-block
                 font-size: $fontsize-small
                 color: $color-grey
                 height: 25px
                 margin-right: auto
                 overflow: hidden 
                 
                 text-overflow: ellipsis
                 
                 
               .default
                 height:25px
                 width: 25px
                 display: inline-block
                 font-size: $fontsize-medium
                 color: $color-light-grey-s
                 vertical-align: middle
                 .img
                   width: 24px
                   heigth:24px
</style>
