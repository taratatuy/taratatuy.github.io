$( document ).ready(function() {
  let myAudio;
  const musicUrl = 'https://dailyradio-server.herokuapp.com/music/';
  let songNum = 1;
  let songIndex = -1;
  let musicArray = [];

  fetch(musicUrl + '/playlist').then(res => {
      res.json().then(data => {
          musicArray = data;
          GetNewSong(1);
      })
  });

  function GetNewSong(step = 1) {
    if (songIndex + step >= musicArray.length) {
        songIndex = 0
    } else if (songIndex + step < 0) {
        songIndex = 0
    } else {
        songIndex += step;
    }

    let songName = musicArray[songIndex];
    let songUrl = `${musicUrl}play/${songName}/`;

    fetch(songUrl + 'stats').then(res => {
        res.json().then(songStats => {
            $('#track-name').html(songStats.title + ' - ' + songStats.artist);
            if (songStats.picture) {
              $('#track-image').html(`<img src="${_imageEncode(songStats.picture.data.data)}">`);
            }
        });
    });

    myAudio = new Audio(songUrl);

    myAudio.addEventListener('timeupdate', function(){
      curtime = myAudio.currentTime;
      $("#current-time").attr("value", curtime);
      $("#current-time").attr("max", myAudio.duration);
    });

    myAudio.addEventListener('ended', function(){
      GetNewSong(1);
      myAudio.play();
    });

  }

  function _imageEncode(arrayBuffer) {
      let u8 = new Uint8Array(arrayBuffer)
      let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer), function (p, c) { return p + String.fromCharCode(c) }, ''))
      let mimetype = "image/jpeg"
      return "data:" + mimetype + ";base64," + b64encoded
  }

  let previos = document.getElementById('player-previous-button');
  let next = document.getElementById('player-next-button');

  previos.addEventListener('click', previous_btn);
  next.addEventListener('click', next_btn);

  play = $('#play');
  let flag = false;

  play.on('click', function(e) {
    if (flag == true) {
      $('#player-play-icon').replaceWith(`<i id="player-play-icon" class="fa fa-play" aria-hidden="true"></i>`);
      myAudio.pause();
      flag = false;
    } else {
      $('#player-play-icon').replaceWith(`<i id="player-play-icon" class="fa fa-pause" aria-hidden="true"></i>`);
      myAudio.play();
      flag = true;
    }
  });

  function next_btn() {
    if (flag == false) {
      GetNewSong(1);
    } else {
      myAudio.pause();
      GetNewSong(1);
      myAudio.play();
    }
  }

  function previous_btn() {
    if (flag == false) {
      GetNewSong(-1);
    } else {
      myAudio.pause();
      GetNewSong(-1);
      myAudio.play();
    }
  }

  /* volume */

  let volumeFlag = true;
  let lastVolume;
  mute = $('#block-volume-icon');
  mute.on('click' , function(e) {
    if (myAudio.volume != 0) {
      lastVolume = myAudio.volume;
      myAudio.volume = 0;
      document.getElementById('volume-line').value = 0;
      volumeFlag = false;
      updateValue();
    } else {
      myAudio.volume = lastVolume;
      document.getElementById('volume-line').value = lastVolume;
      volumeFlag = true;
      updateValue();
    }
  });

  const input = document.getElementById('volume-line');
  input.addEventListener('input', updateValue);

  function updateValue() {
    let volume_icon = document.getElementById('volume-line').value;
    myAudio.volume = document.getElementById('volume-line').value;
    if (volume_icon > 0.5) {
      $('#volume-icon').replaceWith(`<i id="volume-icon" class="fa fa-volume-up" aria-hidden="true"></i>`);
    } else if (volume_icon < 0.5 & volume_icon > 0) {
      $('#volume-icon').replaceWith(`<i id="volume-icon" class="fa fa-volume-down" aria-hidden="true"></i>`);
    } else if (volume_icon == 0) {
      $('#volume-icon').replaceWith(`<i id="volume-icon" class="fa fa-volume-off" aria-hidden="true"></i>`);
    }
  }
});

$(function() {
  $('.menu__mobile_btn').click(function() {
      $(".menu__mobile_list").show(200);
  });

  $('.close-menu-button').click(function() {
      $(".menu__mobile_list").hide(200);
  });

  $('.menu__mobile_btn').click(function() {
      $(".menu__mobile_mask").show(200);
  });

  $('.close-menu-button').click(function() {
      $(".menu__mobile_mask").hide(200);
  });

  $('.menu__mobile_mask').click(function() {
      $(this).hide(200);
      $(".menu__mobile_list").hide(200);
  });
});
let mainBlock = $('.menu__mobile_list');

mainBlock.find('li').on('click', function() {
   $(".menu__mobile_mask").hide(200);
   $(".menu__mobile_list").hide(200);
});