var userAlert = false

var countOrg
var countCon
var ratioOrg

var sixPackConValue
var fourPackConValue

var sixPackOrgValue
var fourPackOrgValue

var sixPackCon = document.getElementById('sixPackCon');
var fourPackCon = document.getElementById('fourPackCon');

var sixPackOrg = document.getElementById('sixPackOrg');
var fourPackOrg = document.getElementById('fourPackOrg');

// Get references to the input elements
var valueUSDInput = document.getElementById('valueUSD');
var grossValue = valueUSDInput.value;

//var organicSoldInput = document.getElementById('organicSold');
var packPrice1Input = document.getElementById('packPrice1');
var packPrice2Input = document.getElementById('packPrice2');
var packPrice4Input = document.getElementById('packPrice4');
var packPrice6Input = document.getElementById('packPrice6');
var packPrice12Input = document.getElementById('packPrice12');


// Add event listeners to update variables when input values change
valueUSDInput.addEventListener('input', updateVariables);
//organicSoldInput.addEventListener('input', updateVariables);
packPrice1Input.addEventListener('input', updateVariables);
packPrice2Input.addEventListener('input', updateVariables);
packPrice4Input.addEventListener('input', updateVariables);
packPrice6Input.addEventListener('input', updateVariables);
packPrice12Input.addEventListener('input', updateVariables);

sixPackCon.addEventListener('input', updateVariables);
fourPackCon.addEventListener('input', updateVariables);

sixPackOrg.addEventListener('input', updateVariables);
fourPackOrg.addEventListener('input', updateVariables);

// Function to update variables
function updateVariables() {
    // Update the variables with the new input values
    totalValue = 0;
    totalPacks = 0;
    grossValue = parseFloat(valueUSDInput.value) || 0;

    sixPackConValue = parseFloat(sixPackCon.value) || 0;
    fourPackConValue = parseFloat(fourPackCon.value) || 0;
    
    sixPackOrgValue = parseFloat(sixPackOrg.value) || 0;
    fourPackOrgValue = parseFloat(fourPackOrg.value) || 0;
    
    priceMap[0].price = Number(parseFloat(packPrice1Input.value)) || 0;
    priceMap[1].price = Number(parseFloat(packPrice2Input.value)) || 0;
    priceMap[2].price = Number(parseFloat(packPrice4Input.value)) || 0;
    priceMap[3].price = Number(parseFloat(packPrice6Input.value)) || 0;
    priceMap[4].price = Number(parseFloat(packPrice12Input.value)) || 0;
}

// Get references to the button and result container
var generateButton = document.getElementById("generate");
var resultContainer = document.getElementById("resultContainer");

// Add a click event listener to the button
generateButton.addEventListener("click", function() {
    countCon = parseFloat(sixPackConValue) + parseFloat(fourPackConValue) / 6
    countOrg = parseFloat(sixPackOrgValue) + parseFloat(fourPackOrgValue) / 6

    ratioOrg = countOrg / (countCon + countOrg)

    dS = [0,0,0,0,0]
    userAlert = false
    clearError()
    calculate()
    toggleInputRows()
    addToggle()
});

var dS = [0,0,0,0,0]
var priceMap = defaultPriceMap(dS[0],dS[1],dS[2],dS[3],dS[4])

function defaultPriceMap(a,b,c,d,e){
    return [
      { price: packPrice1Input.value, qty: 1, sold: a },
      { price: packPrice2Input.value, qty: 2, sold: b },
      { price: packPrice4Input.value, qty: 4, sold: c },
      { price: packPrice6Input.value, qty: 6, sold: d },
      { price: packPrice12Input.value, qty: 12, sold: e }
    ]
}

function sumPriceMap(){
    var total = 0;

    for (var i = 0; i < priceMap.length; i++) {
        total += Number(priceMap[i].price) * Number(priceMap[i].sold);
    }

    return total;
}

var maxIter = 10000
var iter = 0

