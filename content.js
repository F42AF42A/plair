/* Edit this file on GitHub to update the portfolio. Paths are relative to index.html.
   Media: { type: "image", src: "/assets/name.webp", alt: "Description" }
   Video: { type: "video", src: "/assets/name.mp4", poster: "assets/poster.webp", alt: "Video description" }
   Add actual video files before adding video entries. No build is needed. */
window.PLAIR_CONFIG = {
  // Set an activated opaque FormSubmit endpoint before enabling delivery.
  formService: "formsubmit",
  formEndpoint: "",
  formActivated: false,
  // Alternatively, set an approved business email to open a prefilled email draft.
  contactEmail: ""
};
window.PLAIR_CASES = [
  {
    id: "t-quest",
    title: "T-Quest",
    category: "Web / Mobile",
    description: "Игра для геймификации HR-активностей Т-банка на конференциях.",
    media: [
      { type: "image", src: "/assets/t-quest-1.webp", alt: "Персонаж и золотистое существо на игровой локации в T-Quest"},
      { type: "image", src: "/assets/t-quest-2.webp", alt: "Экран выбора стихии с командой персонажей в T-Quest" },
      { type: "image", src: "/assets/t-quest-3.webp", alt: "Персонаж-бык Хнум в T-Quest" }
    ]
  }
];
