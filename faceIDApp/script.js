const video = document.getElementById('video');

/* Setting up the constraint */
var facingMode = 'environment'; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
var constraints = {
  audio: false,
  video: {
    // facingMode: facingMode
  }
};

/* Stream it to video element */
console.log(navigator);
navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
  video.srcObject = stream;
});

// function startVideo() {
//   navigator.getUserMedia(
//     { video: { width: 720, height: 720 } },
//     stream => {
//       video.srcObject = stream;
//     },
//     err => {
//       console.log(err);
//     }
//   );
// }

// startVideo();
