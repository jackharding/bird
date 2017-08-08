<template>
    <div id="app" class="container">
        <home-screen v-if="!playing" :start-game="startGame"></home-screen>

        <div class="quiz">
            <progress-bar v-if="playing" :count="count" :limit="limit" :score="score"></progress-bar>
            <question v-show="playing"></question>
            <answers v-if="playing" :next="next" :submitAnswer="submitAnswer"></answers>
        </div>
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

            setTimeout(() => {
                var canvas = document.getElementById('questionCanvas');
                var ctx = canvas.getContext('2d');
                var containerWidth = document.querySelector('.question').offsetWidth;
                canvas.width = containerWidth;
                canvas.height = containerWidth;
                console.log(canvas.width);
                var canvasImg = new Image();
                canvasImg.src = './../static/img/birds/' + this.next.image;
                console.log(canvasImg.src);
                canvasImg.onload = function() {
                    ctx.drawImage(canvasImg, 0, 0, canvasImg.width, canvasImg.height, 0, 0, canvas.width, canvas.height);
                }
            },100);
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

        window.addEventListener('keyup', function(e) {
            switch(e.keyCode) {
                case 49:
                    document.querySelector('button[data-answer="0"]').click();
                    break;
                case 50:
                    document.querySelector('button[data-answer="1"]').click();
                    break;
                case 51:
                    document.querySelector('button[data-answer="2"]').click();
                    break;
                case 52:
                    document.querySelector('button[data-answer="3"]').click();
                    break;
                default:
                    break;
            }
        });
    }
}
</script>

<style lang="scss">
/* Variables */
$black: #333;

/* Mixins */
@mixin list-plain {
    padding: 0;
    margin: 0;
    list-style: none;
}

*, *:before, *:after {
    box-sizing: border-box;
}

html,
body {
    overflow-x: hidden;
}

body {
    font-family: 'Open Sans', sans-serif;
    color: $black;
}

.btn {
    background: none;
    padding: 5px;
    border: 1px solid $black;
    font-size: 14px;
    &.btn--answer {
        width: 100%;
        height: 55px;
    }
}

.container {
    display: flex;
    align-items: center;
    max-width: 450px;
    margin: 0 auto;
    padding: 15px 15px;
    >div {
        width: 100%;
    }
}

.quiz__top {
    font-size: 20px;
    text-align: center;
}

.question {
    width: 100%;
    margin: 15px 0;
}

.answers {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    @include list-plain;
    li {
        width: calc(50% - 7.5px);
        &:nth-of-type(n+3) {
            margin-top: 15px;
        }
    }
}
</style>