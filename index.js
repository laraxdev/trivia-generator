import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://opentdb.com/api.php";
const trivia_category_URL = "https://opentdb.com/api_category.php";

// let categoryID;
// const CategoryInfoURL =`https://opentdb.com/api_count.php?category=${categoryID}`;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


//-------------------------------------------------------------
app.get("/", async (req, res) => {
  try {
    const respond = await axios.get(trivia_category_URL);
    const triviaCategory = respond.data.trivia_categories;
   
    res.render("index.ejs", {
      categoryOption: triviaCategory,
    });
  } catch (error) {
    res.status(500);
  }
});

//-------------------------------------------------------------

app.post("/generate", async (req, res) => {
  const amount = 1;
  const category = req.body.category;
  const difficulty = req.body.difficulty;
  const questionType = "multiple";
  const filterUrl = API_URL + "?amount=" + amount + "&category=" + category + "&difficulty=" + difficulty + "&type=" + questionType;

  try {
    const respond = await axios.get(filterUrl);

    const triviaBank = respond.data.results;


    const respond2 = await axios.get(trivia_category_URL);
    const triviaCategory = respond2.data.trivia_categories;

    // console.log(triviaBank);
    const numberOftriviaBankQuestions = triviaBank.length;

    const category1 = triviaBank[0].category;
    const question1 = triviaBank[0].question;
    const correctAnswer1 = triviaBank[0].correct_answer;

    // console.log(question1);
    // console.log(correctAnswer1);

    const answerChoices = [];

    const numberOfIncorrectAnswers = triviaBank[0].incorrect_answers.length;

    answerChoices.push(correctAnswer1);

    for (let i = 0; i < numberOfIncorrectAnswers; i++) {
      answerChoices.push(triviaBank[0].incorrect_answers[i]);
    }

    // console.log(answerChoices);

    const answerChoicesNew = [];

    while (answerChoices.length > 0) {
      const randomSelection = Math.floor(Math.random() * answerChoices.length);
      const randomPop = answerChoices.pop(randomSelection);
      answerChoicesNew.push(randomPop);
    }

    //-------------------------------------

    res.render("index.ejs", {
      
      
      categoryOption: triviaCategory,

      category: category1,
      question: question1,
      correctAnswer: correctAnswer1,
      listOfAnswers: answerChoicesNew,
    });
  } catch (error) {
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

