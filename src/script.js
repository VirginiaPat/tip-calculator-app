"use strict";

// Select elements
const billInput = document.getElementById("bill-total");
const billInputParentEl = document.getElementById("bill-total-parentEl");
const tipButtons = document.querySelectorAll(".tip-btn");
const tipCustomInput = document.getElementById("tip-custom");
const numOfPeopleInput = document.getElementById("number-of-people");
const numOfPeopleInputParentEl = document.getElementById(
  "number-of-people-parentEl",
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
  // for bill and number of people input
  if (inputEl.classList.contains("focus-within:outline-green-400")) {
    inputEl.classList.remove("focus-within:outline-green-400");
    inputEl.classList.add("focus-within:outline-orange-400");
  }
  // for custom tip input
  if (inputEl.classList.contains("focus:outline-green-400")) {
    inputEl.classList.remove("focus:outline-green-400");
    inputEl.classList.add("focus:outline-orange-400");
  }
};

const hideErrorMessage = (errorMessageElement, inputElement) => {
  const messageElement = errorMessageElement;
  const inputEl = inputElement;
  messageElement.classList.add("hidden");
  // for bill and number of people input
  if (inputEl.classList.contains("focus-within:outline-orange-400")) {
    inputEl.classList.add("focus-within:outline-green-400");
    inputEl.classList.remove("focus-within:outline-orange-400");
  }
  // for custom tip input
  if (inputEl.classList.contains("focus:outline-orange-400")) {
    inputEl.classList.add("focus:outline-green-400");
    inputEl.classList.remove("focus:outline-orange-400");
  }
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
    "active:text-green-900",
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
    "active:text-green-900",
  );
  resetButton.classList.add("cursor-not-allowed", "text-green-800");
};

// General reset function
const resetValues = () => {
  //Reset state variables
  billAmount = 0;
  tipPercentage = 0;
  numberOfPeople = 0;

  // Clear all inputs
  billInput.value = "";
  tipCustomInput.value = "";
  numOfPeopleInput.value = "";

  // Reset placeholders
  billInput.placeholder = "0";
  tipCustomInput.placeholder = "Custom";
  numOfPeopleInput.placeholder = "0";

  // Remove any active states from tip buttons
  tipButtons.forEach((button) => {
    button.removeAttribute("aria-pressed");
    button.classList.remove("active:bg-green-200", "active:text-green-900");
    button.removeAttribute("data-selected");
  });

  // Reset outpouts
  tipAmountOutput.textContent = "$0.00";
  totalAmountOutput.textContent = "$0.00";

  // Clear aria-invalid attributes
  billInput.removeAttribute("aria-invalid");
  tipCustomInput.removeAttribute("aria-invalid");
  numOfPeopleInput.removeAttribute("aria-invalid");

  // disable reset button
  resetBtnDisable();
};

// Calculate values
const calculateCosts = () => {
  if (billAmount > 0 && tipPercentage > 0 && numberOfPeople > 0) {
    const tipAmount = (billAmount * tipPercentage * 0.01) / numberOfPeople;
    const totalAmount = billAmount / numberOfPeople + tipAmount;

    tipAmountOutput.textContent = `$${tipAmount.toFixed(2)}`;
    totalAmountOutput.textContent = `$${totalAmount.toFixed(2)}`;

    // Update ARIA labels for screen readers
    tipAmountOutput.setAttribute(
      "aria-label",
      `Tip amount per person: $${tipAmount.toFixed(2)}`,
    );
    totalAmountOutput.setAttribute(
      "aria-label",
      `Total amount per person: $${totalAmount.toFixed(2)}`,
    );

    // make reset button active
    resetBtnActivation();
  } else {
    tipAmountOutput.textContent = "$0.00";
    totalAmountOutput.textContent = "$0.00";

    tipAmountOutput.setAttribute("aria-label", "Tip amount per person: $0.00");
    totalAmountOutput.setAttribute(
      "aria-label",
      "Total amount per person: $0.00",
    );
  }
};

//Implement debouncing for smoother experience (to avoid calculateCosts() being called in every keystroke)
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Debounced calculateCost() - I use it only for bill input as it is the only one that gets decimals
const debouncedCalculate = debounce(calculateCosts, 300);

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
    debouncedCalculate();
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
      btn.removeAttribute("data-selected");
    });

    // in case of value presence in custom tip input remove value, set placeholder back and remove attributes
    tipCustomInput.value = "";
    tipCustomInput.placeholder = customTipPlaceholder;
    tipCustomInput.removeAttribute("aria-invalid");
    hideErrorMessage(errorMessageCustom, tipCustomInput);
    tipPercentage = 0;

    // add active to the current button
    pressedButton.setAttribute("aria-pressed", "true");
    pressedButton.classList.add("active:bg-green-200", "active:text-green-900");
    pressedButton.setAttribute("data-selected", "true");
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

//remove active states from other buttons when clicking in the input
tipCustomInput.addEventListener("click", () => {
  tipButtons.forEach((button) => {
    button.removeAttribute("aria-pressed");
    button.classList.remove("active:bg-green-200", "active:text-green-900");
    button.setAttribute("data-selected", "false");
  });
});

// Handling custom tip input
tipCustomInput.addEventListener("input", (e) => {
  let value = e.target.value;

  // Remove any non-numeric characters
  value = value.replace(/[^0-9]/g, "");

  // Update the input value to sanitized version
  e.target.value = value;

  const insertedCustomTip = parseFloat(value);

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

// Implementing arrow navigation in tip buttons
const setupKeyboardNavigation = () => {
  const buttons = Array.from(tipButtons);

  // Set initial tabindex
  buttons.forEach((btn, index) => {
    btn.setAttribute("tabindex", index === 0 ? "0" : "-1");
  });

  buttons.forEach((button, index) => {
    button.addEventListener("keydown", (e) => {
      let newIndex = index;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          newIndex = (index + 1) % buttons.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          newIndex = index === 0 ? buttons.length - 1 : index - 1;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = buttons.length - 1;
          break;
        default:
          return;
      }

      // Update tabindex
      buttons.forEach((btn) => btn.setAttribute("tabindex", "-1"));
      buttons[newIndex].setAttribute("tabindex", "0");
      buttons[newIndex].focus();
    });
  });
};

// Call function after DOM load
setupKeyboardNavigation();

//Reset button-------------------------------------------------
resetButton.addEventListener("click", () => {
  resetValues();
});

//Reset everything when page reloads
window.addEventListener("load", () => {
  // Hide error messages
  hideErrorMessage(errorMessageBill, billInputParentEl);
  hideErrorMessage(errorMessageCustom, tipCustomInput);
  hideErrorMessage(errorMessagePersons, numOfPeopleInputParentEl);

  // Reset all values
  resetValues();
});
