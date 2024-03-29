// Підключаємо технологію express для back-end сервера
const express = require('express');
const { ids } = require('webpack');
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================
class Product {
  static #list = [];
  static #count = 0;
  constructor(img, title, description, category, price, amount = 0) {
    this.id = ++Product.#count;
    this.img = img;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.amount = amount;
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct);
  }


  static getList = () => {
    return this.#list;
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id);
  }

  static getRandomList = (id) => {
    const filteredList = this.#list.filter((product) => product.id !== id);

    const shuffledList = filteredList.sort(
      () => {
        Math.random() - 0.5;
      })

    return shuffledList.slice(0, 3);
  }
}
// =============================================================

class Purchase {
  static DELIVERY_PRICE = 150;
  static #BONUS_FACTOR = 0.1;
  static #count = 0;
  static #list = [];
  static #bonusAccount = new Map();


  constructor(data, product) {
    this.id = ++Purchase.#count;

    this.firstname = data.firstname;
    this.lastname = data.lastname;

    this.phone = data.phone;
    this.email = data.email;

    this.comment = data.comment || null;
    this.bonus = data.bonus || 0;

    this.promocode = data.promocode || null;

    this.totalPrice = data.totalPrice;
    this.productPrice = data.productPrice;
    this.deliveryPrice = data.deliveryPrice;
    this.amount = data.amount;
    this.product = product;
  }

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0;
  }

  static calcBonus = (value) => { return value * Purchase.#BONUS_FACTOR };
  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {

    const amount = this.calcBonus(price);
    const currentBalance = Purchase.getBonusBalance(email);

    const updateBalance =
      currentBalance + amount - bonusUse
    Purchase.#bonusAccount.set(email, updateBalance)

    console.log(email, updateBalance)
    return amount;
  }

  static add = (...data) => {
    const newPurchase = new Purchase(...data);
    this.#list.push(newPurchase);
    return newPurchase;
  }

  static getList = () => {
    return Purchase.#list.reverse()
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id);
  }


  static updateById = (id, data) => {
    const purchase = Purchase.getById(id);

    if (purchase) {
      if (data.firstname) {
        purchase.firstname = data.firstname
      }
      if (data.lastname) purchase.lastname = data.lastname;
      if (data.phone) purchase.phone = data.phone;
      if (data.email) purchase.email = data.email;
      return true;
    } else {
      return false;
    }
  }
}
// ===============================================================

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name;
    this.factor = factor;
  }

  static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}
Promocode.add('SUMMER2024', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)
// ===============================================================

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`,
  [
    { id: 2, text: 'Топ продажів' },
  ],
  20000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [
    { id: 1, text: 'Готовий до відправки' },

  ],
  35000,
  10,
)
// ================================================================

router.get('/', function (req, res) {
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    }

  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id);
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    }

  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id);
  const amount = Number(req.body.amount);
  console.log(id, amount)
  const product = Product.getById(id)

  if (amount < 1) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Некоректна к-сть товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  if (product.amount < 1) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Такої к-сть товару нема в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product, amount)


  const productPrice = product.price * amount;
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE;
  const bonus = Purchase.calcBonus(totalPrice);


  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        }
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,

    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================


router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id);
  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id);

  if (!product) {
    return res.render('purchase-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-alert',

      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },

    })
  }

  if (product.amount < amount) {
    return res.render('purchase-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-alert',

      data: {
        message: 'Помилка',
        info: 'Товару нема в потрібній к-сті',
        link: `/purchase-list`,
      },

    })
  }

  totalPrice = Number(totalPrice);
  productPrice = Number(productPrice);
  deliveryPrice = Number(deliveryPrice);
  amount = Number(amount);
  bonus = Number(bonus);

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('purchase-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-alert',

      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: `/purchase-list`,
      },

    })

  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('purchase-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-alert',

      data: {
        message: 'Заповніть обовязкові поля',
        info: 'Некоректні дані',
        link: `/purchase-list`,
      },

    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email);
    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount;
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)
    totalPrice -= bonus;
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) [
      totalPrice = Promocode.calc(promocode, totalPrice)
    ]
  }

  if (totalPrice < 0) { totalPrice = 0 }
  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    product,
  )

  console.log(purchase);

  res.render('purchase-alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-alert',

    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },

  })

})


// =================================================

router.get('/purchase-list', function (req, res) {
  const list = Purchase.getList();
  let { email } = req.body;
  const bonus = Purchase.getBonusBalance(email);
  res.render('purchase-list', {

    style: 'purchase-list',

    data: {
      purchases: {
        list,
      },
      bonus,
    }
  })
})

// =================================================


router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id);
  const purchase = Purchase.getById(id);
  const bonus = Purchase.calcBonus(purchase.totalPrice);
  res.render('purchase-info', {

    style: 'purchase-info',

    data: {
      id: purchase.id,

      totalPrice: purchase.totalPrice,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,


      firstname: purchase.firstname,
      lastname: purchase.lastname,
      email: purchase.email,
      phone: purchase.phone,

      comment: purchase.comment,
      product: purchase.product.title,

      bonus: bonus,
    }
  })
})

// =================================================

router.post('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)
  let { firstname, lastname, phone, email } =
    req.body

  const purchase = Purchase.getById(id)

  console.log(purchase)

  if (purchase) {
    const newPurchase = Purchase.updateById(id, {
      firstname,
      lastname,
      phone,
      email,

    })

    console.log(newPurchase)

    // Якщо оновлення вдалося, відображаємо повідомлення про успіх
    if (newPurchase) {
      res.render('purchase-alert', {
        style: 'purchase-alert',
        component: ['button', 'heading'],

        data: {
          link: '/purchase-list',
          alert: 'Успішне виконання дії',
          info: 'Товар успішно оновлено',
        },
      })
    } else {
      // Якщо оновлення не вдалося (наприклад, товару з таким id не існує),
      // відображаємо повідомлення про помилку
      res.render('purchase-alert', {
        style: 'purchase-alert',
        component: ['button', 'heading'],

        data: {
          link: '/purchase-list',
          alert: 'Помилка',
          info: 'Не вдалося оновити товар',
        },
      })
    }
  }
})

router.get('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)

  const purchase = Purchase.getById(id)

  if (!purchase) {
    // Якщо товар з таким id не знайдено, відображаємо повідомлення про помилку
    res.render('purchase-alert', {
      style: 'purchase-alert',
      component: ['button', 'heading'],

      isError: true,
      alert: 'Помилка',
      info: 'Замовлення з таким ID не знайдено',
    })
  } else {
    // Якщо товар знайдено, передаємо його дані у шаблон product-edit
    res.render('purchase-edit', {
      style: 'purchase-edit',
      component: ['heading', 'divider', 'field', 'button'],

      title: 'Зміна данних замовлення',

      data: {
        id: purchase.id,
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        phone: purchase.phone,
        email: purchase.email,
        delivery: purchase.delivery,
      },
    })
  }
})

module.exports = router;