// components/rolling-text/rolling-text.js
Component({
  properties: {
    // 传入的数字
    number: {
      type: Number,
      value: 0,
      observer(newVal, oldVal) {
        // 如果 number 发生变化，启动动画
        if (newVal !== oldVal) {
          this.animateNumberTransition(oldVal, newVal);
        }
      }
    },
    // 动画的持续时间（单位：毫秒）
    duration: {
      type: Number,
      value: 1000
    },
    // 字体大小
    size: {
      type: Number,
      value: 38
    }
  },

  data: {
    currentNumber: 0, // 当前显示的数字
  },

  methods: {
    // 启动数字平滑过渡动画
    animateNumberTransition(start, end) {
      const { duration } = this.data;
      const steps = 60; // 动画更新的步数（每秒更新60次）
      const stepDuration = duration / steps; // 每次更新的时间间隔

      const diff = end - start; // 变化的差值
      let step = 0;

      // 定时器，逐步更新数字
      const intervalId = setInterval(() => {
        step++;
        // 根据步数计算当前的数值
        const currentValue = start + (diff * (step / steps));
        this.setData({
          currentNumber: Math.round(currentValue)
        });

        // 动画完成后清除定时器
        if (step >= steps) {
          clearInterval(intervalId);
        }
      }, stepDuration);
    }
  }
});

