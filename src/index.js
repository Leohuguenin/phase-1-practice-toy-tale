let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const addToyForm = document.querySelector(".add-toy-form");
  addToyForm.addEventListener("submit", (e) => {
    console.log("submit");
    e.preventDefault();
    console.log(e.target.name);
    console.log(e.target.image);

    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0
    };

    postToy(newToy);
  })

  fetchToy();
});

function fetchToy() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(data => {
      data.forEach(toy => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        const h2 = document.createElement('h2');
        h2.textContent = toy.name;
        cardDiv.appendChild(h2);

        const img = document.createElement('img');
        img.src = toy.image;
        img.classList.add("toy-avatar");
        cardDiv.appendChild(img);

        const p = document.createElement('p');
        p.id = `p-${toy.id}`;
        p.textContent = `${toy.likes} likes`;
        cardDiv.appendChild(p);

        const button = document.createElement("button");
        button.classList.add("like-btn");
        button.id = toy.id;
        button.textContent = "like";
        button.addEventListener("click", () => updateLikes(toy.id));
        cardDiv.appendChild(button);

        const toyCollection = document.getElementById("toy-collection");
        toyCollection.appendChild(cardDiv);
      });
    })
    .catch(error => {
      console.error("Error fetching toys:", error);
    });
}

function postToy(newToy) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newToy)
  })
    .then(response => response.json())
    .then(() => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");

      const h2 = document.createElement('h2');
      h2.textContent = newToy.name;
      cardDiv.appendChild(h2);

      const img = document.createElement('img');
      img.src = newToy.image;
      img.classList.add("toy-avatar");
      cardDiv.appendChild(img);

      const p = document.createElement('p');
      p.id = `p-${newToy.id}`;
      p.textContent = `${newToy.likes} likes`;
      cardDiv.appendChild(p);

      const button = document.createElement("button");
      button.classList.add("like-btn");
      button.id = newToy.id;
      button.textContent = "like";
      button.addEventListener("click", () => updateLikes(newToy.id));
      cardDiv.appendChild(button);

      const toyCollection = document.getElementById("toy-collection");
      toyCollection.appendChild(cardDiv);
    })
}

function updateLikes(id) {
  const p = document.getElementById(`p-${id}`);
  const currentLikes = parseInt(p.textContent);
  const newLikes = currentLikes + 1;

  fetch(`http://localhost:3000/toys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": newLikes
    })
  })
    .then(response => response.json())
    .then(data => {
      p.textContent = `${data.likes} likes`;
    });
}
