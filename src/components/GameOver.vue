<template>
	<div class="game-over">
		<div class="game-over__alert">
			New high score! Submit your score.
			<input class="game-over__input" type="text" v-model="username" />
		</div>

		<h3>You scored: <span>{{ score }}</span></h3>

		<nav role="navigation">
			<ul class="game-over__menu menu">
				<li><button @click="startGame()" class="home__btn">Play</button></li>
				<li><button @click="viewHighScores()" class="home__btn">Top 10</button></li>
				<li><button @click="$emit('toggleAbout')" class="home__btn">About</button></li>
			</ul>
		</nav>
	</div>
</template>

<script>
	import * as firebase from 'firebase'
	import 'firebase/auth'
	import 'firebase/database';

	export default {
		props: [
			'score'
		],
		data() {
			return {
				username: 'bombaclart'
			}
		},
		mounted: function() {
			this.checkScore();
		},
		methods: {
			// Database
	        getScores: function(limit = 10, order = 'score') {
	            // get the top 10 ordered by score
	            return firebase.database()
	            .ref('scores/')
	            .orderByChild(order)
	            .limitToFirst(limit)
	            .once('value', function(snap) {
	                return snap;
	            }, function(err) {
	                return err;
	            });
	        },
	        checkScore: function() {
	            // check if the user's score is higher than any of the top 10
	            this.getScores()
	            .then(data => {
	                var betterThan;
	                var currentIndex = 0;
	                data.forEach(topScore => {
	                    if(this.score > topScore.val().score) {
	                        betterThan = topScore.key;
	                    }
	                    currentIndex++;
	                });

	                // if there aren't 10 scores yet, just add it
	                if(currentIndex < 10 || betterThan) {
	                    this.notifyUser();
	                    var newScore = firebase.database().ref('scores/').push();
	                    newScore.set({
	                        name: this.username,
	                        score: this.score
	                    });
	                }
	                
	            });
	        },
	        // ask user for username to save high score
	        notifyUser: function() {
	            alert('piss');
	        }
		}
	}
</script>

<style lang="scss">
	.menu {
		padding: 0;
		margin: 0 auto;
		list-style: none;
	}

	.game-over {
		text-align: center;
	}

	h3 {
		font-size: 36px;
		span {
			display: block;
			font-size: 66px;
		}
	}
</style>