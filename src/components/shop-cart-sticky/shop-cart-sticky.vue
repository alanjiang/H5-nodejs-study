<template>
  <div class="shop-cart-sticky" v-show="visible">
    
    <myCart 
      ref="shopCart"
      :selectFoods="selectFoods"
      :delivery_set="delivery_set"  
      :min_delivery_price="min_delivery_price" 
      :max_delivery_distance="max_delivery_distance"
      :chooseModel="chooseModel"
      :fold="fold"
      :sticky=true
      :eventstatus="eventstatus"
      :orderPrice="orderPrice"
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
      delivery_set: {
        type: Number,
        default() {
          return 1
        }
      },
      min_delivery_price: {
        type: Number,
        default() {
          return 0
        }
      },
      max_delivery_distance: {
        type: Number,
        default() {
          return 0
        }
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
         componetKey: 0,
         chooseModel: '',
         eventstatus: 1,
         orderPrice: 0
      } 
    },
    created() {
          this.dropBalls = []
          
          
          
    },
    
    methods: {
     //reset(this.chooseModel,this.eventstatus, this.orderPrice);
      reset(v1,v2,v3){
      
       this.chooseModel = v1;
       this.eventstatus= v2;
       this.orderPrice=v3;
      },
      calcCount (col){
        var count = 0;
        col.forEach((t)=>{
           count += t.count;
        });
        return count;
      },
      drop(el) {
        this.$refs.shopCart.drop(el)
      }
    
    },
    
   
    components: {
      myCart
    }
  }
</script>

<style lang="stylus" scoped>
  .shop-cart-sticky
    position: fixed
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
</style>
