<template>
  <transition
    name="move"
    @after-leave="afterLeave"
  >
    <div class="address-form" v-show="visible">
      <cube-scroll ref="scroll" click="true">
        <div class="back" @click="close">
              <i class="icon-arrow_lift"></i>
        </div>
        
       <div class="form-control">
       
         <h3 v-if="this.address.id"> 地址修改 </h3>
           <h3 v-else>地址新增 </h3>
       
        <cube-form :model="model" @validate="validateHandler" :key="comKey">
         <cube-form-group>
             <cube-form-item :field="fields[0]"></cube-form-item>
             <cube-form-item :field="fields[1]"></cube-form-item>
            <cube-form-item :field="fields[2]"></cube-form-item>
            <cube-form-item>
            <VDistpicker type="mobile"  @selected="onSelected" ref="dp"></VDistpicker>
            </cube-form-item>
            <cube-form-item :field="fields[3]"></cube-form-item>
            <cube-form-item :field="fields[4]"></cube-form-item>  
        </cube-form-group>
        <cube-form-group>
            <cube-button @click="submit">保存信息</cube-button>
         </cube-form-group>
      </cube-form>
    
      </div>  
          
      </cube-scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  //id,name,mobile,province, city,district,detail,default_set
  import {updateAddress} from   '../../api'
  import popupMixin from '../../common/mixins/popup'
  import VDistpicker from 'v-distpicker'
  const EVENT_SHOW = 'show'
  const EVENT_ADD = 'add'
  const EVENT_LEAVE = 'leave'
  export default {
    name: 'addressDialog',
    mixins: [popupMixin],
    props: {
      address: {
        type: Object
      }
      
    },
    
    computed: {
       
       model(){
          return this.address;
       }
        
    
    },
    data() {
    return {
      comKey: 0,
      validity: {},
      fields: [
        {
          type: 'input',
          modelKey: 'name',
          label: '收件人',
          props: {
            placeholder: '请输入收件人姓名'
          },
          rules: {
            required: true
          }
        },
        {
          type: 'input',
          modelKey: 'mobile',
          label: '手机号',
          props: {
            placeholder: '请输入收件人手机号'
          },
          rules: {
            required: true
          }
        },
        
        {
          type: 'input',
          modelKey: 'area',
          label: '地区',
          props: {
            placeholder: '请选择地区,无需要手动输入',
            disabled: true
          },
          rules: {
            required: true
          }
        },
        {
          type: 'input',
          modelKey: 'detail',
          label: '详细门牌号',
          props: {
            placeholder: '请填写详细门牌号'
            
          },
          rules: {
            required: true
          }
        },
        {
                type: 'switch',
                modelKey: 'default_set',
                label: '设为默认地址',
                rules: {
                  required: false
                }
        },
        
        
      ]
    }
  },
  methods: {
  
   close() {
     this.hide();
     //this.$emit('leave');
     
      
   },
  
   submit () {
      if(this.address.name == '' ){
        this.showMsg(1000,'收件人未填写');
        return false;
      }
      if(this.address.mobile == '' ){
        this.showMsg(1000,'收件人手机未填写');
        return false;
      }
      if(this.address.area == '' ){
        this.showMsg(1000,'收件人地区未选择');
        return false;
      }
      if(this.address.detail == '' ){
        this.showMsg(1000,'收件人详细地址未填写');
        return false;
      }
      var bean = {'name':this.address.name,'mobile':this.address.mobile,
                  'province':this.address.province,'city':this.address.city,
                  'district':this.address.district,
                  'detail':this.address.detail }
      if(this.address.id){
          bean.id = this.address.id;
      }    
     
      var judge = new Boolean(this.address.default_set);
      if(judge == true){
        
        bean.default_set=2;
      }else{
        bean.default_set=1;
      }
      updateAddress(bean).then((res) => {
           console.log('***res='+JSON.stringify(res));
           if(res.status != 200){
             this.showMsg(1000,'==>服务器请求未响应，请检查网络环境<==');
             return false;
           }else{
             if(res.data.resCode=='999999'){
                this.showMsg(1000,'登陆超时，请重新扫码登录');
                return false;
             }else if(res.data.resCode=='0'){
                this.$bus.emit('close','close win');
                this.close();
             }else{
             
                this.showMsg(1000,res.data.resMsg);
                return false;
             }
         }
       });
   },
   
    
   
    onSelected(data) {
     
      this.address.area=data.province.value+data.city.value+data.area.value;
     
      this.address.province = data.province.value;
      this.address.city = data.city.value;
      this.address.district = data.area.value;
      this.comKey++;
      
    },

   
    validateHandler(result) {
      this.validity = result.validity
      this.valid = result.valid
    
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
    
    created() {
        this.$on(EVENT_SHOW, () => {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      })
      
      
    },
    mounted() {
      
    
    },
    components:{
      VDistpicker
    }
    
     
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin.styl"
  .address-form
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    height:100%
    background: $color-white
    &.move-enter-active, &.move-leave-active
      transition: all 0.3s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .form-control
      
      h3 
        color: color-dark-grey
        font-size: $fontsize-large
        text-align: left
        padding: 2px
        line-height: 20px
        font-weight: 500
      padding-top:20px
      
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: $fontsize-large-xx
          color: $color-white
    
</style>