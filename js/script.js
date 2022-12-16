const guessList = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const leftGuesses = document.querySelector(".remaining");
const showRemainingGuesses = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const hiddenButton = document.querySelector(".play-again");

let word = "magnolia";
let guessedLetters =[];
let remainingGuesses = 8;

const getWord = async function () {
    const response = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await response.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    placeholder(word);
  };

// Start game 

getWord();

// Show dots as placeholders, placeholderLetters is the empty array, for adding to and the array is empty and will collect the letters then for each letter inside of the word that we passed to the function, we add a "●" to the array

const placeholder = (word) => {
     const placeholderLetters = [];

     for (const letter of word) {
        // console.log(letter);

        placeholderLetters.push("●");
     }
    // join method returns the array into a string, so we end up with "●●●●●●●●"

    wordInProgress.innerText = placeholderLetters.join("");

};
// Call function and pass it to theword variable as an argument
placeholder(word);

// Because you’re working with a form, you want to prevent the default behavior of clicking a button, the form submitting, and then reloading the page

guessButton.addEventListener("click", function (e) {
    e.preventDefault();

// Empty message paragraph
message.innerText = "";

// Create and name a variable to capture the value of the input. Log out the value of the variable capturing the input. You should see the letter you enter into the input field in the console when the Guess button is clicked. 

const guess = letterInput.value;

// Use regular expressions and the match method to make sure the player uses a single letter
// Validate input here

const goodGuess = acceptInput(guess);

if (goodGuess) {
// We have a letter, guess!
    makeGuess(guess);
}

// empty input field
letterInput.value = "";

});

// Check players' guesses (check event listener too)

const acceptInput = function (input) {
    const acceptedLetter = /[a-zA-Z]/;

    if (input.length === 0) {
        message.innerText = "Give it a go!";
        } else if (input.length > 1) {
        message.innerText = "Please enter one single letter.";
        } else if (!input.match(acceptedLetter)) {
        message.innerText = "Please choose a letter from A to Z.";
        } else {
        return input;
    }
};

// Handle the players' guesses

const makeGuess = function (guess) {
    guess = guess.toUpperCase();

    if (guessedLetters.includes(guess)) {
        message.innerText = "Try again! You already got that one!";
    } else {
        guessedLetters.push(guess);
        console.log(guessedLetters);
        updateGuessesRemaining(guess);
        showGuessedLetters();
        updateWordInProgress(guessedLetters);
    }
};

// Show Guessed Letters

const showGuessedLetters = function () {

// Clear the list first
guessList.innerHTML = "";

for (const letter of guessedLetters) {
    const li = document.createElement("li");
    li.innerText = letter;
    guessList.append(li);
    }
};

// update the word in progress, replacing the placeholder dots with correct letters chosen

const updateWordInProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();

    // split the word string into an array so that the letter can appear in the guessedLetters array:
    const wordArray = wordUpper.split("");
    const wordReveal = [];

    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            wordReveal.push(letter.toUpperCase());
        } else {
            wordReveal.push("●");
        }
    }

    wordInProgress.innerText = wordReveal.join("");
    winner();
};

// Count remaining guesses

const updateGuessesRemaining = function (guess) {
    const upperWord = word.toUpperCase();
     if (!upperWord.includes(guess)) {
     message.innerText = `Sorry, the word doesn't have ${guess}. Try again.`;
     remainingGuesses -= 1;
     } else {
     message.innerText = `Great job! The word has ${guess}.`;
     }
 
     if (remainingGuesses === 0) {
     message.innerText = `Game over! The word was ${word}.`;
     startOver();
     } else if (remainingGuesses === 1) {
        showRemainingGuesses.innerText = `${remainingGuesses} guess`;
     } else {
        showRemainingGuesses.innerText = `${remainingGuesses} guesses`;
     }
 };

 // Check if player won, verifying if their word in progress matches the word they should guess

const winner = function () {
    if (word.toUpperCase() === wordInProgress.innerText) {
    message.classList.add("win");
    message.innerHTML = `<p class="highlight"> You guessed correct the word! Congrats!</p>`;
    
    startOver();
    }
};

 // Play it again

const startOver = function () {
    guessButton.classList.add("hide");
    leftGuesses.classList.add("hide");
    guessList.classList.add("hide");
    hiddenButton.classList.remove("hide");
};

// reset original values
hiddenButton.addEventListener("click", function () {
    message.classList.remove("win");
    message.innerText = "";
    guessedLetters = [];
    remainingGuesses = 8;
    showRemainingGuesses.innerText = `${remainingGuesses} guesses`;
    guessList.innerHTML = "";

    // Get a new word
    getWord();

// Show the right UI elements
    guessButton.classList.remove("hide");
    hiddenButton.classList.add("hide");
    leftGuesses.classList.remove("hide");
    guessList.classList.remove("hide");
});