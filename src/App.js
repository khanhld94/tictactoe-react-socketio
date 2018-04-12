import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from 'socket.io-client'

class Menu extends Component{
    constructor(props,context){
        super(props,context)
        this.state={
            room: null,
            new: false,
            turn: 1
        }
        this.getTurn = this.getTurn.bind(this)
        this.resetTurn = this.resetTurn.bind(this)
    }
    join(){
        this.setState({
            room: document.getElementById("room_id").value,
            new: true
        })
    }
    changeRoom(){
        this.setState({
            room: "",
            new: false
        })
    }
    getTurn(x){
        this.setState({
            turn: x
        })
    }
    resetTurn(){
        this.setState({
            turn: 1
        })
    }
    render(){
        if(this.state.new){
            return(
                <div className="App-intro">
                <div className="tic-tac-toe--field">
                <div className="tic-tac-toe--cells-matrix">
                <TicTacToe room={this.state.room} getTurn={this.getTurn} resetTurn={this.resetTurn}/>
            </div>
            </div>
            <div className="joinboard">
                <button className="joinotherbutton" onClick={() => this.changeRoom()}>Join Other Room</button>
            <div>
            <div>
            { this.state.turn === 1 ? (
                <p>Turn: O</p>
        ) : (
            <p>Turn: X</p>
        )
        }
        </div>
            </div>
            </div>
            </div>
        )
        }
        else{
            return(
                <div className="App-intro">
                <div className="tic-tac-toe--field">
                <div className="tic-tac-toe--cells-matrix">
                <input type="text" id="room_id"></input>
                <button className="btn btn-primary" onClick={()=> this.join()} style={{marginLeft: "0"}}>JOIN</button>
            </div>
            </div>

            </div>
        )
        }
    }
}
class TicTacToe extends Component{
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
            gameOver: false,
            // endpoint: "http://localhost:4001",
            socket: socketIOClient("https://mighty-taiga-45737.herokuapp.com/")
        }
        let room = this.props.room;
        let socket = this.state.socket
        socket.on('connect', function() {
            socket.emit('room', room);
        });
        socket.on('sendData', (data) => {
            if(data.length !== 0){
            this.setState({
                init_matrix: data.init_matrix,
                turn: data.turn,
                gameOver: data.gameOver,
                // endpoint: "http://localhost:4001"
            })
        }
    })
        this.changeStatus = this.changeStatus.bind(this)
        this.getTurn = this.getTurn.bind(this)
        this.resetTurn = this.resetTurn.bind(this)
    }
    changeStatus(x,y){
        let tmp = this.state.init_matrix
        let turn = this.state.turn
        if(tmp[y][x] === 0){
            tmp[y][x] = turn === 1 ? 1 : 2
            turn = turn === 2 ? 1 : 2
            let data = {
                init_matrix: tmp,
                turn: turn,
                gameOver: this.checkGameOver(x,y)
            }
            this.getTurn(turn)
            let socket = this.state.socket
            socket.emit('sendData', data)
            this.getData()
        }
    }
    resetTurn(){
        this.props.resetTurn()
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
        this.resetTurn()
    }
    checkGameOver(x,y){
        x = parseInt(x,10)
        y = parseInt(y,10)
        let tmp = this.state.init_matrix
        if((tmp[y][x] === tmp[y][x+1] && tmp[y][x] === tmp[y][x+2] && tmp[y][x] === tmp[y][x+3] && tmp[y][x] === tmp[y][x+4] ) ||
            (tmp[y][x] === tmp[y][x-1] && tmp[y][x] === tmp[y][x+1] && tmp[y][x] === tmp[y][x+2] && tmp[y][x] === tmp[y][x+3] ) ||
            (tmp[y][x] === tmp[y][x-1] && tmp[y][x] === tmp[y][x-2]　&& tmp[y][x] === tmp[y][x+1] && tmp[y][x] === tmp[y][x+2] ) ||
            (tmp[y][x] === tmp[y][x-1] && tmp[y][x] === tmp[y][x-2]　&& tmp[y][x] === tmp[y][x-3] && tmp[y][x] === tmp[y][x+1] ) ||
            (tmp[y][x] === tmp[y][x-1] && tmp[y][x] === tmp[y][x-2]　&& tmp[y][x] === tmp[y][x-3] && tmp[y][x] === tmp[y][x-4] ) ||

            (y >= 4 && tmp[y][x] === tmp[y-1][x] && tmp[y][x] === tmp[y-2][x]　&& tmp[y][x] === tmp[y-3][x] && tmp[y][x] === tmp[y-4][x]) ||
            (y >= 3 && y<= 10 && tmp[y][x] === tmp[y-1][x] && tmp[y][x] === tmp[y+1][x] && tmp[y][x] === tmp[y-2][x] && tmp[y][x] === tmp[y-3][x]) ||
            (y >= 2 && y<= 9 && tmp[y][x] === tmp[y-2][x] && tmp[y][x] === tmp[y-1][x] && tmp[y][x] === tmp[y+1][x] && tmp[y][x] === tmp[y+2][x]) ||
            (y >= 1 && y<= 8 && tmp[y][x] === tmp[y-1][x] && tmp[y][x] === tmp[y+1][x] && tmp[y][x] === tmp[y+2][x] && tmp[y][x] === tmp[y+3][x]) ||
            (y <= 7 && tmp[y][x] === tmp[y+1][x] && tmp[y][x] === tmp[y+2][x] && tmp[y][x] === tmp[y+3][x] && tmp[y][x] === tmp[y+4][x]) ||

            (y <= 7 && tmp[y][x] === tmp[y+1][x+1] && tmp[y][x] === tmp[y+2][x+2] && tmp[y][x] === tmp[y+3][x+3] && tmp[y][x] === tmp[y+4][x+4]) ||
            (y >= 1 && y<= 8 && tmp[y][x] === tmp[y-1][x-1] && tmp[y][x] === tmp[y+1][x+1] && tmp[y][x] === tmp[y+2][x+2] && tmp[y][x] === tmp[y+3][x+3]) ||
            (y >= 2 && y <= 9 && tmp[y][x] === tmp[y-2][x-2] && tmp[y][x] === tmp[y-1][x-1] && tmp[y][x] === tmp[y+1][x+1] && tmp[y][x] === tmp[y+2][x+2]) ||
            (y >= 3 && y <= 10 && tmp[y][x] === tmp[y-3][x-3] && tmp[y][x] === tmp[y-2][x-2] && tmp[y][x] === tmp[y-1][x-1] && tmp[y][x] === tmp[y+1][x+1]) ||
            (y >= 4 && tmp[y][x] === tmp[y-3][x-3] && tmp[y][x] === tmp[y-2][x-2] && tmp[y][x] === tmp[y-1][x-1] && tmp[y][x] === tmp[y-4][x-4]) ||

            (y <= 7 && tmp[y][x] === tmp[y+1][x-1] && tmp[y][x] === tmp[y+2][x-2] && tmp[y][x] === tmp[y+3][x-3] && tmp[y][x] === tmp[y+4][x-4]) ||
            (y >= 1 && y <= 8 && tmp[y][x] === tmp[y+3][x-3] && tmp[y][x] === tmp[y+2][x-2] && tmp[y][x] === tmp[y+1][x-1] && tmp[y][x] === tmp[y-1][x+1]) ||
            (y >= 2 && y <= 9 && tmp[y][x] === tmp[y+2][x-2] && tmp[y][x] === tmp[y+1][x-1] && tmp[y][x] === tmp[y-1][x+1] && tmp[y][x] === tmp[y-2][x+2]) ||
            (y >= 3 && y <= 10 && tmp[y][x] === tmp[y+1][x-1] && tmp[y][x] === tmp[y-1][x+1] && tmp[y][x] === tmp[y-2][x+2] && tmp[y][x] === tmp[y-3][x+3]) ||
            (y >= 4 && tmp[y][x] === tmp[y-1][x+1] && tmp[y][x] === tmp[y-2][x+2] && tmp[y][x] === tmp[y-3][x+3] && tmp[y][x] === tmp[y-4][x+4])
        ){
            // alert("player "+this.state.turn+" win")
            // this.setState({
            //     gameOver: true
            // })
            return true
        }
        else return false
    }
    getData(){
        let socket = this.state.socket
        socket.on('sendData', (data) => {
            this.setState({
            init_matrix: data.init_matrix,
            turn: data.turn,
            gameOver: data.gameOver,
        })
    })
    }
    getTurn(x){
        this.props.getTurn(x)
    }
    render(){
        let matrix_list = [];
        let matrix = this.state.init_matrix;
        for(let y in matrix){
            for(let x in matrix[y]){
                if(matrix[y][x] === 1){
                    matrix_list.push(<div key={[x,y]} className="tic-tac-toe-cell oSymbol"></div>)
                }else if(matrix[y][x] === 2){
                    matrix_list.push(<div key={[x,y]} className="tic-tac-toe-cell xSymbol"></div>)
                }else{
                    matrix_list.push(<div key={[x,y]} className="tic-tac-toe-cell" onClick={() => this.changeStatus(x,y)}></div>)
                }
            }
        }
        if (this.state.gameOver){
            return(
                <h1 className="btn btn-primary" onClick={() => this.newGame()}>New</h1>
        )
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
            <Menu/>
            </div>
    );
    }
}

export default App;
