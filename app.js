const recovery = document.querySelector("#recovery");
const currentHealth = document.querySelector("#current-health");
const maxHealth = document.querySelector("#max-health");
const result = document.querySelector("#recovery-result");
const progress = document.querySelector("#recovery-progress");
const roll = document.querySelector("#roll");
let total = 0;
let turn = 0;

function updateResult(target, die) {
  const recovered = total >= target;
  const summary = `누적 ${total} / ${target}`;
  result.textContent = turn
    ? `${turn}턴 · 주사위 ${die} · ${summary}${recovered ? " · 마비 해제" : ""}`
    : summary;
  progress.max = target;
  progress.value = Math.min(total, target);
  roll.disabled = recovered;
}

function resetProgress() {
  total = 0;
  turn = 0;
  const target = maxHealth.validity.valid ? maxHealth.valueAsNumber : 10;
  updateResult(target);
}

function validateHealth() {
  const exceedsMaximum = currentHealth.validity.valid && maxHealth.validity.valid
    && currentHealth.valueAsNumber > maxHealth.valueAsNumber;
  currentHealth.setCustomValidity(exceedsMaximum ? "현재 건강은 최대 건강 이하여야 합니다." : "");
}

recovery.addEventListener("input", () => {
  currentHealth.setCustomValidity("");
  validateHealth();
  resetProgress();
});

recovery.addEventListener("submit", (event) => {
  event.preventDefault();
  validateHealth();
  if (!recovery.reportValidity() || roll.disabled) return;
  const die = 1 + Math.floor(Math.random() * currentHealth.valueAsNumber);
  total += die;
  turn += 1;
  updateResult(maxHealth.valueAsNumber, die);
});

recovery.addEventListener("reset", () => {
  currentHealth.setCustomValidity("");
  queueMicrotask(resetProgress);
});
