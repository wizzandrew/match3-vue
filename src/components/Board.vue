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

        <tbody v-else v-if="board && board.getTiles()">
          <tr v-for="tileRow in board.getTiles()">
            <td v-for="tile in tileRow">{{ tile }}</td>
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
import * as Board from "@/models/board";

export default defineComponent({
  name: "board",
  setup() {
    //data
    const generator = ref(new Board.CyclicGenerator("ABCD"));
    const board = ref<Board.Board<String>>();
    const newGame = ref(false);

    //methods
    const setNewGame = () => {
      newGame.value = !newGame.value;
      board.value = new Board.Board(generator.value, 4, 4);
    };

    return { newGame, board, setNewGame };
  },
});
</script>
