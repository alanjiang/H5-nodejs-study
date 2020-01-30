<template>
  <div class="shop-cart-sticky" v-show="visible">
    <myCart
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
    methods: {
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
    position: absolute
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
</style>
