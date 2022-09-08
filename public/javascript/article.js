async function articleHandler(event) {
  const target = event.target.parentNode;
  if (target.matches(".article")) {
    const response = await fetch(`/api/article/${target.dataset.id}`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unread: false,
      }),
    });

    if (response.ok) {
      // todo mark as read visually
      target.classList.remove("bg-zinc-300");
      target.classList.add("text-zinc-200");
    } else {
      alert(response.statusText);
    }
  }
}

document.querySelector("#articles").addEventListener("click", articleHandler);
