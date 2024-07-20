import { questions } from "./question.js";

const startButton = document.querySelector(".start-button");
const alertContainer = document.querySelector(".alert-container");
const informationContainer = document.querySelector(".information-container");
const quizContainer = document.querySelector(".quiz-container");
const exitButton = informationContainer.querySelector(".action-buttons-container .quit");
const continueButton = informationContainer.querySelector(".action-buttons-container .restart");
const resultContainer = document.querySelector(".result-container");
const resultExitButton = resultContainer.querySelector(".action-buttons-container .quit");
const resultContinueButton = resultContainer.querySelector(".action-buttons-container .restart");
const score = document.querySelector(".result-container .score");
const nextButton = document.querySelector(".quiz-container-footer .next-button");
const question_counter_container = document.querySelector(".quiz-container-footer .total-questions");
const question = document.querySelector(".quiz-container-body .question");
const options_list = document.querySelector(".quiz-container-body .options-list");
const count_timer = document.querySelector(".quiz-container-header .timer-container .timer-second");
const timer_title = document.querySelector(".quiz-container-header .timer-container .timer-title");
const timer_line = document.querySelector(".quiz-container-header .timer-line");
const tick = `<div class="icon correct"><i class="fas fa-check"></i></div>`;
const wrong = `<div class="icon wrong"><i class="fas fa-times"></i></div>`;
let index = 0;
let counter;
let timer_line_counter;
let initial_time = 15;
let initial_timer_line = 0;
let user_score = 0;

/* Handle Events Listener */
startButton.addEventListener("click", (e) => {
	ellipsis.style.display = "none";

	if(!questions) {
		alertContainer.classList.add("active-alert");
	} else {
		informationContainer.classList.add("active-information-container");
	}
});

exitButton.addEventListener("click", (e) => {
	ellipsis.style.display = "block";
	informationContainer.classList.remove("active-information-container");
});

continueButton.addEventListener("click", (e) => {
	informationContainer.classList.remove("active-information-container");
	quizContainer.classList.add("active-quiz-container");
	display_quiz(index);
	quiz_counter(index);
	quiz_timer(initial_time);
	quiz_timer_line(initial_timer_line);
});

nextButton.addEventListener("click", (e) => {
	timer_title.innerText = "Time Left";
	nextButton.style.display = "none";
	if(index < questions.length - 1) {
		index += 1;
		quiz_counter(index);
		display_quiz(index);
		clearInterval(counter);
		quiz_timer(initial_time);
		clearInterval(timer_line_counter);
		quiz_timer_line(initial_timer_line);
	} else {
		clearInterval(counter);
		clearInterval(timer_line_counter);
		display_result();
	};
});

const display_quiz = (index) => {
	question.innerHTML = `${questions[index].id}. ${questions[index].question}`;
	const li = `
		<li class="option">${questions[index].options[0]}</li>
		<li class="option">${questions[index].options[1]}</li>
		<li class="option">${questions[index].options[2]}</li>
		<li class="option">${questions[index].options[3]}</li>
	`
	options_list.innerHTML = li;

	/* Get options from DOM and pass a selected option */
	let options = document.querySelectorAll(".quiz-container-body .options-list .option");
	options.forEach((option) => {
		option.addEventListener("click", (e) => {
			option_selected(option, options);
		});
	});
};

const option_selected = (option, options) => {
	clearInterval(counter);
	clearInterval(timer_line_counter);
	let user_answer = option.innerText.toLowerCase();
	let answer = questions[index].answer.toLowerCase();

	if(user_answer === answer) {
		user_score += 1;
		option.classList.add("correct");
		option.insertAdjacentHTML("beforeend", tick);
	} else {
		option.classList.add("wrong");
		option.insertAdjacentHTML("beforeend", wrong);

		/* If answer is incorrect then automatically selected correct answer */
		show_answer(options);
	};

	/* Once user selected disabled all options */
	disabled_options(options);

	nextButton.style.display = "block";

	/* Change button text if question is last */
	if(index === questions.length -1){
		nextButton.innerText = "Sumbit Answers";
	} else {
		nextButton.innerText = "Next Question";
	}
};

const quiz_counter = (index) => {
	let p = `<p>${questions[index].id} of ${questions.length} Questions</p>`;
	question_counter_container.innerHTML = p;
};


const quiz_timer = (time) => {
	const update_timer = () => {
		let options = document.querySelectorAll(".quiz-container-body .options-list .option");
		count_timer.innerText = time;
		time--;
		if (time < 9) { count_timer.innerText = "0" + count_timer.innerText };
		if (time < 0) {
			clearInterval(counter); count_timer.innerText = "00";
			timer_title.innerText = "Time Off";
			disabled_options(options);
			show_answer(options);
			nextButton.style.display = "block";
		};
	};

	update_timer();
	counter = setInterval(update_timer, 1000);
};

const quiz_timer_line = (time) => {
	const update_timer_line = () => {
		time += 1;
		timer_line.style.width = `${time}px`;
		if (time > (quizContainer.offsetWidth - 1)) {
			clearInterval(timer_line_counter)
		};
	};

	update_timer_line();
	timer_line_counter = setInterval(update_timer_line, 15000 / (quizContainer.offsetWidth - 1));
};

const quit_quiz = () => {
	location.reload();
}

const restart_quiz = () => {
	quizContainer.classList.add("active-quiz-container");
	resultContainer.classList.remove("active-result-container");

	index = 0;
	counter;
	timer_line_counter;
	initial_time = 15;
	initial_timer_line = 0;
	user_score = 0;

	display_quiz(index);
	quiz_counter(index);
	clearInterval(counter);
	quiz_timer(initial_time);
	clearInterval(timer_line_counter);
	quiz_timer_line(initial_timer_line);
	timer_title.innerText = "Time Left";
	nextButton.innerText = "Next Question";
	nextButton.style.display = "none";
};

const display_result = () => {
	informationContainer.classList.remove("active-information-container");
	quizContainer.classList.remove("active-quiz-container");
	resultContainer.classList.add("active-result-container");

	if (user_score > (questions.length / 2)) {
		score.innerHTML = `<p>Congrats! &#127881; you got ${user_score} out of ${questions.length}</p>`;
	} else if (user_score > 2) {
		score.innerHTML = `<p>Nice! &#128526; you got ${user_score} out of ${questions.length}</p>`;
	} else {
		score.innerHTML = `<p>Sorry! &#128542; you got only ${user_score} out of ${questions.length}</p>`;
	};

	/* EXIT OR RESTART QUIZ */
	resultExitButton.addEventListener("click", quit_quiz);
	resultContinueButton.addEventListener("click", restart_quiz);
};


const show_answer = (options) => {
	options.forEach((option) => {
		if(option.innerText.toLowerCase() === questions[index].answer.toLowerCase()) {
			option.insertAdjacentHTML("beforeend", tick);
			option.classList.add("correct");
		}
	})
};

const disabled_options = (options) => {
	options.forEach((option) => {
		option.classList.add("disabled");
	});
};

/* -------------- For Navigation ----------------- */
const ellipsis = document.querySelector(".ellipsis");
const nav = document.querySelector(".navigation");

ellipsis.addEventListener("click", (e) => {
	e.stopPropagation();	
	nav.classList.toggle("active");
});

/* Remove active class when user click on window */
document.addEventListener("click", () => {
	nav.classList.remove("active");
})