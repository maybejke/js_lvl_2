Vue.component('error', {
	data(){
		return {
			text: ''.
		}
	},
	methods: {
		setError(error){
			this.text = error
		}
	},
	computed: {
		isVisible() {
			return this.text !== ''
		}
	},
	template: `
		<div class="error-block" v-if="isVisible">
			<p class="error-msg">
				<buttun class="close-btn" @click="setError('')"> X </button>
				{{text}}
			</p>
		</div>
	`
});