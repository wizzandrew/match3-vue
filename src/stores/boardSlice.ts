import { ref, computed } from "vue";
import { defineStore } from "pinia";
import * as Board from "@/models/board";

export const useBoardStore = defineStore("board", () => {
  const generator = ref(new Board.CyclicGenerator("ABCD"));
  const board = ref<Board.Board<String>>();

  function createBoard() {
    board.value = new Board.Board(generator.value, 4, 4);
  }

  return { board, createBoard };
});
