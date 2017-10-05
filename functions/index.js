const functions = require('firebase-functions');

exports.checkScore = functions.database
    .ref('/scores/{pushId}')
    .onWrite(e => {
        const score = e.data.val();
        let finalScore = 0;
        score.chosenAnswers.forEach((item) => {
            if(item.a !== item.b) {
                return e.data.ref.set({});
            } else {
                finalScore++;
            }
        });

        if(score.score !== finalScore || score.baps === 'salty') {
            e.data.ref.remove();
        }

        score.name = score.name;
        score.score = finalScore;
        return e.data.ref.set(score);
    });