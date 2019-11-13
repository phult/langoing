module.exports = HomeController;
const Cache = require("cache");
let quizCache = new Cache(1 * 24 * 60 * 60 * 1000);

function HomeController($config, $event, $logger, $dbConnection) {
    this.welcome = function (io) {
        io.json({
            name: $config.get("package.name"),
            version: $config.get("package.version"),
            port: $config.get("app.port"),
            debug: $config.get("app.debug"),
            log: $config.get("log.storage"),
            autoload: $config.get("app.autoload"),
        });
    }

    this.quiz = async function (io) {
        let quizes = quizCache.get("quizes");
        if (quizes == null) {
            quizes = await $dbConnection.query(`SELECT *
            FROM quiz, (
                    SELECT id AS sid
                    FROM quiz
                    ORDER BY RAND()
                    LIMIT 140
                ) tmp
            WHERE quiz.id = tmp.sid;`);
            console.log('quizes[0]', quizes[0]);
            for (let index = 0; index < quizes.length; index++) {
                quizes[index] = suffleQuizAnswer(quizes[index]);
            }
            console.log('quizes[0]', quizes[0]);
            quizCache.put("quizes", quizes);
        }
        io.render("quiz", {
            "quizes": quizes
        });
    }
    this.submitQuiz = async function (io) {
        let result = {
            answer_count: 0,
            submit_answer_count: 0,
            correct_answer_count: 0
        }
        let quizes = JSON.parse(JSON.stringify(quizCache.get("quizes")));
        result.answer_count = quizes.length;
        for (const key in io.inputs) {
            var keySpliter = key.split("quiz-id-");
            if (keySpliter.length == 2) {
                result.submit_answer_count++;
                let quizId = keySpliter[1];
                let submitAnswer = io.inputs[key];
                quizes.forEach(item => {
                    if (item.id == quizId) {
                        item.submit_answer = submitAnswer;
                        item.submit_answer_text = item["answer" + submitAnswer];
                        item.correct_answer_text = item["answer" + item.correct_answer];
                        item.is_correct = false;
                        if (submitAnswer == item.correct_answer) {
                            item.is_correct = true;
                            result.correct_answer_count++;
                        }
                        return;
                    }
                });
            }
        }
        console.log("result", result);
        console.log("quizes", quizes);
        io.render("quiz", {
            "quizes": quizes,
            "result": result
        });
    }
    function suffleQuizAnswer(quiz) {
        var answers = [];
        answers.push(quiz.answer1);
        answers.push(quiz.answer2);
        answers.push(quiz.answer3);
        answers.push(quiz.answer4);
        quiz.correct_answer = answers[quiz.correct_answer - 1];
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        quiz.answer1 = answers[0];
        quiz.answer2 = answers[1];
        quiz.answer3 = answers[2];
        quiz.answer4 = answers[3];
        quiz.correct_answer = answers.indexOf(quiz.correct_answer) + 1;
        return quiz;
    }
}