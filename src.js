
let testUsers = generateTestUsers(10);

class TokenMiningSystem {
    constructor() {
      this.lastBlockID     = 0
      this.currentBlockID  = 1

      this.blocksMined     = 0;
      this.nowTokens       = 0;
      this.rewardInterval  = 31558149.756 / 3

      this.globalHalving   = 1
      this.blockHalving    = 2   / this.globalHalving
      this.difficultyValue = 100 / this.globalHalving;

      this.rewardMin       = 0.01
      this.reward          = 1
      this.rewardBonus     = 0
    }

    mine(userID) {
        const target    = this.getRandomNumber(0, this.difficultyValue);
        const userGuess = this.getRandomNumber(0, this.difficultyValue);
        const user      = testUsers.find(user => user.ID === userID);

        // regular updates
        this.update1()

        // periodic updates
        this.update2()

        // Normal reward conditions
        if (userGuess === target) {
            user.balance     = (Number(user.balance) + Number(this.reward)).toFixed(2);
        } else 
        // Bonus reward accumulation
        {
            this.rewardBonus = (Number(this.rewardBonus) + Number(this.reward)).toFixed(2);
        }

        // Bonus Reward Conditions
        if(userGuess === target && this.reward === this.safeNum(this.rewardMin)){
            user.balance     = (Number(user.balance) + Number(this.rewardBonus)).toFixed(2);
            this.rewardBonus = 0
        }

        // Track user and bonus tokens
        this.nowTokens       = (Number(this.nowTokens) + Number(this.reward)).toFixed(2);

        // Increase BlocksHalving each time contract is called
        this.blockHalving   *= 2
    }

    blockIDCheck(){
        return this.currentBlockID > this.lastBlockID;
    }

    rewardCheck(){
        return this.reward <= this.rewardMin;
    }

    update1(){
        if(this.blockIDCheck() && this.rewardCheck()){
            this.blockHalving = 2
        }

        if(this.blockIDCheck()){
            this.blocksMined++
        }

        this.reward = 1 / this.blockHalving

        // Set reward Minimum (0.00000001)
        if(this.reward < this.rewardMin){
            this.reward = this.safeNum(this.rewardMin)
        }
    }

    update2(){
        if(this.nowTokens > this.rewardInterval){
            this.rewardInterval *= 2
            this.globalHalving /= 2
            this.blockHalving = this.globalHalving * 2
        }
    }

    isMinReward(){
        return this.reward === this.rewardMin
    }
    
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    updateBlockID(id) {
      this.lastBlockID = this.currentBlockID
      this.currentBlockID = id
    }

    safeNum(num){
        return (Number(num)).toFixed(2)
    }
}
  
const miningSystem = new TokenMiningSystem();

let blockInterval = 1;
let userInterval = 1

const tokensMined = document.getElementById("tokenAllocations");
const currentReward = document.getElementById("reward");
const currentBonus = document.getElementById("bonus");
const nextHalving = document.getElementById("nextHalving");
const blocksMined = document.getElementById("blocksMined");
const blockChance = document.getElementById("blockChance");
const stopButton = document.getElementById("stopButton");
  
const blockTime = setInterval(() => {
    if (blockInterval < 0) {
        clearInterval(blockInterval);
        return;
    }

    
    nextHalving.textContent = miningSystem.halvingInterval
    blocksMined.textContent = miningSystem.blocksMined

    displayBalances(testUsers);
    next = randomNum(0,30)

    //console.log(blockInterval)

    blockInterval++;
}, 300);

var next = randomNum(0,1000)
const userInput = setInterval(() => {
    if (userInterval < 0) {
        clearInterval(userInterval);
        next = randomNum(0,100)
        return;
    }

    const userIndex = randomNum(0, testUsers.length - 1); // Ensure index is within the range of testData
    const user = testUsers[userIndex];

    miningSystem.updateBlockID(blockInterval);
    miningSystem.mine(user.ID);

    currentReward.textContent = miningSystem.reward
    currentBonus.textContent = miningSystem.rewardBonus
    tokensMined.textContent = miningSystem.nowTokens

    //console.log(miningSystem.reward)

    userInterval++;
    
}, 70);

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTestUsers(numEntries) {
    const Data = [];
    const usedUserIDs = new Set(); // To ensure unique user IDs

    for (let i = 0; i < numEntries; i++) {
        const ID = generateUniqueUserID(usedUserIDs);
        const balance = 0

        Data.push({ ID, balance});
    }

    return Data;
}

function generateTestData(testUsers, numEntries) {
    const Data = [];

    for (let i = 0; i < numEntries; i++) {
        const randomIndex = Math.floor(Math.random() * testUsers.length);
        const user = testUsers[randomIndex];
        const ID = user.ID;
        const Guess = Math.floor(Math.random() * 10) + 1; 

        Data.push({ ID, Guess});
    }

    return Data;
}

function generateUniqueUserID(usedUserIDs) {
    let userID;
    do {
        userID = getRandomString(2); // Generate a random string of length 6
    } while (usedUserIDs.has(userID));

    usedUserIDs.add(userID);
    return userID;
}

function getRandomString(length) {
    const characters = 'abcdefg';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

function displayBalances(testUsers) {
    const balanceContainer = document.getElementById("balanceContainer");
    balanceContainer.innerHTML = ''; // Clear existing content

    for (let i = 0; i < testUsers.length; i++) {
        const user = testUsers[i];
        const userElement = document.createElement("p");
        userElement.textContent = `User ${user.ID}: Balance - ${user.balance}`;
        balanceContainer.appendChild(userElement);
    }
}