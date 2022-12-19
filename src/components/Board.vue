<template>
  <div class="p-3 mt-5 bg-light bg-gradien">
    <div class="row">
      <div class="col-5 d-flex">
        <p>Score: {{ boardStore.score }} &emsp;</p>
        <p>Moves left: {{ boardStore.moveCountdown }} &emsp;</p>
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
        <p>Notifications: {{ moveNotifications }}</p>
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
        <button
          v-show="newGame === true"
          class="btn btn-secondary"
          @click="setNewGame"
        >
          New Game
        </button>
        <button
          v-show="newGame === false"
          class="btn btn-secondary newGameBtn"
          @click="setNewGame"
        >
          New Game
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useBoardStore } from "@/stores/boardSlice";
import { useUserStore } from "@/stores/userSlice";
import * as Board from "@/models/board";
import * as api from "@/shared/api";

export default defineComponent({
  name: "board",
  setup() {
    //------data

    //pinia state
    const boardStore = useBoardStore();
    const userStore = useUserStore();

    //local state
    const newGame = ref(false);

    //computed
    const matchEffects = computed(() => {
      return boardStore.events?.length > 0
        ? boardStore.events.filter((e) => e.getKind() === "Match")
        : new Array<Board.BoardEvent<string>>();
    });

    const moveNotifications = computed(() => {
      const events = matchEffects.value;

      let notifications = "";
      if (events != null) {
        events.map((event) => {
          notifications += `Match: ${event.getMatch()?.getMatched()}  `;
        });
      }

      return notifications;
    });

    //-------methods
    const setNewGame = async () => {
      if (userStore.token != null) {
        newGame.value = true;
        const game = await api.postGame(userStore.token);
        setTimeout(() => boardStore.setGame(game), 1000);
        boardStore.createBoard();
      }
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
        //update move countdown
        boardStore.updateMoveCountdown();

        //find out if legal move
        const currentMove = new Board.Position(
          boardStore.currentMove?.getRow(),
          boardStore.currentMove?.getCol()
        );
        const canMove = boardStore.board?.canMove(currentMove, move);

        //manage legal move
        if (canMove) {
          //copy board to construct an instance
          const board = boardStore.board?.copy();

          //clear move notifications
          boardStore.setEventsToDefault();

          //perform move
          if (board != undefined) board.move(currentMove, move);
          boardStore.updateBoard(board!, matchEffects.value.length);
        }

        //set current move to default
        boardStore.setCurrentMove(new Board.Position(-1, -1));
      }

      //check moveCountdown
      if (boardStore.moveCountdown - 1 === -1) {
        handleFinishGame();
      }
    };

    const handleFinishGame = async () => {
      alert("Game Over! Score:" + boardStore.score);

      if (userStore.token != null) {
        if (boardStore.game != null) {
          await api.patchGame({
            token: userStore.token,
            user: userStore.userId!,
            id: boardStore.game.id,
            score: boardStore.score,
            completed: true,
          });
        }
        boardStore.gameOver();
      }
      newGame.value = false;
    };

    return {
      boardStore,
      userStore,
      newGame,
      moveNotifications,
      setNewGame,
      handleCurrentMove,
      handleFinishGame,
    };
  },
});
</script>

<style>
.newGameBtn {
  position: absolute;
  top: 290px;
}
</style>
