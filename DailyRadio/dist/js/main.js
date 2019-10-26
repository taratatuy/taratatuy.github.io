const musicUrl = 'https://dailyradio-server.herokuapp.com/music/';
let songIndex = -1;
let playlist = [];
const myAudio = new Audio();
let autoplay = false;

$(document).ready(() => {
  fetch(musicUrl + '/playlist').then(res => {
    res.json().then(data => {
      playlist = data;
      GetNewSong(1);
    });
  });
});

function GetNewSong(step = 1) {
  if (songIndex + step >= playlist.length) songIndex = 0;
  else if (songIndex + step < 0) songIndex = 0;
  else songIndex += step;

  const songUrl = `${musicUrl}play/${playlist[songIndex]}/`;
  let title, artist, picture;

  fetch(songUrl + 'stats').then(async res => {
    try {
      let songStats = await res.json();
      title = songStats.title;
      artist = songStats.artist;
      picture = songStats.picture;
    } catch (err) {
      console.error(err.message);
    }

    title = title || 'Unknown title';
    artist = artist || 'Unknown artist';
    $('#track-name').html(title + ' - ' + artist);
    if (picture) {
      $('#track-image').prop('src', _imageEncode(picture.data.data));
    } else {
      $('#track-image').prop('src', 'https://i.imgur.com/1Y5Uhk6.png');
    }

    myAudio.src = songUrl;
    myAudio.load();
  });
}

$(myAudio).on('durationchange', () => {
  $('.information__numeric_songLength').html(
    `${parseInt(myAudio.duration / 60)}:${PrettyTimeFormat(
      parseInt(myAudio.duration % 60)
    )}`
  );
});

$(myAudio).on('canplay', () => {
  if (autoplay) myAudio.play().catch(err => console.error(err.message));
});

$(myAudio).on('timeupdate', () => {
  curtime = myAudio.currentTime;
  $('#current-time')
    .attr('value', curtime)
    .attr('max', myAudio.duration);
  $('.information__numeric_currentTime').html(
    `${parseInt(myAudio.currentTime / 60)}:${PrettyTimeFormat(
      parseInt(myAudio.currentTime % 60)
    )}`
  );
});

$(myAudio).on('ended', () => {
  GetNewSong(1);
});

function PrettyTimeFormat(num) {
  return num < 10 ? `0${num}` : num;
}

function _imageEncode(arrayBuffer) {
  let u8 = new Uint8Array(arrayBuffer);
  let b64encoded = btoa(
    [].reduce.call(
      new Uint8Array(arrayBuffer),
      (p, c) => {
        return p + String.fromCharCode(c);
      },
      ''
    )
  );
  let mimetype = 'image/jpeg';
  return 'data:' + mimetype + ';base64,' + b64encoded;
}

$('#player-previous-button').on('click', () => {
  GetNewSong(-1);
  $('.information__numeric_songLength').html('');
});
$('#player-next-button').on('click', () => {
  GetNewSong(1);
  $('.information__numeric_songLength').html('');
});

let flag = false;

$(myAudio).on('play', () => {
  autoplay = true;
  $('#player-play-icon').replaceWith(
    `<i id="player-play-icon" class="fa fa-pause" aria-hidden="true"></i>`
  );
  flag = true;
});

$(myAudio).on('pause', () => {
  $('#player-play-icon').replaceWith(
    `<i id="player-play-icon" class="fa fa-play" aria-hidden="true"></i>`
  );
  flag = false;
});

$('#play').on('click', () => {
  if (flag) myAudio.pause();
  else myAudio.play();
});

/* volume */

let volumeFlag = true;
let lastVolume;

$('#block-volume-icon').on('click', e => {
  if (myAudio.volume != 0) {
    lastVolume = myAudio.volume;
    myAudio.volume = 0;
    $('#volume-line').prop('value', 0);
    volumeFlag = false;
    updateValue();
  } else {
    myAudio.volume = lastVolume;
    $('#volume-line').prop('value', lastVolume);
    volumeFlag = true;
    updateValue();
  }
});

$('#volume-line').on('input', updateValue);

function updateValue() {
  let volume_icon = document.getElementById('volume-line').value;
  myAudio.volume = document.getElementById('volume-line').value;
  if (volume_icon > 0.5) {
    $('#volume-icon').replaceWith(
      `<i id="volume-icon" class="fa fa-volume-up" aria-hidden="true"></i>`
    );
  } else if ((volume_icon < 0.5) & (volume_icon > 0)) {
    $('#volume-icon').replaceWith(
      `<i id="volume-icon" class="fa fa-volume-down" aria-hidden="true"></i>`
    );
  } else if (volume_icon == 0) {
    $('#volume-icon').replaceWith(
      `<i id="volume-icon" class="fa fa-volume-off" aria-hidden="true"></i>`
    );
  }
}

$(() => {
  $('.menu__mobile_btn').click(() => {
    $('.menu__mobile_list').show(200);
  });

  $('.close-menu-button').click(() => {
    $('.menu__mobile_list').hide(200);
  });

  $('.menu__mobile_btn').click(() => {
    $('.menu__mobile_mask').show(200);
  });

  $('.close-menu-button').click(() => {
    $('.menu__mobile_mask').hide(200);
  });

  $('.menu__mobile_mask').click(() => {
    $(this).hide(200);
    $('.menu__mobile_list').hide(200);
  });
});

$('.menu__mobile_list')
  .find('li')
  .on('click', () => {
    $('.menu__mobile_mask').hide(200);
    $('.menu__mobile_list').hide(200);
  });
