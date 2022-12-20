<template>
  <div>
    <ol v-if="games">
      <li key="game.id" v-for="game in top3scores">Score: {{ game.score }}</li>
    </ol>
    <p v-if="!games">No games fetched</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userSlice";
import type { Game } from "@/models/types";
import * as api from "@/shared/api";
import * as _ from "lodash";

export default defineComponent({
  name: "topscores",
  setup() {
    //------data

    //pinia state
    const userStore = useUserStore();

    //local state
    const games = ref<Game[]>([]);

    //computed
    const top3scores = computed(() => {
      let top3games: Game[] = [];

      if (Array.isArray(games.value)) {
        const _games = games.value.filter((g) => g.completed);
        const sortedGames = _.cloneDeep(_games);

        //sort array in ascending order
        sortedGames.sort((a, b) => b.score - a.score);

        //get 3 highest scores
        if (sortedGames.length >= 3) top3games = sortedGames.slice(0, 3);
        else if (sortedGames.length < 3) top3games = sortedGames;
      }
      return top3games;
    });

    //------methods
    onMounted(async () => {
      if (userStore.token != null) {
        const _games = await api.getGames(userStore.token!);
        games.value.push(..._games);
      }
    });

    return { games, top3scores };
  },
});
</script>
