const typingText = document.querySelector(".typing-text p"),
inputfield = document.querySelector(".wrapper .input-field"),
timeCount = document.querySelector(".time span b"),
mistakeCount = document.querySelector(".mistake span"),
wpmCount = document.querySelector(".WPM span"),
cpmCount = document.querySelector(".CPM span"),
tryAgainButton = document.querySelector("button");

let timer= 0, maxTime= 60, leftTime = maxTime; // Variables for counting time
let charIndex = 0 /* Variable for taking the index of the paragraphs */, mistakes = 0 /* Variable for counting mistakes */;
let isTyping = 0;// Variable checking whether the user started to type

// FUNCTION TO GENERATE RANDOM PARAGRAPHS FROM PARAGRAPH.JS
function randomParagraph(){
    let randomIndex = Math.floor(Math.random() * paragraphs.length);//getting random numbers less than the paragraph length
    typingText.innerHTML = "";//for preventing other paragraphs to stay beneath the current paragraph
    paragraphs[randomIndex].split("").forEach(span =>{ /**Getting random character from character array, splitting all characters inside that
        paragraph, adding each character inside span and then adding those span inside p tag */
        let spanTag = `<span>${span}</span>`;
        typingText.innerHTML += spanTag;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");//keeping the cursor blinking on the first word of any paragraph
    //focusing input field when any key is pressed
    document.addEventListener("keydown", () => inputfield.focus());
    typingText.addEventListener("click", () => inputfield.focus());
}

// FUNCTION WHEN USER STARTS TO TYPE
function initialTyping(){
    const characters = typingText.querySelectorAll("span");
    let typedChar = inputfield.value.split("")[charIndex];
    if(charIndex < characters.length - 1 && leftTime > 0){//if user starts to type, timer starts till it reaches 60 seconds
        if(!isTyping){
            timer = setInterval(initTimer,1000);
            isTyping = true;
        }
        if(typedChar == null){//if user uses backspace
            charIndex--;
            if(characters[charIndex].classList.contains("incorrect")){
                mistakes--;
            }
            characters[charIndex].classList.remove("correct", "incorrect");
        } else {
            if(characters[charIndex].innerText === typedChar){//if user types the exact character present at charIndex
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"))
        characters[charIndex].classList.add("active");//active class gets added to each successive charIndex
    
        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - leftTime)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0: wpm;//to prevent negative and infinity print
        mistakeCount.innerText = mistakes;
        wpmCount.innerText = wpm;//count words (standard convention: 5 words)
        cpmCount.innerText = charIndex - mistakes;//count characters
    } else {//if user does nothing
        inputfield.value = "";
        clearInterval(timer);
    }
}

// FUNCTION TO START TIMER
function initTimer(){
    if(leftTime > 0){
        leftTime--;
        timeCount.innerText = leftTime;
    } else {
        clearInterval(timer);
    }
}

// FUNCTION TO REFRESH THE GAME WHILE CALLING A NEW PARAGRAPH
function refreshGame() {
    randomParagraph();
    inputfield.value = "";
    clearInterval(timer);
    leftTime = maxTime;
    charIndex = 0, 
    mistakes = 0;
    isTyping = 0;
    timeCount.innerText = leftTime;
    mistakeCount.innerText = mistakes;
    wpmCount.innerText = 0;
    cpmCount.innerText = 0;
}

randomParagraph();
inputfield.addEventListener("input",initialTyping);
tryAgainButton.addEventListener("click",refreshGame);