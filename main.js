// When HTMX replaces #main content, focus the first input
document.body.addEventListener("htmx:afterSwap", evt => {
  if (evt.target.id === "main") {
    const firstInput = evt.target.querySelector("input, textarea, select");
    if (firstInput) {
      firstInput.focus();
    }
  }
});
