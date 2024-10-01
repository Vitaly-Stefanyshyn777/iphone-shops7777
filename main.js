"use strict";

// Глобальні змінні
let currentPage = 1;
const productsPerPage = 21;
let totalProducts = 0;
let isLoading = false;
let isResettingFilters = false; // Додаємо флаг для скидання фільтрів

// Базова URL-адреса вашого API
const BASE_URL = "http://localhost:3000/api/smartphones";

// Елементи DOM
const showButton = document.querySelector(".show");
const btnCloseButton = document.querySelector(".btn-close");
const cardsContainer = document.querySelector(".cards");
const searchInput = document.getElementById("searchInput");
const apiResponseElement = document.getElementById("api-response");
const loadingIndicator = document.getElementById("loading"); // Індикатор завантаження

// Мапа між заголовками фільтрів і ключами для запиту
const filterKeyMap = {
  Бренди: "brand",
  "Операційна система": "os",
  Колір: "color",
  "Тип SIM-карти": "simType",
  "Кількість модулів камери": "numberOfCameras", // Змінено з "cameraModules"
  "Запис відео": "videoResolution", // Змінено з "videoRecording"
  "Матеріал корпусу": "bodyMaterial",
  "Ємність акумулятора": "batteryCapacity",
  "Швидка зарядка": "fastCharging",
  "Фронтальна камера": "frontCamera",
  "Діагональ екрану": "screenSize",
  "Роздільна здатність екрану": "screenResolution",
  "Основна камера": "mainCamera",
  "Кількість SIM-карт": "simCount",
  "Оперативна пам'ять": "ram",
  "Внутрішня пам'ять": "storage", // Змінено з "internalMemory"
};

// Структура для зберігання поточних фільтрів
const selectedFilters = {
  brand: [],
  os: [],
  color: [],
  simType: [],
  numberOfCameras: [], // Змінено відповідно до filterKeyMap
  videoResolution: [], // Змінено відповідно до filterKeyMap
  bodyMaterial: [],
  batteryCapacity: [],
  fastCharging: [],
  frontCamera: [],
  screenSize: [],
  screenResolution: [],
  mainCamera: [],
  simCount: [],
  ram: [],
  storage: [], // Змінено відповідно до filterKeyMap
  minPrice: null,
  maxPrice: null,
  search: "",
};

