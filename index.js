import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

            //class Square extends React.Component {
            //          //add constructor to the class to initialize the state
            //          //but not necessary cuz square no longer keeps track of the gam'e state
            //          //constructor(props) {
            //          //  super(props);
            //          //  this.state = {
            //          //    value: null,
            //          //  };
            //          //}
            //   //shows what to display on screen
            //  render() {
            //      return (
            //        //allows user to add X to square only when it is clicked (don't forget ()=>)
            //       <button 
            //        className="square"
            //        //tell react to re-render that Square when its button is clicked 
            //        onClick={() => this.props.onClick()}
            //        >
            //          {this.props.value}
            //        </button>
            //      );
            //    }
            //  }
  //turn the above into a function component because only uses render() and doesnt have a state
  //note lack of parentheses on both sides of onClick...
  function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
                //    //constructor sets Board's initial state to contain an array of 9 nulls corr. to 9 squares
                //    constructor(props) {
                //      super(props);
                //      this.state = {
                //        squares: Array(9).fill(null),
                //        //set first move to be X by default, modify initial state
                //        xIsNext: true,
                //      };
                //    }
                //   //above: constructor will change below to 'o', null, 'x', etc.. as players take turns
                //  // above: deleted after we create constructor in GAME because we are "lifting state up"
    
                //create function to handleClick
                //slice creates a copy of the squares array to modify instead of modifying existing array
                //    handleClick(i) {
                //      //returns early by igonring a click if someone has won the game or square is already filled
                //      //creates a new copy of the squares array for time travel
                //      const squares = this.state.squares.slice();
                //      if (calculateWinner(squares) || squares[i]) {
                //        return;
                //      }
                //      //flip the value of xIsNext
                //      squares[i] = this.state.xIsNext ? 'X' : 'O';
                //      this.setState({
                //        squares: squares,
                //        xIsNext: !this.state.xIsNext,
                //      });
                //    }
                //***Above moving to GAME component for TIME TRAVEL */

    //below: prop passing mechanism, instruct each individual Square about its current value, reads from constructor
    renderSquare(i) {
      return (
        //pass down func from board to square to call when it is clicked
        <Square 
        //passing two props from Board to Square (value and onClick)
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {    
                    //    //display who has won
                    //   const winner = calculateWinner(this.state.squares);
                    //    let status;
                    //    if (winner) {
                    //      status = 'Winner: ' + winner;
                    //      //display whose turn it is 
                    //    } else {
                    //      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
                    //    }
                    //***ABOVE: deleting this because GAME is rendering the game's status now, TIME TRAVEL
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    //sets up initial state within constructor
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    //BELOW: taken from above to be handled here
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    //method allows player to go back to previous steps TIME TRAVEL
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    //GAME component is now rendering hte game's status***
    render() {
    //use the most recent history entry to determine and display the game's status
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //maps over the history in this render method
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'GAME RESTART';
      return (
        <ul key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </ul>
      );
    });

    //checks for winner
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else { 
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }