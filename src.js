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
    priceMap[0].price = Number(parseFloat(packPrice1Input.value)) || 0;
    priceMap[1].price = Number(parseFloat(packPrice2Input.value)) || 0;
    priceMap[2].price = Number(parseFloat(packPrice4Input.value)) || 0;
    priceMap[3].price = Number(parseFloat(packPrice6Input.value)) || 0;
}

// Get references to the button and result container
var generateButton = document.getElementById("generate");
var resultContainer = document.getElementById("resultContainer");

// Add a click event listener to the button
generateButton.addEventListener("click", function() {
    calculate()
    
});

var dS = [0,0,0,0]
var priceMap = defaultPriceMap(dS[0],dS[1],dS[2],dS[3])

function defaultPriceMap(a,b,c,d){
    return [
      { price: packPrice1Input.value, qty: 1, sold: a },
      { price: packPrice2Input.value, qty: 2, sold: b },
      { price: packPrice4Input.value, qty: 4, sold: c },
      { price: packPrice6Input.value, qty: 6, sold: d },
    ]
}

function sumPriceMap(){
    var total = 0;

    for (var i = 0; i < priceMap.length; i++) {
        total += Number(priceMap[i].price) * Number(priceMap[i].sold);
    }

    return total;
}

var maxIter = 1000
var iter = 0

function calculate(){

    while (sumPriceMap() < valueUSDInput.value && iter < maxIter) {
        priceMap[getRandomNumber(3)].sold++ 

        if(sumPriceMap() > valueUSDInput.value){
            priceMap = defaultPriceMap(dS[0],dS[1],dS[2],dS[3])
            iter++
        }
    }

    iter = 0

    displayPriceMap(priceMap)
}

function getRandomNumber(maxRange) {
    return Math.floor(Math.random() * (maxRange + 1));
}

function displayPriceMap(arrayOfObjects) {
    var resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = ""; // Clear previous content

    var totalPacksSold = 0;

    for (var i = 0; i < arrayOfObjects.length; i++) {
        var item = arrayOfObjects[i];
        var itemQTY = item.sold
        var itemTotalValue = item.price * item.sold
        var itemText = item.qty + "-PACK " + 
                    "min_[ " + dS[i]  + " ] " +
                    "TOTAL_[ " + itemQTY  + " ] " +
                    "$" + itemTotalValue; // Format to two decimal places
        var itemElement = document.createElement("p");
        itemElement.textContent = itemText;
        resultContainer.appendChild(itemElement);

        totalPacksSold += Number(item.sold * item.qty / 6);
    }

    var totalText = "Total 1/2 Flats Sold: " + totalPacksSold.toFixed(2) 
                  + ", Total Value: $" + sumPriceMap().toFixed(2); // Format to two decimal places
    var totalElement = document.createElement("p");
    totalElement.textContent = totalText;
    resultContainer.appendChild(totalElement);

    // Reset variables
    for (var i = 0; i < arrayOfObjects.length; i++) {
        arrayOfObjects[i].sold = 0;
    }
}

const minusButtons = document.querySelectorAll(".minusButton");
  const plusButtons = document.querySelectorAll(".plusButton");

  minusButtons.forEach(button => {
    const id = parseInt(button.id);
    button.addEventListener("click", () => handleMinus(id));
    button.addEventListener("touchstart", () => handleMinus(id));
  });

  plusButtons.forEach(button => {
    const id = parseInt(button.id);
    button.addEventListener("click", () => handlePlus(id));
    button.addEventListener("touchstart", () => handlePlus(id));
  });

  const handleMinus = (i) => {
    if (dS[i] > 0) {
      dS[i]--;
      priceMap = defaultPriceMap(dS[0], dS[1], dS[2], dS[3]);
      calculate();
    }
  };

  const handlePlus = (i) => {
    dS[i]++;
    priceMap = defaultPriceMap(dS[0], dS[1], dS[2], dS[3]);
    calculate();
  };


