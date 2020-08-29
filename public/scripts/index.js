const socket = io.connect('/');
const video = document.querySelector('video');
const image = document.querySelector('img');

const snapshot = (stream) => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  const image = canvas.toDataURL();
  socket.emit('image', { image });
};

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    if (video) {
      video.srcObject = stream;
    }

    setInterval(() => snapshot(stream), 500);
  });

socket.on('image', (data) => {
  image.src = data.image;
});
