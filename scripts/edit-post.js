// scripts/edit-post.js
async function initEditPostPage() {
  console.log("init edit post page");

  const postId = window.location.search.split("=")[1];
  const postData = await fetchPostData(postId);

  if (!postData) {
    console.error("Aucun post trouvé avec l'ID fourni.");
    return;
  }

  populateForm(postData);

  const editForm = document.getElementById("editForm");
  editForm.addEventListener("submit", (event) => updatePost(event, postId));
}

async function fetchPostData(postId) {
  const url = `http://localhost:8001/api/posts/${postId}`;
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    Swal.fire({
      icon: "error",
      title: "Modification echouée !",
      showConfirmButton: false,
      timer: 1500,
    });
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  Swal.fire({
    icon: "success",
    title: "Modification effectuée !",
    showConfirmButton: false,
    timer: 1500,
  });
  return await response.json();
}

function populateForm(postData) {
  document.getElementById("newtitle").value = postData.title;
  document.getElementById("newcontent").value = postData.content;
  document.getElementById("newimage").value = postData.image_url;
}

async function updatePost(event, postId) {
  event.preventDefault();

  const editForm = document.getElementById("editForm");
  const dataToSend = new FormData(editForm);
  const accessToken = localStorage.getItem("accessToken");
  const url = `http://localhost:8001/api/posts/${postId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: dataToSend.get("newtitle"),
        content: dataToSend.get("newcontent"),
        image_url: dataToSend.get("newimage"),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    alert("Article modifié avec succès !");
    app.loadPage("pages/blog.html");
  } catch (error) {
    console.error("Erreur lors de la modification de l'article :", error);
  }
}

document.addEventListener("DOMContentLoaded", initEditPostPage());
