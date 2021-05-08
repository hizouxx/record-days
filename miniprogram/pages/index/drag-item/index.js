Component({
  options: {
    addGlobalClass: true
  },
	properties: {
		itemData: {
			type: Object,
			value: {}
		},
		radius: {
			type: Number,
			value: 0
		}
	},
	methods: {
		itemClick(e) {
			this.triggerEvent('click', {});
		}
	},
	ready() {}
})