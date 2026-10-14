document.querySelectorAll(".video-facade").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const iframe = document.createElement("iframe");
    iframe.src = link.dataset.embed;
    iframe.title = link.textContent.trim();
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    link.replaceWith(iframe);
  });
});
