<template>
  <div class="shop-cart-sticky" v-show="visible">
    
    <myBall 
      ref="shopBall"
      :selectFoods="selectFoods"
      :fold="fold"
      :sticky=true
      
    >
    </myBall>
  </div>
</template>

<script>
  import myBall from '../shop-cart/MyBall'
  import popupMixin from '../../common/mixins/popup'

  export default {
    name: 'shop-cart-ball',
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
         count: this.calcCount(this.selectFoods)
         
      } 
    },
    created() {
          this.dropBalls = []
         
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
        this.$refs.shopBall.drop(el)
      }
    
    },
    
   
    components: {
      myBall
    }
  }
</script>

<style lang="stylus" scoped>
  .shop-cart-sticky
    position: fixed
    left: 0
    bottom: 0
    z-index: 999
    width: 48px
    height: 48px
</style>