// Клас для створення карток продуктів
class AddCard {
  addCard(product) {
    const { imagePath, model, description, reviews, price, discount } = product;
    return `
      <div class="card" data-id="${product.id}">
        <div class="card__images">
          <img src="${imagePath}" alt="${model}" />
        </div>
        <div class="card__hr"></div>
        <p class="card__title">${model}</p>
        <p class="card__descr">${description}</p>
        <div class="card__rating">
          <div class="rating__span">
            ${"&#9733;".repeat(5)}
          </div>
          <div class="card__comment">(${reviews} відгуків)</div>
        </div>
        <div class="card__m">
          <div class="card__m-left">
            <div class="card__m-text">Ціна</div>
            <div class="card__m-money">${price}$</div>
          </div>
          <div class="card__m-left">
            <div class="card__m-text">Зі знижкою</div>
            <div class="card__m-money">
              <mark>${price - discount}$</mark><span>${discount}$</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

const cardCreator = new AddCard();

// Функція для побудови рядка запиту на основі фільтрів
function buildQueryString() {
  const params = new URLSearchParams();

  // Додаємо фільтри з selectedFilters
  Object.keys(selectedFilters).forEach((key) => {
    if (selectedFilters[key]) {
      if (
        Array.isArray(selectedFilters[key]) &&
        selectedFilters[key].length > 0
      ) {
        params.append(key, selectedFilters[key].join(","));
      } else if (["minPrice", "maxPrice", "search"].includes(key)) {
        if (selectedFilters[key]) {
          params.append(key, selectedFilters[key]);
        }
      }
    }
  });

  // Додаємо пагінацію
  params.append("page", currentPage);
  params.append("limit", productsPerPage);

  return params.toString();
}

// Функція для отримання продуктів з API
// Функція для отримання продуктів з API
async function fetchProducts() {
  if (isLoading) return; // Уникаємо повторних запитів
  isLoading = true;

  if (loadingIndicator) {
    loadingIndicator.classList.remove("dn"); // Показати індикатор
  }

  const queryString = buildQueryString();
  console.log(`Запит до API: ${BASE_URL}?${queryString}`); // Для відладки

  try {
    const response = await fetch(`${BASE_URL}?${queryString}`);

    // Логування статусу відповіді
    console.log("Статус відповіді:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Пробуй розпарсити відповідь

    // Перевіряємо, чи правильно повернуті дані
    if (!data || typeof data !== "object") {
      throw new Error("Невірна структура даних");
    }

    console.log("Отримані дані з API:", data); // Лог для відладки отриманих даних

    if (data.products && Array.isArray(data.products)) {
      totalProducts = data.total;

      if (currentPage === 1) {
        cardsContainer.innerHTML = ""; // Очищаємо контейнер лише при першому завантаженні або новому запиті
      }

      if (data.products.length === 0 && currentPage === 1) {
        cardsContainer.innerHTML = "<p>Немає доступних продуктів.</p>";
      } else {
        data.products.forEach((product) => {
          cardsContainer.insertAdjacentHTML(
            "beforeend",
            cardCreator.addCard(product)
          );
        });
      }

      // Оновлюємо стан кнопок
      if (
        currentPage * productsPerPage >= totalProducts ||
        data.products.length === 0
      ) {
        showButton.classList.add("dn");
        btnCloseButton.classList.remove("dn");
      } else {
        showButton.classList.remove("dn");
        btnCloseButton.classList.add("dn");
      }

      // Оновлюємо поточну сторінку для наступного завантаження
      currentPage++;
    } else {
      throw new Error(
        "Очікувався масив продуктів, отримано: " + JSON.stringify(data)
      );
    }
  } catch (error) {
    console.error("Помилка запиту до API:", error.message || error);
    if (currentPage === 1) {
      cardsContainer.innerHTML = "<p>Помилка завантаження даних</p>";
      showButton.classList.add("dn");
      btnCloseButton.classList.remove("dn");
    }
  } finally {
    isLoading = false;

    if (loadingIndicator) {
      loadingIndicator.classList.add("dn"); // Приховати індикатор
    }
  }
}
// Функція для застосування фільтрів
function applyFilters() {
  currentPage = 1; // Скидаємо сторінку при новому фільтрі
  fetchProducts();
}

// Дебаунс функція
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Ініціалізація фільтрів на сторінці та завантаження продуктів при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
  const filterContainer = document.querySelector(".filter-container");

  // Початковий масив з фільтрами (ваш масив)
  const filterData = [
    {
      title: "Бренди",
      options: [
        { name: "Apple", count: 274 },
        { name: "Samsung", count: 301 },
        { name: "Xiaomi", count: 116 },
        { name: "Motorola", count: 64 },
        { name: "Meizu", count: 77 },
      ],
    },
    {
      title: "Операційна система",
      options: [
        { name: "IOS", count: 335 },
        { name: "Android", count: 1095 },
        { name: "EMUI", count: 7 },
      ],
    },
    {
      title: "Колір",
      options: [
        { name: "Bronze", value: "#cd7f32", count: 1 },
        { name: "Rose gold", value: "#f4c2c2", count: 3 },
        { name: "blue", value: "blue", count: 96 },
        { name: "gold", value: "gold", count: 73 },
        { name: "red", value: "red", count: 23 },
      ],
    },
    {
      title: "Тип SIM-карти",
      options: [
        { name: "Micro-SIM", count: 3 },
        { name: "Nano-SIM", count: 1434 },
        { name: "e-SIM", count: 304 },
      ],
    },
    {
      title: "Кількість модулів камери",
      options: [
        { name: "2", count: 554 },
        { name: "3", count: 688 },
        { name: "4", count: 144 },
      ],
    },
    {
      title: "Запис відео",
      options: [
        { name: "Full HD", count: 594 },
        { name: "4K UHD", count: 617 },
        { name: "8K UHD", count: 122 },
      ],
    },
    {
      title: "Матеріал корпусу",
      options: [
        { name: "Metal", count: 450 },
        { name: "Glass", count: 651 },
      ],
    },
    {
      title: "Ємність акумулятора",
      options: [
        { name: "3000-3999 mAh", count: 141 },
        { name: "4000-4999 mAh", count: 181 },
        { name: "5000-5999 mAh", count: 842 },
      ],
    },
    {
      title: "Швидка зарядка",
      options: [
        { name: "No", count: 879 },
        { name: "33 W", count: 106 },
        { name: "45 W", count: 31 },
      ],
    },
    {
      title: "Фронтальна камера",
      options: [
        { name: "5 Mp", count: 181 },
        { name: "8 Mp", count: 238 },
        { name: "15 Mp", count: 111 },
      ],
    },
    {
      title: "Діагональ екрану",
      options: [
        { name: '4" - 4.99"', count: 9 },
        { name: '5" - 5.99"', count: 27 },
        { name: '6" - 6.99"', count: 1385 },
      ],
    },
    {
      title: "Роздільна здатність екрану",
      options: [
        { name: "HD+", count: 346 },
        { name: "Full HD+", count: 659 },
      ],
    },
    {
      title: "Основна камера",
      options: [
        { name: "200 Mp", count: 39 },
        { name: "108 Mp", count: 146 },
        { name: "48 Mp", count: 167 },
      ],
    },
    {
      title: "Кількість SIM-карт",
      options: [
        { name: "1 SIM", count: 151 },
        { name: "2 SIM", count: 1286 },
      ],
    },
    {
      title: "Оперативна пам'ять",
      options: [
        { name: "4 GB", count: 339 },
        { name: "6 GB", count: 317 },
        { name: "8 GB", count: 423 },
      ],
    },
    {
      title: "Внутрішня пам'ять",
      options: [
        { name: "32 GB", count: 76 },
        { name: "64 GB", count: 193 },
        { name: "128 GB", count: 486 },
      ],
    },
  ];

  // Побудова фільтрів на сторінці
  filterData.forEach((filter) => {
    const filterWrapper = document.createElement("div");
    filterWrapper.classList.add("filter-wrapper");

    const filterHeader = document.createElement("div");
    filterHeader.classList.add("filter-header");

    const filterTitle = document.createElement("h3");
    filterTitle.innerText = filter.title;
    filterHeader.appendChild(filterTitle);

    const toggleIcon = document.createElement("span");
    toggleIcon.classList.add("toggle-icon");
    toggleIcon.innerHTML = "&#9650;"; // Значок вгору за замовчуванням (фільтр відкритий)
    filterHeader.appendChild(toggleIcon);

    const filterBody = document.createElement("div");
    filterBody.classList.add("filter-body");

    // Отримуємо ключ для цього фільтра
    const filterKey = filterKeyMap[filter.title];

    // Додаємо чекбокси для кожної опції
    filter.options.forEach((option) => {
      const filterOption = document.createElement("label");
      filterOption.classList.add("filter-option");

      if (filter.title === "Колір" && option.value) {
        filterOption.innerHTML = `
          <input type="checkbox" value="${option.name}" data-filter="${filterKey}">
          <span class="color-circle" style="background-color: ${option.value};"></span>
          ${option.name} (${option.count})
        `;
      } else {
        filterOption.innerHTML = `
          <input type="checkbox" value="${option.name}" data-filter="${filterKey}">
          ${option.name} (${option.count})
        `;
      }

      filterBody.appendChild(filterOption);
    });

    filterWrapper.appendChild(filterHeader);
    filterWrapper.appendChild(filterBody);
    filterContainer.appendChild(filterWrapper);

    // Додавання обробника кліку для розгортання/згортання фільтра
    filterHeader.addEventListener("click", () => {
      filterBody.classList.toggle("hidden"); // Перемикання класу 'hidden'
      toggleIcon.innerHTML = filterBody.classList.contains("hidden")
        ? "&#9660;"
        : "&#9650;"; // Стрілка вниз або вгору
    });
  });

  // Додаємо обробники подій для чекбоксів
  document
    .querySelectorAll('.filter-option input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        if (isResettingFilters) return; // Пропускаємо, якщо відбувається скидання фільтрів

        const filterType = e.target.getAttribute("data-filter");
        const filterValue = e.target.value;

        if (!selectedFilters[filterType]) {
          selectedFilters[filterType] = [];
        }

        if (e.target.checked) {
          if (!selectedFilters[filterType].includes(filterValue)) {
            selectedFilters[filterType].push(filterValue);
          }
        } else {
          selectedFilters[filterType] = selectedFilters[filterType].filter(
            (value) => value !== filterValue
          );
        }

        console.log("Оновлені фільтри:", selectedFilters); // Додаткове логування для налагодження
        applyFilters();
      });
    });

  // Ініціалізація продуктів при завантаженні сторінки
  fetchProducts();
});

// Подія для кнопки "Показати ще"
showButton.addEventListener("click", fetchProducts);

// Подія для кнопки "Закрити"
btnCloseButton.addEventListener("click", () => {
  currentPage = 1; // Скидаємо поточну сторінку
  selectedFilters.search = ""; // Скидаємо пошуковий термін
  searchInput.value = ""; // Очищаємо поле пошуку

  isResettingFilters = true; // Встановлюємо флаг перед скиданням фільтрів

  // Скидаємо фільтри (відключаємо всі чекбокси)
  document
    .querySelectorAll('.filter-option input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.checked = false; // Вимикаємо всі чекбокси
    });

  // Скидаємо значення фільтрів
  Object.keys(selectedFilters).forEach((key) => {
    if (Array.isArray(selectedFilters[key])) {
      selectedFilters[key] = [];
    } else {
      selectedFilters[key] = null;
    }
  });

  isResettingFilters = false; // Скидаємо флаг після скидання фільтрів

  // Очищаємо контейнер карток і завантажуємо перші 21 продукт
  cardsContainer.innerHTML = "";
  fetchProducts(); // Викликаємо для завантаження початкових продуктів

  // Ховаємо кнопку "Закрити" та показуємо "Показати ще"
  showButton.classList.remove("dn");
  btnCloseButton.classList.add("dn");
});

// Фільтрація за введеним значенням (пошук) з дебаунсом
searchInput.addEventListener(
  "input",
  debounce(function (e) {
    selectedFilters.search = e.target.value.trim().toLowerCase();
    console.log("Пошуковий термін:", selectedFilters.search); // Додаткове логування для налагодження
    applyFilters();
  }, 300)
);

// ------------------------------------Слайдер-нижній------------------------------------------------------------

const slider = document.querySelector(".product-slider");
const prevButton = document.querySelector(".prev-button");
const nextButton = document.querySelector(".next-button");

const defaultProducts = [
  {
    model: "iPhone 7 Pro",
    price: 1100,
    description:
      "iPhone 7 Pro - это улучшенная версия iPhone 7 с более мощными характеристиками.",
    discount: 110,
    imagePath: "img/iphone7pro.jpg",
    reviews: 140,
  },
  {
    model: "iPhone 8",
    price: 1200,
    description:
      "iPhone 8 - это обновленная модель с улучшенной камерой и производительностью.",
    discount: 120,
    imagePath: "img/iphone8.jpg",
    reviews: 200,
  },
  {
    model: "iPhone 8 Pro",
    price: 1300,
    description:
      "iPhone 8 Pro - это профессиональная версия iPhone 8 с дополнительными функциями и улучшенными характеристиками.",
    discount: 130,
    imagePath: "img/iphone8pro.jpg",
    reviews: 220,
  },
  {
    model: "iPhone X",
    price: 1400,
    description:
      "iPhone X - это революционный смартфон от Apple с безрамочным дизайном и Face ID.",
    discount: 140,
    imagePath: "img/iphonex.jpg",
    reviews: 250,
  },
  {
    model: "iPhone X Pro",
    price: 1500,
    description:
      "iPhone X Pro - это улучшенная версия iPhone X с дополнительными функциями и производительностью.",
    discount: 150,
    imagePath: "img/iphonexpro.jpg",
    reviews: 260,
  },
  {
    model: "iPhone XR",
    price: 1300,
    description:
      "iPhone XR - это доступная версия iPhone X с LCD дисплеем и отличной производительностью.",
    discount: 130,
    imagePath: "img/iphonexr.jpg",
    reviews: 300,
  },
  {
    model: "iPhone 11",
    price: 1600,
    description:
      "iPhone 11 - это обновленная модель с двойной камерой и новым процессором A13 Bionic.",
    discount: 160,
    imagePath: "img/iphone11.jpg",
    reviews: 400,
  },
  {
    model: "iPhone 11 Pro",
    price: 1800,
    description:
      "iPhone 11 Pro - это профессиональная модель с тройной камерой и улучшенной производительностью.",
    discount: 180,
    imagePath: "img/iphone11pro.jpg",
    reviews: 450,
  },
  {
    model: "iPhone 11 Pro Max",
    price: 2000,
    description:
      "iPhone 11 Pro Max - это самая мощная версия iPhone 11 с большим дисплеем и улучшенной батареей.",
    discount: 200,
    imagePath: "img/iphone11promax.jpg",
    reviews: 500,
  },
  {
    model: "iPhone 12",
    price: 1700,
    description:
      "iPhone 12 - это новый iPhone с поддержкой 5G и новым дизайном.",
    discount: 170,
    imagePath: "img/iphone12.jpg",
    reviews: 550,
  },
  {
    model: "iPhone 12 Mini",
    price: 1500,
    description:
      "iPhone 12 Mini - это компактная версия iPhone 12 с теми же функциями в меньшем корпусе.",
    discount: 150,
    imagePath: "img/iphone12mini.jpg",
    reviews: 600,
  },
  {
    model: "iPhone 12 Pro",
    price: 1900,
    description:
      "iPhone 12 Pro - это профессиональная версия iPhone 12 с улучшенной камерой и LiDAR сканером.",
    discount: 190,
    imagePath: "img/iphone12pro.jpg",
    reviews: 650,
  },
  {
    model: "iPhone 12 Pro Max",
    price: 2100,
    description:
      "iPhone 12 Pro Max - это самая мощная версия iPhone 12 с большим дисплеем и улучшенной камерой.",
    discount: 210,
    imagePath: "img/iphone12promax.jpg",
    reviews: 700,
  },
  {
    model: "iPhone 13",
    price: 1800,
    description:
      "iPhone 13 - это новая модель телефона от Apple с передовыми технологиями и функциями.",
    discount: 180,
    imagePath: "img/iphone13.jpg",
    reviews: 138,
  },
  {
    model: "iPhone 13 Mini",
    price: 1600,
    description:
      "iPhone 13 Mini - это компактная версия iPhone 13 с теми же функциями в меньшем корпусе.",
    discount: 160,
    imagePath: "img/iphone13mini.jpg",
    reviews: 150,
  },
  {
    model: "iPhone 13 Pro Max",
    price: 2300,
    description:
      "iPhone 13 Pro Max - это самая мощная версия iPhone 13 с большим дисплеем и улучшенной камерой.",
    discount: 230,
    imagePath: "img/iphone13promax.jpg",
    reviews: 250,
  },
  {
    model: "iPhone 14",
    price: 1900,
    description:
      "iPhone 14 - это новая модель с улучшенной производительностью и дополнительными функциями.",
    discount: 190,
    imagePath: "img/iphone14.jpg",
    reviews: 300,
  },
  {
    model: "iPhone 14 Pro",
    price: 2200,
    description:
      "iPhone 14 Pro - это профессиональная версия iPhone 14 с улучшенной камерой и новыми функциями.",
    discount: 220,
    imagePath: "img/iphone14pro.jpg",
    reviews: 350,
  },
  {
    model: "iPhone 14 Pro Max",
    price: 2400,
    description:
      "iPhone 14 Pro Max - это самая мощная версия iPhone 14 с большим дисплеем и улучшенной батареей.",
    discount: 240,
    imagePath: "img/iphone14promax.jpg",
    reviews: 400,
  },
  {
    model: "iPhone 15",
    price: 2000,
    description:
      "iPhone 15 - это новая модель с улучшенными характеристиками и передовыми технологиями.",
    discount: 200,
    imagePath: "img/iphone15.jpg",
    reviews: 500,
  },
  {
    model: "iPhone 15 Pro",
    price: 2300,
    description:
      "iPhone 15 Pro - это профессиональная версия iPhone 15 с улучшенной производительностью и новыми функциями.",
    discount: 230,
    imagePath: "img/iphone15pro.jpg",
    reviews: 550,
  },
  {
    model: "iPhone 15 Pro Max",
    price: 2500,
    description:
      "iPhone 15 Pro Max - это самая мощная версия iPhone 15 с большим дисплеем и улучшенной камерой.",
    discount: 250,
    imagePath: "img/iphone15promax.jpg",
    reviews: 600,
  },
];

let currentProducts = defaultProducts.slice(0, 9); // Початково відображаємо 9 карток
let currentStartIndex = 0; // Індекс, що визначає початок

// Функція для очищення слайдера
const clearSlider = () => {
  slider.innerHTML = ""; // Очищаємо всі картки
};

// Функція для додавання карток у слайдер
const addProductsToSlider = (defaultProducts) => {
  defaultProducts.forEach((product) => {
    const slide = document.createElement("div");
    slide.classList.add("product-slide");

    const img = document.createElement("img");
    img.src = product.imagePath;
    img.alt = product.model;

    const title = document.createElement("h3");
    title.textContent = product.model;

    slide.appendChild(img);
    slide.appendChild(title);
    slider.appendChild(slide);
  });
};

// Показуємо початкові 9 продуктів
addProductsToSlider(currentProducts);

// Функція для оновлення слайдера (видаляємо першу картку і додаємо нову в кінець)
const updateSliderNext = () => {
  currentStartIndex++;
  if (currentStartIndex >= defaultProducts.length) {
    currentStartIndex = 0; // Якщо досягли кінця, повертаємось на початок
  }

  currentProducts.shift(); // Видаляємо перший елемент з масиву
  currentProducts.push(defaultProducts[currentStartIndex]); // Додаємо новий елемент

  clearSlider();
  addProductsToSlider(currentProducts);
};

// Функція для оновлення слайдера (видаляємо останню картку і додаємо нову на початок)
const updateSliderPrev = () => {
  currentStartIndex--;
  if (currentStartIndex < 0) {
    currentStartIndex = defaultProducts.length - 1; // Якщо на початку, переходимо на кінець
  }

  currentProducts.pop(); // Видаляємо останній елемент
  currentProducts.unshift(defaultProducts[currentStartIndex]); // Додаємо новий на початок

  clearSlider();
  addProductsToSlider(currentProducts);
};

// Додаємо обробники подій для кнопок
nextButton.addEventListener("click", updateSliderNext);
prevButton.addEventListener("click", updateSliderPrev);

// ------------------------------------Слайдер-нижній------------------------------------------------------------

// Елементи DOM для першого слайдера
const firstSliderWrapper = document.querySelector(".first-slider");
const firstPrevButton = document.querySelector(".first-prev-button");
const firstNextButton = document.querySelector(".first-next-button");
const firstSliderImages = document.querySelectorAll(".first-slider img");

let firstCurrentIndex = 0;
const totalFirstSlides = firstSliderImages.length;
let autoSlideInterval;

// Функція для оновлення слайдера
const updateFirstSlider = () => {
  firstSliderWrapper.style.transform = `translateX(-${
    firstCurrentIndex * 100
  }%)`; // Переміщення слайдів на 100% ширини контейнера
};

// Обробник події для кнопки "вперед" для першого слайдера
firstNextButton.addEventListener("click", () => {
  firstCurrentIndex = (firstCurrentIndex + 1) % totalFirstSlides;
  updateFirstSlider();
  resetAutoSlide(); // Скидаємо автопрогортання після ручного втручання
});

// Обробник події для кнопки "назад" для першого слайдера
firstPrevButton.addEventListener("click", () => {
  firstCurrentIndex =
    (firstCurrentIndex - 1 + totalFirstSlides) % totalFirstSlides;
  updateFirstSlider();
  resetAutoSlide(); // Скидаємо автопрогортання після ручного втручання
});

// Функція для автоматичного прогортання слайдів
const autoSlide = () => {
  autoSlideInterval = setInterval(() => {
    firstCurrentIndex = (firstCurrentIndex + 1) % totalFirstSlides;
    updateFirstSlider();
  }, 3000); // Зміна слайда кожні 3 секунди
};

// Функція для скидання таймера автопрогортання
const resetAutoSlide = () => {
  clearInterval(autoSlideInterval);
  autoSlide(); // Запуск автопрогортання знову після ручного втручання
};

// Ініціалізація слайдера та запуск автопрогортання
updateFirstSlider();
autoSlide();


// ------------------------------------Слайдер-нижній------------------------------------------------------------

// ---------------------------------------верхній-хедер-------------------------------------------------------------

// ---------------------------------------верхній-хедер-------------------------------------------------------------
