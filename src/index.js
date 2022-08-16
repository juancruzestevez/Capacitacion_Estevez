import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight' : '');
  return (
    <button 
      className={className} 
      onClick={()=> props.onClick({value: 'X'})}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winLine = this.props.winLine;
    return(
       <Square
        value={this.props.squares[i]} 
        onClick={()=> this.props.onClick(i)}
        highlight={winLine && winLine.includes(i)}/>
    );
  }

  render() {
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
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      clicked: 0,
      isAscending:true,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    const position = i
    if (calculateWinner(squares).winner || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        pos: position,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  rev(){
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winneriNFO = calculateWinner(current.squares);
    const winner = winneriNFO.winner;



    let moves = history.map((step, move) => {
      const desc = move ?
        'Go to ' + (Math.floor(this.state.history[move].pos/3) + 1) + ', ' + (this.state.history[move].pos%3 + 1) :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          
        </li>
        
      );
    });

    let status;
    if(winner){
      status = 'winner: ' + winner;
    } else{
      if(winneriNFO.isDraw){
        status = "Draw"
      }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    const isAscending = this.state.isAscending;
      if (!isAscending) {
        moves.reverse();
      } 

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=> this.handleClick(i)}
            winLine = {winneriNFO.line}
          />
        </div>
        <div className="game-info">
          <div className='desc'>{status}</div>
          <ol>{moves}</ol>
          <button onClick = {() => this.rev()}>
              {isAscending ? 'Descending' : 'Ascending'}
            </button>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
      return {
        winner: squares[a],
        line: lines[i],
        isDraw: false,
      }
    }
  }
  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }
  return {
    winner: null,
    line: null,
    isDraw: isDraw,
  };
}

