// vue 参考版本 vue.2.5.16.js
// api 地址 http://caibaojian.com/vue/api/





// ======================== 全局配置 ========================

// ======================== api: config.optionMergeStrategies ========================
// 合并策略 optionMergeStrategies对象，没个属性对应一个方法，表示合并测略，
// el propsData data hooks watch props methods inject computed provide 等 列出部分
optionMergeStrategies: Object.create(null)
var strats = config.optionMergeStrategies;
strats.el = strats.propsData = function (parent, child, vm, key) {}
strats.data = function (parentVal, childVal, vm) {}
LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
});
ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
});
strats.watch = function (parentVal, childVal, vm, key) {}

// ======================== 全局 API ========================

// ======================== api: Vue.extend( options )========================
// 用Vue构造起创建一个子类，子类！，返回的构造器是 构造函数function 
// 创建构造器
var Profile = Vue.extend({
    template: '<p>  aka </p>',
    data: function () {
      return {
        firstName: 'Walter',
        lastName: 'White',
        alias: 'Heisenberg'
      }
    }
  })
  // 创建 Profile 实例，并挂载到一个元素上。
  new Profile().$mount('#mount-point')



// ======================== api: Vue.use() ========================

function initUse(Vue) {
    Vue.use = function (plugin) {
        var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
        if (installedPlugins.indexOf(plugin) > -1) {
            return this
        }

        // additional parameters
        //   arguments 类数组对象转化为数组 
        var args = toArray(arguments, 1);
        args.unshift(this);
        //   传入类型检测 function 或者 对象的install属性值是function
        if (typeof plugin.install === 'function') {
            plugin.install.apply(plugin, args);
        } else if (typeof plugin === 'function') {
            plugin.apply(null, args);
        }
        installedPlugins.push(plugin);
        return this
    };
}
// ======================== api: Vue.mixin() ========================
// 可以包含任意组件选项
// 选项值为函数，如同名钩子函数将混合为一个数组，并且混合对象的钩子先执行 
// 选项值为对象，则合并对象，如键名冲突则混入不覆盖组件


function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this
    };
}
// ======================== api: Vue.compile( template ) ========================
// 绝大部分时间我们有更便捷的方式，比如使用template
// 但是有些定制化框架并不能满足你，这时候就可以考虑使用render
// 单独作为一个项目分析



// ======================== 选项 / 数据 ========================
// ======================== data ========================
