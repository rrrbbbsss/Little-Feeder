async function newFeedHandler(event) {
  event.preventDefault();

  const newfeedurl = document.querySelector("#feedurl-input").value.trim();
  const newdescription = document
    .querySelector("#description-input")
    .value.trim();
  const errorText = document.querySelector("#error-text");

  const response = await fetch("/api/feed", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: newfeedurl,
      description: newdescription,
    }),
  });

  if (response.ok) {
    document.location.reload();
  } else {
    const { message } = await response.json();
    errorText.textContent = message;
  }
}

async function feedHandler(event) {
  event.preventDefault();
  const target = event.target;
  // match for delete feed
  if (target.matches(".deleteFeed")) {
    const response = await fetch(`/api/feed/${target.dataset.id}`, {
      method: "delete",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }

  // match for edit feed
  if (target.matches(".editFeed")) {
    const editDescription = document.querySelector(
      "#feedDescription-".concat(target.dataset.id)
    );
    if (editDescription.firstChild.tagName === "FORM") {
      const editDescription = document.querySelector(
        "#feedDescription-".concat(target.dataset.id)
      );
      editDescription.innerHTML = `${editDescription.dataset.old}`;
      target.dataset.old = "";
      return;
    }
    const old = editDescription.textContent.trim();
    editDescription.dataset.old = old;
    editDescription.innerHTML = `<form
      class=""
      id="editfeed-form"
    >
      <div class="p-2">
        <textarea class="p-1 w-full" id="description-input-${target.dataset.id}">${old}</textarea>
      </div>
      <p class="p-2 text-rose-700" id="edit-error-text-${target.dataset.id}">
        <br />
      </p>
      <div class="flex justify-center">
        <button
          class="updateEdit p-2 bg-zinc-400 border border-bg-zinc-600 hover:bg-green-400"
          data-id=${target.dataset.id}
        >
          Update Description
        </button>
        <button
          class="cancelEdit p-2 bg-zinc-400 border border-bg-zinc-600 hover:bg-amber-400"
          data-id=${target.dataset.id}
        >
          Cancel
        </button>
      </div>
    </form>`;
  }

  // match cancel button
  if (target.matches(".cancelEdit")) {
    const editDescription = document.querySelector(
      "#feedDescription-".concat(target.dataset.id)
    );
    editDescription.innerHTML = `${editDescription.dataset.old}`;
    target.dataset.old = "";
  }

  if (target.matches(".updateEdit")) {
    const feedDescription = document.querySelector(
      "#feedDescription-".concat(target.dataset.id)
    );
    const editDescription = document.querySelector(
      `#description-input-${target.dataset.id}`
    );
    const errorText = document.querySelector(
      `#edit-error-text-${target.dataset.id}`
    );

    const response = await fetch(`/api/feed/${target.dataset.id}`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: editDescription.value.trim(),
      }),
    });
    if (response.ok) {
      feedDescription.innerHTML = editDescription.value.trim();
    } else {
      const { message } = await response.json();
      errorText.textContent = message;
    }
  }
}

async function editFeedHandler(event) {
  event.preventDefault();

  const editdescription = document
    .querySelector("#description-input")
    .value.trim();
  const errorText = document.querySelector("#edit-error-text");

  const response = await fetch(`/api/feed/${target.dataset.id}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: editedDiscription,
    }),
  });
  if (response.ok) {
    document.location.reload();
  } else {
    const { message } = await response.json();
    errorText.textContent = message;
  }
}

document
  .querySelector("#newfeed-form")
  .addEventListener("submit", newFeedHandler);

document.querySelector("#feeds").addEventListener("click", feedHandler);
