import { questions } from "./question.js";
let button = document.querySelector(".added-button");

class QuestionAdded {
	fieldnames = ["id", "question", "answer"];
	option_fields = ["option-1", "option-2", "option-3", "option-4"];

	constructor(questions) {
		this.questions = questions || [];
		this.set_inputs();
		this.set_hidden_inputs();
		this.bind_events();
	}

	set_inputs() {
		this.inputs = {
			options: []
		};
		for (let f of this.fieldnames) {
			this.inputs[f] = document.querySelector(`input[name="${f}"]`);
		}
		for (let f of this.option_fields) {
			this.inputs.options.push(document.querySelector(`input[name="${f}"]`));
		}
	}

	set_hidden_inputs() {
		let id = this.get_id();
		this.inputs.id.value = (id + 1).toString();
	}

	bind_events() {
		button.addEventListener("click", (e) => this.handle_submit(e));
		for (let field of Object.keys(this.inputs)) {
			if (field === "options") {
				for (let input of this.inputs.options) {
					input.addEventListener("change", () => {
						this.set_has_error_class_for_field(input.name);
					});
				}
			} else {
				this.inputs[field].addEventListener("change", () => {
					this.set_has_error_class_for_field(field);
				});
			}
		}
	}

	handle_submit(e) {
		e.preventDefault();

		if (!this.validate_mandatory()) {
			alert_message.style.display = "none";
			return false;
		} else {
			this.store_local_storage();
			this.clear_field_values();
			this.set_hidden_inputs();
			this.submit_message("Congratulations! Quiz has been added successfully.");
		}
	}

	store_local_storage() {
		const values = this.get_values();
		values.id = Number(values.id);
		this.questions.push(values);
		localStorage.setItem("questions", JSON.stringify(this.questions));
	}

	validate_mandatory() {
		this.set_has_error_class();

		let answer = this.inputs["answer"].value;
		let option_values = this.inputs["options"].map(option => option.value);

		if (!option_values.includes(answer)) {
			this.inputs["answer"].classList.add("has-error");
			return false;
		}

		for (let field of this.fieldnames.concat(this.option_fields)) {
			if (!this.validate_mandatory_for_field(field)) {
				return false;
			}
		}
		return true;
	}

	set_has_error_class() {
		for (let field of this.fieldnames.concat(this.option_fields)) {
			this.set_has_error_class_for_field(field);
		}
	}

	set_has_error_class_for_field(field) {
		if (field.startsWith("option-")) {
			let optionIndex = parseInt(field.split("-")[1]) - 1;
			if (!this.validate_mandatory_for_field(field)) {
				this.inputs.options[optionIndex].classList.add("has-error");
			} else {
				this.inputs.options[optionIndex].classList.remove("has-error");
			}
		} else {
			if (!this.validate_mandatory_for_field(field)) {
				this.inputs[field].classList.add("has-error");
			} else {
				this.inputs[field].classList.remove("has-error");
			}
		}
	}

	validate_mandatory_for_field(field) {
		let value = this.get_value(field);
		return value ? true : false;
	}

	get_values() {
		let values = {};
		for (let field of this.fieldnames) {
			values[field] = this.get_value(field);
		}
		values.options = this.inputs.options.map(option => option.value);
		return values;
	}

	get_value(field) {
		if (field.startsWith("option-")) {
			let optionIndex = parseInt(field.split("-")[1]) - 1;
			return this.inputs.options[optionIndex].value.trim();
		}
		let input = this.inputs[field];
		if (!input) {
			return null;
		}
		return input.value.trim();
	}

	clear_field_values() {
		for (let field of this.fieldnames) {
			this.inputs[field].value = "";
		}
		for (let input of this.inputs.options) {
			input.value = "";
		}
	}

	get_id() {
		if (this.questions.length) {
			let id = parseInt(this.questions[this.questions.length - 1].id);
			return isNaN(id) ? 0 : id;
		}
		return 0;
	}

	submit_message (message) {
		let messageContainer = document.querySelector(".message");
		messageContainer.innerText = message;
		messageContainer.classList.add("active");

		setTimeout(() => {
			messageContainer.classList.remove("active");
		}, 4000);
	}
}

new QuestionAdded(questions);

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