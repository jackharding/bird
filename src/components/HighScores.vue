<template>
	<div class="hi-scores">
		<div class="container">
			<button class="about__close" @click="$emit('toggleScores')">Back</button>
			<div class="about__text">
				<table class="hi-scores__table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Name</th>
							<th>Score</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(score, index) in orderedScores">
							<td>{{ index + 1 }}</td>
							<td>{{ score[1].name }}</td>
							<td>{{ score[1].score }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
	import * as firebase from 'firebase'
	import 'firebase/auth'
	import 'firebase/database';

	export default {
		props: [
			'getScores'
		],
		data() {
			return {
				orderedScores: []
			}
		},
		methods: {

		},
		mounted: function() {
			this.getScores()
			.then(data => {
				const scores = data.val();
				let scoresArr = Object.keys(scores).map(function(key) {
					return [key, scores[key]];
				})
				this.orderedScores = scoresArr.sort((a, b) => a[1].score > b[1].score ? 1 : -1).slice().reverse().slice(0, 10);
			});
		}
	}
</script>

<style lang="scss">
	$black: #333;

	.hi-scores {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		padding: 35px 0;
		background: rgba(255,255,255,1);
		overflow-y: scroll;
	}

	.about__text {
		padding-top: 25px;
		font-size: 22px;
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

	.hi-scores__table {
		width: 100%;
		text-align: left;
		td,
		th {
			padding: 8px 5px;
		}
	}
</style>
