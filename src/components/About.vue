<template>
	<div class="about">
		<div class="container">
			<button class="about__close" @click="$emit('toggleAbout')">Back</button>
			<div class="about__text" v-html="aboutText"></div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				aboutText: '<p>bird? is a bird identification built using <a href="https://vuejs.org" target="_blank" rel="nofollow noreferrer">VueJS</a>, <a href="https://firebase.google.com/" target="_blank" rel="nofollow noreferrer">Firebase</a> and the <a href="http://www.vision.caltech.edu/visipedia/CUB-200.html" target="_blank" rel="nofollow noreferrer">Caltech-UCSD Birds 200 dataset</a>.</p><p>Created by <a href="https://jackharding.co" target="_blank">Jack Harding</a></p>'
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	$black: #333;

	.about {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		padding: 35px 0;
		background: rgba(255,255,255,1);
	}

	.about__text {
		padding-top: 25px;
		font-size: 22px;
		line-height: 24px;
	}

	.about__close {
		position: relative;
		padding: 0 0 5px;
		border: 0;
		background: none;
		cursor: pointer;
		&:after {
			content: '';
			display: block;
			position: absolute;
			width: 100%;
			height: 1px;
			background: $black;
		}
	}
</style>
