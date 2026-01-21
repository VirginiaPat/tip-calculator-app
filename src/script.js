"use strict";

// Select elements
const billInput = document.getElementById("bill-total");
const billInputParentEl = document.getElementById("bill-total-parentEl");
const tipButtons = document.querySelectorAll(".tip-btn");
const tipCustomInput = document.getElementById("tip-custom");
const numOfPeopleInput = document.getElementById("number-of-people");
const numOfPeopleInputParentEl = document.getElementById(
  "number-of-people-parentEl"
);
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
const showErrorMessage = (errorMessageElement, inputElement) => {
  const messageElement = errorMessageElement;
  const inputEl = inputElement;
  messageElement.classList.remove("hidden");
  inputEl.classList.remove("focus-within:outline-green-400");
  inputEl.classList.add("focus-within:outline-orange-400");
};

const hideErrorMessage = (errorMessageElement, inputElement) => {
  const messageElement = errorMessageElement;
  const inputEl = inputElement;
  messageElement.classList.add("hidden");
  inputEl.classList.add("focus-within:outline-green-400");
  inputEl.classList.remove("focus-within:outline-orange-400");
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
  let value = e.target.value;

  // Remove any non-numeric characters except decimal point
  value = value.replace(/[^0-9.]/g, "");

  // Prevent multiple decimals
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  // Limit to 2 decimal places
  if (parts.length === 2 && parts[1].length > 2) {
    value = parts[0] + "." + parts[1].substring(0, 2);
  }
  // Update the input value to sanitized version
  e.target.value = value;

  const insertedBillValue = parseFloat(value);

  // Clear error if input is empty
  if (value === "") {
    billInput.removeAttribute("aria-invalid");
    hideErrorMessage(errorMessageBill, billInputParentEl);
    billAmount = 0; //reset bill amount
    calculateCosts();
    return; //exit early
  }

  //Validate input
  if (isNaN(insertedBillValue) || insertedBillValue <= 0) {
    billInput.setAttribute("aria-invalid", "true");
    showErrorMessage(errorMessageBill, billInputParentEl);
    billAmount = 0;
    calculateCosts();
    return;
  } else {
    billInput.removeAttribute("aria-invalid");
    hideErrorMessage(errorMessageBill, billInputParentEl);

    billAmount = insertedBillValue;
    calculateCosts();
  }
});

// Tip % ---------------------------------------------------------------------
tipButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const pressedButton = e.target;

    // Remove active state from other buttons
    tipButtons.forEach((btn) => {
      btn.removeAttribute("aria-pressed");
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

// Handling custom tip input
tipCustomInput.addEventListener("input", (e) => {
  let value = e.target.value;

  // Remove any non-numeric characters
  value = value.replace(/[^0-9]/g, "");

  // Update the input value to sanitized version
  e.target.value = value;

  const insertedCustomTip = parseFloat(value);

  // Remove active state from other buttons
  tipButtons.forEach((button) => {
    button.removeAttribute("aria-pressed");
    button.classList.remove("active:bg-green-200", "active:text-green-900");
  });

  // Clear error if input is empty
  if (value === "") {
    tipCustomInput.removeAttribute("aria-invalid"); // remove invalid state
    hideErrorMessage(errorMessageCustom, tipCustomInput);
    tipPercentage = 0; // reset tip percentage
    calculateCosts();
    return; // exit early
  }

  // Validate input
  if (isNaN(insertedCustomTip) || insertedCustomTip <= 0) {
    tipCustomInput.setAttribute("aria-invalid", "true");
    showErrorMessage(errorMessageCustom, tipCustomInput);
    tipPercentage = 0; // reset to avoid stale value
    calculateCosts(); // update calculations with reset tip
    return;
  } else {
    // Clear error state when valid input entered
    tipCustomInput.removeAttribute("aria-invalid");
    hideErrorMessage(errorMessageCustom, tipCustomInput);

    tipPercentage = insertedCustomTip;
    calculateCosts();
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
  let value = e.target.value;

  // Remove any non-numeric characters
  value = value.replace(/[^0-9]/g, "");

  // Update the input value to sanitized version
  e.target.value = value;

  const insertedNumberPeopleValue = parseFloat(e.target.value);

  // Clear error if input is empty
  if (numOfPeopleInput.value === "") {
    numOfPeopleInput.removeAttribute("aria-invalid");
    hideErrorMessage(errorMessagePersons, numOfPeopleInputParentEl);
    numberOfPeople = 0;
    calculateCosts();
    return;
  }

  // Validate input
  if (isNaN(insertedNumberPeopleValue) || insertedNumberPeopleValue <= 0) {
    numOfPeopleInput.setAttribute("aria-invalid", "true");
    showErrorMessage(errorMessagePersons, numOfPeopleInputParentEl);
    numberOfPeople = 0;
    calculateCosts();
    return;
  } else {
    numOfPeopleInput.removeAttribute("aria-invalid");
    hideErrorMessage(errorMessagePersons, numOfPeopleInputParentEl);
    numberOfPeople = insertedNumberPeopleValue;
    calculateCosts();
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

  billInput.placeholder = "0";
  tipCustomInput.placeholder = "Custom";
  numOfPeopleInput.placeholder = "0";

  tipButtons.forEach((button) => {
    button.removeAttribute("aria-pressed");
    button.classList.remove("active:bg-green-200", "active:text-green-900");
  });

  tipAmountOutput.textContent = "$0.00";
  totalAmountOutput.textContent = "$0.00";

  // disable reset button
  resetBtnDisable();
});
