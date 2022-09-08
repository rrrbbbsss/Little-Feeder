async function loginHandler(event) {
  event.preventDefault();

  const email = document.querySelector("#email-input").value.trim();
  const password = document.querySelector("#password-input").value.trim();
  const errorText = document.querySelector("#error-text");

  const response = await fetch("/api/user/login", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.ok) {
    document.location.replace("/article");
  } else {
    const { message } = await response.json();
    console.log(message);
    errorText.textContent = message;
  }
}

document
  .querySelector("#account-form")
  .addEventListener("submit", loginHandler);
