import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://opentdb.com/api.php";
const trivia_category_URL = "https://opentdb.com/api_category.php";


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


//--------app-get-----------------------------------------------

app.get("/", async (req, res) => { 

  try {
    const respond = await axios.get(trivia_category_URL);
    const triviaCategory = respond.data.trivia_categories;  
   
    res.render("index.ejs", {     
      categoryOption: triviaCategory,
    });

  } catch (error) {
    console.log(error.response.data);
    res.status(500);    
  }
});

//-------app-post-----------------------------------------------------

app.post("/generate", async (req, res) => {
  const amount = 12;
  const category = req.body.category;
  const difficulty = req.body.difficulty;
  const questionType = "multiple";
  const filterUrl = API_URL + "?amount=" + amount + "&category=" + category + "&difficulty=" + difficulty + "&type=" + questionType;

  try {
    const respond = await axios.get(filterUrl);
    const triviaBank = respond.data.results;

    const respond2 = await axios.get(trivia_category_URL);
    const triviaCategory = respond2.data.trivia_categories;
   

    res.render("index.ejs", {    
      numberOfQuestions: triviaBank.length,
      categoryOption: triviaCategory,
      triviaBankSelected: triviaBank,
    });

  } catch (error) {
    console.log(error.response.data);
    res.status(500);    
  }
});

//--------app-listen-----------------------------------------------------

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

