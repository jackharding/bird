const functions = require('firebase-functions');

exports.checkScore = functions.database
    .ref('/scores/{pushId}')
    .onWrite(e => {
        const score = e.data.val();
        let finalScore = 0;

        if(score == null) return;
        if(score.checked === true) return;

        score.chosenAnswers.forEach((item) => {
            if(item.a !== item.b) {
                 return e.data.ref.set(null);
            } else {
                finalScore++;
            }
        });

        if(score.score !== finalScore) {
            console.log('cheater');
            return e.data.ref.set(null);
        } else {
            score.name = score.name;
            score.score = finalScore;
            score.checked = true;
            console.log('score getting set');
            return e.data.ref.set(score);
        }

    });