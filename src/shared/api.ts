import { URL } from "./utils";
import type { Game } from "@/models/types";

export type CreateAccount = {
  username: string;
  password: string;
};

export type LoginProps = {
  username: string;
  password: string;
};

export type LoginReply = {
  token: string | null;
  userId: number | null;
  error?: string;
};

export type PatchGame = { token: string } & Game;

export async function createAccount(create: CreateAccount): Promise<void> {
  //let result ={success: false};

  await fetch(URL + "users", {
    method: "POST",
    body: JSON.stringify(create),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  })
    .then((res) => {
      if (res.ok) return res;
      else {
        let err = new Error("Error " + res.status + ":" + res.statusText);
        throw err;
      }
    })
    .then((res) => res.json())
    .then((data) => alert("Successfully created user\n"))
    .catch((err) => {
      alert("Error" + err.message);
    });
}

export async function loginUser(login: LoginProps): Promise<LoginReply> {
  let result: LoginReply = {
    token: null,
    userId: null,
  };

  const response = await fetch(URL + "login", {
    method: "POST",
    body: JSON.stringify(login),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  if (response.ok) {
    await response
      .json()
      .then((data) => (result = data))
      .catch((err) => console.log(err));
  } else {
    result = {
      token: null,
      userId: null,
      error: response.statusText,
    };
  }
  return result;
}

export async function postGame(token: string): Promise<Game | null> {
  let result: Game | null = null;

  const response = await fetch(URL + "games?token=" + token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  if (response.ok) {
    await response
      .json()
      .then((data) => (result = data))
      .catch((err) => console.log(err));
  } else {
    throw new Error("\nStatus: " + response.status + " " + response.statusText);
  }
  return result;
}

export async function patchGame(
  game: PatchGame
): Promise<{ success: boolean }> {
  let result = { success: false };

  const response = await fetch(
    URL + "games/" + game.id + "?token=" + game.token,
    {
      method: "PATCH",
      body: JSON.stringify({
        user: game.user,
        id: game.id,
        score: game.score,
        completed: game.completed,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    }
  );

  if (response.ok) {
    await response
      .json()
      .then((data) => (result = { success: data.success }))
      .catch((err) => console.log(err));
  } else {
    throw new Error("\nStatus: " + response.status + " " + response.statusText);
  }
  return result;
}
