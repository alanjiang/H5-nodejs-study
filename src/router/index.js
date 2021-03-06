import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Goods from '@/components/Goods'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
	{
	    path: '/',
	    name: 'Home',
	    component: Home
	},
    {
      path: '/helloword',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    }
   
  ]
})
