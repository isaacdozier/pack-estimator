// Get references to the input elements
var valueUSDInput = document.getElementById('valueUSD');
//var organicSoldInput = document.getElementById('organicSold');
var packPrice1Input = document.getElementById('packPrice1');
var packPrice2Input = document.getElementById('packPrice2');
var packPrice4Input = document.getElementById('packPrice4');
var packPrice6Input = document.getElementById('packPrice6');

// Add event listeners to update variables when input values change
valueUSDInput.addEventListener('input', updateVariables);
//organicSoldInput.addEventListener('input', updateVariables);
packPrice1Input.addEventListener('input', updateVariables);
packPrice2Input.addEventListener('input', updateVariables);
packPrice4Input.addEventListener('input', updateVariables);
packPrice6Input.addEventListener('input', updateVariables);

// Function to update variables
function updateVariables() {
    // Update the variables with the new input values
    totalValue = 0
    totalPacks = 0
    maxValue = parseFloat(valueUSDInput.value) || 0;
    //maxPacks = parseInt(organicSoldInput.value) || 0;
    priceMap[0].price = parseFloat(packPrice1Input.value) || 0;
    priceMap[1].price = parseFloat(packPrice2Input.value) || 0;
    priceMap[2].price = parseFloat(packPrice4Input.value) || 0;
    priceMap[3].price = parseFloat(packPrice6Input.value) || 0;
}

// Get references to the button and result container
var generateButton = document.getElementById("generate");
var resultContainer = document.getElementById("resultContainer");

// Add a click event listener to the button
generateButton.addEventListener("click", function() {
    calculate()
    displayPriceMap(priceMap)
});

var priceMap = [
  { price: packPrice1Input.value, qty: 1, sold: 0 },
  { price: packPrice2Input.value, qty: 2, sold: 0 },
  { price: packPrice4Input.value, qty: 4, sold: 0 },
  { price: packPrice6Input.value, qty: 6, sold: 0 },
  ]

var totalValue = 0
var maxValue = valueUSDInput.value

var totalPacks = 0
//var maxPacks = organicSoldInput.value * 6

function calculate(){
    totalValue = 0
    totalPacks = 0

    while (totalValue < maxValue) {
        var tmp = getRandomNumber(3)
        
        totalValue += Number(priceMap[tmp].price);
        totalPacks += Number(priceMap[tmp].qty);
        priceMap[tmp].sold += Number(priceMap[tmp].qty)
    }

    
}

function getRandomNumber(maxRange) {
    return Math.floor(Math.random() * (maxRange + 1));
}

function displayPriceMap(arrayOfObjects) {
    var resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = ""; // Clear previous content

    var totalPacksSold = 0;
    var totalValue = 0;

    for (var i = 0; i < arrayOfObjects.length; i++) {
        var item = arrayOfObjects[i];
        var itemQTY = item.sold/item.qty
        var itemTotalValue = item.sold/item.qty * item.price
        var itemText = item.qty + "-pack [ " 
                     + itemQTY  + " ]"
                     + " $" + itemTotalValue; // Format to two decimal places
        var itemElement = document.createElement("p");
        itemElement.textContent = itemText;
        resultContainer.appendChild(itemElement);

        totalPacksSold += Number(item.sold/6);
        totalValue += itemTotalValue;
    }

    var totalText = "Total Flats Sold: " + totalPacksSold.toFixed(2) 
                  + ", Total Value: $" + totalValue.toFixed(2); // Format to two decimal places
    var totalElement = document.createElement("p");
    totalElement.textContent = totalText;
    resultContainer.appendChild(totalElement);

    // Reset variables
    for (var i = 0; i < arrayOfObjects.length; i++) {
        arrayOfObjects[i].sold = 0;
    }
}


