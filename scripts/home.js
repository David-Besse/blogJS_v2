const home = {
  init: function () {
    console.log("init home");

    this.addEventListener();
  },

  addEventListener: function () {
    document.getElementById("loadHome").addEventListener("click", () => {
      app.loadPage("home");
    });

    document.getElementById("loadProfil").addEventListener("click", () => {
      app.loadPage("profil");
    });

    document.getElementById("loadConnexion").addEventListener("click", () => {
      app.loadPage("login");
    });

    document.getElementById("loadInscription").addEventListener("click", () => {
      app.loadPage("register");
    });

    document.getElementById("loadBlog").addEventListener("click", () => {
      app.loadPage("blog");
    });
  },
};

document.addEventListener("DOMContentLoaded", home.init());
