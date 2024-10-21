// Event listeners for buttons
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginButton").addEventListener("click", login);
    document.getElementById("pinButton").addEventListener("click", checkPin);
});

// Function to load names from the backend
function loadNames() {
    fetch('https://gameapp-mu.vercel.app/names')  // Ensure the correct API URL
        .then(response => {
            // Log the response for debugging
            console.log("Response status: ", response.status);
            if (!response.ok) {
                throw new Error('Failed to load names');
            }
            return response.json();  // Return the response as JSON
        })
        .then(data => {
            console.log("Data received: ", data);  // Log data for debugging
            names = data.names || [];
            submitters = data.submitters || [];
            updateNameList();  // Function that updates the DOM with names

            // Show names only if admin is logged in
            if (isAdminLoggedIn()) {
                document.getElementById('nameSection').style.display = 'block';
            }
        })
        .catch(error => {
            console.error("Error fetching names:", error.message);
        });
}

// Function to add a new name (POST to backend)
function addName() {
    const submitterInput = document.getElementById('submitterInput').value.trim();
    const nameInput = document.getElementById('nameInput').value.trim();

    // Check if inputs are empty
    if (submitterInput === "" || nameInput === "") {
        alert("Both submitter and name fields are required.");
        return;
    }

    const newName = {
        submitter: submitterInput,
        name: nameInput
    };

    fetch('https://gameapp-mu.vercel.app/names', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newName)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add name');
        }
        return response.json();  // Parse the JSON response
    })
    .then(data => {
        console.log("Name added successfully: ", data);
        loadNames();  // Reload the list after adding a new name
    })
    .catch(error => {
        console.error("Error adding name:", error.message);
    });
}

// Function to check if the admin is logged in
function isAdminLoggedIn() {
    // Assuming this checks admin login state
    // Implement the logic to verify if the user is an admin
    return true;  // Temporary assumption for the example
}

// Function to update the name list in the UI
function updateNameList() {
    const nameList = document.getElementById('nameList');
    nameList.innerHTML = '';  // Clear the current list

    // Assuming 'names' is a global array storing names
    names.forEach(name => {
        const listItem = document.createElement('li');
        listItem.textContent = name;
        nameList.appendChild(listItem);
    });
}

// Function to handle the login logic
function login() {
    // Implement your login logic here
}

// Function to check the pin
function checkPin() {
    // Implement your pin-check logic here
}
