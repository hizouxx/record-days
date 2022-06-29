// components/cat/cat.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isActive: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggle () {
      setTimeout(() => {
        this.setData({
          isActive: true
        })
        setTimeout(() => {
          this.setData({
            isActive: false
          })
        }, 58000);
      }, 2000);
    }
  }
})
