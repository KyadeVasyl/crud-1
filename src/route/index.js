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


  static getbyId(id) {
    return (this.#list.find((track) => { track.id === id }));

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
    this.image = 'https://picsum.photos/300/300';
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
    return this.#list.find((playlist) => playlist.id === id)
  }



  getTrackCount() {
    return this.tracks.length;
  }

  deleteTrackById(trackId) {
    const index = this.tracks.findIndex((track) => track.id === trackId)
    if (index !== -1) {
      this.tracks.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static findListByValue(value) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(value.toLowerCase()),
    )
  }
}


router.get('/spotify-choose', function (req, res) {
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
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    }

  })
  // ↑↑ сюди вводимо JSON дані
})



// =============================================================


router.get('/spotify-playlist', function (req, res) {
  const playlistId = Number(req.query.playlistId);
  const playlist = Playlist.getById(playlistId);


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
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    }

  })
  // ↑↑ сюди вводимо JSON дані
})


// =============================================================


router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId);
  const trackId = Number(req.query.trackId);

  const playlist = Playlist.getById(playlistId);


  if (!playlist) {
    return res.render('purchase-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-alert',
      data: {
        message: "Помилка",
        info: "Такого плейлиста не знайдено",
        link: `/spotify-playlist?id=${playlistId}`,
      }

    })
  }

  playlist.deleteTrackById(trackId);

  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    }

  })
  // ↑↑ сюди вводимо JSON дані
})


// =============================================================
router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)
  const allTracks = Track.getList()

  // console.log(playlistId, playlist, allTracks)

  res.render('spotify-track-add', {
    style: 'spotify-track-add',

    data: {
      playlistId: playlist.id,
      tracks: allTracks,
      // link: `/spotify-track-add?playlistId={playlistId}}&trackId=={id}}`,
    },
  })
})

// ================================================================
router.post('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.body.playlistId)
  const trackId = Number(req.body.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  const trackToAdd = Track.getList().find(
    (track) => track.id === trackId,
  )

  if (playlist.tracks.includes(trackToAdd)) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Такий трек вже є в плейлисті',
        link: `/spotify-track-add?playlistId=${playlistId}`,
      },
    })
  }
  if (!trackToAdd) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Такого треку не знайдено',
        link: `/spotify-track-add?playlistId=${playlistId}`,
      },
    })
  }

  playlist.tracks.push(trackToAdd)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})


// ================================================================


router.get('/', function (req, res) {

  let playlists = Playlist.getList();

  let playlistsData = playlists.map((playlist) => {
    return {
      name: playlist.name,
      playlistId: playlist.id,
      image: playlist.image,
      amount: playlist.getTrackCount(),
    };
  })

  res.render('spotify-my-playlists', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-my-playlists',
    data: {
      name: 'Моя бібліотека',
      playlists: playlistsData,
    }

  })
  // ↑↑ сюди вводимо JSON дані
})



// =============================================================


router.get('/spotify-search', function (req, res) {
  const value = '';

  const list = Playlist.findListByValue(value);

  res.render('spotify-search', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-search',
    data: {
      name: 'Пошук плейліста',
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },

  })
  // ↑↑ сюди вводимо JSON дані
})



// =============================================================


router.post('/spotify-search', function (req, res) {
  const value = req.body.value || '';

  const list = Playlist.findListByValue(value);
  console.log(value)
  res.render('spotify-search', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-search',
    data: {
      name: 'Пошук плейліста',
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },

  })
  // ↑↑ сюди вводимо JSON дані
})



module.exports = router;