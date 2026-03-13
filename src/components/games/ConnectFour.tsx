import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
const SIZE = 6; type Cell = "empty"|"p1"|"p2";
function createBoard(): Cell[][] { return Array.from({length:SIZE},()=>Array(SIZE).fill("empty")); }
function checkWinner(board: Cell[][]): Cell { for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE-3;c++){const cell=board[r][c];if(cell!=="empty"&&board[r][c+1]===cell&&board[r][c+2]===cell&&board[r][c+3]===cell)return cell;} for(let r=0;r<SIZE-3;r++)for(let c=0;c<SIZE;c++){const cell=board[r][c];if(cell!=="empty"&&board[r+1][c]===cell&&board[r+2][c]===cell&&board[r+3][c]===cell)return cell;} for(let r=0;r<SIZE-3;r++)for(let c=0;c<SIZE-3;c++){const cell=board[r][c];if(cell!=="empty"&&board[r+1][c+1]===cell&&board[r+2][c+2]===cell&&board[r+3][c+3]===cell)return cell;} for(let r=0;r<SIZE-3;r++)for(let c=3;c<SIZE;c++){const cell=board[r][c];if(cell!=="empty"&&board[r+1][c-1]===cell&&board[r+2][c-2]===cell&&board[r+3][c-3]===cell)return cell;} return "empty"; }
export default function ConnectFour() {
  const navigate = useNavigate();
  const [board,setBoard]=useState(createBoard());const [turn,setTurn]=useState<"p1"|"p2">("p1");const [winner,setWinner]=useState<Cell>("empty");
  const dropPiece=(col:number)=>{if(winner!=="empty")return;const nb=board.map(r=>[...r]);for(let r=SIZE-1;r>=0;r--){if(nb[r][col]==="empty"){nb[r][col]=turn;setBoard(nb);const w=checkWinner(nb);if(w!=="empty")setWinner(w);else setTurn(t=>t==="p1"?"p2":"p1");return;}}};
  const reset=()=>{setBoard(createBoard());setTurn("p1");setWinner("empty");};
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-lg mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate("/games")}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <h1 className="text-3xl font-display font-bold text-foreground text-center">Connect Four</h1>
      <p className="text-center text-muted-foreground">{winner!=="empty"?`${winner==="p1"?"Player 1":"Player 2"} wins!`:`${turn==="p1"?"Player 1":"Player 2"}'s turn`}</p>
      <div className="grid gap-1 mx-auto" style={{gridTemplateColumns:`repeat(${SIZE}, 1fr)`, maxWidth: 300}}>
        {board.flat().map((cell,i)=>{const col=i%SIZE;return(
          <button key={i} onClick={()=>dropPiece(col)} className={`aspect-square rounded-full border-2 border-glass-border ${cell==="p1"?"bg-primary":cell==="p2"?"bg-destructive":"bg-muted/20 hover:bg-muted/40"}`} />
        );})}
      </div>
      {winner!=="empty"&&<div className="text-center"><Button onClick={reset}><RotateCcw className="h-4 w-4 mr-2" /> Play Again</Button></div>}
    </div>
  );
}