function calculate() {
    // Reset all priceMap[].sold to 0
    for (var i = 0; i < priceMap.length; i++) {
        priceMap[i].sold = 0;
    }

    for (var i = 0; i < dS.length; i++) {
        if (dS[i] !== 0) {
            priceMap[i].sold = dS[i]; // Apply dS value to priceMap if not 0
        }
    }

    iter = 0; // Reset the iteration count

    const targetValue = Math.round(grossValue * ratioOrg);
    const allowedDifference = 0; // Set your desired range here

    while (Math.abs(sumPriceMap() - targetValue) > allowedDifference && iter < maxIter) {
        var randomIndex = getRandomNumber(4);

        if (dS[randomIndex] === 0) {
            priceMap[randomIndex].sold++;
        }

        iter++; // Increment the iteration count

        if (sumPriceMap() > targetValue) {
            priceMap = defaultPriceMap(dS[0], dS[1], dS[2], dS[3], dS[4]);
        }
    }



    //console.log(iter)

    if(iter === maxIter || iter === 0){
        displayError("Warning: Pack counts do not match desired value")
    }

    iter = 0;

    displayPriceMap(priceMap);
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
        var itemQTY = item.sold;
        var itemTotalValue = item.price * item.sold;

        var itemElement = document.createElement("div");
        itemElement.classList.add("mb-3", "p-3", "bg-light", "rounded"); // Bootstrap classes

        // Create a row
        var row = document.createElement("div");
        row.classList.add("row", "align-items-center"); // Center align items vertically
        itemElement.appendChild(row);

        // Left column for buttons
        var leftColumn = document.createElement("div");
        leftColumn.classList.add("col-md-3", "col-12", "text-center", "mb-2", "mb-md-0");
        row.appendChild(leftColumn);

        var minusButton = document.createElement("button");
        minusButton.textContent = "-1";
        minusButton.classList.add("btn", "btn-danger", "minusButton");
        minusButton.id = i.toString();
        leftColumn.appendChild(minusButton);

        var plusButton = document.createElement("button");
        plusButton.textContent = "+1";
        plusButton.classList.add("btn", "btn-success", "plusButton");
        plusButton.id = i.toString();
        leftColumn.appendChild(plusButton);

        // Middle column for item details
        var middleColumn = document.createElement("div");
        middleColumn.classList.add("col-md-6", "col-12", "text-center", "mb-2", "mb-md-0");
        row.appendChild(middleColumn);

        var itemHeader = document.createElement("h4");
        itemHeader.textContent = item.qty + "-PACK -> " + itemQTY;
        middleColumn.appendChild(itemHeader);

        var totalValueElement = document.createElement("p");
        totalValueElement.textContent = "$" + itemTotalValue.toFixed(2) + "total / " + " $" + item.price + " each";
        middleColumn.appendChild(totalValueElement);

        // Right column for blank space
        var rightColumn = document.createElement("div");
        rightColumn.classList.add("col-md-3", "col-12");
        row.appendChild(rightColumn);

        resultContainer.appendChild(itemElement);

        totalPacksSold += Number(item.sold * item.qty / 6);
    }

    var totalText = "Result/Expected: " + totalPacksSold.toFixed(2) 
                  + " - " + countOrg.toFixed(2)
                  + " / " 
                  + "$" + sumPriceMap().toFixed(0)
                  + " - $" + (grossValue*ratioOrg).toFixed(0)
    var totalElement = document.createElement("p");
    totalElement.classList.add("mt-4"); // Add margin top
    totalElement.textContent = totalText;
    resultContainer.appendChild(totalElement);

    buttonEvents();
}



function buttonEvents() {
    const handleMinus = (i) => {
        if (priceMap[i].sold > 0) {
            dS[i] = priceMap[i].sold - 1;
            calculate();
        }
    };

    const handlePlus = (i) => {
        dS[i] = priceMap[i].sold + 1;
        calculate();
    };

    const minusButtons = document.querySelectorAll(".minusButton");
    const plusButtons = document.querySelectorAll(".plusButton");

    minusButtons.forEach(button => {
        const id = parseInt(button.id);
        button.addEventListener("click", () => handleMinus(id));
        button.addEventListener("touchstart", (event) => {
            event.preventDefault();
            handleMinus(id);
        });
        button.addEventListener("touchend", (event) => {
            event.preventDefault();
        });
    });

    plusButtons.forEach(button => {
        const id = parseInt(button.id);
        button.addEventListener("click", () => handlePlus(id));
        button.addEventListener("touchstart", (event) => {
            event.preventDefault();
            handlePlus(id);
        });
        button.addEventListener("touchend", (event) => {
            event.preventDefault();
        });
    });
}



// Get references to the button and input rows
var toggleButton = document.getElementById("toggleButton");
var inputRows = document.getElementById("inputContainer");

// Function to toggle the visibility of the input rows
function toggleInputRows() {
  if (inputRows.style.display === "none") {
    inputRows.style.display = "block";
  } else {
    inputRows.style.display = "none";
  }
}



function addToggle() {
    // Create the "Switch" button
    var toggleButton = document.createElement("button");
    toggleButton.id = "toggleButton";
    toggleButton.classList.add("btn", "btn-primary");
    toggleButton.textContent = "Switch";

    // Add a click event listener to the button
    toggleButton.addEventListener("click", function() {
        // Your code to toggle or perform any action
    });

    // Get the button container element
    var buttonContainer = document.getElementById("buttonContainer");

    // Clear any existing content and append the button
    buttonContainer.innerHTML = "";
    buttonContainer.appendChild(toggleButton);

    // Add a click event listener to the button that toggles the input rows
toggleButton.addEventListener("click", toggleInputRows);
}

updateVariables()

function displayError(message) {
    if(!userAlert){
        var errorContainer = document.getElementById("errorContainer");
        errorContainer.textContent = message;

        alert(message);

        userAlert = true
    }
}

function clearError() {
    var errorContainer = document.getElementById("errorContainer");
    errorContainer.textContent = '';
}