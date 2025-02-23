function initLoginPage() {
  console.log("init login page");

  emailInput = document.getElementById("email");
  passwordInput = document.getElementById("password");

  submitButton = document.querySelector('button[type="submit"]');
  submitButton.addEventListener("click", (event) => login(event));
}

async function login(event) {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch("http://localhost:8001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Connexion echouée !",
        text: "Email ou mot de passe incorrect",
        showConfirmButton: false,
        timer: 1500,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      accessToken = data.access_token;
      localStorage.setItem("accessToken", accessToken);
      console.log("accessToken:", accessToken);

      Swal.fire({
        icon: "success",
        title: "Connexion réussie !",
        text: "Vous êtes maintenant connecté !",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", initLoginPage());
