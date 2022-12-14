import { URL } from "./utils";

export type CreateAccount = {
  username: string;
  password: string;
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
