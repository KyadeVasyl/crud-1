// Підключаємо технологію express для back-end сервера
const express = require('express');
const { ids } = require('webpack');
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// =============================================================
class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name;
    this.author = author
    this.image = image

  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }
}


Track.create(
  'UNIVERSE',
  'BTS',
  'https://picsum.photos/100/100',
)


Track.create(
  'Blank Space',
  'Taylor Swift',
  'https://picsum.photos/100/100',
)


Track.create(
  'Ой чи то день чи то ніч',
  'KOLA',
  'https://picsum.photos/100/100',
)


Track.create(
  'Щоб не було',
  'DOROFEEVA',
  'https://picsum.photos/100/100',
)


Track.create(
  'Cruel Summer',
  'Taylor Swift',
  'https://picsum.photos/100/100',
)


Track.create(
  'Without me',
  'Eminem',
  'https://picsum.photos/100/100',
)


Track.create(
  'Thank You',
  'DIDO',
  'https://picsum.photos/100/100',
)


// =============================================================

class Playlist {
  static #list = [];

  constructor(name) {
    this.name = name;
    this.id = Math.floor(1000 + Math.random() * 9000);
    this.tracks = [];
  }

  static create(name) {
    const newPlaylist = new Playlist(name);
    this.#list.push(newPlaylist);
    return newPlaylist;
  }


  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList();

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks);

  }


  static getById(id) {
    return (
      Playlist.#list.find((playlist) => { playlist.id === id }) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter((track) => {
      track.id !== trackId;
    })
  }
}



// =============================================================


router.get('/', function (req, res) {
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',
    data: {

    }

  })
  // ↑↑ сюди вводимо JSON дані
})


// ===============================================


router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix;
  console.log(isMix)
  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',
    data: {
      isMix,
    }

  })
  // ↑↑ сюди вводимо JSON дані
})



// ===============================================


router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix;
  const name = req.body.name;
  if (!name) {
    return res.render('purchase-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-alert',
      data: {
        message: "Помилка",
        info: "Введіть назву плейліста",
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      }

    })
  }

  const playlist = Playlist.create(name);
  if (isMix) {
    Playlist.makeMix(playlist);
  }


  console.log(playlist);



  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    }

  })
  // ↑↑ сюди вводимо JSON дані
})



// =============================================================


router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id);
  const playlist = Playlist.getById(id);


  if (!playlist) {
    return res.render('purchase-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-alert',
      data: {
        message: "Помилка",
        info: "Такого плейлиста не знайдено",
        link: '/',
      }

    })
  }
  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    }

  })
  // ↑↑ сюди вводимо JSON дані
})




// =============================================================


router.get('/spotify-track-delete', function (req, res) {
  const playListId = Number(req.query.playListId);
  const trackId = Number(req.query.trackId);

  const playlist = Playlist.getById(playListId);

  console.log(playlist)

  if (!playlist) {
    return res.render('purchase-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-alert',
      data: {
        message: "Помилка",
        info: "Такого плейлиста не знайдено",
        link: `/spotify-playlist?id=${playListId}`,
      }

    })
  }

  playlist.deleteTrackById(trackId);

  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    }

  })
  // ↑↑ сюди вводимо JSON дані
})

module.exports = router;