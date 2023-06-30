import songs from "./songs.js";
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
var audio = $(".audio");
var lyrics = document.querySelector(".music_lyris p");
var nameMusic = $(".music_name");
var timeSongs = $("#music_run");

var indexSong = 0;

var checkRandom = false;

function start() {
  getApi(songs);
  getLyrics(songs);
  handlePlay(songs);
  nextSong();
  prevSong();
  randomSong();
  loadSong();
  changeTimeSong();
}

start();

// Lấy dữ liệu từ JSON

function getApi(songs) {
  var listMusic = document.querySelector(".list_music");

  var html = songs.map((song) => {
    return `
        <div class="item_music">
        <img src="${song.image}" alt="" />
        <div class="item_content">
          <h3>${song.name}</h3>
          <p>${song.singer}</p>
        </div>
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </div>
        `;
  });

  listMusic.innerHTML = html.join("");
}

function getLyrics(songs) {
  var indexLyrics = $$(".item_music");

  renderMusic(songs, 0);

  indexLyrics.forEach((item, index) => {
    item.onclick = () => {
      renderMusic(songs, index);
      playing();
      indexSong = index;
    };
  });
}

function renderMusic(songs, index) {
  lyrics.innerHTML = songs[index].lyrics;
  audio.src = songs[index].path;
  nameMusic.innerText = songs[index].name;
  $(".music_cd-main").src = songs[index].image;
}

// Play/ Pause

function handlePlay() {
  var btnActions = $(".music_btn-actions");

  btnActions.onclick = () => {
    if ($(".btn-playing").classList.contains("show")) {
      pausing();
    } else if ($(".btn-pausing").classList.contains("show")) {
      playing();
    }
  };
}

function pausing() {
  audio.pause();
  $(".btn-playing").classList.remove("show");
  $(".btn-pausing").classList.add("show");
  $(".music_cd-main").classList.remove("action");
}

function playing() {
  audio.play();
  $(".btn-playing").classList.add("show");
  $(".btn-pausing").classList.remove("show");
  $(".music_cd-main").classList.add("action");
  timeSong();
}

// next music

function nextSong() {
  $(".btn-next").onclick = () => {
    if ($(".btn-random").classList.contains("active")) {
      indexSong = Math.floor(Math.random() * songs.length);
    }

    var index = ++indexSong;

    if (index >= songs.length) index = 0;

    renderMusic(songs, index);
    playing();
  };
}

// Prev music

function prevSong() {
  $(".btn-prev").onclick = () => {
    if ($(".btn-random").classList.contains("active")) {
      indexSong = Math.floor(Math.random() * songs.length);
    }
    var index = --indexSong;

    if (index <= 0) index = songs.length - 1;

    renderMusic(songs, index);
    playing();
  };
}

// ramdom music

function randomSong() {
  $(".btn-random").onclick = () => {
    !checkRandom ? (checkRandom = true) : (checkRandom = false);

    $(".btn-random").classList.toggle("active");
  };
}

//load music

function loadSong() {
  var checkLoad = false;

  $(".btn-load").onclick = () => {
    if (checkLoad) {
      checkLoad = false;
      audio.loop = false;
    } else {
      checkLoad = true;
      audio.loop = true;
    }

    $(".btn-load").classList.toggle("active");
  };
}

// Time Song

function timeSong() {
  audio.ontimeupdate = () => {
    timeSongs.value = (audio.currentTime / audio.duration) * 100;

    if (audio.currentTime == audio.duration) {
      var index = checkRandom
        ? Math.floor(Math.random() * songs.length)
        : ++indexSong;

      if (index >= songs.length) index = 0;
      renderMusic(songs, index);
      playing();
    }
  };
}

let isSeeking = false;

function changeTimeSong() {
  timeSongs.onmousedown = () => {
    isSeeking = true;
  };

  timeSongs.onmouseup = () => {
    isSeeking = false;
  };

  timeSongs.onchange = () => {
    if (!isSeeking) {
      audio.currentTime = (timeSongs.value / 100) * audio.duration;
    }
  };
}

$$(".item_music i").forEach((item, index) => {
  item.onclick = () => {
    $(".music_lyris").classList.add("show");
    document.body.style.overflow = "hidden";
  };
});

$(".music_lyris span").onclick = () => {
  $(".music_lyris").classList.remove("show");
};
