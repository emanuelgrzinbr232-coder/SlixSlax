const API = "/api";


function showMessage(text, success = false) {

  const message =
    document.getElementById("message");

  if (!message) return;

  message.textContent = text;

  message.style.color =
    success
      ? "#42d889"
      : "#ff657d";
}


/* =========================
   CADASTRO
========================= */

const registerForm =
  document.getElementById("registerForm");


if (registerForm) {

  registerForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const button =
        registerForm.querySelector("button");

      button.disabled = true;

      button.textContent =
        "Criando conta...";


      const username =
        document
          .getElementById("username")
          .value;

      const email =
        document
          .getElementById("email")
          .value;

      const password =
        document
          .getElementById("password")
          .value;

      const birth_date =
        document
          .getElementById("birth_date")
          .value;


      try {

        const response =
          await fetch(
            `${API}/auth/register`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                username,
                email,
                password,
                birth_date
              })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.error ||
            "Não foi possível criar a conta."
          );

        }


        localStorage.setItem(
          "slixslax_token",
          data.token
        );


        localStorage.setItem(
          "slixslax_user",
          JSON.stringify(data.user)
        );


        showMessage(
          "Conta criada com sucesso!",
          true
        );


        setTimeout(() => {

          window.location.href =
            "perfil.html";

        }, 900);


      } catch (error) {

        showMessage(
          error.message
        );

        button.disabled = false;

        button.textContent =
          "Criar minha conta";

      }

    }
  );

}


/* =========================
   LOGIN
========================= */

const loginForm =
  document.getElementById("loginForm");


if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const button =
        loginForm.querySelector("button");

      button.disabled = true;

      button.textContent =
        "Entrando...";


      const email =
        document
          .getElementById("email")
          .value;

      const password =
        document
          .getElementById("password")
          .value;


      try {

        const response =
          await fetch(
            `${API}/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                email,
                password
              })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.error ||
            "Não foi possível entrar."
          );

        }


        localStorage.setItem(
          "slixslax_token",
          data.token
        );


        localStorage.setItem(
          "slixslax_user",
          JSON.stringify(data.user)
        );


        showMessage(
          "Login realizado com sucesso!",
          true
        );


        setTimeout(() => {

          window.location.href =
            "perfil.html";

        }, 900);


      } catch (error) {

        showMessage(
          error.message
        );

        button.disabled = false;

        button.textContent =
          "Entrar";

      }

    }
  );

}


/* =========================
   PERFIL
========================= */

async function loadProfile() {

  const token =
    localStorage.getItem(
      "slixslax_token"
    );


  if (!token) {

    window.location.href =
      "login.html";

    return;

  }


  try {

    const response =
      await fetch(
        `${API}/users/me`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        "Sessão expirada."
      );

    }


    const user =
      data.user;


    const name =
      document.getElementById("name");

    const email =
      document.getElementById("email");

    const bio =
      document.getElementById("bio");

    const level =
      document.getElementById("level");

    const xp =
      document.getElementById("xp");

    const avatar =
      document.getElementById("avatar");


    if (name)
      name.textContent =
        user.username;

    if (email)
      email.textContent =
        user.email;

    if (bio)
      bio.textContent =
        user.bio ||
        "Ainda não adicionou uma bio.";

    if (level)
      level.textContent =
        user.level;

    if (xp)
      xp.textContent =
        user.xp;

    if (avatar)
      avatar.textContent =
        user.username
          .charAt(0)
          .toUpperCase();


  } catch (error) {

    logout();

  }

}


/* =========================
   LOGOUT
========================= */

function logout() {

  localStorage.removeItem(
    "slixslax_token"
  );

  localStorage.removeItem(
    "slixslax_user"
  );


  window.location.href =
    "login.html";
}
