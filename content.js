/* Файл редактируется прямо на GitHub — этого достаточно, сборки нет.
   Пути указываются относительно index.html.

   Кадр: { type: "image", src: "/assets/name.webp", w: 2000, h: 1125, alt: "Описание" }
   `w` и `h` — настоящие размеры файла в пикселях. По ним страница считает
   пропорцию кадра и раскладывает три кадра кейса коллажем: вертикальные
   встают рядом, широкие — крупным кадром и парой под ним. Без размеров кадр
   считается широким и раскладка портится.
   Кроме того, объявленная `w` подключает узкие копии name-800.webp и
   name-1400.webp для телефонов — положите их рядом с оригиналом.
   Размеры и узкие копии делает скрипт fix-assets.py в корне репозитория:
   положите оригинал в assets/, впишите путь сюда и запустите его.

   Видео: { type: "video", src: "/assets/name.mp4", poster: "assets/poster.webp", alt: "Описание" }
   Сначала положите файл, потом добавляйте запись. */
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
    id: "gaica",
    title: "GAICA",
    category: "Хакатон / платформа",
    description: "Международный кибер-турнир для разработчиков по созданию игровых ИИ-агентов.",
    note: "250 участников из 3 стран, финал на РВФ.",
    media: [
      { type: "image", src: "/assets/gaica-1.webp", w: 1600, h: 1067, alt: "Награждение победителей хакатона «GAICA: игровая арена ИИ» на сцене" },
      { type: "image", src: "/assets/gaica-2.webp", w: 1600, h: 1067, alt: "Участники GAICA на пуфах смотрят трансляцию матчей ИИ-агентов" },
      { type: "image", src: "/assets/gaica-3.webp", w: 1600, h: 1067, alt: "Призы GAICA в виде гаек на стенде турнира" }
    ]
  },
  {
    id: "game-open-lab",
    title: "Game Open Lab",
    category: "Ивент",
    description: "Всероссийская лаборатория и игрофицированный геймджем.",
    note: "500 участников, 160 проектов, 30 топовых экспертов и блогеров в жюри.",
    media: [
      { type: "image", src: "/assets/game-open-lab-1.webp", w: 1280, h: 853, alt: "Общее фото участников Game Open Lab с дипломами на фоне экрана GOL Direct" },
      { type: "image", src: "/assets/game-open-lab-2.webp", w: 1280, h: 853, alt: "Паблик-ток «Будущее игровой индустрии» в полном зале на Game Open Lab" },
      { type: "image", src: "/assets/game-open-lab-3.webp", w: 1280, h: 853, alt: "Рабочая зона геймджема с командами за компьютерами на Game Open Lab" }
    ]
  },
  {
    id: "travel-quest",
    title: "Travel Quest",
    category: "Mobile",
    description: "AR-паззл с квестами для изучения городов.",
    media: [
      { type: "image", src: "/assets/travel-quest-1.webp", w: 701, h: 623, alt: "Карта с точкой квеста и список заданий в приложении Travel Quest" },
      { type: "image", src: "/assets/travel-quest-2.webp", w: 657, h: 582, alt: "Сканирование QR-кода в городе и японский кроссворд в приложении Travel Quest" },
      { type: "image", src: "/assets/travel-quest-3.webp", w: 663, h: 592, alt: "Экраны завершения квеста с промокодом и новым персонажем в приложении Travel Quest" }
    ]
  },
  {
    id: "tehnopark",
    title: "Геймификация технопарка",
    category: "Web",
    description: "Разработка системы геймификации технопарков Иннополиса.",
    media: [
      { type: "image", src: "/assets/tehnopark-1.webp", w: 1280, h: 853, alt: "Технопарк Иннополиса с высоты птичьего полёта с подсвеченными секторами направлений" },
      { type: "image", src: "/assets/tehnopark-2.webp", w: 1280, h: 853, alt: "Схема уровней участника с наградами и значками в системе геймификации технопарка" }
    ]
  },
  {
    id: "hotlime",
    title: "Hotlime",
    category: "PC",
    description: "Аркадный PvP-экшен для 2–4 игроков.",
    media: [
      { type: "image", src: "/assets/hotlime-1.webp", w: 1280, h: 720, alt: "Взрыв в офисе и двое игроков на карте в игре Hotlime" },
      { type: "image", src: "/assets/hotlime-2.webp", w: 1280, h: 720, alt: "Перестрелка во дворе с разбросанным оружием в игре Hotlime" },
      { type: "image", src: "/assets/hotlime-3.webp", w: 1280, h: 720, alt: "Схватка в офисных помещениях в игре Hotlime" }
    ]
  },
  {
    id: "sportivnye-vyzhivateli",
    title: "Самые спортивные выживатели",
    category: "PC",
    description: "Игра про популяризацию ЗОЖ с брендом художницы Beco.",
    media: [
      { type: "image", src: "/assets/sportivnye-vyzhivateli-1.webp", w: 937, h: 512, alt: "Встреча с сектантом и диалоговое окно в игре «Самые спортивные выживатели»" },
      { type: "image", src: "/assets/sportivnye-vyzhivateli-2.webp", w: 1280, h: 720, alt: "Бой с толпой противников у дома лесника в игре «Самые спортивные выживатели»" },
      { type: "image", src: "/assets/sportivnye-vyzhivateli-3.webp", w: 1280, h: 720, alt: "Экран выбора артефакта с тремя вариантами в игре «Самые спортивные выживатели»" }
    ]
  },
  {
    id: "innosim",
    title: "Инносим",
    category: "Web",
    description: "Симулятор городского движения.",
    media: [
      { type: "image", src: "/assets/innosim-1.webp", w: 2000, h: 1033, alt: "3D-модель круглого здания с автономным такси и пешеходами в симуляторе «Инносим»" },
      { type: "image", src: "/assets/innosim-2.webp", w: 2000, h: 1036, alt: "Роботы-доставщики и беспилотный транспорт на городской улице в симуляторе «Инносим»" },
      { type: "image", src: "/assets/innosim-3.webp", w: 2000, h: 1044, alt: "Панорама квартала с беспилотным транспортом в симуляторе «Инносим»" }
    ]
  },
  {
    id: "marshrut-perestroen",
    title: "Маршрут перестроен",
    category: "Web",
    description: "Игра для промо фильма о путешествии по зимней Якутии.",
    media: [
      { type: "image", src: "/assets/marshrut-perestroen-1.webp", w: 2000, h: 1134, alt: "Заставка «Маршрут перестроен» с автомобилем на заснеженной дороге" },
      { type: "image", src: "/assets/marshrut-perestroen-2.webp", w: 2000, h: 1138, alt: "Экран окончания поездки с пройденным расстоянием в игре «Маршрут перестроен»" },
      { type: "image", src: "/assets/marshrut-perestroen-3.webp", w: 2000, h: 1138, alt: "Олень на дороге перед автомобилем в игре «Маршрут перестроен»" }
    ]
  },
  {
    id: "2nd-chance",
    title: "2nd Chance",
    category: "Mobile",
    description: "Образовательная игра в жанре «алхимия» (500K+ установок).",
    media: [
      { type: "image", src: "/assets/2nd-chance-1.webp", w: 2000, h: 921, alt: "Постапокалиптическая локация для поиска предметов в игре 2nd Chance" },
      { type: "image", src: "/assets/2nd-chance-2.webp", w: 921, h: 2000, alt: "Карточка открытого элемента «Данные» в игре 2nd Chance" },
      { type: "image", src: "/assets/2nd-chance-3.webp", w: 921, h: 2000, alt: "Список достижений игрока в игре 2nd Chance" },
      { type: "image", src: "/assets/2nd-chance-4.webp", w: 921, h: 2000, alt: "Сетка открытых и закрытых элементов с прогрессом 6 из 300 в игре 2nd Chance" }
    ]
  },
  {
    id: "simple-sandbox",
    title: "Simple Sandbox 3",
    category: "Mobile",
    description: "Геймдизайн для мобильной песочницы с 1М+ установок.",
    media: [
      { type: "image", src: "/assets/simple-sandbox-1.webp", w: 1280, h: 755, alt: "Кат-сцена с персонажами и гробом в стилистике Simple Sandbox 3" },
      { type: "image", src: "/assets/simple-sandbox-2.webp", w: 1280, h: 718, alt: "Игровой автомобиль на городской улице в Simple Sandbox 3" },
      { type: "image", src: "/assets/simple-sandbox-3.webp", w: 1280, h: 720, alt: "Сцена в школьном классе с игровым интерфейсом в Simple Sandbox 3" }
    ]
  },
  {
    id: "naydi-oshibku",
    title: "Найди ошибку",
    category: "Web / стенд",
    description: "Игра на поиск ошибок в интерфейсе для Почтатеха.",
    media: [
      { type: "image", src: "/assets/naydi-oshibku-1.webp", w: 2000, h: 1124, alt: "Интерфейс отслеживания отправления со спрятанными ошибками в игре «Найди ошибку»" },
      { type: "image", src: "/assets/naydi-oshibku-2.webp", w: 2000, h: 1123, alt: "Экран регистрации участника с маскотом Почтатеха в игре «Найди ошибку»" },
      { type: "image", src: "/assets/naydi-oshibku-3.webp", w: 2000, h: 1125, alt: "Экран правил игры «Найди ошибку» для Почтатеха" }
    ]
  },
  {
    id: "polka-chudes",
    title: "Полка чудес",
    category: "Web / Mobile",
    description: "Игра для федеральной сети магазинов.",
    media: [
      { type: "image", src: "/assets/polka-chudes-1.webp", w: 1094, h: 1708, alt: "Прыгающий персонаж-медвежонок на игровой локации в «Полке чудес»" },
      { type: "image", src: "/assets/polka-chudes-2.webp", w: 1094, h: 1708, alt: "Экран награды с воздушными шарами и подарком в «Полке чудес»" },
      { type: "image", src: "/assets/polka-chudes-3.webp", w: 1094, h: 1708, alt: "Финальный экран со счётом игрока в «Полке чудес»" }
    ]
  },
  {
    id: "t-quest",
    title: "T-Quest",
    category: "Web / Mobile",
    description: "Игра для геймификации HR-активностей Т-банка на конференциях.",
    media: [
      { type: "image", src: "/assets/t-quest-1.webp", w: 751, h: 1013, alt: "Персонаж и золотистое существо на игровой локации в T-Quest"},
      { type: "image", src: "/assets/t-quest-2.webp", w: 747, h: 1015, alt: "Экран выбора стихии с командой персонажей в T-Quest" },
      { type: "image", src: "/assets/t-quest-3.webp", w: 757, h: 1006, alt: "Персонаж-бык Хнум в T-Quest" }
    ]
  }
];
