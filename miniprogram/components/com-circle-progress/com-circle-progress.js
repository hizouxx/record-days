// components/com-circle-progress/com-circle-progress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentProgress:{
      type: Number,
      value: 0,
      observer: '_progressDidChange',
    },
    size:{
      type: Number,
      value: 200
    },
    borderSize:{
      type: Number,
      value: 20
    },
    borderColor:{
      type: String,
      value: "green"
    },
    normalColor:{
      type: String,
      value: "gray"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rightCircleRadius: 135,
    leftCircleRadius: 135,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _progressDidChange: function(newVal,oldVal){
      var that = this;
      var newLeftRadius = that.data.leftCircleRadius;
      var newRightRadius = that.data.rightCircleRadius;
      var radius = 360 * newVal;
      if(newVal < 0.5 && newVal >= 0){
        //只需要旋转右边的值
        newLeftRadius = 135;
        newRightRadius = 135 + radius;
      }else if(newVal <= 1 && newVal >=0.5){
        //两边都需要旋转
        newLeftRadius = radius - 45;
        newRightRadius = -45;
      }
      that.setData({rightCircleRadius:newRightRadius,leftCircleRadius:newLeftRadius});
    }
  }
})
