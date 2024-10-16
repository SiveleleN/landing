let names = [];
let votes = [];
let submitters = [];
let votedNames = new Set();
let submittedNames = new Set(); // Tracks people who have submitted names
let isAdminLoggedIn = false;

document.addEventListener("DOMContentLoaded", () => {
    loadNames(); // Load names from local storage when the page is loaded
    document.getElementById("submitNameButton").addEventListener("click", addName);
    document.getElementById("revealWinnerButton").addEventListener("click", revealWinner);
    document.getElementById("loginButton").addEventListener("click", login);
    document.getElementById("pinButton").addEventListener("click", checkPin);
});

function loadNames() {
    const storedNames = JSON.parse(localStorage.getItem('names')) || [];
    const storedVotes = JSON.parse(localStorage.getItem('votes')) || [];
    const storedSubmitters = JSON.parse(localStorage.getItem('submitters')) || [];
    
    names = storedNames;
    votes = storedVotes;
    submitters = storedSubmitters;
    submittedNames = new Set(storedSubmitters);
    
    updateNameList();
}

function saveNames() {
    localStorage.setItem('names', JSON.stringify(names));
    localStorage.setItem('votes', JSON.stringify(votes));
    localStorage.setItem('submitters', JSON.stringify(submitters));
}

function addName() {
    const submitterInput = document.getElementById('submitterInput').value.trim();
    const nameInput = document.getElementById('nameInput').value.trim();
    
    if (submitterInput === "" || nameInput === "") {
        alert("Please enter both your name and the name to submit.");
        return;
    }

    if (submittedNames.has(submitterInput)) {
        alert("You have already submitted a name.");
        return;
    }

    if (names.includes(nameInput)) {
        alert("This name has already been added.");
        return;
    }

    names.push(nameInput);
    votes.push(0);
    submitters.push(submitterInput);
    submittedNames.add(submitterInput); // Mark this person as having submitted a name
    document.getElementById('nameInput').value = '';
    document.getElementById('submitterInput').value = '';
    updateNameList();
    saveNames(); // Save names to local storage
}

function vote(index) {
    const name = names[index];
    
    if (votedNames.has(name)) {
        alert("You can only vote once for each name.");
        return;
    }
    
    votes[index] += 1;
    votedNames.add(name);
    updateNameList();
    document.getElementById('voteMessage').innerText = `You have voted for ${name}!`;
}

function updateNameList() {
    const nameList = document.getElementById('nameList');
    const voteList = document.getElementById('voteList');
    nameList.innerHTML = '';
    voteList.innerHTML = '';

    names.forEach((name, index) => {
        nameList.innerHTML += `
            <li>
                ${name} (submitted by ${submitters[index]})
                <button onclick="vote(${index})">Vote</button>
            </li>
        `;
        voteList.innerHTML += `
            <li>${name} - Votes: ${votes[index]}</li>
        `;
    });
}

function revealWinner() {
    if (!isAdminLoggedIn) {
        alert("Only logged-in admins can reveal the winner.");
        return;
    }

    const maxVotes = Math.max(...votes);
    const winners = names.filter((name, index) => votes[index] === maxVotes);

    const winnerDisplay = document.getElementById('winnerDisplay');
    if (winners.length === 1) {
        winnerDisplay.innerHTML = `Winner: ${winners[0]} with ${maxVotes} votes! Submitted by ${submitters[names.indexOf(winners[0])]}`;
    } else if (winners.length > 1) {
        winnerDisplay.innerHTML = `It's a tie between: ${winners.map(winner => `${winner} (submitted by ${submitters[names.indexOf(winner)]})`).join(', ')} with ${maxVotes} votes!`;
    } else {
        winnerDisplay.innerHTML = "No votes have been cast yet!";
    }
}

function login() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    const validUsername = "admin";
    const validPassword = "password123";

    if (username === validUsername && password === validPassword) {
        isAdminLoggedIn = true;
        document.getElementById('loginMessage').innerText = "Logged in as admin.";
        document.getElementById('revealWinnerButton').disabled = false;
    } else {
        isAdminLoggedIn = false;
        document.getElementById('loginMessage').innerText = "Invalid login credentials.";
        document.getElementById('revealWinnerButton').disabled = true;
    }

    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
}

function checkPin() {
    const pin = document.getElementById('pinInput').value;

    const validPin = "1234"; // You can change the PIN to whatever you prefer

    if (pin === validPin) {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('pinMessage').innerText = "PIN accepted. Please log in.";
    } else {
        document.getElementById('pinMessage').innerText = "Invalid PIN.";
    }

    document.getElementById('pinInput').value = '';
}
