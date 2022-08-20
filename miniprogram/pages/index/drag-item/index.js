Component({
  options: {
    addGlobalClass: true
  },
	properties: {
		itemData: {
			type: Object,
			value: {}
		},
		textColor: { // 字体颜色
			type: String,
			value: 'white'
		},
	},
	methods: {
		itemClick(e) {
			this.triggerEvent('click', {});
		}
	},
	ready() {}
})