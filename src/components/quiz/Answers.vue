<template>
	<ul class="answers">
		<li v-for="(answer, i) in next.answers">
			<button v-on:click="submitAnswer" class="btn btn--answer" :data-answer="i">{{ answer | tidyName }}</button>
		</li>
	</ul>
</template>

<script>
	export default {
		props: [
			'next',
			'submitAnswer',
			'tidyName'
		],
		filters: {
			tidyName: function(value) {
            	if(!value) return;
	            value = value.replace(/\d./g, '').replace(/_/g, ' ');
	            return value;
	        }
		}
	}
</script>