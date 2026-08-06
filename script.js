const letterForm = document.querySelector(".letter-body");
const btnKeep = document.querySelector(".btn-keep");
let btnBurn = document.querySelector(".btn-burn");

function getInfoForm() {
  const text = letterForm.value;
  letterForm.value = "";
  console.log(text);
}

function burnLetter() {
  letterForm.value = "";
  console.log("Letter has been deleted");
}

btnKeep.addEventListener("click", getInfoForm);
btnBurn.addEventListener("click", burnLetter);
