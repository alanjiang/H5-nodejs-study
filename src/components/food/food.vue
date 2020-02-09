<template>
  <transition
    name="move"
    @after-leave="afterLeave"
  >
    <div class="food" v-show="visible">
      <cube-scroll ref="scroll" click="true">
        <div class="food-content">
        
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div> <!-- end of class="image-header" -->
          
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <!-- start of  规格  -->
            <div class="detail">
            <div  v-for="(attr,index1) in food.attrs">
                 
                  <span class="scall"> {{attr.attr_key}} </span>
                  <ul>
                     <li v-for="(item,index) in attr.attr_values"  class="label"
                         :class="{label_active: index1 == 0 ? selected1 == index : selected2 == index}"  @click="index1 == 0 ? chooseItem1(index,item.attr_id):chooseItem2(index,item.attr_id)" >
                        {{ item.attr_value }}  
                     </li> 
                   </ul>
            </div>
            </div>
            <!-- end of  规格  -->
            <div class="price">
              
               <span class="now" v-else>￥ {{ food.price }} </span>
             
              
            </div>
            <div class="cart-control-wrapper">
              <!-- +,- 购物车增加、移除商品组件, 监听 cart-control中发出的事件 -->
              <addcart @add="addFood" :food="food" ></addcart>
            </div>
            <transition name="fade">
              <div @click="addFirst" class="buy" v-show="!food.count">
                加入购物车
              </div>
            </transition>
          </div> <!-- end of class="content" --> 
          
          
         
          <div class="info" v-show="food.description">
            <h1 class="title">商品信息</h1>
            <p class="text">{{ food.description }}</p>
          </div>
          
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <rating-select
              @select="onSelect"
              @toggle="onToggle"
              :selectType="selectType"
              :onlyContent="onlyContent"
             
              :ratings="ratings">
            </rating-select>
            <div class="rating-wrapper">
              <ul v-show="computedRatings && computedRatings.length">
                <li
                  v-for="(rating,index) in computedRatings"
                  class="rating-item border-bottom-1px"
                  :key="index"
                >
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                  </div>
                  <div class="time">{{format(rating.rateTime)}}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!computedRatings || !computedRatings.length">暂无评价</div>
            </div>
          </div>
        </div>
      </cube-scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import moment from 'moment'
  import addcart from '../addToCart/cart-control'
  import RatingSelect from '../rating-select/rating-select'
  import Split from '../split/split'
  import ratingMixin from '../../common/mixins/rating'
  import popupMixin from '../../common/mixins/popup'
  import ratingsData from '../../datas/ratings_list.json'
  const ratings = ratingsData.ratings
  const EVENT_SHOW = 'show'
  const EVENT_ADD = 'add'
  const EVENT_LEAVE = 'leave'
  export default {
    name: 'food',
    mixins: [ratingMixin, popupMixin],
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        desc: {
             all: '全部',positive: '推荐',negative: '吐槽'
          }
          
        }
       
    },
    computed: {
      ratings() {
        return this.food.ratings
      }
    },
    created() {
      this.$on(EVENT_SHOW, () => {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      })
      
      
      
    },
    methods: {
      afterLeave() {
        //用户离开后，清理规格的选择值
        
        this.$emit(EVENT_LEAVE);
      },
      addFirst(event) {
        this.$set(this.food, 'count', 1)
        this.$emit(EVENT_ADD, event.target)
      },
      //不执行具体的数量加减动作，所有的数量加减均在cart-control.vue addToCart中
      addFood(target) { 
          
           this.$emit(EVENT_ADD, target);
      },
      format(time) {
        return moment(time).format('YYYY-MM-DD hh:mm')
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
      addcart,
      RatingSelect,
      Split
      }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin.styl"
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: $color-white
    &.move-enter-active, &.move-leave-active
      transition: all 0.3s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: $fontsize-large-xx
          color: $color-white
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: $fontsize-medium
        font-weight: 700
        color: $color-dark-grey
      .detail
        width: 100%
        height: auto
        min-height: 25px
        padding: 3px 5px
        .scall
          font-size: $fontsize-small
          font-weight: 700
          color:  $color-orange
          margin-right: 12px
          height: 25px
          padding: 5px 5px
      ul
            padding: 2px 2px
            display: flex
            flex-direction: row
            .label, .label_active
              min-width: 90px
              width: auto
              height: 20px
              padding-top:2px
              text-align: center
              display: inline-block
              list-style:none
              cursor:pointer
              border-radius: 10px
              color: #000
              font-size: $fontsize-small
              margin-right: 8px
              background-color:$color-orange-opacity 
            li:hover
                 border: 1px solid red
                 border-radius: 10px
                 background-color:$color-orange
            .label_active
                 color:red
                 border:1px solid red
                 border-radius: 10px
                 background-color:$color-orange
                
      .price
        line-height: 24px
        font-weight: 700
        .now
          margin-right: 8px
          font-size: 14px
          color: $color-red
        .old
          text-decoration: line-through
          font-size: $fontsize-small-s
          color: $color-light-grey
      .cart-control-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: $fontsize-small-s
        color: $color-white
        background: $color-blue
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.3s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: $fontsize-medium
        color: $color-dark-grey
      .text
        line-height: 24px
        padding: 0 8px
        font-size: $fontsize-small
        color: $color-grey
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: $fontsize-medium
        color: $color-dark-grey
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          &:last-child
            border-none()
          .user
            position: absolute
            right: 0
            top: 16px
            display: flex
            align-items: center
            line-height: 12px
            .name
              margin-right: 6px
              font-size: $fontsize-small-s
              color: $color-light-grey
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: $fontsize-small-s
            color: $color-light-grey
          .text
            line-height: 16px
            font-size: $fontsize-small
            color: $color-dark-grey
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: $fontsize-small
            .icon-thumb_up
              color: $color-blue
            .icon-thumb_down
              color: $color-light-grey
        .no-rating
          padding: 16px 0
          font-size: $fontsize-small
          color: $color-light-grey
</style>