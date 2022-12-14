import { URL } from "./utils";

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
