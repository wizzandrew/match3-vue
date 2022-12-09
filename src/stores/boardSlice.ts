import { ref, computed } from "vue";
import { defineStore } from "pinia";
import * as Board from "@/models/board";

export const useBoardStore = defineStore("board", () => {
  const generator = ref(new Board.CyclicGenerator("ABCD"));
  const board = ref<Board.Board<String>>();
  const currentMove = ref<Board.Position>(new Board.Position(-1, -1));

  function createBoard() {
    board.value = new Board.Board(generator.value, 4, 4);
  }

  function updateBoard(_board: Board.Board<String>) {
    board.value = _board;
  }

  function setCurrentMove(move: Board.Position) {
    currentMove.value = move;
  }

  return { board, currentMove, createBoard, updateBoard, setCurrentMove };
});
