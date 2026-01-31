import { elCardContainer, elCardTemplate, elSkeletonLoader, elSkeletonTemplate } from "./html-el.js";

const elSelect = document.getElementById("categorySelect");


function showLoader() {
  elSkeletonLoader.innerHTML = "";
  for (let _ of Array(8)) {
    elSkeletonLoader.appendChild(elSkeletonTemplate.content.cloneNode(true));
  }
  elSkeletonLoader.classList.remove("hidden");
  elCardContainer.classList.add("hidden");
}

function hideLoader() {
  elSkeletonLoader.classList.add("hidden");
  elCardContainer.classList.remove("hidden");
}


function showCards(data) {
  elCardContainer.innerHTML = "";
  data.forEach(item => {
    const card = elCardTemplate.content.cloneNode(true);
    
    card.querySelector(".js-name").textContent = item.name;
    card.querySelector(".js-sound").textContent = item.soundText;
    card.querySelector(".js-category").textContent = item.category;
    card.querySelector(".js-year").textContent = item.year;
    card.querySelector(".js-wild").textContent = item.isWild;
    card.querySelector(".js-weight").textContent = item.weight;
    card.querySelector(".js-speed").textContent = item.speed;
    card.querySelector(".js-color").textContent = item.color;
    card.querySelector(".js-habitat").textContent = item.habitat;
    
    elCardContainer.appendChild(card);
  });
}


function loadData(category = null) {
  showLoader();
  
  fetch("https://json-api.uz/api/project/game-over/animals")
    .then(res => res.json())
    .then(result => {
      const data = category 
        ? result.data.filter(item => item.category === category)
        : result.data;
      
      showCards(data);
      hideLoader();
    })
    .catch(err => {
      console.error(err);
      hideLoader();
    });
}

elSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  loadData(value === "all" ? null : value);
});


loadData();