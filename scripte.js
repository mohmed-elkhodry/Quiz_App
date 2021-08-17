//elements

let count           = document.querySelector(".number"),
    span_container  = document.querySelector(".spans"),
    answers_cont    = document.querySelector(".answers"),
    submit          = document.querySelector(".submit-btn"),
    timer           = document.querySelector(".timer"),
    retakeBtn       = document.querySelector(".retake");

//properties
let currentIndex = 0;
let score = 0;
let CountDowninterval;


//methods

function getQusestion(){
  let request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(this.readyState === 4 && this.status === 200){

      //variables
      let data = JSON.parse(this.responseText);
      let qCount = data.length;

      //bullets function
      bullets(qCount);

      //get data function
      addData(currentIndex,data,qCount);

      //start count timer
      countDown(10,qCount);

      //next quesdtion function
      submit.onclick = () => {
        if (currentIndex+1 < qCount) {
          let rightAnswer = data[currentIndex].right_answer;
        currentIndex++;
        chechanswers(rightAnswer,qCount);
        document.querySelector(".question").textContent ="";
        answers_cont.innerHTML="";
        addData(currentIndex,data,qCount);
        //handle bullet
        handleBulls(qCount);
        //finish time and start new ont
        clearInterval(CountDowninterval);
        countDown(10,qCount);
        }else{
        showresult(qCount);
        clearInterval(CountDowninterval);
        }
      };
    }
  };

  request.open("GET","file.json",true);
  request.send();
}

function bullets(length){
  count.textContent = length;
  for (let index = 0; index < length; index++) {
    let span_ele = document.createElement("span");

    if(index === 0){
      span_ele.className= "done";
    }
    span_container.appendChild(span_ele);
    
  }

}

function addData(i,obj,count){
  if(i < count){
    let myobj = obj[i];
    let title   = myobj.title;
    document.querySelector(".question").textContent = title + " ?";
    for (let index = 1; index <= 4; index++) {

      //main div for rach answer
      let main_div = document.createElement("div");
      main_div.className = "anser";

      //make radio button
      let radioIn = document.createElement("input");

      //make first answer checked by default
      if( index === 1){
        radioIn.checked = true;
      }

      //ser radio button properties
      radioIn.type =  "radio";
      radioIn.name= "answer";
      radioIn.id = `answer_${index}`;
      radioIn.dataset.answer = myobj[`answer_${index}`];

      //create label
      let label = document.createElement("label");
      label.htmlFor = `answer_${index}`;
      let label_text = document.createTextNode(myobj[`answer_${index}`]);


      //append elemnts
      label.appendChild(label_text);
      main_div.appendChild(radioIn);
      main_div.appendChild(label);
      answers_cont.appendChild(main_div);
    }
  }
}

function chechanswers(rAnswer, count){
  
  let answers = document.getElementsByName("answer");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }


  if (rAnswer === theChoosenAnswer) {
    score++;
  }
}

function handleBulls(qCount){
  let spans = document.querySelectorAll(".spans span");
  let arrayOfSpans = Array.from(spans);
  arrayOfSpans.forEach((span,index) => {
    if (index === currentIndex) {
      span.className = "done";
    }
  });
  if (currentIndex<qCount) {
    document.querySelector(".current").textContent = currentIndex + 1;
  }
}

function showresult(qCount){
  document.querySelector(".main-container").style.display="none";
  document.querySelector(".result").style.display="block";
  document.querySelector(".score").textContent = score;
  let word = document.querySelector(".word");
  if (score/qCount < 0.5) {
    word.style.color = "red";
    word.textContent = "failed";
  }else{
    word.style.color = "green";
    word.textContent = "passed"
  }

}

function countDown(interval,count){
  if(currentIndex < count){
    let minutes,seconds;
    CountDowninterval = setInterval(() => {
      minutes = parseInt(interval/60);
      seconds =parseInt(interval%60);
      minutes = minutes < 10 ?`0${minutes}` : minutes;
      seconds = seconds < 10 ?`0${seconds}` : seconds;
      timer.innerHTML = `${minutes} : ${seconds}`;
      if (--interval < 0) {
        clearInterval(CountDowninterval);
        submit.click();
      }

    }, 1000);
  }
}
getQusestion();

retakeBtn.onclick = () =>{
  currentIndex = 0;
  getQusestion();
  document.querySelector(".main-container").style.display="block";
  document.querySelector(".result").style.display="none";
  document.querySelector(".question").innerHTML = "";
  answers_cont.innerHTML = "";
  span_container.innerHTML = "";
}