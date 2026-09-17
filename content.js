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
    id: "winter-route-demo",
    title: "Зимний маршрут",
    category: "Промоигра · Web",
    description: "Исследовать мир, находить новое, возвращаться. Игровой формат для знакомства с брендом.",
    note: "Демонстрационный кейс",
    media: [
      { type: "image", src: "/assets/winter-route.webp", alt: "Автомобиль на зимней дороге в горах" },
      { type: "image", src: "/assets/forest-route.webp", alt: "Зимняя дорога через хвойный лес к горному озеру" },
      { type: "image", src: "/assets/route-aerial.webp", alt: "Вид сверху на извилистую дорогу в заснеженном лесу" }
    ]
  }
];
