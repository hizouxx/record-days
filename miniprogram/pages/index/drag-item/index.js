Component({
  options: {
    addGlobalClass: true
  },
	properties: {
		itemData: {
			type: Object,
			value: {}
		}
	},
	methods: {
		itemClick(e) {
			this.triggerEvent('click', {});
		}
	},
	ready() {}
})