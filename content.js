/* Edit this file on GitHub to update the portfolio. Paths are relative to index.html.
   Media: { type: "image", src: "/assets/name.webp", w: 2000, alt: "Description" }
   `w` is the file's own width in pixels. Declare it and the page will also offer
   narrow copies named name-800.webp / name-1400.webp — put them next to the original
   (any of the listed widths smaller than `w`). Leave `w` out and only the original is used.
   Video: { type: "video", src: "/assets/name.mp4", poster: "assets/poster.webp", alt: "Video description" }
   Add actual video files before adding video entries. No build is needed. */
window.PLAIR_CONFIG = {
  // FormSubmit needs its first-ever submission confirmed by email before it starts
  // delivering silently — see the note sent alongside this change.
  formService: "formsubmit",
  formEndpoint: "https://formsubmit.co/fazullin@me.com",
  formActivated: true,
  // Fallback used only while formActivated is false.
  contactEmail: "fazullin@me.com"
};
window.PLAIR_CASES = [
  {
    id: "marshrut-perestroen",
    title: "Маршрут перестроен",
    category: "Web",
    description: "Игра для промо фильма о путешествии по зимней Якутии.",
    media: [
      { type: "image", src: "/assets/marshrut-perestroen-1.webp", w: 2000, alt: "Заставка «Маршрут перестроен» с автомобилем на заснеженной дороге" },
      { type: "image", src: "/assets/marshrut-perestroen-2.webp", w: 2000, alt: "Экран окончания поездки с пройденным расстоянием в игре «Маршрут перестроен»" },
      { type: "image", src: "/assets/marshrut-perestroen-3.webp", w: 2000, alt: "Олень на дороге перед автомобилем в игре «Маршрут перестроен»" }
    ]
  },
  {
    id: "2nd-chance",
    title: "2nd Chance",
    category: "Mobile",
    description: "Образовательная игра в жанре «алхимия» (500K+ установок).",
    media: [
      { type: "image", src: "/assets/2nd-chance-1.webp", w: 2000, alt: "Постапокалиптическая локация для поиска предметов в игре 2nd Chance" },
      { type: "image", src: "/assets/2nd-chance-2.webp", w: 921, alt: "Карточка открытого элемента «Данные» в игре 2nd Chance" },
      { type: "image", src: "/assets/2nd-chance-3.webp", w: 921, alt: "Список достижений игрока в игре 2nd Chance" }
    ]
  },
  {
    id: "simple-sandbox",
    title: "Simple Sandbox 3",
    category: "Mobile",
    description: "Геймдизайн для мобильной песочницы с 1М+ установок.",
    media: [
      { type: "image", src: "/assets/simple-sandbox-1.webp", w: 1280, alt: "Кат-сцена с персонажами и гробом в стилистике Simple Sandbox 3" },
      { type: "image", src: "/assets/simple-sandbox-2.webp", w: 1280, alt: "Игровой автомобиль на городской улице в Simple Sandbox 3" },
      { type: "image", src: "/assets/simple-sandbox-3.webp", w: 1280, alt: "Сцена в школьном классе с игровым интерфейсом в Simple Sandbox 3" }
    ]
  },
  {
    id: "naydi-oshibku",
    title: "Найди ошибку",
    category: "Web / стенд",
    description: "Игра на поиск ошибок в интерфейсе для хакатона Почтатеха.",
    media: [
      { type: "image", src: "/assets/naydi-oshibku-1.webp", w: 2000, alt: "Интерфейс отслеживания отправления со спрятанными ошибками в игре «Найди ошибку»" },
      { type: "image", src: "/assets/naydi-oshibku-2.webp", w: 2000, alt: "Экран регистрации участника с маскотом Почтатеха в игре «Найди ошибку»" },
      { type: "image", src: "/assets/naydi-oshibku-3.webp", w: 2000, alt: "Экран правил игры «Найди ошибку» на хакатоне Почтатеха" }
    ]
  },
  {
    id: "polka-chudes",
    title: "Полка чудес",
    category: "Web / Mobile",
    description: "Игра для федеральной сети магазинов.",
    media: [
      { type: "image", src: "/assets/polka-chudes-1.webp", w: 1094, alt: "Прыгающий персонаж-медвежонок на игровой локации в «Полке чудес»" },
      { type: "image", src: "/assets/polka-chudes-2.webp", w: 1094, alt: "Экран награды с воздушными шарами и подарком в «Полке чудес»" },
      { type: "image", src: "/assets/polka-chudes-3.webp", w: 1094, alt: "Финальный экран со счётом игрока в «Полке чудес»" }
    ]
  },
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
  },
  {
    id: "innosim",
    title: "Инносим",
    category: "Web",
    description: "Симулятор городского движения.",
    media: [
      { type: "image", src: "/assets/innosim-1.webp", w: 2000, alt: "3D-модель круглого здания с автономным такси и пешеходами в симуляторе «Инносим»" },
      { type: "image", src: "/assets/innosim-2.webp", w: 2000, alt: "Роботы-доставщики и беспилотный транспорт на городской улице в симуляторе «Инносим»" },
      { type: "image", src: "/assets/innosim-3.webp", w: 2000, alt: "Панорама квартала с беспилотным транспортом в симуляторе «Инносим»" }
    ]
  }
];
