const token = localStorage.getItem("token");

// Si l'utilisateur possède un token, il est redirigé vers la page d'accueil
if (token) {
  window.location.href = "./index.html";
}

// Récupération du formulaire, et ajout d'un event listener sur le bouton "Se connecter"
document.querySelector("form").addEventListener("submit", (event) => {
  // Gestion manuelle de l'évènement
  event.preventDefault();

  // Récupération de l'email et du mot de passe rentré par l'utilisateur
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Création d'un objet contenant les données de l'utilisateur
  const userLogs = {
    email: email,
    password: password,
  };

  // Appelle à l'API, retourne une promesse
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Transformation en chaîne de caractères de l'objet qui contient les données de l'utilisateur
    body: JSON.stringify(userLogs),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Réponse de la promesse: " + res.statusText);
      // Conversion de la promesse en json
      return res.json();
    })

    // Récupération des données du fichier json
    .then((data) => {
      // Récupération du token
      const token = data.token;
      if (!token) throw new Error("Token manquant dans la réponse");

      // Stockage du token
      localStorage.setItem("token", token);

      // Redirection vers la page d'accueil
      window.location.href = "./index.html";
    })
    .catch((error) => {
      console.error(error);
      alert("Une erreur s'est produite lors de la tentative de connexion.");
    });
});
