async function handleSubmit(event) {
  event.preventDefault();

  const searchTerm = document.getElementById("searchInput").value.trim();

  if (searchTerm.length < 3) {
    const errorContainer = document.getElementById("errorContainer");
    errorContainer.innerHTML =
      '<p class="error">Введите не менее 3 символов</p>';
    return;
  }

  const url = `https://api.github.com/search/repositories?q=${searchTerm}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ошибка запроса");
    }
    const data = await response.json();
    const resultsContainer = document.getElementById("resultsContainer");
    if (data.total_count === 0) {
      resultsContainer.innerHTML = "<p>Ничего не найдено</p>";
    } else {
      const resultsList = resultsContainer.querySelector(".results");
      resultsList.innerHTML = "";

      for (let i = 0; i < Math.min(data.items.length, 10); i++) {
        const repo = data.items[i];
        let content = ``;
        content += `
        <li class="result">
            <div class="left">
              <p>
                Название:
                <a
                  class="repo-name"
                  href="${repo.html_url}"
                  target="_blank"
                  >${repo.name}</a
                >
              </p>
              <p class="repo-description">
                Описание: ${repo.description || "Описание отсутствует"}
              </p>
            </div>
            <div class="right">
              <p class="repo-login">Автор: ${repo.owner.login}</p>
              <p class="repo-created">Создан: ${formatDate(repo.created_at)}</p>
            </div>
          </li>
        `;
        resultsList.innerHTML += content;
      }
    }
  } catch (error) {
    const errorContainer = document.getElementById("errorContainer");
    errorContainer.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

const form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.innerHTML = "";
});

searchInput.addEventListener("input", () => {
  const errorContainer = document.getElementById("resultsContainer");
  errorContainer.innerHTML = "<ul class='results'></ul>";
});

function formatDate(dateTimeString) {
  const dateTime = new Date(dateTimeString);

  const dateString = dateTime.toLocaleDateString("ru-RU");
  const timeString = dateTime.toLocaleTimeString("ru-RU");

  return `${dateString} ${timeString}`;
}
