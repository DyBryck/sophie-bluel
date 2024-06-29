let token = localStorage.getItem("token");

// Initialisation des tableaux qui contiendront la liste des catégories et des travaux
let categoriesList = [];
let worksList = [];

// Récupération des catégories depuis l'API
const getCategories = () => {
  fetch("http://localhost:5678/api/categories")
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return alert("Une erreur s'est produite lors de la récupération");
      }
    })
    .then((data) => {
      categoriesList = data;
      if (!token) {
        generateFiltersButtons(data);
      }
    });
};

// Récupération des travaux depuis l'API
const getWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return alert("Une erreur s'est produite lors de la récupération");
      }
    })
    .then((data) => {
      worksList = data;
      generateWorksList(0);
    });
};

getCategories();
getWorks();

// Génération des boutons de filtre pour chaque catégorie de travail
const generateFiltersButtons = (categories) => {
  // Récupération du conteneur qui contiendra les boutons
  const filters = document.querySelector(".filters");
  // Ajout de la catégorie "Tous" avec un id 0
  categories.push({ id: 0, name: "Tous" });
  // Tri dans l'ordre croissant des ID
  categories.sort((a, b) => a.id - b.id);
  // Boucle qui agit sur chaque élément du tableau contenant les catégories
  categories.forEach((categorie) => {
    const button = document.createElement("button");
    button.innerText = categorie.name;
    button.className = "buttons filter-button";
    button.addEventListener("click", () => generateWorksList(categorie.id));
    filters.appendChild(button);
  });
};

// Génération de la liste des travaux en fonction de l'id du bouton de filtre
const generateWorksList = (categoryId) => {
  // Récupération des boutons de filtre par leur classe
  const filterButton = document.getElementsByClassName("buttons");
  // Gestion de la couleur de fond du bouton de filtre actif
  for (let i = 0; i < filterButton.length; i++) {
    if (i === categoryId) {
      filterButton[i].className = "buttons filter-button-active";
    } else {
      filterButton[i].className = "buttons filter-button";
    }
  }
  // Initialisation d'un nouveau tableau qui contiendra la liste des travaux pour éviter tout conflit avec le tableau original
  let works = [];
  // Affichage de tous les travaux (id 0)
  if (categoryId === 0) {
    works = worksList;
  } else {
    works = worksList.filter((work) => work.categoryId === categoryId);
  }
  // Récupération du conteneur qui contiendra les travaux
  const gallery = document.querySelector(".gallery");
  // Vidage du conteneur pour n'avoir aucune duplication
  gallery.innerHTML = "";
  // Boucle qui génère chaque travail pour chaque élément du tableau contenant les travaux
  for (let i = 0; i < works.length; i++) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = works[i].imageUrl;
    img.alt = works[i].title;
    const figcaption = document.createElement("figcaption");
    figcaption.innerText = works[i].title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
    figure.id = "work " + works[i].id;
  }
};

// Fonction qui génère la barre noire lorsque l'utilisateur est connecté
const generateTopBar = () => {
  const header = document.querySelector("header");
  const topBar = document.createElement("div");
  const topBarIcon = document.createElement("img");
  topBarIcon.src = "./assets/icons/edit-white.svg";
  topBar.className = "topBar";
  topBar.innerText = "Mode édition";
  topBar.prepend(topBarIcon);
  header.prepend(topBar);
};

// Fonction qui génère le bouton "éditer" lorsque l'utilisateur est connecté
const generateEditButton = () => {
  const editContainer = document.querySelector(".edit-projects");
  const editButton = document.createElement("button");
  const editIconButton = document.createElement("img");
  editIconButton.src = "./assets/icons/Group.svg";
  editButton.innerText = "modifier";
  editButton.className = "edit-button";
  editButton.prepend(editIconButton);
  editButton.addEventListener("click", generateModale);
  editContainer.appendChild(editButton);
};

const modaleContainer = document.querySelector(".modale-container");
// Fonction qui génère la modale
const generateModale = () => {
  const modale = document.createElement("div");
  modale.className = "modale";
  const modaleContent = document.createElement("div");
  modaleContent.className = "modale-content";
  modale.appendChild(modaleContent);
  modaleContainer.appendChild(modale);
  generateFirstContentModale();
};

// Fonction qui ferme la modale
const closeModale = () => {
  modaleContainer.innerHTML = "";
};

// Fonction qui génère l'icône croix qui ferme la modale
const generateCloseModaleButton = (modaleContent) => {
  const closeModaleIcon = document.createElement("img");
  closeModaleIcon.src = "./assets/icons/close-icon.svg";
  closeModaleIcon.classList = "close-modale-icon";
  closeModaleIcon.addEventListener("click", closeModale);
  modaleContent.appendChild(closeModaleIcon);
};

// Fermeture de la modale à l'appuie de la touche echap
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModale();
  }
});

