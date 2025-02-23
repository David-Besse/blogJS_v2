async function initBlogPage() {
  console.log("init blog page");

  articles = await getPosts();

  // Trier les articles par ID
  articles.sort((a, b) => a.id - b.id);

  const blogContainer = document.querySelector(".blog-container");

  blogContainer.innerHTML = "";

  if (articles) {
    articles.forEach((article) => {
      const articleElement = document.createElement("article");
      articleElement.innerHTML = `
                <h2>${article.title}</h2>
                <p>${article.content}</p>
                <p>${article.author.username}</p>
                <button class="button-${article.id}" data-id="${article.id}">Lire l'article</button> 
              `;
      blogContainer.appendChild(articleElement);

      const readButton = articleElement.querySelector(`.button-${article.id}`);
      readButton.addEventListener("click", () => {
        const postId = readButton.getAttribute("data-id");
        window.history.pushState(null, "", `article?postId=${postId}`);
        app.loadPage(`article`);
      });
    });
  }

  // Ajouter un gestionnaire d'événements pour le bouton de création d'article
  const createPostButton = document.getElementById("createPostButton");
  createPostButton.addEventListener("click", () => {
    app.loadPage("create-post");
  });
}

async function getMe() {
  const url = "http://localhost:8001/api/auth/me";

  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (response.ok && data) {
      localStorage.setItem("blog_user_id", data);
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

async function getPosts() {
  const url = "http://localhost:8001/api/posts";

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
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

async function createPost() {
  const url = "http://localhost:8001/api/posts";

  const newTitle = titleInput.value;
  const newContent = contentInput.value;
  const newImage = imageInput.value;
  const userId =
    parseInt(localStorage.getItem("blog_user_id")) || (await getMe());

  const newPost = JSON.stringify({
    title: newTitle,
    content: newContent,
    image_url: newImage,
    user_id: userId,
  });

  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: newPost,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

async function updatePost() {
  const url = `http://localhost:8001/api/posts/${postId}`;

  const updatedTitle = titleInput.value;
  const updatedContent = contentInput.value;
  const updatedImage = imageInput.value;
  const userId =
    parseInt(localStorage.getItem("blog_user_id")) || (await getMe());

  const newPost = JSON.stringify({
    title: updatedTitle,
    content: updatedContent,
    image_url: updatedImage,
    user_id: userId,
  });

  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: newPost,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

async function getPostByUserId(userId) {
  const url = `http://localhost:8001/api/posts/user/${userId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", initBlogPage());
