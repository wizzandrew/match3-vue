import { ref, computed } from "vue";
import { defineStore } from "pinia";
import * as Board from "@/models/board";

export const useBoardStore = defineStore("board", () => {
  const generator = ref(new Board.CyclicGenerator("ABCD"));
  const board = ref<Board.Board<String>>();
  const currentMove = ref<Board.Position>(new Board.Position(-1, -1));
  const score = ref(0);
  const events = ref<Board.BoardEvent<string>[]>(
    new Array<Board.BoardEvent<string>>()
  );
  const moveCountdown = ref(0);

  function createBoard() {
    board.value = new Board.Board(generator.value, 4, 4);
    board.value.addListener((e: Board.BoardEvent<string>) => {
      events.value.push(e);
    });
    moveCountdown.value = 10;
  }

  function updateBoard(_board: Board.Board<String>, _score: number) {
    board.value = _board;
    score.value += _score;
  }

  function setCurrentMove(move: Board.Position) {
    currentMove.value = move;
  }

  function setEventsToDefault() {
    events.value = [];
  }

  function updateMoveCountdown() {
    moveCountdown.value -= 1;
  }

  return {
    board,
    currentMove,
    score,
    events,
    moveCountdown,
    createBoard,
    updateBoard,
    setCurrentMove,
    setEventsToDefault,
    updateMoveCountdown,
  };
});
