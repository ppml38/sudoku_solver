import {SudokuSolver} from "./sudoku_solver.js";

class app{
	constructor(){
		this.title=this.getTitle();
		this.board=this.getBoard();
		this.buttonRow = this.getButtonRow();
	}
	render(){
		this.parentDiv = document.createElement("div");
		this.parentDiv.classList.add("app");
		this.parentDiv.appendChild(this.title);
		this.parentDiv.appendChild(this.board.render());
		this.parentDiv.appendChild(this.buttonRow);
		return this.parentDiv;
	}
	getTitle(){
		let title = document.createElement("div");
		title.classList.add("title");
		title.innerText="Sudoku Solver";
		return title;
	}
	getBoard(){
		return new board();
	}
	getButtonRow(){
		let solveButton = document.createElement("button");
		solveButton.innerText="Solve";
		solveButton.onclick = (event)=>{
			this.board.solve();
		}
		let resetButton = document.createElement("button");
		resetButton.innerText="Reset";
		resetButton.classList.add("resetbutton");
		resetButton.onclick = (event)=>{
			this.board.reset();
		}
		let buttonrow = document.createElement("div");
		buttonrow.classList.add("buttonrow");
		buttonrow.appendChild(solveButton);
		buttonrow.appendChild(resetButton);
		return buttonrow;
	}
}

class board{
	constructor(){
		this.grid = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0]];
		this.parentDiv = document.createElement("div");
	}
	canPlace(row,col,num){
        for(let x=0; x<9; x++){
            if(this.grid[row][x]===num)
                return false
            if(this.grid[x][col]===num)
                return false
        }
        let ro=Math.floor(row/3)*3;
        let co=Math.floor(col/3)*3;
        for(let r=ro; r<ro+3; r++){
            for(let c=co; c<co+3; c++){
                if(this.grid[r][c]===num && (row,col)!==(r,c))
                    return false;
            }
        }
        return true;
    }
	render(){
	    let board=document.createElement("div");
		for(let row=0; row<9; row++){
			let rowdiv=document.createElement("div");
			rowdiv.classList.add("row");
			for(let col=0; col<9; col++){
				let cell = document.createElement("input");
				cell.setAttribute("type","text");
				cell.classList.add("cell");
				cell.setAttribute("tabIndex",`{row}{col}`);
				let txt = this.grid[row][col]===0?"":this.grid[row][col];
				cell.setAttribute("value",txt);
				//cell.onchange=(event)=>{this.grid[row][col]=Number(event.target.value)};
				cell.oninput=(event)=>{
				    event.preventDefault();
				    if(event.target.value.match('^[1-9]$') && this.canPlace(row,col,Number(event.target.value))===true){
				        this.grid[row][col]=Number(event.target.value);
				        // Move focus to next cell
                        let e = [...document.querySelectorAll('[tabindex]')];
                        let i = e.indexOf(document.activeElement) + 1;
                        i = i === e.length ? 0 : i;
                        e[i].focus()
                    }
                    else{
				        event.target.value='';
				        this.grid[row][col]=0;
				    }
				};
				rowdiv.appendChild(cell);
			}
			board.appendChild(rowdiv);
		}
		this.parentDiv.replaceChildren(board);
		return this.parentDiv;
	}
	reset(){
		this.grid = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0, 0, 0, 0]];
		this.render();
	}
	getCell(row,col){
	    return this.parentDiv.firstChild.children.item(row).children.item(col);
	}
	solve(){
		//let solution = new SudokuSolver(JSON.parse(JSON.stringify(this.grid))).solveSudoku();
		let solution = new SudokuSolver(this.grid).solveSudoku();
		if(solution!==null){
		/* // for showing the result in different color. but i noticed, this makes few cells have empty values(weird!)
		   // even though new numbers assigned. hence commented out.
		    for(let r=0; r<9; r++){
		        for(let c=0; c<9; c++){
		            if(this.grid[r][c]!==solution[r][c]){
		                let cell=this.getCell(r,c);
		                cell.setAttribute("value",solution[r][c]);
		                cell.classList.add("answerCell");
		            }
		        }
		    }*/
			this.grid = [...solution]; // three dot deep copy is not working for nested array, need a better method.
			this.render();
		}
		else{
			alert("Invalid sudoku. No solution found.");
		}
	}
}

let root = document.getElementById('root');
root.appendChild(new app().render());