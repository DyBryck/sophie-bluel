let token = localStorage.getItem("token");

let worksList = [];
let categoriesList = [];

const modaleContainer = document.querySelector(".modale-container");

// Récupération des catégories à l'API (1: objets, 2: appartements, 3: hôtels & restaurants)
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

// Récupération des travaux à l'API via leur ID
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

// Génération des boutons de filtre pour chaque catégorie de travail
const generateFiltersButtons = (categories) => {
  const filters = document.querySelector(".filters");
  categories.push({ id: 0, name: "Tous" });
  categories.sort((a, b) => a.id - b.id);
  for (let i = 0; i < categories.length; i++) {
    const button = document.createElement("button");
    button.innerText = categories[i].name;
    button.className = "buttons filter-button";
    button.addEventListener("click", () => generateWorksList(categories[i].id));
    filters.appendChild(button);
  }
};

// Génération de la liste des travaux
const generateWorksList = (categoryId) => {
  let works = [];
  const filterButton = document.getElementsByClassName("buttons");
  for (let i = 0; i < filterButton.length; i++) {
    if (i === categoryId) {
      filterButton[i].className = "buttons filter-button-active";
    } else {
      filterButton[i].className = "buttons filter-button";
    }
  }
  if (parseInt(categoryId) === 0) {
    works = worksList;
  } else {
    works = worksList.filter(function (work) {
      return work.categoryId === parseInt(categoryId);
    });
  }
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
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
  }
};

getCategories();
getWorks();

// Fonction qui génère la barre noire quand l'utilisateur est connecté
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

const checkFormValue = () => {
  const input = document.getElementById("add-input");
  if (input.files && input.files[0]) {
    const addButton = document.querySelector(".modale-grey-button");
    addButton.classList.add("background-green");
  }
};

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

const sendWork = (e) => {
  e.preventDefault();
  const image = document.getElementById("add-input");
  const title = document.getElementById("title");
  const category = document.getElementById("category");

  if (image.files[0] === "" || title.value === "") {
    alert("Veuillez renseigner tous les champs");
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
  }).then(async () => {
    generateSecondContentModale();
    await getWorks();
  });
};

const deleteWork = async (id) => {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(async () => {
    await getWorks();
    generateFirstContentModale();
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
