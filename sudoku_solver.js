class defaultdict {
  constructor(defaultVal) {
    return new Proxy({}, {
      get: (target, name) => name in target ? target[name] : defaultVal
    })
  }
}
export class SudokuSolver{
	constructor(board){
		this.board=[...board];
		// box size
        this.n = 3;
        // row size
        this.N = this.n * this.n;
        
        
        // init rows, columns and boxes
        this.rows = []
		for(let i=0; i<this.N; i++){
			this.rows.push(new defaultdict(0));
		}
		this.columns = []
		for(let i=0; i<this.N; i++){
			this.columns.push(new defaultdict(0));
		}
		this.boxes = []
		for(let i=0; i<this.N; i++){
			this.boxes.push(new defaultdict(0));
		}
        for(let i=0; i<this.N; i++){
            for(let j=0; j<this.N; j++){
                if(this.board[i][j] !== 0){
                    let d = this.board[i][j];
                    this.place_number(d, i, j);
				}
			}
        }
        this.sudoku_solved = false;
	}
	box_index(row,col){
		// function to compute box index
		return Math.floor(row / this.n ) * this.n + Math.floor(col / this.n);
	}
	place_number(d, row, col){
		/*
		Place a number d in (row, col) cell
		*/
		this.rows[row][d] += 1;
		this.columns[col][d] += 1;
		this.boxes[this.box_index(row, col)][d] += 1;
		this.board[row][col] = d;
	}
	could_place(d, row, col){
		/*
		Check if one could place a number d in (row, col) cell
		*/
		return !(d in this.rows[row] || d in this.columns[col] || 
				d in this.boxes[this.box_index(row, col)]);
	}
	remove_number(d, row, col){
		/*
		Remove a number which didn't lead 
		to a solution
		*/
		delete this.rows[row][d];
		delete this.columns[col][d];
		delete this.boxes[this.box_index(row, col)][d];
		this.board[row][col] = 0;
	}
    place_next_numbers(row, col){
		/*
		Call backtrack function in recursion
		to continue to place numbers
		till the moment we have a solution
		*/
		// if we're in the last cell
		// that means we have the solution
		if(col === this.N - 1 && row === this.N - 1){
			this.sudoku_solved = true;
		}
		//if not yet    
		else{
			// if we're in the end of the row
			// go to the next row
			if(col === this.N - 1){
				this.backtrack(row + 1, 0);
			}
			// go to the next column
			else{
				this.backtrack(row, col + 1);
			}
		}
	}
	backtrack(row, col){
		/*
		Backtracking
		*/
		// if the cell is empty
		if(this.board[row][col] === 0){
			// iterate over all numbers from 1 to 9
			for(let d=1; d<10; d++){
				if(this.could_place(d, row, col)){
					this.place_number(d, row, col);
					this.place_next_numbers(row, col);
					// if sudoku is solved, there is no need to backtrack
					// since the single unique solution is promised
					if(!this.sudoku_solved){
						this.remove_number(d, row, col);
					}
				}
			}
		}
		else{
			this.place_next_numbers(row, col);
		}
	}
    solveSudoku(){
		this.backtrack(0,0);
		if(!this.sudoku_solved){
			return null;
		}
		return this.board;
	}
}
