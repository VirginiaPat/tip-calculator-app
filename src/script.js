"use strict";

// Select elements
const billInput = document.getElementById("bill-total");
const tipButtons = document.querySelectorAll(".tip-btn");
const tipCustomInput = document.getElementById("tip-custom");
const numOfPeopleInput = document.getElementById("number-of-people");
const tipAmountOutput = document.getElementById("tip-amount-output");
const totalAmountOutput = document.getElementById("total-amount-output");
const resetButton = document.getElementById("reset-button");
const errorMessagePersons = document.getElementById("number-of-people-error");
const errorMessageBill = document.getElementById("bill-error");
const errorMessageCustom = document.getElementById("custom-tip-error");

let billAmount = 0;
let tipPercentage = 0;
let numberOfPeople = 0;

// Set reset button disabled
resetButton.disabled = true;
resetButton.classList.add("cursor-not-allowed");

// Functions
const showBillErrorMessage = () => {
  errorMessageBill.classList.remove("hidden");
  billInput.parentElement.classList.remove("focus-within:outline-green-400");
  billInput.parentElement.classList.add("focus-within:outline-orange-400");
};

const hideBillErrorMessage = () => {
  errorMessageBill.classList.add("hidden");
  billInput.parentElement.classList.remove("focus-within:outline-orange-400");
  billInput.parentElement.classList.add("focus-within:outline-green-400");
};

const showCustomTipErrorMsg = () => {
  errorMessageCustom.classList.remove("hidden");
  tipCustomInput.classList.remove("focus:outline-green-400");
  tipCustomInput.classList.add("focus:outline-orange-400");
};

const hideCustomTipErrorMsg = () => {
  errorMessageCustom.classList.add("hidden");
  tipCustomInput.classList.remove("focus:outline-orange-400");
  tipCustomInput.classList.add("focus:outline-green-400");
};

const showNumPeopleErrorMessage = () => {
  errorMessagePersons.classList.remove("hidden");
  numOfPeopleInput.parentElement.classList.remove(
    "focus-within:outline-green-400"
  );
  numOfPeopleInput.parentElement.classList.add(
    "focus-within:outline-orange-400"
  );
};

const hideNumPeopleErrorMessage = () => {
  errorMessagePersons.classList.add("hidden");
  numOfPeopleInput.parentElement.classList.remove(
    "focus-within:outline-orange-400"
  );
  numOfPeopleInput.parentElement.classList.add(
    "focus-within:outline-green-400"
  );
};

const resetBtnActivation = () => {
  resetButton.disabled = false;
  resetButton.classList.remove("cursor-not-allowed", "text-green-800");
  resetButton.classList.add(
    "cursor-pointer",
    "text-white",
    "hover:bg-green-400",
    "hover:text-green-900",
    "hover:transition-all",
    "focus:outline-none",
    "focus:bg-green-400",
    "focus:text-green-900",
    "active:bg-green-200",
    "active:text-green-900"
  );
};

const resetBtnDisable = () => {
  resetButton.disabled = true;
  resetButton.classList.remove(
    "cursor-pointer",
    "text-white",
    "hover:bg-green-400",
    "hover:text-green-900",
    "hover:transition-all",
    "focus:outline-none",
    "focus:bg-green-400",
    "focus:text-green-900",
    "active:bg-green-200",
    "active:text-green-900"
  );
  resetButton.classList.add("cursor-not-allowed", "text-green-800");
};

const calculateCosts = () => {
  if (billAmount > 0 && tipPercentage > 0 && numberOfPeople > 0) {
    const tipAmount = (billAmount * tipPercentage * 0.01) / numberOfPeople;
    const totalAmount = billAmount / numberOfPeople + tipAmount;

    tipAmountOutput.textContent = `$${tipAmount.toFixed(2)}`;
    totalAmountOutput.textContent = `$${totalAmount.toFixed(2)}`;

    // make reset button active
    resetBtnActivation();
  } else {
    tipAmountOutput.textContent = "$0.00";
    totalAmountOutput.textContent = "$0.00";
  }
};

// Event listeners------------------------------------------------------
// Bill INPUT-----------------------------------------------------------
// Remove placeholder when click input
const billPlaceholder = billInput.placeholder;

billInput.addEventListener("focus", () => {
  billInput.placeholder = "";
});

