<template>
  <div class="p-3 mt-5 bg-light bg-gradien">
    <div class="row">
      <div class="col-5 d-flex">
        <p>Score: &emsp;</p>
        <p>Moves left: &emsp;</p>
      </div>
      <div class="col-3">
        <button class="btn btn-secondary">Finish Game</button>
      </div>
      <div className="col-3 d-flex justify-content-end">
        <button class="btn btn-danger">X</button>
      </div>
      <hr />
    </div>

    <div class="row">
      <div className="col-4 offset-4 text-align-center">
        <p>moveNotification</p>
      </div>
    </div>

    <div class="row">
      <table class="table table-bordered">
        <tbody v-if="newGame === false">
          <tr>
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
          </tr>
          <tr>
            <td>A</td>
            <td>C</td>
            <td>B</td>
            <td>D</td>
          </tr>
          <tr>
            <td>B</td>
            <td>C</td>
            <td>A</td>
            <td>C</td>
          </tr>
          <tr>
            <td>C</td>
            <td>B</td>
            <td>A</td>
            <td>D</td>
          </tr>
        </tbody>

        <tbody v-else v-if="boardStore.board && boardStore.board.getTiles()">
          <tr
            v-for="(tileRow, rowIndex) in boardStore.board.getTiles()"
            :key="rowIndex"
          >
            <td
              v-for="(tile, tileIndex) in tileRow"
              :key="rowIndex + tileIndex.toString(10)"
              @click="handleCurrentMove(rowIndex + tileIndex.toString(10))"
            >
              {{ tile }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="row">
      <div className="col-2 offset-5">
        <button class="btn btn-secondary" @click="setNewGame">New Game</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useBoardStore } from "@/stores/boardSlice";
import * as Board from "@/models/board";

export default defineComponent({
  name: "board",
  setup() {
    //------data

    //pinia state
    const boardStore = useBoardStore();

    //local state
    const newGame = ref(false);

    //-------methods
    const setNewGame = () => {
      newGame.value = !newGame.value;
      boardStore.createBoard();
    };

    const handleCurrentMove = (key: string) => {
      //extract data
      const move = new Board.Position(
        Number(key.charAt(0)),
        Number(key.charAt(1))
      );

      //manage move1, move2
      //default current move -1:-1
      if (boardStore.currentMove.equals(new Board.Position(-1, -1))) {
        boardStore.setCurrentMove(move);
      } else {
        //find out if legal move
        const currentMove = new Board.Position(
          boardStore.currentMove?.getRow(),
          boardStore.currentMove?.getCol()
        );
        const canMove = boardStore.board?.canMove(currentMove, move);

        //manage legal move
        if (canMove) {
          const board = boardStore.board?.copy();
          if (board != undefined) board.move(currentMove, move);
          boardStore.updateBoard(board!);
        }

        //set current move to default
        boardStore.setCurrentMove(new Board.Position(-1, -1));
      }
    };

    return { boardStore, newGame, setNewGame, handleCurrentMove };
  },
});
</script>
