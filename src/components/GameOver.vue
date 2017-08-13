<template>
	<div>
		<h3>You scored: <span>{{ score }}</span></h3>
	</div>
</template>

<script>
	export default {
		props: [
			'score'
		],
	}
</script>