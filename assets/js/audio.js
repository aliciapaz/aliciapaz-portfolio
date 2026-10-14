document.querySelectorAll("[data-player]").forEach((player) => {
  const audio = player.querySelector("audio");
  const toggle = player.querySelector(".player-toggle");
  const seek = player.querySelector(".player-seek");

  audio.controls = false;
  player.querySelector(".player-ui").hidden = false;

  const setPlaying = (playing) => {
    player.classList.toggle("is-playing", playing);
    toggle.setAttribute("aria-label", playing ? toggle.dataset.labelPause : toggle.dataset.labelPlay);
  };

  toggle.addEventListener("click", () => (audio.paused ? audio.play() : audio.pause()));
  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
  });
  seek.addEventListener("input", () => {
    if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  });
});
