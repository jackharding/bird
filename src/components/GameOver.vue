<template>
	<div class="game-over">
		<transition name="fade-out">
			<div class="game-over__alert" v-if="highScore">
				New high score! Submit your score.
				<form action="" v-on:submit.prevent="setHighscore">
					<input class="game-over__input" type="text" maxlength="20" @keyup="validateInput" v-model="username" />
					<button type="submit" class="btn" :disabled="valid == false">Submit</button>
				</form>
			</div>
		</transition>

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

	const list = require('badwords-list'),
      	  badArray = list.array;

    function textFromHtmlString( arbitraryHtmlString ) {
	    const temp = document.createElement('div');
	    temp.innerHTML = arbitraryHtmlString;
	    return temp.innerText;
	}

	export default {
		props: [
			'score',
			'startGame',
			'viewHighScores',
			'getScores'
		],
		data() {
			return {
				username: '',
				highScore: false,
				valid: false
			}
		},
		mounted: function() {
			this.checkScore();
		},
		methods: {
			// Databases
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
	                    this.highScore = true;	                    
	                }
	            });
	        },
	        // ask user for username to save high score
	        setHighscore() {
	        	const clean = textFromHtmlString(this.username);

	        	const newScore = firebase.database().ref('scores/').push();
                newScore.set({
                    name: clean,
                    score: this.score
                })
                .then(() => {
                	this.highScore = false;
                });
	        },
	        validateInput() {
	        	let profane = false;
	        	for(var i = 0; i < badArray.length; i++) {
					if(this.username.indexOf(badArray[i]) > -1) {
						profane = true;
					}
				}

	        	if(this.username.length > 0 && !profane) {
	        		this.valid = true;
	        	} else {
	        		this.valid = false;
	        	}
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

	.game-over__alert {
		form {
			display: flex;
			max-width: 290px;
			margin: 10px auto 0;
		}

		input {
			width: calc(100% - 84px);
		}

		button {
			width: 84px;
		}
	}

	h3 {
		font-size: 36px;
		span {
			display: block;
			font-size: 66px;
		}
	}

	.btn {
		&[disabled] {
			background: #bcbcbc;
			border-color: #bcbcbc;
			cursor: default;
			&:hover {
				color: #fff;
			}
		}
	}
</style>