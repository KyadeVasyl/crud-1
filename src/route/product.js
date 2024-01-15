// Підключаємо технологію express для back-end сервера
const express = require('express');
const { ids } = require('webpack');
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()


class Product {
  static #list = []
  constructor(name, price, description) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.createDate = new Date().toISOString();
    this.id = Math.floor(10000 + Math.random() * 9000)
  }

  static add = (product) => {
    this.#list.push(product);
  }

  static getList = () => {
    return this.#list;
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id);
  }
  static updateById = (id, data) => {
    const product = this.getById(id)
    const { name, price, description } = data;

    if (product) {
      if (name) {
        product.name = name
      } else if (price) {
        product.price = price
      } else if (description) {
        product.description = description
      }

      return true
    } else {
      return false
    }
  }
  static update = (product, { name, price, description }) => {
    if (price) {
      product.price = price;
    }
    else if (name) {
      product.name = name;
    }
    else if (description) {
      product.description = description;
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex((product) => product.id === id)
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else return false;
  }


}

// =======================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body;
  const product = new Product(name, price, description);
  Product.add(product);
  console.log(Product.getList())
  res.render('alert', {
    style: 'alert',
    info: 'Успішне виконання дії',
    alert: 'Товар успішно створено',
  });
})

// =======================================================

router.get('/product-create', function (req, res) {


  res.render('product-create', {

    style: 'product-create',

  })
})

// ======================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList();
  console.log(list)

  res.render('product-list', {

    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      }
    },
  })

})

// =================================



router.get('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query;
  const product = Product.getById(Number(id));
  console.log(product);
  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('product-edit', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-edit',
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        id: product.id,

      },
    })
  } else {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Продукту за таким ID не знайдено',
      alert: 'Помилка',
    })
  }
})


// =======================================================


router.post('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { name, price, description, id } = req.body;
  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  });
  console.log(id)
  console.log(product)
  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Інформація про товар оновлена',
    })
  } else {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Сталася помилка',
    })
  }
  // ↑↑ сюди вводимо JSON дані
})
// ======================================================


router.get('/product-delete', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query
  const product = Product.deleteById(Number(id))
  console.log(product)
  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Продукт видалено',
      alert: 'Успішна операція',
    })
  } else {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Продукт не вдалося видалити',
      alert: 'Помилка',
    })
  }
})
module.exports = router
