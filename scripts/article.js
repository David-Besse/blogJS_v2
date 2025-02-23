async function initArticlePage() {
  const articleContainer = document.querySelector(".article-content");
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");

  if (!postId) {
    console.error("No post ID found in URL.");
    return;
  }

  const post = await getPost(postId);

  if (post) {
    articleContainer.innerHTML = `
            <h1 class="article-title">${post.title}</h1>
            <p class="article-author">Auteur : ${post.author.username}</p>
            <p class="article-author">Email : ${post.author.email}</p>
            <p class="article-date">Date : ${new Date(
              post.author.created_at
            ).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
            <section class="article-introduction">
                <h2 class="introduction-title">Introduction</h2>
                <p class="introduction-text">${post.content}</p>
                <img class="article-image" src="${
                  post.image_url
                }" alt="Image de l'article">
            </section>
            <button class="edit-button" data-id="${
              post.id
            }">Modifier cet article</button>
            <button class="delete-button" data-id="${
              post.id
            }">Supprimer cet article</button>
          `;

    const editButton = articleContainer.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
      const postId = editButton.getAttribute("data-id");
      window.history.pushState(null, "", `edit-post?postId=${postId}`);
      app.loadPage(`pages/edit-post.html`);
    });

    const deleteButton = articleContainer.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
      const postId = deleteButton.getAttribute("data-id");
      deletePost(postId);
    });
  }
}

async function deletePost(postId) {
  const url = `http://localhost:8001/api/posts/${postId}`;
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Suppression echouée !",
        showConfirmButton: false,
        timer: 1500,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    Swal.fire({
      icon: "success",
      title: "Suppression effectuée !",
      showConfirmButton: false,
      timer: 1500,
    });
    app.loadPage(`pages/blog.html`);
  } catch (error) {
    console.error("Error deleting blog post:", error);
  }
}

async function getPost(postId) {
  const url = `http://localhost:8001/api/posts/${postId}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", initArticlePage());
