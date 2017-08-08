<template>
	<div>
		<div class="quiz__top">
			<div class="remaining">Question {{ count }} of {{ limit }}</div>
			<div class="score">Score: {{ score }}</div>
		</div>		
	</div>
</template>

<script>
	export default {
		props: [
			'count',
			'limit',
			'score'
		]
	}
</script>