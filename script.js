let names = [];
let submitters = [];
let isAdminLoggedIn = false;

document.addEventListener("DOMContentLoaded", () => {
    loadNames(); // Load names from backend when the page is loaded

    document.getElementById("submitNameButton").addEventListener("click", addName);
    document.getElementById("revealWinnerButton").addEventListener("click", revealWinner);
    document.getElementById("loginButton").addEventListener("click", login);
    document.getElementById("pinButton").addEventListener("click", checkPin);
});

// Function to load names from the backend
function loadNames() {
    fetch('https://gameapp-mu.vercel.app/names')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load names');
            }
            return response.json();
        })
        .then(data => {
            names = data.names || [];
            submitters = data.submitters || [];
            updateNameList();

            // Show names only if admin is logged in
            if (isAdminLoggedIn) {
                document.getElementById('namesSection').style.display = 'block';
            }
        })
        .catch(error => console.error("Error fetching names:", error));
}

// Function to add a new name (POST to backend)
function addName() {
    const submitterInput = document.getElementById('submitterInput').value.trim();
    const nameInput = document.getElementById('nameInput').value.trim();

    if (submitterInput === "" || nameInput === "") {
        alert("Please enter both your name and the name to submit.");
        return;
    }

    // Send the data to the backend
    fetch('https://gameapp-mu.vercel.app/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submitter: submitterInput, name: nameInput }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error submitting name');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            loadNames();  // Refresh the list after a successful submission
            alert(data.message); // Display success message
        } else {
            alert(data.message); // Display error message
        }
    })
    .catch(error => {
        console.error("Error submitting name:", error);
        alert("There was an error submitting the name. Please try again later.");
    });
}

// Function to update the list of names (render on frontend)
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

// Function to reveal a random winner
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

// Function for admin login
function login() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    const validUsername = "admin";
    const validPassword = "bounty1234";

    if (username === validUsername && password === validPassword) {
        isAdminLoggedIn = true;
        document.getElementById('loginMessage').innerText = "Logged in as admin.";
        document.getElementById('namesSection').style.display = 'block'; // Show the names section
        document.getElementById('revealWinnerButton').disabled = false; // Enable reveal button
        updateNameList();
    } else {
        isAdminLoggedIn = false;
        document.getElementById('loginMessage').innerText = "Invalid login credentials.";
        document.getElementById('namesSection').style.display = 'none'; // Hide the names section
        document.getElementById('revealWinnerButton').disabled = true; // Disable reveal button
    }

    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
}

// Function to check the PIN
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