// Fermeture de la modale au click en dehors de la modale
document.addEventListener("click", (event) => {
  const modale = document.querySelector(".modale");
  if (event.target === modale) {
    closeModale();
  }
});

// Fonction qui génère la première fenêtre de la modale
const generateFirstContentModale = () => {
  const modaleContent = document.querySelector(".modale-content");
  modaleContent.innerText = "";

  const h2 = document.createElement("h2");
  h2.innerText = "Galerie photo";
  h2.classList = "modale-title";
  modaleContent.appendChild(h2);

  generateCloseModaleButton(modaleContent);

  const addPicture = document.createElement("button");
  addPicture.innerText = "Ajouter une photo";
  addPicture.classList = "modale-green-button";
  addPicture.addEventListener("click", generateSecondContentModale);

  const modaleWorksContainer = document.createElement("div");
  modaleWorksContainer.className = "modale-works-container";
  for (let i = 0; i < worksList.length; i++) {
    const workDiv = document.createElement("div");
    workDiv.className = "work-image-container";
    workDiv.id = worksList[i].id;
    modaleWorksContainer.appendChild(workDiv);

    const workImage = document.createElement("img");
    workImage.src = worksList[i].imageUrl;
    workImage.className = "work-image-modale";
    workDiv.appendChild(workImage);

    const trashDiv = document.createElement("div");
    trashDiv.className = "trash-container";

    const trash = document.createElement("img");
    trash.src = "./assets/icons/trash-can-solid.svg";
    trash.className = "trash-icon";
    trash.id = worksList[i].id;

    workDiv.appendChild(trashDiv);
    trashDiv.appendChild(trash);

    trash.addEventListener("click", () => {
      deleteWork(trash.id);
    });
  }
  modaleContent.appendChild(modaleWorksContainer);
  modaleContent.appendChild(addPicture);
};

// Fonction qui génère le contenu pour l'ajout d'un travail
const generateInputAddPhoto = () => {
  const modaleContent = document.querySelector(".modale-content");
  const formAddPhoto = document.createElement("form");
  formAddPhoto.className = "add-photo-form";
  formAddPhoto.action = "";
  formAddPhoto.method = "";

  const addPhotoDiv = document.createElement("label");
  addPhotoDiv.className = "add-photo-div";
  addPhotoDiv.for = "add-input";

  const addInputFile = document.createElement("input");
  addInputFile.type = "file";
  addInputFile.accept = ".jpg, .png, .jpeg";
  addInputFile.className = "add-input";
  addInputFile.id = "add-input";
  addInputFile.innerText = "+ Ajouter photo";
  addInputFile.addEventListener("change", afficherPhoto);

  const imageAffichee = document.createElement("img");
  imageAffichee.id = "image-affichee";
  imageAffichee.src = "#";
  imageAffichee.alt = "Photo téléchargée";

  const addPhotoImg = document.createElement("img");
  addPhotoImg.src = "./assets/icons/img.svg";
  addPhotoImg.id = "img-logo";

  const addPhotoButton = document.createElement("div");
  addPhotoButton.innerText = "+ Ajouter Photo";
  addPhotoButton.className = "add-photo-button";

  const formatCaption = document.createElement("p");
  formatCaption.innerText = "jpg, png : 4mo max";
  formatCaption.className = "format-caption";

  addPhotoDiv.appendChild(addPhotoImg);
  addPhotoDiv.appendChild(addInputFile);
  addPhotoDiv.appendChild(imageAffichee);
  addPhotoDiv.appendChild(addPhotoButton);
  addPhotoDiv.appendChild(formatCaption);

  const formAddPhotoTitle = document.createElement("label");
  formAddPhotoTitle.setAttribute("for", "title");
  formAddPhotoTitle.innerText = "Titre";

  const inputTextAddPhotoTitle = document.createElement("input");
  inputTextAddPhotoTitle.setAttribute("type", "text");
  inputTextAddPhotoTitle.id = "title";
  inputTextAddPhotoTitle.name = "title";
  inputTextAddPhotoTitle.addEventListener("input", checkFormValue);

  const formAddPhotoCategoryTitle = document.createElement("label");
  formAddPhotoCategoryTitle.setAttribute("for", "category");
  formAddPhotoCategoryTitle.innerText = "Catégorie";

  const inputSelectAddPhotoCategory = document.createElement("select");
  inputSelectAddPhotoCategory.id = "category";
  inputSelectAddPhotoCategory.name = "category";

  modaleContent.appendChild(formAddPhoto);
  formAddPhoto.appendChild(addPhotoDiv);
  formAddPhoto.appendChild(formAddPhotoTitle);
  formAddPhoto.appendChild(inputTextAddPhotoTitle);
  formAddPhoto.appendChild(formAddPhotoCategoryTitle);
  formAddPhoto.appendChild(inputSelectAddPhotoCategory);

  for (let i = 0; i < categoriesList.length; i++) {
    const inputOptionAddPhotoCategory = document.createElement("option");
    inputOptionAddPhotoCategory.value = categoriesList[i].id;
    inputOptionAddPhotoCategory.innerText = categoriesList[i].name;
    inputOptionAddPhotoCategory.id = categoriesList[i].id;
    inputSelectAddPhotoCategory.appendChild(inputOptionAddPhotoCategory);
  }

  const addPicture = document.createElement("input");
  addPicture.value = "Valider";
  addPicture.className = "modale-grey-button";
  addPicture.type = "submit";
  addPicture.addEventListener("click", sendWork);
  formAddPhoto.appendChild(addPicture);
};

