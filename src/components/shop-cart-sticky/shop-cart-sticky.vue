<template>
  <div class="shop-cart-sticky" v-show="visible">
    
    <myCart :key="componetKey"
      ref="shopCart"
      :selectFoods="selectFoods"
      :fold="fold"
      :sticky=true
    >
    </myCart>
  </div>
</template>

<script>
  import myCart from '../shop-cart/MyCart'
  import popupMixin from '../../common/mixins/popup'

  export default {
    name: 'shop-cart-sticky',
    mixins: [popupMixin],
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      fold: {
        type: Boolean,
        default: true
      },
      list: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    
    data () {
      return {
         count: this.calcCount(this.selectFoods),
         componetKey: 0
      } 
    },
    methods: {
    
      calcCount (col){
        var count = 0;
        col.forEach((t)=>{
           count += t.count;
        });
        return count;
      },
      drop(el) {
        this.$refs.shopCart.drop(el)
      },
      update (selectFoods) {
           
           this.selectFoods = selectFoods;
          
           this.componetKey++; // :key 强制更新组件
      }
    },
    
    created() {
    
      
    
    },
    components: {
      myCart
    }
  }
</script>

<style lang="stylus" scoped>
  .shop-cart-sticky
    position: absolute
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
</style>
