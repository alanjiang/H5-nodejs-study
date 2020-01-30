<template>

  <div>
   
    <dheader></dheader>
     <div class="tab-wrapper">
      <tab :tabs="tabs"></tab>
    </div>
 </div>
</template>

<script>
import dheader from './header/dian-header';
import tab from './tab/tab'
import Goods from './Goods'
import seller from './seller/seller'
export default {
  name: 'Home',
  data() {
    return {
     tabs: [
            {
            label: '商品',
            component: Goods,
            data:[]
           },
           {
            label: '商家',
            component: seller,
            data:[]
           }]
     }
  },
  
  components: {
      dheader,
      tab,
      Goods,
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
