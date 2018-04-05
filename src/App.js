import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Matrix extends Component{
    constructor(props,context){
        super(props,context);
        let arr = [];
        for(let i = 0; i< 12; i ++){
            let temp = Array(18).fill(0);
            arr.push(temp)
        }
        this.state={
            init_matrix: arr,
            turn: 1,
            gameOver: false
        }
        this.changeStatus = this.changeStatus.bind(this)
    }
    changeStatus(x,y){
        let tmp = this.state.init_matrix
        let turn = this.state.turn
        if(tmp[y][x] === 0){
            tmp[y][x] = turn === 1 ? 1 : 2
            turn = turn === 1 ? 2 : 1
            this.setState({
                init_matrix: tmp,
                turn: turn
            })
            this.checkGameOver(x,y)
        }
    }
    newGame(){
        let arr = [];
        for(let i = 0; i< 12; i ++){
            let temp = Array(18).fill(0);
            arr.push(temp)
        }
        this.setState({
            init_matrix: arr,
            turn: 1,
            gameOver: false
        })
    }
    checkGameOver(x,y){
        x = parseInt(x,10)
        y = parseInt(y,10)
        let tmp = this.state.init_matrix
        if((tmp[y][x] === tmp[y][x+1] && tmp[y][x] === tmp[y][x+2] && tmp[y][x] === tmp[y][x+3] ) ||
            (tmp[y][x] === tmp[y][x-1] && tmp[y][x] === tmp[y][x+1] && tmp[y][x] === tmp[y][x+2] ) ||
            (tmp[y][x] === tmp[y][x-1] && tmp[y][x] === tmp[y][x-2]　&& tmp[y][x] === tmp[y][x+1]) ||
            (tmp[y][x] === tmp[y][x-1] && tmp[y][x] === tmp[y][x-2]　&& tmp[y][x] === tmp[y][x-3]) ||
            (y >= 3 && tmp[y][x] === tmp[y-1][x] && tmp[y][x] === tmp[y-2][x]　&& tmp[y][x] === tmp[y-3][x]) ||
            (y >= 2 && y<= 10 && tmp[y][x] === tmp[y-1][x] && tmp[y][x] === tmp[y+1][x] && tmp[y][x] === tmp[y-2][x]) ||
            (y >= 1 && y<= 9 && tmp[y][x] === tmp[y-1][x] && tmp[y][x] === tmp[y+1][x] && tmp[y][x] === tmp[y+2][x]) ||
            (y <= 8 && tmp[y][x] === tmp[y+1][x] && tmp[y][x] === tmp[y+2][x] && tmp[y][x] === tmp[y+3][x]) ||
            (y <= 8 && tmp[y][x] === tmp[y+1][x+1] && tmp[y][x] === tmp[y+2][x+2] && tmp[y][x] === tmp[y+3][x+3]) ||
            (y >= 1 && y<= 9 && tmp[y][x] === tmp[y-1][x-1] && tmp[y][x] === tmp[y+1][x+1] && tmp[y][x] === tmp[y+2][x+2]) ||
            (y >= 2 && y <= 10 && tmp[y][x] === tmp[y-2][x-2] && tmp[y][x] === tmp[y-1][x-1] && tmp[y][x] === tmp[y+1][x+1]) ||
            (y >= 3 && tmp[y][x] === tmp[y-3][x-3] && tmp[y][x] === tmp[y-2][x-2] && tmp[y][x] === tmp[y-1][x-1]) ||
            (y <= 8 && tmp[y][x] === tmp[y+1][x-1] && tmp[y][x] === tmp[y+2][x-2] && tmp[y][x] === tmp[y+3][x-3]) ||
            (y >= 1 && y <= 9 &&tmp[y][x] === tmp[y+2][x-2] && tmp[y][x] === tmp[y+1][x-1] && tmp[y][x] === tmp[y-1][x+1]) ||
            (y >= 2 && y <= 10 && tmp[y][x] === tmp[y+1][x-1] && tmp[y][x] === tmp[y-1][x+1] && tmp[y][x] === tmp[y-2][x+2]) ||
            (y >= 3 && tmp[y][x] === tmp[y-1][x+1] && tmp[y][x] === tmp[y-2][x+2] && tmp[y][x] === tmp[y-3][x+3])
        ){
            alert("player "+this.state.turn+" win")
            this.setState({
                gameOver: true
            })
        }
    }
    render(){
        let matrix_list = [];
        let matrix = this.state.init_matrix;
        for(let y in matrix){
          for(let x in matrix[y]){
            if(matrix[y][x] === 1){
              matrix_list.push(<div key={[x,y]} className="tic-tac-toe-cell oSymbol" onClick={() => this.changeStatus(x,y)} ></div>)
            }else if(matrix[y][x] === 2){
              matrix_list.push(<div key={[x,y]} className="tic-tac-toe-cell xSymbol" onClick={() => this.changeStatus(x,y)}></div>)
            }else{
              matrix_list.push(<div key={[x,y]} className="tic-tac-toe-cell" onClick={() => this.changeStatus(x,y)}></div>)
            }
          }
        }
        if (this.state.gameOver){
            return(<h1 className="btn btn-primary" onClick={() => this.newGame()}>New</h1>)
        }
        else
        return(
            matrix_list
        )
    }
}
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="App-intro">
          <div className="tic-tac-toe--field">
            <div className="tic-tac-toe--cells-matrix">
              <Matrix/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
