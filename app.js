const app = {
  init: function () {
    console.log("init app");

    app.name = "Blog";

    // Charger la page d'accueil par défaut
    this.loadPage("home");

  },

  loadPage: function (page) {
    let postId;

    // const url = new URL(window.location.href);
    // if (page.includes("article") || page.includes("edit-post")) {
    //   postId = url.searchParams.get("postId");
    //   if (postId) {
    //     url.searchParams.set("postId", postId);
    //     history.pushState(null, "", `${page}?postId=${postId}`);
    //   }
    // }

    fetch(`pages/${page}.html`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        document.getElementById("content").innerHTML = html;

        // Modifier l'URL après le chargement de la page
        history.pushState(null, "", postId ? `${page}?postId=${postId}` : page);

        // Enlever les fichiers CSS précédents sauf "reset.css", "style.css" et "home.css"
        const links = document.querySelectorAll("link[rel='stylesheet']");
        links.forEach((link) => {
          if (
            !link.href.includes("reset.css") &&
            !link.href.includes("style.css") &&
            !link.href.includes("home.css") &&
            !link.href.includes(`${page}.css`)
          ) {
            document.head.removeChild(link);
          }
        });

        // Vérifier et charger le fichier CSS si nécessaire
        const cssLink = `styles/${page}.css`;
        if (!document.querySelector(`link[href='${cssLink}']`)) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = cssLink;
          document.head.appendChild(link);
        }

        // Enlever les scripts précédents sauf celui de la page "home"
        const scripts = document.querySelectorAll("script");
        scripts.forEach((script) => {
          if (!script.src.includes("home.js")) {
            document.body.removeChild(script);
          }
        });

        // Vérifier si le script home.js est déjà chargé
        if (
          page === "home" &&
          !document.querySelector("script[src='scripts/home.js']")
        ) {
          const homeScript = document.createElement("script");
          homeScript.src = "scripts/home.js";
          homeScript.defer = true;
          document.body.appendChild(homeScript);
        } else if (page !== "home") {
          // Charger le fichier JS pour d'autres pages
          const script = document.createElement("script");
          console.log(`scripts/${page}.js`);
          script.src = `scripts/${page}.js`;
          script.defer = true;

          // Vérifier si le script est déjà chargé
          if (!document.querySelector(`script[src='${script.src}']`)) {
            document.body.appendChild(script);
          }
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de la page :", error);
      });
  },
};

window.addEventListener("DOMContentLoaded", () => app.init());