// Fonction qui affiche la photo téléchargée
const afficherPhoto = () => {
  const input = document.getElementById("add-input");
  const title = document.getElementById("title");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    if (title?.value) {
      const addButton = document.querySelector(".modale-grey-button");
      addButton.classList.add("background-green");
    }
    reader.onload = function (e) {
      const photoDiv = document.querySelector(".add-photo-div");
      const imgLogo = document.getElementById("img-logo");
      if (imgLogo) {
        photoDiv.removeChild(imgLogo);
      }
      const addPhotoButton = document.querySelector(".add-photo-button");
      if (addPhotoButton) {
        photoDiv.removeChild(addPhotoButton);
      }
      const addPhotoTagLine = document.querySelector(".format-caption");
      if (addPhotoTagLine) {
        photoDiv.removeChild(addPhotoTagLine);
      }
      const image = document.getElementById("image-affichee");
      image.src = e.target.result;
      image.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  }
};

// Fonction qui vérifie si chaque input est bien remplit
const checkFormValue = () => {
  const input = document.getElementById("add-input");
  if (input.files && input.files[0]) {
    const addButton = document.querySelector(".modale-grey-button");
    addButton.classList.add("background-green");
  }
};

// Fonction qui génère la deuxième fenêtre de la modale
const generateSecondContentModale = () => {
  const modaleContent = document.querySelector(".modale-content");
  modaleContent.innerText = "";

  const arrowLeft = document.createElement("img");
  arrowLeft.src = "./assets/icons/arrow-left.svg";
  arrowLeft.className = "arrow-left";
  arrowLeft.addEventListener("click", generateFirstContentModale);

  const h2 = document.createElement("h2");
  h2.innerText = "Ajout photo";
  h2.className = "modale-title";

  modaleContent.appendChild(arrowLeft);
  generateCloseModaleButton(modaleContent);
  modaleContent.appendChild(h2);
  generateInputAddPhoto();
};

// Fonction qui envoie un travail
const sendWork = (e) => {
  e.preventDefault();

  // Récupération des éléments du formulaire
  const image = document.getElementById("add-input");
  const title = document.getElementById("title");
  const category = document.getElementById("category");

  // Alerte l'utilisateur si un champ est vide
  if (!image.files[0] || !title.value) {
    return alert("Veuillez renseigner tous les champs");
  }

  const body = new FormData();
  body.append("image", image.files[0]);
  body.append("title", title.value);
  body.append("category", category.value);

  fetch("http://localhost:5678/api/works/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: body,
  }).then(async (res) => {
    if (res.ok) {
      generateSecondContentModale();

      const data = await res.json();
      const id = data.id;
      const imageUrl = data.imageUrl;
      const workTitle = data.title;

      worksList.push(data);

      const gallery = document.querySelector(".gallery");

      const figure = document.createElement("figure");
      figure.id = "work " + id;

      const workImage = document.createElement("img");
      workImage.src = imageUrl;

      const workFigcaption = document.createElement("figcaption");
      workFigcaption.innerText = workTitle;

      gallery.appendChild(figure);
      figure.appendChild(workImage);
      figure.appendChild(workFigcaption);
    } else {
      alert("Une erreur s'est produite");
    }
  });
};

// Fonction qui supprime un travail
const deleteWork = async (id) => {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => {
    if (res.ok) {
      // Supprime l'élément de worksList
      worksList = worksList.filter((work) => work.id !== parseInt(id));

      // Regénère la première fenêtre de la modale
      generateFirstContentModale();

      // Mise à jour de la galerie principale
      const gallery = document.querySelector(".gallery");
      const figureChild = document.getElementById("work " + id);
      if (figureChild) {
        gallery.removeChild(figureChild);
      }
    } else {
      alert("Une erreur s'est produite lors de la suppression");
    }
  });
};

if (token) {
  const authButton = document.querySelector(".authButton");
  authButton.innerText = "";
  const logoutButton = document.createElement("a");
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./index.html";
  });
  logoutButton.innerText = "logout";
  authButton.appendChild(logoutButton);
  generateTopBar();
  generateEditButton();
}
