import { ui } from "./ui.js";
import {
  elCardTemplate,
  elCardContainer,
  elSelect,
  elAdd,
  elSkeletonLoader,
  elSkeletonTemplate,
  elModal,
  elEditForm,
  elEditModal,
  elAddForm,
  elAddButton,
} from "./html-el.js";
let editedElementId = null;
let state = null;
function stateChanger(value) {
  state = value;
  ui(state);
}

fetch("https://json-api.uz/api/project/game-over/animals")
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    stateChanger(res.data);
  })
  .catch((err) => {})
  .finally(() => {});

elSelect.addEventListener("change", (e) => {
  let selectedCategory = e.target.value;

  if (!selectedCategory || selectedCategory === "all") {
    loadAllAnimals();
  } else {
    filterByCategory(selectedCategory);
  }
});

function filterByCategory(category) {
  fetch("https://json-api.uz/api/project/game-over/animals")
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      const filtered = result.data.filter((animal) => {
        return animal.category === category;
      });

      ui(filtered);
    })
    .catch((error) => {
      console.error("Xatolik:", error);
    });
}

function showLoader() {
  elCardContainer.innerHTML = "";
  Array.from({ length: 20 }).forEach(() => {
    elCardContainer.appendChild(elSkeletonTemplate.content.cloneNode(true));
  });
}

function showCards(data) {
  elCardContainer.innerHTML = "";
  data.forEach((item) => {
    const card = elCardTemplate.content.cloneNode(true);
    card.querySelector(".js-h5").textContent = item.name;
    card.querySelector(".js-p").textContent = item.category;
    card.querySelector(".js-span").textContent = item.isWild;
    elCardContainer.appendChild(card);
  });
}

showLoader();

function isLogged() {
  if (localStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
}
// Delete
function deleteAnimal(id) {
  const token = localStorage.getItem("token");

  fetch(`https://json-api.uz/api/project/game-over/animals/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((t) => {
          throw new Error(t);
        });
      }
      return res.text();
    })
    .then(() => {
      state = state.filter((el) => el.id != id);
      stateChanger(state);
    })
    .catch((err) => {
      console.error("Delete error:", err.message);
      if (err.message.includes("Token expired")) {
        localStorage.removeItem("token");
        location.href = "./register/login.html";
      }
    });
}
// edit
function edit(editData) {
  fetch("https://json-api.uz/api/project/game-over/animals/" + editData.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(editData),
  })
    .then((res) => res.json())
    .then((res) => {
      const result = state.map((el) => el.id === res.id ? res : el);
      
  
      stateChanger(result);
      
      elEditModal.close();
      elEditForm.reset();
      
    })
    .catch(err => {
      console.error("Edit error:", err);
      showAlert("error", "Failed to update animal!");
    })
    .finally(()=>{});
}

elEditForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const formData = new FormData(elEditForm);
  const result = { id: editedElementId };
  formData.forEach((value, key) => {
    result[key] = value;
  });
  edit(result);
});

elCardContainer.addEventListener("click", (evt) => {
  const editBtn = evt.target.closest(".js-edit");

  if (editBtn) {
    if (isLogged() == false) {
      evt.preventDefault();
      location.href = "./register/login.html";
      return;
    }

    elEditModal.showModal();

    const id = editBtn.dataset.id;
    console.log("Edit ID:", id);

    const data = state.find((el) => el.id == id);

    if (!data) {
      console.error("Ma'lumot topilmadi!");
      return;
    }

    console.log("Found data:", data);

    elEditForm.name.value = data.name;
    elEditForm.category.value = data.category;
    elEditForm.speed.value = data.speed;
    elEditForm.soundText.value = data.soundText;
    elEditForm.year.value = data.year;
    elEditForm.weight.value = data.weight;
    elEditForm.color.value = data.color;
    elEditForm.habitat.value = data.habitat;
    elEditForm.isWild.value = data.isWild;

    editedElementId = data.id;
  }

  if (evt.target.classList.contains(".js-btn")) {
    if (isLogged() == false) {
      evt.preventDefault();
      location.href = "./register/login.html";
    }
  }
});
// delete
elCardContainer.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".js-delete");
  if (!deleteBtn) return;

  const id = deleteBtn.dataset.id;
  if (!id) {
    console.error("ID topilmadi");
    return;
  }

  if (!isLogged()) {
    location.href = "./register/login.html";
    return;
  }

  deleteBtn.disabled = true;
  deleteBtn.textContent = "O‘chirilmoqda...";

  deleteAnimal(id);
});

elAddButton.addEventListener("click", (evt) => {
  if (isLogged() == false) {
    evt.preventDefault();
    location.href = "./register/login.html";
  }
});

elEditForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const formData = new FormData(elEditForm);
  const result = {};

  formData.forEach((value, key) => {
    result[key] = value;
  });

  result.id = editedElementId;

  edit(result);
});

elAddForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const formData = new FormData(elAddForm);
  const result = {};

  formData.forEach((value, key) => {
    result[key] = value;
  });

  if (result.isWild === "true") result.isWild = true;
  if (result.isWild === "false") result.isWild = false;

  fetch("https://json-api.uz/api/project/game-over/animals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(result),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Server error");
      return res.json();
    })
    .then((data) => {
      console.log("Added:", data);
      location.href = "/index.html";
    })
    .catch((err) => console.error(err));
  console.log(localStorage.getItem("token"));
});
