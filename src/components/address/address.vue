<template>
  <cube-scroll class="address-list" :options="addressScrollOptions">
    <div class="seller-content">
      <div class="overview">
          <div class="btn-control">
            <cube-button :primary="true" @click="newAddress">新增地址</cube-button>
            
          </div>
          <ul>
            <li v-for="address in datas" :key="address.id" >
             <div class="title" @click="showAction(address)">
                <span v-if="address.default_set==true" class="choice">
                   <img  src="../../assets/address_default.png">
                </span>
                <span class="choice" v-else>
                  
                </span>
                <span class="name"> {{ address.name }} </span>
                <span class="mobile"> {{ address.mobile }} </span>
                
                
                
             </div>
             
             <div class="address-control">
                
             
                 <span class="address" @click="showAction(address)"> {{address.province}}{{ address.city }}{{ address.district}}{{ address.detail }}</span>
                 
                 <span class="default" @click="showAddress(address)">
                   <img src="../../assets/edit.gif" >
                  </span>
                 
             </div>
            
            </li>
          </ul>
      </div>
    </div>
  </cube-scroll>
</template>

<script>
  import { getAddresses,setDefaultAddress,delAddress } from '../../api'
  import star from '../star/star'
  export default {
    name:'address',
    data() {
      return {
        updated: false,
        addressScrollOptions: {
          directionLockThreshold: 0,
          click: true
        },
        
        datas:[],
        selectedAddress: {}
      }
    },
    created() {
        this.$bus.on('close',(val)=>{
           //重新更新一下集合
           this.fetchAddress();
        
        });
       
      
    },
    methods: {
    
     //删除当前地址
      _delAddress (ad) {
      
        delAddress({'id':ad.id}).then((res) => {
           if(res.status != 200){
             this.showMsg(1000,'==>服务器请求未响应，请检查网络环境<==');
             return false;
           }else
           {
              if(res.data.resCode == '999999')
              {
                 this.showMsg(1000,'登录超时，请重新扫码' );
                 return false;
              }else if(res.data.resCode == '0')
              {
                 this.showMsg(1000,'操作成功');
                 this.fetchAddress() ;
              }else
              {
              
                 this.showMsg(1000,res.data.resMsg );
                 return false;
              }
          }
        
        });
      
      
      },
    
    
      
      //当前地址设置为默认
      _setDefaultAddress (ad) {
         var bean = {'id': ad.id}
        setDefaultAddress(bean).then((res) => {
           if(res.status != 200){
             this.showMsg(1000,'==>服务器请求未响应，请检查网络环境<==');
             return false;
           }else
           {
              if(res.data.resCode == '999999')
              {
                 this.showMsg(1000,'登录超时，请重新扫码' );
                 return false;
              }else if(res.data.resCode == '0')
              {
                 this.showMsg(1000,'操作成功');
                 this.fetchAddress() ;
              }else
              {
              
                 this.showMsg(1000,res.data.resMsg );
                 return false;
              }
          }
        
        });
      
      
      },
      
      
      
      //获取地址列表
      fetchAddress() {
     
         getAddresses({}).then((res) => {
           
           if(res.status != 200){
             this.showMsg(1000,'==>服务器请求未响应，请检查网络环境<==');
             return false;
           }else
           {
              if(res.data.resCode == '999999'){
                 this.showMsg(1000,'登录超时，请重新扫码' );
              }else if(res.data.resCode == '0')
              {
                 this.datas=[]
                 
                 res.data.addresses.forEach(t=>{
                    if(t.default_set == 2) {
                       t.default_set=true;
                    }else{
                      t.default_set=false;
                    }
                    t.area = t.province+t.city+t.district;
                    this.datas.push(t);
                });
              }else{
                this.showMsg(1000, res.data.resMsg );
              
              }
           }
       });   
         
      
      },
      
      showAction (ad) {
      
       
      this.$createActionSheet({
        title: '请选择需要的操作',
        active: 0,
        data: [
          {
            content: '修改',
            type:'edit'
          },
          {
            content: '删除',
            type:'del'
          },
          {
            content: '设置为默认地址',
            type:'default'
          }
        ],
        onSelect: (item, index) => {
           
            if(item.type == 'default'){
            
               this._setDefaultAddress(ad);
            }
            if(item.type == 'del'){
            
               this._delAddress(ad);
            }
            if(item.type == 'edit'){
            
                this.showAddress(ad);
            }
           
          
        },
        onCancel: () => {
          this.$createToast({
            txt: '操作已取消',
            type: 'warn',
            time: 1000
          }).show()
        }
      }).show()
    },
   showAddress(ad) {
       
       this.selectedAddress = ad;
       this.selectedAddress.area=ad.province+ad.city+ad.district;
       this.addressDialogComp = this.addressDialogComp || this.$createAddressDialog({
          $props: {
            address: 'selectedAddress'
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
  
      },
      
       newAddress () {
          const default_address = {'name':'','mobile':'', 'province':'','city':'','district':'', 'detail':'','default_set':false, 'area':''};
          this.showAddress(default_address);
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
      
      star
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  
  .address-list
    height: 100%
    
    background-color: $color-thick-gray
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
                 cursor: hand
                 display: inline-block
                 font-size: $fontsize-medium
                 color: $color-light-grey-s
                 vertical-align: middle
                 .img
                   width: 24px
                   heigth:24px
</style>
