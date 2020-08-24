var io;

let config = {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: '# temperatire',
        data: [],
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
};

document.getElementById('clearIdInput').addEventListener('click', () => {
  const ip = (document.getElementById('ipInput').value = '');
});

document.getElementById('submitIP').addEventListener('click', () => {
  const ip = document.getElementById('ipInput').value;
  document.getElementById('login').style.display = 'none';
  document.getElementById('wrapper').style.display = 'flex';

  init(ip);
});

function init(ip) {
  io = io.connect(`http://${ip}:10252`);

  connect();
}

function connect() {
  const canvas = document.getElementById('place').getContext('2d');

  window.myLine = new Chart(canvas, config);

  io.on('load', (data) => {
    let labels = [];
    data[1].forEach((element) => {
      labels.push(timeFormatLabel(element));
    });
    config.data.labels = labels;
    config.data.datasets[0].data = data[0];
    window.myLine.update();
  });

  io.on('update', (data) => {
    updateChart(data);
    setHighest(data[2]);
    setLowest(data[3]);
  });
}

function updateChart(data) {
  config.data.labels.push(timeFormatLabel(data[1]));
  config.data.datasets[0].data.push(data[0]);

  window.myLine.update();
}

function setHighest(temp) {
  const highest = document.getElementById('highest');

  highest.innerHTML = `Highest temperature: ${temp[0]} (${timeFormat(
    temp[1]
  )})`;
}

function setLowest(temp) {
  const lowest = document.getElementById('lowest');

  lowest.innerHTML = `Lowest temperature: ${temp[0]}  (${timeFormat(temp[1])})`;
}

function timeFormatLabel(time) {
  const date = new Date(time);
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function timeFormat(time) {
  const date = new Date(time);
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}.${date.getMonth()}.${date
    .getFullYear()
    .toString()
    .substring(2)}`;
}

// init('91.77.19.182');
