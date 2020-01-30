# dian-cube-ui

> dian cube ui

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader)


难点问题：

1， cube-scroll引用了 better-scroll ,  点击事件出现次：

    node_modules/scroll.vue
    新增：stopPropagation: true

   const DEFAULT_OPTIONS = {
    observeDOM: true,
    click: true,
    probeType: 1,
    scrollbar: false,
    pullDownRefresh: false,
    pullUpLoad: false,
    stopPropagation: true
  }





<cube-scroll-nav-bar :current="current" :labels="labels" @change="changeHandler" />
.
