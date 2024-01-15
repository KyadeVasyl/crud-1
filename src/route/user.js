// Підключаємо технологію express для back-end сервера
const express = require('express');
const { ids } = require('webpack');
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []
  constructor(email, login, password) {
    this.email = email;
    this.login = login;
    this.password = password;
    this.id = new Date().getTime();
  }

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex((user) => user.id === id)
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }


  static updateById = (id, data) => {
    const user = this.getById(id);
    if (user) {
      this.update(user, data)
      return true
    } else return false
  }
  static update = (user, { email }) => {
    if (email) {
      user.email = email;
    }
  }

  verifyPassword = (password) => this.password === password;
}




// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-index', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList();
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',
    info: 'Користувач створений',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      }
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body;
  const user = new User(email, login, password);
  User.add(user)
  console.log(User.getList())
  res.render('user-create', {
    style: 'user-create',
  })

})







// ==================================================

router.get('/user-delete', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query;
  User.deleteById(Number(id));

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-success-info',
    info: 'Користувач видалений',
  })
  // ↑↑ сюди вводимо JSON дані
})


// =====================


router.post('/user-update', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { email, password, id } = req.body
  let result = false
  const user = User.getById(Number(id))
  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }
  // const result = User.updateById(Number(id), { email })

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-success-info',
    info: result ? 'Пошту змінено' : "Не вдалося змінити пошту"
  })
  // ↑↑ сюди вводимо JSON дані
})
// Підключаємо роутер до бек-енду
module.exports = router
