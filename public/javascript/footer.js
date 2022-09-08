function formatDate(date) {
  const d = new Date(date);
  return `${
    d.getMonth() + 1
  }/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

async function createArticles(dir) {
  const articlesEl = document.querySelector("#articles");
  const currentPage = document.querySelector("#currentPage");
  const totalPage = document.querySelector("#totalPage");
  const currentPageInt = parseInt(currentPage.textContent);
  const totalPageInt = parseInt(totalPage.textContent);

  const prevTest = currentPageInt <= 1;
  const nextTest = totalPageInt - currentPageInt <= 0;
  const test = dir === "next" ? nextTest : prevTest;
  const updatePageInt =
    dir === "next" ? currentPageInt + 1 : currentPageInt - 1;

  if (test) {
    return;
  } else {
    const response = await fetch(
      `/api/article/?page=${updatePageInt}&unread=true`
    );

    if (response.ok) {
      const { pages, articles } = await response.json();
      articlesEl.innerHTML = "";
      articles.forEach((article) => {
        const div = document.createElement("div");
        div.classList.add("grid", "grid-cols-12", "gap-2", "my-4");
        div.innerHTML = `<div class="col-start-2 col-span-10 lg:col-start-4 lg:col-span-6 2xl:col-start-5 2xl:col-span-4">
          <a
          href="${article.url}"
          target="_blank"
          data-id="${article.id}"
          class="group article bg-zinc-300 border border-zinc-400 flex flex-col justify-between"
        >
          <div class="p-2 bg-zinc-400 group-hover:bg-blue-600">
            ${formatDate(article.published)}
          </div>
          <div class="p-2 group-hover:bg-blue-400">
            ${article.title}
          </div>
        </a></div>`;
        articlesEl.appendChild(div);
      });
      currentPage.textContent = updatePageInt;
      totalPage.textContent = pages;
    } else {
      alert(response.statusText);
    }
  }
}
async function footerHandler(event) {
  if (event.target.matches("#article-next-page")) {
    createArticles("next");
  } else if (event.target.matches("#article-prev-page")) {
    createArticles("prev");
  }
}

document.querySelector("#footer").addEventListener("click", footerHandler);
createArticles("next");
