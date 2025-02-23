async function initCreatePostPage() {
  console.log("init create post page");

  userId = await getMe();

  const postForm = document.getElementById("postForm");
  postForm.addEventListener("submit", (event) => createPost(event));
}

async function createPost(event) {
  event.preventDefault();

  postForm = document.getElementById("postForm");
  const dataToSend = new FormData(postForm);

  const accessToken = localStorage.getItem("accessToken");
  const url = "http://localhost:8001/api/posts";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: dataToSend.get("newtitle"),
        content: dataToSend.get("newcontent"),
        image_url: dataToSend.get("newimage"),
        user_id: userId,
      }),
    });

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Création echouée !",
        text: "Une erreur s'est produite lors de la création de l'article",
        showConfirmButton: false,
        timer: 1500,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    Swal.fire({
      icon: "success",
      title: "Article créé avec succès !",
      showConfirmButton: false,
      timer: 1500,
    });
    app.loadPage("pages/blog.html");
  } catch (error) {
    console.error("Erreur lors de la création de l'article :", error);
  }
}

async function getMe() {
  const url = "http://localhost:8001/api/auth/me";

  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    if (response.ok && data) {
      localStorage.setItem("blog_user_id", data.id);
      return data.id;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", initCreatePostPage());
