// ── Elements ──
const letterForm = document.querySelector(".letter-body");
const recipientInput = document.querySelector("#recipient");
const btnKeep = document.querySelector(".btn-keep");
const btnBurn = document.querySelector(".btn-burn");

const writeView = document.querySelector(".typewriter");
const envelopesView = document.querySelector(".envelopes-view");
const envelopeList = document.querySelector(".envelope-list");

const navWrite = document.querySelector(".sidebar .write");
const navEnvelopes = document.querySelector(".sidebar .envelopes");

const formFooter = document.querySelector(".form-footer");
const letterDateEl = document.querySelector(".letter-date");
const btnNewLetter = document.querySelector(".btn-new-letter");

const modalOverlay = document.querySelector(".modal-overlay");
const modalConfirm = document.querySelector(".modal-confirm");
const modalCancel = document.querySelector(".modal-cancel");

const burnOverlay = document.querySelector(".burn-overlay");
const burnConfirm = document.querySelector(".burn-confirm");
const burnCancel = document.querySelector(".burn-cancel");
const burnToast = document.querySelector(".burn-toast");

// ── Storage helpers ──
function getLetters() {
  return JSON.parse(localStorage.getItem("letters") || "[]");
}

function saveLetters(letters) {
  localStorage.setItem("letters", JSON.stringify(letters));
}

// ── Keep flow (with confirmation modal) ──
function requestKeepLetter() {
  const text = letterForm.value.trim();
  if (!text) return;
  openModal();
}

function openModal() {
  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

function confirmKeepLetter() {
  const text = letterForm.value.trim();
  if (!text) {
    closeModal();
    return;
  }

  const letter = {
    id: Date.now(),
    recipient: recipientInput.value.trim() || "Self",
    text,
    date: new Date().toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
  };

  const letters = getLetters();
  letters.unshift(letter);
  saveLetters(letters);

  closeModal();
  showKeepFeedback();

  letterForm.value = "";
  recipientInput.value = "";
}

function showKeepFeedback() {
  btnKeep.classList.add("sealed");
  setTimeout(() => btnKeep.classList.remove("sealed"), 1200);
}

let toastTimeout = null;

// ── Burn flow (with confirmation + toast) ──
function requestBurnLetter() {
  const text = letterForm.value.trim();
  if (!text) return;
  openBurnModal();
}

function openBurnModal() {
  burnOverlay.classList.remove("hidden");
}

function closeBurnModal() {
  burnOverlay.classList.add("hidden");
}

function confirmBurnLetter() {
  letterForm.value = "";
  recipientInput.value = "";
  closeBurnModal();
  showBurnToast();
}

function showBurnToast() {
  burnToast.classList.remove("hidden");
  burnToast.classList.remove("replay");
  void burnToast.offsetWidth;
  burnToast.classList.add("replay");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    burnToast.classList.add("hidden");
  }, 2400);
}

// ── Envelopes rendering ──
function renderEnvelopes() {
  const letters = getLetters();
  envelopeList.innerHTML = "";

  if (letters.length === 0) {
    envelopeList.innerHTML = `<p class="empty-state">No letters kept yet.</p>`;
    return;
  }

  letters.forEach((letter) => {
    const envelope = document.createElement("div");
    envelope.className = "envelope";
    envelope.title = `Dear ${letter.recipient},`;
    envelope.innerHTML = `<span class="envelope-date">${letter.date}</span>`;
    envelope.addEventListener("click", () => openEnvelope(letter));
    envelopeList.appendChild(envelope);
  });
}

// ── Open a kept letter (read-only) ──
function openEnvelope(letter) {
  recipientInput.value = letter.recipient;
  letterForm.value = letter.text;
  letterDateEl.textContent = letter.date;

  recipientInput.readOnly = true;
  letterForm.readOnly = true;
  writeView.classList.add("viewing");

  writeView.classList.remove("hidden");
  envelopesView.classList.add("hidden");
  navWrite.classList.remove("active");
  navEnvelopes.classList.add("active");
}

// ── Start a fresh, editable letter ──
function startNewLetter() {
  recipientInput.value = "";
  letterForm.value = "";
  recipientInput.readOnly = false;
  letterForm.readOnly = false;
  writeView.classList.remove("viewing");
}

// ── View switching ──
function showView(view) {
  writeView.classList.toggle("hidden", view !== "write");
  envelopesView.classList.toggle("hidden", view !== "envelopes");

  navWrite.classList.toggle("active", view === "write");
  navEnvelopes.classList.toggle("active", view === "envelopes");

  if (view === "envelopes") renderEnvelopes();
}

// ── Event listeners ──
btnKeep.addEventListener("click", requestKeepLetter);
btnBurn.addEventListener("click", requestBurnLetter);
modalConfirm.addEventListener("click", confirmKeepLetter);
modalCancel.addEventListener("click", closeModal);
burnConfirm.addEventListener("click", confirmBurnLetter);
burnCancel.addEventListener("click", closeBurnModal);

btnNewLetter.addEventListener("click", () => {
  startNewLetter();
  showView("write");
});

navWrite.addEventListener("click", () => {
  startNewLetter();
  showView("write");
});
navEnvelopes.addEventListener("click", () => showView("envelopes"));
