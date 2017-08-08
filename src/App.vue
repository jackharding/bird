<template>
    <div id="app">
        <home-screen v-if="!playing" :start-game="startGame"></home-screen>

        <progress-bar v-if="playing" :count="count" :limit="limit" :score="score"></progress-bar>
        <question></question>
        <answers v-if="playing" :next="next" :submitAnswer="submitAnswer"></answers>
    </div>
</template>

<script>
import axios from 'axios';
import HomeScreen from './components/HomeScreen.vue';
import ProgressBar from './components/quiz/ProgressBar.vue';
import Question from './components/quiz/Question.vue';
import Answers from './components/quiz/Answers.vue';

export default {
    name: 'app',
    components: {
        HomeScreen,
        ProgressBar,
        Question,
        Answers,
    },
    data () {
        return {
            playing: false,
            names: [],
            images: [],
            used: [],
            next: {
                question: '',
                image: '',
                answers: []
            },
            score: 0,
            count: 1,
            limit: 10
        }
    },
    methods: {
        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },
        shuffleArray: function(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        },
        getRandomInt: function(array) {
            var max = array.length - 1;
            return Math.round(Math.random() * (max - 0));
        },
        startGame: function() {            
            this.playing = true;
            this.getNext();
        },
        readNames: function(file) {
            axios.get(file)
            .then(response => {
                this.names = response.data.split('\n');
            })
            .catch(e => {
                console.log(e);
            })
        },
        readImages: function(file) {
            axios.get(file)
            .then(response => {
                this.images = response.data.split('\n');
            })
            .catch(e => {
                console.log(e);
            })
        },
        // in-game functions
        getQuestion: function(unique) {
            while(true) {
                var question = this.names[this.getRandomInt(this.names)].trim();
                // if this question has been used before, look again
                if(unique) {
                    if(!this.used.includes(question)) {
                        return question;
                        break;
                    }
                } else {
                    return question;
                    break;
                }
            }
        },
        findMatch: function(needle, haystack) {
            var matches = haystack.filter(function(word) {
                return word.includes(needle);
            });
            return matches[Math.floor(Math.random() * matches.length)];
        },
        getAnswers: function() {
            var answers = [];
            for(var i = 0; i < 3; i++) {
                var random = this.getQuestion(false);
                // if the question is included in the answers or if it's a duplicate keep going
                if(!answers.includes(random) && this.next.question != random) {
                    answers.push(random);
                } else {
                    i--;
                }
            }
            return answers;
        },
        insertImage: function() {
            var img = this.getQuestion(true);
            this.next.question = img;
            this.next.image = this.findMatch(this.next.question, this.images).trim();

            var canvas = document.getElementById('questionCanvas');
            var ctx = canvas.getContext('2d');
            var containerWidth = document.querySelector('.question').offsetWidth;
            canvas.width = containerWidth;
            canvas.height = containerWidth;
            var canvasImg = new Image();
            canvasImg.src = './../static/img/birds/' + this.next.image;
            console.log(canvasImg.src);
            canvasImg.onload = function() {
                ctx.drawImage(canvasImg, 0, 0, canvasImg.width, canvasImg.height, 0, 0, canvas.width, canvas.height);
            }
        },
        getNext: function() {
            if(this.next.question.length) {
                this.used.push(this.next.question);
            }

            this.insertImage();
            this.next.answers = this.getAnswers();
            this.next.answers.push(this.next.question);
            this.next.answers = this.shuffleArray(this.next.answers);
        },
        submitAnswer: function(e) {
            var choice = e.target.innerText;
            if(choice == this.next.question.replace(/\d./g, '').replace(/_/g, ' ')) {
                this.score++;
                console.log('correct', this.score);
            } else {
                console.log('WRONG', this.score);
            }

            if(this.used.length == this.limit - 1) {
                this.endQuiz();
            } else {
                this.getNext();
                this.count++;
            }
        },
        endQuiz: function() {
            this.next = {};
            this.playing = false;
            this.score = 0;
            this.count = 1;
            alert('You got ' + this.score);
        }
    },
    mounted: function() {
        this.readNames('./../static/txt/classes.txt');
        this.readImages('./../static/txt/files.txt');
    }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
