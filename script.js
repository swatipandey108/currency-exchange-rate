// Base API URL to fetch currency exchange rates
const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

// Selecting all dropdowns inside .dropdown container
const dropdowns = document.querySelectorAll(".dropdown select");

// Selecting the button inside the form
const btn = document.querySelector("form button");

// Selecting 'from' and 'to' currency dropdowns
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// Selecting the div where the exchange message will be displayed
const msg = document.querySelector(".msg");

// Selecting the swap icon (i element)
const swapIcon = document.querySelector(".dropdown i");

// Loop through each dropdown (from and to)
for (let select of dropdowns) {
  // Loop through each currency code in the countryList object
  for (let currCode in countryList) {
    // Create a new <option> element
    let newOption = document.createElement("option");
    // Set option text and value to currency code (e.g., USD, INR)
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selected options
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected"; // Default from currency is USD
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected"; // Default to currency is INR
    }

    // Append the option to the current select element
    select.append(newOption);
  }

  // When the user changes the currency from dropdown
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target); // Update the flag next to dropdown
  });
}

// Function to fetch and update the exchange rate
const updateExchangeRate = async () => {
  // Select the amount input field
  let amount = document.querySelector(".amount input");
  
  // Get the entered value
  let amtVal = amount.value;

  // If input is empty or less than 1, default it to 1
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Construct the URL based on selected currencies
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;

  try {
    // Fetch the exchange rate data from API
    let response = await fetch(URL);
    let data = await response.json();

    // Extract the exchange rate value from the API response
    let rate = data[toCurr.value.toLowerCase()];

    // Calculate the final converted amount
    let finalAmount = amtVal * rate;

    // Update the message text with the conversion result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

  } catch (error) {
    // Handle any error that occurs during the API call
    msg.innerText = "Something went wrong. Please try again later.";
  }
};

// Function to update the country flag based on selected currency
const updateFlag = (element) => {
  // Get the selected currency code
  let currCode = element.value;

  // Get the corresponding country code from the countryList
  let countryCode = countryList[currCode];

  // Create the new flag image URL
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  // Find the <img> inside the select container and update its src
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Add event listener to the button
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // Prevent form from submitting and refreshing page
  updateExchangeRate(); // Call function to update exchange rate
});

// Automatically update exchange rate when page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});

// Swap 'from' and 'to' currencies when swap icon is clicked
swapIcon.addEventListener("click", () => {
  // Swap the selected currencies
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // Update flags after swapping
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Update the exchange rate after swapping currencies
  updateExchangeRate();
});
