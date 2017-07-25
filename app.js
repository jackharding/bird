var names;
var images;

function readNames(file) {
	var rawFile = new XMLHttpRequest();
	rawFile.open('GET', file, false);
	rawFile.onreadystatechange = function() {
		if(rawFile.readyState === 4) {
			if(rawFile.status === 200 || rawFile.status == 0) {
				names = rawFile.responseText.split('\n');
			}
		}
	}
	rawFile.send();
}

function readImages(file) {
	var rawFile = new XMLHttpRequest();
	rawFile.open('GET', file, false);
	rawFile.onreadystatechange = function() {
		if(rawFile.readyState === 4) {
			if(rawFile.status === 200 || rawFile.status == 0) {
				images = rawFile.responseText.split('\n');
			}
		}
	}
	rawFile.send();
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

readNames('./lists/classes.txt');
readImages('./lists/files.txt');

var app = new Vue({
	el: '#app',
	data: {
		names: names,
		images: images,
		used: [],
		next: {
			question: '',
			image: '',
			answers: [],
		},
		score: 0,
		count: 1
	},
	methods: {
		getRandomInt: function(array) {
			var max = array.length - 1;
			return Math.round(Math.random() * (max - 0));
		},
		getQuestion: function() {
			while(true) {
				var question = this.names[this.getRandomInt(this.names)];
				// if this question has been used before, look again
				if(!this.used.includes(question)) {
					return question;
					break;
				}
			}
		},
		findMatch: function(needle, haystack) {
			var matches = images.filter(function(word) {
				return word.includes(needle);
			});
			return matches[Math.floor(Math.random() * matches.length)];
		},
		getAnswers: function() {
			var answers = [];
			for(var i = 0; i < 3; i++) {
				var random = this.getQuestion();
				// if the question is included in the answers or if it's a duplicate keep going
				if(!answers.includes(random) || this.next.question != random) {
					answers.push(random);
				} else {
					i--;
				}
			}
			return answers;
		},
		getNext: function() {
			if(this.next.question.length) {
				this.used.push(this.next.question);
			}

			this.next.question = this.getQuestion();
			this.next.image = this.findMatch(this.next.question, images);
			this.next.answers = this.getAnswers();
			this.next.answers.push(this.next.question);
			this.next.answers = shuffleArray(this.next.answers);
		},
		submitAnswer: function(e) {
			var choice = e.target.innerText;
			if(choice == this.next.question.replace(/\d./g, '').replace(/_/g, ' ')) {
				this.score++;
				console.log('correct', this.score);
			} else {
				console.log('WRONG', this.score);
			}

			if(this.used.length == 14) {
				this.endQuiz();
			} else {
				this.getNext();
				this.count++;
			}
		},
		endQuiz: function() {
			this.next = {};
			alert('You got ' + this.score);
		}
	},
	filters: {
		tidyName: function(value) {
			if(!value) return;
			value = value.replace(/\d./g, '').replace(/_/g, ' ');
			return value;
		}
	},
	mounted: function() {
		var selectedAnswer;
		window.addEventListener('keyup', function(e) {
			switch(e.keyCode) {
				case 49:
					document.querySelector('button[data-answer="0"]').click();
					break;
				case 50:
					document.querySelector('button[data-answer="0"]').click();
					break;
				case 51:
					document.querySelector('button[data-answer="0"]').click();
					break;
				case 52:
					document.querySelector('button[data-answer="0"]').click();
					break;
				default:
					break;
			}
		});
	}
});

app.getNext();
// .replace(/\d./g, '').replace(/_/g, ' ').split('\n')
