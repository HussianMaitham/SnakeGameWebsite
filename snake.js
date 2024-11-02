
// board
var blockSize = 20;
var rows = 20;
var cols = 20;
var board;
var contex;
var boardColor = "rgb(25, 25, 25)";

// snake
var snakeXpos = blockSize * 10;
var snakeYpos = blockSize * 10;

var snakeXvelocity = 0;
var snakeYvelocity = 0;

var snakeColor = "rgb(159, 193, 49)";
var snakeBody = [];

// food
var foodXpos;
var foodYpos;

var foodColor = "rgb(255, 51, 51)";

// game over
var gameOver;

// score system
var score = 0;
var highScore = 0;

var scoreText;
var highScoreText;

window.onload = function()
{
    // get important elements from the html file
    board = document.getElementById("board");
    scoreText = document.getElementById("score");
    highScoreText = document.getElementById("high score")
    
    // set the board height and width
    board.height = rows * blockSize;
    board.width  = rows * blockSize;

    // this is used for drawing
    contex = board.getContext("2d");

    // spawn the food in a random position
    placeFood();

    // load the previously saved high score from the computer
    highScore = localStorage.getItem("high_score");

    // add an event listner to the web page to so we listen to keyboard presses
    document.addEventListener("keydown", changeDirection);

    // update the board
    setInterval(update, 1000 / 10); // call the update function each 100 miliseconds
}

function update()
{
    // -----------------------Game------------------------
    // check if there was a collision between the snake and the food
    if (snakeXpos == foodXpos && snakeYpos == foodYpos)
    {
        // insert a new X and Y cordinates of the food into a two dimensional array so we can use them to generate the snake body
        snakeBody.push([foodXpos, foodYpos]);

        // place the food in a random position yet again
        placeFood();

        score++; // the player gets 1 point
    }

    // manage the snake body parts position
    for (let i = snakeBody.length - 1; i > 0; i--)
    {
        // basically we start from the tail and set its position to the previous body part
        snakeBody[i] = snakeBody[i-1];
    }

    if (snakeBody.length) // check if there was any body parts
    {
        // set the position of the body part before the head to snake head position before being updated
        snakeBody[0] = [snakeXpos, snakeYpos];
    }

    // update the snake position according to its velocity
    snakeXpos += snakeXvelocity * blockSize;
    snakeYpos += snakeYvelocity * blockSize;

    // scoring system
    // we update the score and highscore text
    scoreText.textContent = "Score: " + score;
    highScoreText.textContent = "High Score: " + highScore;

    if (score > highScore) // checks if the players gets a new high score
    {
        highScore = score;
        localStorage.setItem("high_score", highScore); // save the new highscore
    }

    // game over conditions
    // we check the snake position if it is out of bounds
    if (snakeXpos < 0-1 || snakeXpos > cols * blockSize - 1 || snakeYpos < 0 || snakeYpos > rows * blockSize - 1)
    {
        gameOver = true;
    }

    // we check if the snake has hit any of it body parts
    for (let i = 0; i < snakeBody.length; i++)
    {
        if (snakeXpos == snakeBody[i][0] && snakeYpos == snakeBody[i][1])
        {
            gameOver = true;
        }
    }

    if (gameOver == true)
    {
        // if the player loses we restart the game
        restartGame();
    }

    // ---------------------Graphics----------------------
    // paint the board background black
    contex.fillStyle = boardColor;
    contex.fillRect(0, 0, board.width, board.height);

    // draw the food
    contex.fillStyle = foodColor;
    contex.fillRect(foodXpos, foodYpos, blockSize, blockSize);

    // draw the snake head
    contex.fillStyle = snakeColor;
    contex.fillRect(snakeXpos, snakeYpos, blockSize, blockSize);

    // draw the snake body
    contex.fillStyle = snakeColor;

    for (let i = 0; i < snakeBody.length; i++) 
    {
        // draw the snake body from the cordinates that exist in the first and second dimension of the array
        contex.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
}

function changeDirection(e)
{
    // listen to what key was pressed and chage directions accordingly
    // also make sure that the snake can't just turn around instantly
    if (e.code == "ArrowRight" && snakeXvelocity != -1)
    {
        // go right
        snakeXvelocity = 1;
        snakeYvelocity = 0;
    }
    else if (e.code == "ArrowLeft" && snakeXvelocity != 1)
    {
        // go left
        snakeXvelocity = -1;
        snakeYvelocity =  0;
    }
    else if (e.code == "ArrowUp" && snakeYvelocity != 1)
    {
        // go up
        snakeXvelocity =  0;
        snakeYvelocity = -1;
    }
    else if (e.code == "ArrowDown" && snakeYvelocity != -1)
    {
        // go down
        snakeXvelocity = 0;
        snakeYvelocity = 1;
    }
}

function placeFood()
{
    // generates a random number for the row and colums, the reason we use Math.floor
    // is to round the number to become 19.99 instead of 20 so it doesn't get out of bounds
    foodXpos = Math.floor(Math.random() * cols) * blockSize;
    foodYpos = Math.floor(Math.random() * rows) * blockSize;
}

function restartGame()
{
    // resetart every game paramter if the player losses
    
    // resets the snake velocity
    snakeXvelocity = 0;
    snakeYvelocity = 0;

    // reset the snake position
    snakeXpos = blockSize * 10;
    snakeYpos = blockSize * 10;

    // reset the snake body count
    snakeBody.splice(-snakeBody.length);

    // place another apple in a random position
    placeFood();

    // reset the score but leave the high score untouched
    score = 0;

    // reset the canvas drawings
    contex.fillStyle = boardColor;
    contex.fillRect(0, 0, board.width, board.height);

    gameOver = false;
}