// add placeholder back when click out of input
billInput.addEventListener("blur", () => {
  if (billInput.value === "") {
    billInput.placeholder = billPlaceholder;
  }
});

//Handling bill input
billInput.addEventListener("input", (e) => {
  const insertedBillValue = parseFloat(e.target.value);

  if (isNaN(insertedBillValue) || insertedBillValue <= 0) {
    billInput.setAttribute("aria-invalid", "true");
    showBillErrorMessage();
  } else {
    billAmount = insertedBillValue;
    calculateCosts();
  }

  // if input is empty but contains error message-remove it
  if (
    billInput.value === "" &&
    !errorMessageBill.classList.contains("hidden")
  ) {
    billInput.setAttribute("aria-invalid", "false");
    hideBillErrorMessage();
  }
});

// Tip % ---------------------------------------------------------------------
tipButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const pressedButton = e.target;

    // Remove active state from other buttons
    tipButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", "false");
      btn.classList.remove("active:bg-green-200", "active:text-green-900");
    });

    // add active to the current button
    pressedButton.setAttribute("aria-pressed", "true");
    pressedButton.classList.add("active:bg-green-200", "active:text-green-900");

    tipCustomInput.value = "";

    tipPercentage = parseFloat(pressedButton.dataset.tip);

    calculateCosts();
  });
});

// Custom tip % INPUT-------------------------------------------
// Remove placeholder when click input
const customTipPlaceholder = tipCustomInput.placeholder;

tipCustomInput.addEventListener("focus", () => {
  tipCustomInput.placeholder = "";
});

// add placeholder back when click out of input
tipCustomInput.addEventListener("blur", () => {
  if (tipCustomInput.value === "") {
    tipCustomInput.placeholder = customTipPlaceholder;
  }
});

// Hanndling custom tip input
tipCustomInput.addEventListener("input", (e) => {
  const insertedCustomTip = parseFloat(e.target.value);

  // Remove active state from other buttons
  tipButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.classList.remove("active:bg-green-200", "active:text-green-900");
  });

  if (isNaN(insertedCustomTip) || insertedCustomTip <= 0) {
    tipCustomInput.setAttribute("aria-invalid", "true");
    showCustomTipErrorMsg();
  } else {
    tipPercentage = insertedCustomTip;
    calculateCosts();
  }

  // if input is empty but conatins error message-remove it
  if (
    tipCustomInput.value === "" &&
    !errorMessageCustom.classList.contains("hidden")
  ) {
    tipCustomInput.setAttribute("aria-invalid", "false");
    hideCustomTipErrorMsg();
  }
});

// Number of people INPUT--------------------------------
// Remove placeholder when click input
const numPersonsPlaceholder = numOfPeopleInput.placeholder;

numOfPeopleInput.addEventListener("focus", () => {
  numOfPeopleInput.placeholder = "";
});

// add placeholder back when click out of input
numOfPeopleInput.addEventListener("blur", () => {
  if (numOfPeopleInput.value === "") {
    numOfPeopleInput.placeholder = numPersonsPlaceholder;
  }
});

//Handling number of people input
numOfPeopleInput.addEventListener("input", (e) => {
  const insertedNumberPeopleValue = parseFloat(e.target.value);

  if (isNaN(insertedNumberPeopleValue) || insertedNumberPeopleValue <= 0) {
    numOfPeopleInput.setAttribute("aria-invalid", "true");
    showNumPeopleErrorMessage();
  } else {
    numberOfPeople = insertedNumberPeopleValue;
    calculateCosts();
  }

  // if input is empty but contains error message-remove it
  if (
    numOfPeopleInput.value === "" &&
    !errorMessagePersons.classList.contains("hidden")
  ) {
    numOfPeopleInput.setAttribute("aria-invalid", "false");
    hideNumPeopleErrorMessage();
  }
});

//Reset button-------------------------------------------------
resetButton.addEventListener("click", () => {
  billAmount = 0;
  tipPercentage = 0;
  numberOfPeople = 0;

  billInput.value = "";
  tipCustomInput.value = "";
  numOfPeopleInput.value = "";

  tipButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.classList.remove("active:bg-green-200", "active:text-green-900");
  });

  tipAmountOutput.textContent = "$0.00";
  totalAmountOutput.textContent = "$0.00";

  // disable reset button
  resetBtnDisable();
});
