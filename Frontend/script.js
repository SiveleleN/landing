let names = [];
let votes = [];
let votedNames = new Set(); // Tracks names that the user has voted for

function addName() {
    const nameInput = document.getElementById('nameInput').value.trim();
    
    if (nameInput === "") {
        alert("Please enter a valid name.");
        return;
    }

    if (names.includes(nameInput)) {
        alert("This name has already been added.");
        return;
    }

    names.push(nameInput);
    votes.push(0); // Initialize votes for the new name
    document.getElementById('nameInput').value = '';
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
    const winners = names.filter((name, index) => votes[index] === maxVotes);

    const winnerDisplay = document.getElementById('winnerDisplay');
    if (winners.length === 1) {
        winnerDisplay.innerHTML = `Winner: ${winners[0]} with ${maxVotes} votes!`;
    } else if (winners.length > 1) {
        winnerDisplay.innerHTML = `It's a tie between: ${winners.join(', ')} with ${maxVotes} votes!`;
    } else {
        winnerDisplay.innerHTML = "No votes have been cast yet!";
    }
}
// Handling cloned objects
//http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object

// Optimised by switching to 0 and 1 integers instead of booleans as recommended here:
//https://www.reddit.com/r/algorithms/comments/1etjf4/optimizing_conways_game_of_life/

class TopPanel extends React.Component {

    pauseGame() {
      this.props.pauseGame();
    }
  
    runGame() {
      if (this.props.aliveCount > 0) {
       this.props.runGame();
      }
    }
  
    clearBoard() {
      // true for clearSquares
      this.props.clearGame(true);
    }
  
