<template>

  <div>
   
    <dheader :member_authen="member_authen" :shop="shop" ></dheader>
     <div class="tab-wrapper">
      <tab :tabs="tabs"></tab>
    </div>
 </div>
</template>

<script>
import { getShopMers } from '../api'
import dheader from './header/dian-header';
import tab from './tab/tab'
import Goods from './Goods'
import address from './address/address'
import seller from './seller/seller'
export default {
  name: 'Home',
  data() {
    return {
       goods:[], //Goods.vue 使用 
       member_authen: {}, // dian-header.vue  使用 
       shop: {} // dian-header.vue 使用 
    }
     
  },
  computed: {
    tabs() {
       return [
            {
            label: '商品',
            component: Goods,
            data:{
               goods: this.goods
            }
           },
           {
             label: '地址簿',
             component: address,
             data:[]
           },
           {
              label: '商家',
              component: seller,
              data:[]
           }]
    } 

  }, 
  created () {
  
    this._getShopMers();
  
  },
  
  
  methods:{
   //消息方法    
   showMsg(ms,msg ) {
         const toast = this.$createToast({
           time: ms,
           txt: msg
         });
         toast.show();
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
                          
                           var m = {'id':item.id, 'name': item.name,'sort': item.sort,'image':item.image, 'haslabel':'','counts':[], 'selectedCount':0,'unit':item.unit};          
                
                           if (item.mer_attr_price.length > 0 ){//有规格商品
                              m.haslabel = 'yes';
                              m.price_span = item.price_span;
                              m.attrs = item.attrs;
                              m.mer_attr_price = item.mer_attr_price;
                              item.mer_attr_price.forEach(t => {
                                 item.label = t.label;
                                 item.price = t.price; //用mer_attr_price中的价格
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
              
               
              if( result.member_authen  ){ //存储在local避免频繁验证
                  this.member_authen = result.member_authen;
                  localStorage.setItem("member_authen",JSON.stringify(result.member_authen));
              }
              if( result.shop  ){
                  this.shop = result.shop;
                  localStorage.setItem("shop",JSON.stringify(result.shop));
              }
              
              console.log(JSON.stringify(this.goods));
              
             
           }else{
              this.showMsg(1000,result.resMsg);
              
           }    
            
        })
      
      }// 结束商品列表请求
      
      
      
  
  },
  components: {
      dheader,
      tab,
      Goods,
      address,
      seller
      
    }
}
</script>


<style lang="stylus" scoped>

.tab-wrapper
      position: fixed
      top: 136px
      left: 0
      right: 0
      bottom: 0

</style>
