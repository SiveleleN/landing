let names = [];
let submitters = [];
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
    const storedSubmitters = JSON.parse(localStorage.getItem('submitters')) || [];

    names = storedNames;
    submitters = storedSubmitters;
    submittedNames = new Set(storedSubmitters);

    if (isAdminLoggedIn) {
        updateNameList();
        document.getElementById('namesSection').style.display = 'block'; // Show names only if admin is logged in
    }
}

function saveNames() {
    localStorage.setItem('names', JSON.stringify(names));
    localStorage.setItem('submitters', JSON.stringify(submitters));
}

function addName() {
    const submitterInput = document.getElementById('submitterInput').value.trim();
    const nameInput = document.getElementById('nameInput').value.trim();
    
    if (submitterInput === "" || nameInput === "") {
        alert("Please enter both your name and the name to submit.");
        return;
    }

    if (names.includes(nameInput)) {
        alert("This name has already been added.");
        return;
    }

    names.push(nameInput);
    submitters.push(submitterInput);
    submittedNames.add(submitterInput); // Mark this person as having submitted a name
    document.getElementById('nameInput').value = '';
    document.getElementById('submitterInput').value = '';
    saveNames(); // Save names to local storage
    updateNameList(); // Update the list to reflect changes
}

function updateNameList() {
    const nameList = document.getElementById('nameList');
    nameList.innerHTML = ''; // Clear the list before re-rendering

    names.forEach((name, index) => {
        nameList.innerHTML += `
            <li>
                ${name} (submitted by ${submitters[index]})
            </li>
        `;
    });
}

function revealWinner() {
    if (!isAdminLoggedIn) {
        alert("Only logged-in admins can reveal the winner.");
        return;
    }

    if (names.length === 0) {
        document.getElementById('winnerDisplay').innerText = "No names have been submitted yet!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * names.length);
    const winnerName = names[randomIndex];
    const winnerSubmitter = submitters[randomIndex];

    document.getElementById('winnerDisplay').innerHTML = `Winner: ${winnerName} submitted by ${winnerSubmitter}!`;
}

function login() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    const validUsername = "admin";
    const validPassword = "bounty1234";

    if (username === validUsername && password === validPassword) {
        isAdminLoggedIn = true;
        document.getElementById('loginMessage').innerText = "Logged in as admin.";
        document.getElementById('namesSection').style.display = 'block'; // Show the names section
        document.getElementById('revealWinnerButton').style.display = 'inline-block'; // Enable reveal button
        updateNameList();
    } else {
        isAdminLoggedIn = false;
        document.getElementById('loginMessage').innerText = "Invalid login credentials.";
        document.getElementById('namesSection').style.display = 'none'; // Hide the names section
        document.getElementById('revealWinnerButton').style.display = 'none'; // Disable reveal button
    }

    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
}

function checkPin() {
    const pin = document.getElementById('pinInput').value;

    const validPin = "4321"; // You can change the PIN to whatever you prefer

    if (pin === validPin) {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('pinMessage').innerText = "PIN accepted. Please log in.";
    } else {
        document.getElementById('pinMessage').innerText = "Invalid PIN.";
    }

    document.getElementById('pinInput').value = '';
}
