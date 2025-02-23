function registerPage() {
  console.log("init register page");

  usernameInput = document.getElementById("username");
  emailInput = document.getElementById("email");
  passwordInput = document.getElementById("password");

  submitButton = document.querySelector('button[type="submit"]');
  submitButton.addEventListener("click", (event) => register(event));
}

async function register(event) {
  event.preventDefault();

  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const url = "http://localhost:8001/api/auth/register";

    const userInformation = JSON.stringify({
      username: username,
      email: email,
      password: password,
    });

    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: userInformation,
    });

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Création echouée !",
        text: "Utilisateur deja existant ou identifiant/mot de passe incorrect",
        showConfirmButton: false,
        timer: 1500,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      localStorage.setItem("user", data);
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", registerPage());
