let names = [];
let votes = [];
let submitters = []; // Array to store submitter names
let votedNames = new Set(); // Tracks names that the user has voted for

document.addEventListener("DOMContentLoaded", () => {
    // Add event listeners
    document.getElementById("submitNameButton").addEventListener("click", addName);
    document.getElementById("revealWinnerButton").addEventListener("click", revealWinner);
});

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
    votes.push(0); // Initialize votes for the new name
    submitters.push(submitterInput); // Save the submitter's name
    document.getElementById('nameInput').value = '';
    document.getElementById('submitterInput').value = '';
    updateNameList();
}

function vote(index) {
    const name = names[index];
    
    if (votedNames.has(name)) {
        alert("You can only vote once for each name.");
        return;
    }
    
    votes[index] += 1;
    votedNames.add(name); // Mark this name as voted for
    updateNameList(); // Update the name and vote list immediately after voting
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
