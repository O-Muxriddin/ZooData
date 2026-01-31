
const elForm = document.getElementById("form");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(elForm);

  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  fetch("https://json-api.uz/api/project/game-over/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        return res.text();
      }
      return res.json();
    })
    .then((res) => {
      localStorage.setItem("token", res.access_token);
      location.href = "/index.html";
    })
    .catch((err) => console.error(err));
});
