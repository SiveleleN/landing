let names = [];
let votes = [];

function addName() {
    const nameInput = document.getElementById('nameInput').value;
    if (nameInput !== "") {
        names.push(nameInput);
        votes.push(0); // Initialize votes for the new name
        document.getElementById('nameInput').value = '';
        updateNameList();
    }
}

function vote(index) {
    votes[index] += 1;
    updateNameList(); // Update the name and vote list immediately after voting
}

function updateNameList() {
    const nameList = document.getElementById('nameList');
    const voteList = document.getElementById('voteList');
    nameList.innerHTML = '';
    voteList.innerHTML = '';

    names.forEach((name, index) => {
        nameList.innerHTML += `
            <li>
                ${name}
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
    const winnerIndex = votes.indexOf(maxVotes);
    const winnerName = names[winnerIndex] || '';

    const winnerDisplay = document.getElementById('winnerDisplay');
    winnerDisplay.innerHTML = `Winner: ${winnerName} with ${maxVotes} votes!`;
}
