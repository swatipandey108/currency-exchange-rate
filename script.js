// Base URL for API requests
const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

// Selecting important elements from the DOM
const dropdowns = document.querySelectorAll(".dropdown select");  // Get all dropdown select elements
const btn = document.querySelector("#get-rate");  // Get the button that will trigger the exchange rate update
const fromCurr = document.querySelector(".from select");  // Get the 'from' currency dropdown
const toCurr = document.querySelector(".to select");  // Get the 'to' currency dropdown
const msg = document.querySelector(".msg");  // Get the div to display the exchange rate message
const swapIcon = document.querySelector("#swap-icon");  // Get the swap icon element
const themeToggle = document.querySelector("#theme-toggle");  // Get the dark mode toggle button
const toast = document.querySelector("#toast");  // Get the toast notification element

// Populate all currency dropdowns with options
for (let select of dropdowns) {
  // Loop through each currency code in the countryList object
  for (let currCode in countryList) {
    let option = document.createElement("option");  // Create a new <option> element
    option.innerText = currCode;  // Set the option text as the currency code (USD, INR, etc.)
    option.value = currCode;  // Set the option value to the currency code

    // Default selections for the dropdown
    if (select.name === "from" && currCode === "USD") {
      option.selected = true;  // Default 'from' currency is USD
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;  // Default 'to' currency is INR
    }

    select.append(option);  // Append the option to the respective select element
  }

  // Update flag image whenever a currency is changed
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);  // Call updateFlag to change the flag image based on selected currency
  });
}

// Function to update flag image based on selected country
const updateFlag = (element) => {
  let currCode = element.value;  // Get the selected currency code
  let countryCode = countryList[currCode];  // Get the corresponding country code from countryList
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;  // Construct the new flag image URL
  let img = element.parentElement.querySelector("img");  // Find the <img> element inside the select container
  img.src = newSrc;  // Update the <img> source with the new flag image URL
};

// Function to fetch and update the exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");  // Get the amount input field
  let amtVal = amount.value;  // Get the entered value for amount

  // If the entered amount is empty or less than 1, default it to 1
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";  // Set the input field value to 1
  }

  // Construct the URL for fetching exchange rates using selected currencies
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;

  let response = await fetch(URL);  // Fetch data from the API
  let data = await response.json();  // Parse the JSON response

  let rate = data[toCurr.value.toLowerCase()];  // Get the exchange rate for the selected 'to' currency

  // Calculate the final amount by multiplying the entered amount with the exchange rate
  let finalAmount = (amtVal * rate).toFixed(2);  // Round the result to 2 decimal places
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;  // Update the message to show the conversion result

  showToast("Exchange Rate Updated!");  // Show a toast notification when the exchange rate is updated
};

// Function to swap 'from' and 'to' currencies when the swap icon is clicked
swapIcon.addEventListener("click", () => {
  let temp = fromCurr.value;  // Store the current 'from' currency value in a temporary variable
  fromCurr.value = toCurr.value;  // Swap the 'from' currency value with the 'to' currency value
  toCurr.value = temp;  // Set the 'to' currency value to the temporary variable

  // Update the flags after swapping the currencies
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Update the exchange rate after swapping the currencies
  updateExchangeRate();
});

// Event listener for the "Get Exchange Rate" button
btn.addEventListener("click", (evt) => {
  evt.preventDefault();  // Prevent the form from submitting and refreshing the page
  updateExchangeRate();  // Call the function to update the exchange rate
});

// Event listener for when the page loads, to fetch the initial exchange rate
window.addEventListener("load", () => {
  updateExchangeRate();  // Automatically fetch the exchange rate when the page loads
});

// Toggle dark mode when the theme toggle button is clicked
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");  // Add or remove the 'dark' class on the body element
});

// Function to show a toast notification with a custom message
const showToast = (text) => {
  toast.innerText = text;  // Set the text of the toast to the provided message
  toast.className = "toast show";  // Add the 'show' class to display the toast
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");  // Remove the 'show' class after 3 seconds to hide the toast
  }, 3000);
};
