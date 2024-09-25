// Функція для встановлення активної вкладки
function setActive(element) {
  // Видаляємо клас 'active' з усіх вкладок
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Додаємо клас 'active' до вибраної вкладки
  element.classList.add("active");
}

// Змінні для синхронізації діапазонів ціни та введення ціни
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const minRange = document.getElementById("min-range");
const maxRange = document.getElementById("max-range");

// Перевіряємо, чи існують елементи перед додаванням обробників подій
if (minRange && maxRange && minPriceInput && maxPriceInput) {
  minRange.addEventListener("input", function () {
    // Синхронізація значення мінімальної ціни з повзунком
    minPriceInput.value = this.value;
  });

  maxRange.addEventListener("input", function () {
    // Синхронізація значення максимальної ціни з повзунком
    maxPriceInput.value = this.value;
  });

  minPriceInput.addEventListener("input", function () {
    // Синхронізація повзунка з введенням мінімальної ціни
    minRange.value = this.value;
  });

  maxPriceInput.addEventListener("input", function () {
    // Синхронізація повзунка з введенням максимальної ціни
    maxRange.value = this.value;
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const filterContainer = document.querySelector(".filter-container");

  // Початковий масив з фільтрами (приклад масиву)
  const filters = [
    {
      title: "Бренди",
      options: [
        { name: "Apple", count: 274 },
        { name: "Samsung", count: 301 },
        { name: "Xiaom", count: 116 },
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
    // Додайте інші фільтри тут...
    {
      title: "Колір",
      options: [
        { name: "Бронзовий", value: "#cd7f32", count: 1 },
        { name: "Рожеве золото", value: "#f4c2c2", count: 3 },
        { name: "Синій", value: "blue", count: 96 },
        { name: "Золотий", value: "gold", count: 73 },
        { name: "Червоний", value: "red", count: 23 },
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
      title: "Частота оновлення екрану",
      options: [
        { name: "60 Гц", count: 74 },
        { name: "90 Гц", count: 310 },
        { name: "120 Гц", count: 562 },
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
        { name: "Метал", count: 450 },
        { name: "Скло", count: 651 },
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
        { name: "Так", count: 879 },
        { name: "33 Вт", count: 106 },
        { name: "45 Вт", count: 31 },
      ],
    },
    {
      title: "Фронтальна камера",
      options: [
        { name: "5 Мп", count: 181 },
        { name: "8 Мп", count: 238 },
        { name: "13 Мп", count: 111 },
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
        { name: "200 Мп", count: 39 },
        { name: "108 Мп", count: 146 },
        { name: "48 Мп", count: 167 },
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
        { name: "4 ГБ", count: 339 },
        { name: "6 ГБ", count: 317 },
        { name: "8 ГБ", count: 423 },
      ],
    },
    {
      title: "Внутрішня пам'ять",
      options: [
        { name: "32 ГБ", count: 76 },
        { name: "64 ГБ", count: 193 },
        { name: "128 ГБ", count: 486 },
      ],
    },
  ];
  filters.forEach((filter, index) => {
    // Створюємо блок для фільтра
    const filterWrapper = document.createElement("div");
    filterWrapper.classList.add("filter-wrapper");

    // Створюємо заголовок фільтра
    const filterHeader = document.createElement("div");
    filterHeader.classList.add("filter-header");
    const filterTitle = document.createElement("h3");
    filterTitle.innerText = filter.title;
    filterHeader.appendChild(filterTitle);

    const filterBody = document.createElement("div");
    filterBody.classList.add("filter-body");

    // Додаємо чекбокси для кожної опції
    filter.options.forEach((option) => {
      const filterOption = document.createElement("label");
      filterOption.classList.add("filter-option");

      if (filter.title === "Колір" && option.value) {
        filterOption.innerHTML = `
          <input type="checkbox" value="${
            option.name
          }" data-filter="${filter.title.toLowerCase()}">
          <span class="color-circle" style="background-color: ${
            option.value
          };"></span>
          ${option.name} (${option.count})
        `;
      } else {
        filterOption.innerHTML = `
          <input type="checkbox" value="${
            option.name
          }" data-filter="${filter.title.toLowerCase()}">
          ${option.name} (${option.count})
        `;
      }

      filterBody.appendChild(filterOption);
    });

    filterWrapper.appendChild(filterHeader);
    filterWrapper.appendChild(filterBody);
    filterContainer.appendChild(filterWrapper);
  });

  // Додаємо обробники подій для чекбоксів
  document
    .querySelectorAll('.filter-option input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", applyFilters); // Коли чекбокси змінюються, запускаємо фільтрацію
    });
});

// Функція для фільтрації продуктів на основі обраних фільтрів
function applyFilters() {
  const selectedFilters = {
    brand: Array.from(
      document.querySelectorAll('input[data-filter="бренди"]:checked')
    ).map((cb) => cb.value),
    os: Array.from(
      document.querySelectorAll(
        'input[data-filter="операційна система"]:checked'
      )
    ).map((cb) => cb.value),
    color: Array.from(
      document.querySelectorAll('input[data-filter="колір"]:checked')
    ).map((cb) => cb.value),
  };

  const filteredProducts = products.filter((product) => {
    const brandMatch =
      selectedFilters.brand.length === 0 ||
      selectedFilters.brand.includes(product.brand);
    const osMatch =
      selectedFilters.os.length === 0 ||
      selectedFilters.os.includes(product.os);
    const colorMatch =
      selectedFilters.color.length === 0 ||
      selectedFilters.color.includes(product.color);

    return brandMatch && osMatch && colorMatch;
  });

  displayProducts(filteredProducts); // Відображення фільтрованих продуктів
}

// Функція для відображення продуктів
function displayProducts(productsArray) {
  const productContainer = document.querySelector(".product-list");
  productContainer.innerHTML = ""; // Очищуємо контейнер перед виведенням

  if (productsArray.length === 0) {
    productContainer.innerHTML = "<p>Немає результатів</p>";
  } else {
    productsArray.forEach((product) => {
      productContainer.innerHTML += `<p>${product.model} - ${product.price}$</p>`;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const filterContainer = document.querySelector(".filter-container");

  // Проходимося по кожному фільтру з масиву
  filters.forEach((filter, index) => {
    // Створення обгортки для фільтра
    const filterWrapper = document.createElement("div");
    filterWrapper.classList.add("filter-wrapper");

    // Створення заголовку фільтра
    const filterHeader = document.createElement("div");
    filterHeader.classList.add("filter-header");

    // Створення тексту заголовку
    const filterTitle = document.createElement("h3");
    filterTitle.innerText = filter.title;

    // Створення іконки для заголовку
    const toggleIcon = document.createElement("span");
    toggleIcon.classList.add("toggle-icon");
    toggleIcon.innerHTML = "&#9650;"; // Значок вгору за замовчуванням (фільтр відкритий)

    // Додавання заголовку та іконки до заголовка фільтра
    filterHeader.appendChild(filterTitle);
    filterHeader.appendChild(toggleIcon);

    // Створення тіла фільтра
    const filterBody = document.createElement("div");
    filterBody.classList.add("filter-body"); // Фільтр відкритий за замовчуванням

    // Додавання опцій до тіла фільтра
    filter.options.forEach((option) => {
      const filterOption = document.createElement("label");
      filterOption.classList.add("filter-option");

      // Додавання колірної кулі, якщо фільтр за кольором
      if (filter.title === "Колір" && option.value) {
        filterOption.innerHTML = `
          <input type="checkbox" name="color${index}" value="${option.name}"> 
          <span class="color-circle" style="background-color: ${option.value};"></span>
          ${option.name} (${option.count})
        `;
      } else {
        filterOption.innerHTML = `
          <input type="checkbox" name="${filter.title
            .toLowerCase()
            .replace(/\s+/g, "-")}${index}" value="${option.name}"> 
          ${option.name} (${option.count})
        `;
      }

      // Додавання опції до тіла фільтра
      filterBody.appendChild(filterOption);
    });

    // Збірка повного фільтра та додавання його до контейнера фільтрів
    filterWrapper.appendChild(filterHeader);
    filterWrapper.appendChild(filterBody);
    filterContainer.appendChild(filterWrapper);

    // Додавання обробника кліку для розгортання/згортання фільтра
    filterHeader.addEventListener("click", () => {
      filterBody.classList.toggle("hidden"); // Перемикання класу 'hidden'

      // Зміна іконки в залежності від стану фільтра
      toggleIcon.innerHTML = filterBody.classList.contains("hidden")
        ? "&#9660;"
        : "&#9650;"; // Стрілка вниз або вгору
    });
  });
});
("use strict");

// const showButton = document.querySelector(".show");
// const btnCloseButton = document.querySelector(".btn-close");
// const cardsContainer = document.querySelector(".cards");
// const input = document.getElementById("searchInput");
// let currentIndex = 0; // Додаємо оголошення для currentIndex

// // ----------------------------------------------------------------чіткий шлях--------------------------------------------------------
fetch("http://localhost:3000/api/smartphones") // Замініть на вашу реальну URL-адресу API
  .then((response) => response.json())
  .then((data) => {
    // Перевіряємо, чи існує поле products і чи воно є масивом
    if (Array.isArray(data.products)) {
      const products = data.products; // Отримуємо масив продуктів з об'єкта
      const cardsContainer = document.querySelector(".cards");
      cardsContainer.innerHTML = ""; // Очищаємо контейнер перед додаванням нових карток

      products.forEach((product) => {
        const cardHTML = `
          <div class="card">
            <div class="card__images">
              <img src="${product.imagePath}" alt="${product.model}" />
            </div>
            <div class="card__hr"></div>
            <p class="card__title">${product.model}</p>
            <p class="card__descr">${product.description}</p>
            <div class="card__rating">
              <div class="rating__span">
                <span>&#9733;</span>
                <span>&#9733;</span>
                <span>&#9733;</span>
                <span>&#9733;</span>
                <span>&#9733;</span>
              </div>
              <div class="card__comment">(${product.reviews} відгуків)</div>
            </div>
            <div class="card__m">
              <div class="card__m-left">
                <div class="card__m-text">Ціна</div>
                <div class="card__m-money">${product.price}$</div>
              </div>
              <div class="card__m-left">
                <div class="card__m-text">Зі знижкою</div>
                <div class="card__m-money">
                  <mark>${product.price - product.discount}$</mark>
                  <span>${product.discount}$</span>
                </div>
              </div>
            </div>
          </div>
        `;
        cardsContainer.insertAdjacentHTML("beforeend", cardHTML); // Додаємо картки до контейнера
      });
    } else {
      console.error("Очікувався масив продуктів, отримано:", data);
    }
  })
  .catch((error) => {
    console.error("Помилка запиту до API:", error);
    document.getElementById("api-response").innerText = "Помилка запиту до API";
  });

// ---------------------------------------

// ------------------------уже майже працює----------------------

// let currentPage = 1;
// const productsPerPage = 20;
// let searchTerm = '';
// const showButton = document.querySelector(".show");
// const cardsContainer = document.querySelector(".cards");
// const input = document.getElementById("searchInput");

// // Клас для створення карток
// class AddCard {
//   addCard(product) {
//     const { imagePath, model, description, reviews, price, discount } = product;
//     return `
//       <div class="card">
//         <div class="card__images">
//           <img src="${imagePath}" alt="${model}" />
//         </div>
//         <div class="card__hr"></div>
//         <p class="card__title">${model}</p>
//         <p class="card__descr">${description}</p>
//         <div class="card__rating">
//           <div class="rating__span">
//             <span>${"&#9733;".repeat(5)}</span>
//           </div>
//           <div class="card__comment">(${reviews} відгуків)</div>
//         </div>
//         <div class="card__m">
//           <div class="card__m-left">
//             <div class="card__m-text">Ціна</div>
//             <div class="card__m-money">${price}$</div>
//           </div>
//           <div class="card__m-left">
//             <div class="card__m-text">Зі знижкою</div>
//             <div class="card__m-money">
//               <mark>${price - discount}$</mark><span>${discount}$</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//   }
// }

// Клас для створення карток
// Клас для створення карток
// Клас для створення карток
class AddCard {
  addCard(product) {
    const { imagePath, model, description, reviews, price, discount } = product;
    return `
      <div class="card">
        <div class="card__images">
          <img src="${imagePath}" alt="${model}" />
        </div>
        <div class="card__hr"></div>
        <p class="card__title">${model}</p>
        <p class="card__descr">${description}</p>
        <div class="card__rating">
          <div class="rating__span">
            <span>${"&#9733;".repeat(5)}</span>
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

const a1 = new AddCard();
let currentPage = 1; // Початкова сторінка
const productsPerPage = 20; // Кількість продуктів на сторінку
let searchTerm = ""; // Пошуковий термін (якщо є)

// Елементи для кнопок
const showButton = document.querySelector(".show");
const closeButton = document.querySelector(".btn-close"); // Кнопка закриття
const cardsContainer = document.querySelector(".cards");

// Функція для отримання продуктів з API
const fetchProducts = async (page = 1, search = "") => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/smartphones?page=${page}&limit=${productsPerPage}&search=${search}`
    );
    const data = await response.json();
    return data.products; // Отримуємо масив продуктів з відповіді API
  } catch (error) {
    console.error("Помилка запиту до API:", error);
    return []; // Повертаємо порожній масив у разі помилки
  }
};

// Функція для показу наступних 20 продуктів
const showNext20Items = async () => {
  const products = await fetchProducts(currentPage, searchTerm); // Отримуємо наступну сторінку продуктів
  if (products.length > 0) {
    products.forEach((product) => {
      cardsContainer.insertAdjacentHTML("beforeend", a1.addCard(product)); // Додаємо картки до контейнера
    });
    currentPage++; // Збільшуємо номер сторінки
  }

  // Перевіряємо, чи більше немає продуктів для завантаження
  if (products.length < productsPerPage) {
    // Якщо більше немає продуктів, ховаємо кнопку "Показати ще" і показуємо "Скрить"
    showButton.classList.add("dn"); // Ховати кнопку "Показати ще"
    closeButton.classList.remove("dn"); // Показати кнопку "Скрить"
  }
};

// Функція для початкового відображення продуктів
const displayApiProducts = async () => {
  const products = await fetchProducts(1, searchTerm); // Отримуємо продукти для першої сторінки
  cardsContainer.innerHTML = ""; // Очищаємо контейнер
  if (products.length > 0) {
    products.forEach((product) => {
      cardsContainer.insertAdjacentHTML("beforeend", a1.addCard(product)); // Додаємо картки до контейнера
    });
    currentPage = 2; // Збільшуємо сторінку для наступного запиту
    showButton.classList.remove("dn"); // Показати кнопку "Показати ще"
    closeButton.classList.add("dn"); // Сховати кнопку "Скрить"
  } else {
    cardsContainer.innerHTML = "<p>Нічого не знайдено</p>"; // Якщо результатів немає
    showButton.classList.add("dn"); // Сховати кнопку "Показати ще"
  }
};

// Функція для закриття всіх продуктів і показу тільки 20 початкових
const closeAllProducts = () => {
  currentPage = 1;
  displayApiProducts(); // Показати тільки перші 20 продуктів
  closeButton.classList.add("dn"); // Сховати кнопку "Скрить"
  showButton.classList.remove("dn"); // Показати кнопку "Показати ще"
};

// Подія для кнопки "Показати ще"
showButton.addEventListener("click", showNext20Items);

// Подія для кнопки "Скрить"
closeButton.addEventListener("click", closeAllProducts);

// Подія для пошуку продуктів за ключовими словами
input.addEventListener("input", function (e) {
  searchTerm = e.target.value.trim().toLowerCase(); // Оновлюємо пошуковий термін
  currentPage = 1; // Скидаємо поточну сторінку
  displayApiProducts(); // Очищаємо контейнер і показуємо результати пошуку
});

// Початкове завантаження продуктів при завантаженні сторінки
document.addEventListener("DOMContentLoaded", displayApiProducts);
// ---------
