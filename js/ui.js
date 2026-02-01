import { elCardContainer, elCardTemplate } from "./html-el.js";

export function ui(data) {
  elCardContainer.innerHTML = "";

  data.forEach((element) => {
    const clone = elCardTemplate.cloneNode(true).content;

    clone.querySelector(".js-name").innerText = element.name ?? "No name";
    clone.querySelector(".js-p").innerText = element.category ?? "No category";
    clone.querySelector(".js-speed").innerText = element.speed ?? "No speed";
    clone.querySelector(".js-sound").innerText =
      element.soundText ?? "No sound";
    clone.querySelector(".js-year").innerText = element.year ?? "No year";
    clone.querySelector(".js-weight").innerText = element.weight ?? "No weight";
    clone.querySelector(".js-color").innerText = element.color ?? "No color";
    clone.querySelector(".js-habitat").innerText =
      element.habitat ?? "No habitat";
    clone.querySelector(".js-span").innerText = element.isWild ?? "No wild";

    clone.querySelector(".js-edit").dataset.id = element.id ?? "No id";
    clone.querySelector(".js-delete").dataset.id = element.id ?? "No Id";

    elCardContainer.appendChild(clone);
  });
}