    render() {
      let panelWidth = {
        width: this.props.width
      };
      return (
        <div
          style={panelWidth}
          className="top-controls"
        >
          <button
            className="control-button"
            onClick={this.runGame.bind(this)}
          >
            Run
          </button>
          <button
            className="control-button"
            onClick={this.pauseGame.bind(this)}
          >
            Pause
          </button>
          <button
            className="control-button"
            onClick={this.clearBoard.bind(this)}
          >
            Clear
          </button>
          <div
            className="generations"
          >
            Generations: {this.props.generations}
          </div>
        </div>
      );
    }
  }
  
  class Person extends React.Component {
    clickSquare() {
      this.props.clickSquare(this.props.id);
    }
  
    render() {
      let aliveColor = this.props.newPerson ? "rgba(0,220,200,1)" : "rgba(0,100,100, 1)";
      let backgroundColor = this.props.isAlive ? aliveColor : 'none';
      let squareStyle = {
        height: this.props.squareSize,
        width: this.props.squareSize,
        background: backgroundColor
      }
      return (
        <span
          onClick={this.clickSquare.bind(this)}
          className={"person"} style={squareStyle}>
        </span>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        people: [],
        squareSize: 14,
        numCols: 50,
        numRows: 30,
        generations: 1,
        aliveStates: null,
        paused: false,
        aliveCount: 0,
        newPeople: []
      };
    }
  
    componentWillMount() {
      // stores keys of coordinates with alive or dead boolean.
      // example: aliveStates['0,0'] = 1 (true);
      this.resetBoard();
    }
  
    resetBoard(clearSquares = false) {
      let aliveStates = {}
      let aliveCount = 0;
      let people = [];
      if (clearSquares) {
        this.setState({
          paused: true
        });
      }
  
      let alive;
      for (let row = 0; row < this.state.numRows; row++) {
        // Make columns
        for (let col = 0; col < this.state.numCols; col++) {
          if (clearSquares) {
            alive = 0;
          }
          else {
            alive = Math.floor(Math.random() * 10) > 6 ? 1 : 0;
            people.push([row, col]);
          }
          if (alive === 1) {
            aliveCount++;
          }
          aliveStates[`${row},${col}`] = alive;
        }
      }
  
      if (clearSquares) {
        this.setState({
          aliveStates: aliveStates,
          generations: 0,
          aliveCount: 0
        });
      }
      else {
        let squareSize = this.state.squareSize;
        let amount = this.state.numRows * this.state.numCols;
        this.setState({
          people: people,
          aliveStates: aliveStates,
          totalSquares: amount,
          aliveCount: aliveCount
        });
      }
    }
  
    getNeighbors(currentRow, currentCol) {
      let numCols = this.state.numCols;
      let numRows = this.state.numRows;
      let moveDirections = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
      ];
  
      let currentPair = [];
      let neighbors = moveDirections.map(pair => {
        currentPair = [currentRow + pair[0], currentCol + pair[1]];
        if (currentPair[0] < 0) {
          currentPair = [numRows - 1, currentPair[1]];
        }
  
       else if (currentPair[0] >= numRows) {
          currentPair = [0, currentPair[1]];
        }
  
        if (currentPair[1] >= numCols) {
          currentPair = [currentPair[0], 0];
        }
  
        else if (currentPair[1] < 0) {
          currentPair = [currentPair[0], numCols - 1];
        }
        return currentPair;
      });
      return neighbors;
    }
  
    checkAlive(isAlive,currentRow, currentCol) {
      // returns 2 dimensional array of neighbors
      let neighbors = this.getNeighbors(currentRow, currentCol);
  
      let livingNeighbors = 0;
  
      for (var i = 0; i < neighbors.length; i++) {
        if (this.state.aliveStates[`${neighbors[i][0]},${neighbors[i][1]}`] === 1) {
          livingNeighbors += 1;
        }
      }
  
      if (isAlive === 1) {
        if (livingNeighbors < 2 || livingNeighbors > 3) {
          return 0;
        }
        return 1;
      }
  
      else {
        // wasn't alive
        if (livingNeighbors === 3) {
          return 1;
        }
        return 0;
      }
    }
  
    updatePopulation() {
      let people = this.state.people;
      let newPeople = [];
      let aliveCount = 0;
      let aliveStates = JSON.parse(JSON.stringify(this.state.aliveStates));
  
      for(let i = 0; i < this.state.totalSquares; i++) {
        let currentRow = people[i][0];
        let currentCol = people[i][1];
        let location = `${currentRow},${currentCol}`;
        let wasAlive = aliveStates[location];
        let isAlive = this.checkAlive(wasAlive, currentRow, currentCol);
  
        if (wasAlive) {
          aliveCount++;
        }
  
        if (!wasAlive && isAlive) {
          newPeople.push(location);
        }
  
        aliveStates[location] = isAlive;
      }
  
      setTimeout(() => {
        if (this.state.paused) {
          return;
        }
        if (aliveCount === 0) {
           this.setState({
            aliveStates: aliveStates,
            generations: 0,
            aliveCount: 0,
            paused: true,
            newPeople: []
          });
          return;
        }
  
        this.setState({
          aliveStates: aliveStates,
          generations: this.state.generations + 1,
          aliveCount: aliveCount,
          newPeople: newPeople,
          updateQueue: []
        });
      }, 60);
    }
  
    renderSquares() {
      if (!this.state.paused && this.state.aliveCount > 0) {
       this.updatePopulation();
      }
      if (!this.state.people || this.state.people.length < 1 || !this.state.aliveStates) {
        return null;
      }
      let aliveStates = this.state.aliveStates;
      let newPeople = this.state.newPeople;
      let alive;
      let coords;
      let result = this.state.people.map(location => {
        coords = `${location[0]},${location[1]}`;
        alive = aliveStates[coords];
        let newPerson = newPeople.indexOf(coords) !== -1 ?
            true : false;
        return (
          <Person
            key={coords}
            id={coords}
            squareSize={this.state.squareSize}
            clickSquare={this.clickSquare.bind(this)}
            newPerson={newPerson}
            isAlive={alive}
          />
        );
      });
      return result;
    }
    // Controls
    pauseGame() {
      this.setState({
        paused: true
      });
    }
  
    runGame() {
      if (this.state.aliveCount > 0) {
        this.setState({
          paused: false
        });
      }
    }
  
    // Handles updating squares
    clickSquare(location) {
      let aliveStates = JSON.parse(JSON.stringify(this.state.aliveStates));
      let aliveCount = this.state.aliveCount;
      let newPeople = JSON.parse(JSON.stringify(this.state.newPeople));
      let alive = aliveStates[location] === 0 ? 1 : 0;
        aliveStates[location] = alive;
      if (this.state.paused) {
        if (alive) {
          aliveCount++;
          if (newPeople.indexOf(location) === -1) {
            newPeople.push(location);
          }
        }
        else {
          aliveCount--;
        }
        this.setState({
          aliveStates: aliveStates,
          aliveCount: aliveCount,
          newPeople: newPeople
        });
      }
    }
  
    render() {
      let gameStyles = {
        height: this.state.numRows * this.state.squareSize + 1.5 + 'px',
        width: this.state.numCols * this.state.squareSize + 1.5 + 'px'
      }
      return (
          <div className="game-of-life">
            <div
              id="game"
              style={gameStyles}
            >
              <TopPanel
                width={this.state.numCols * this.state.squareSize * 4 / 6}
                generations={this.state.generations}
                pauseGame={this.pauseGame.bind(this)}
                runGame={this.runGame.bind(this)}
                aliveCount={this.state.aliveCount}
                clearGame={this.resetBoard.bind(this)}
              />
              {this.renderSquares()}
            </div>
        </div>
      );
    }
  }
  
  ReactDOM.render(
    <Game />, document.getElementById('container')
  );
  