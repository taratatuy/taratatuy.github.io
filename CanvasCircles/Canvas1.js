// const canvas = document.querySelector('canvas');

{
  const canvas1 = document.getElementById('v1');
  const c1 = canvas1.getContext('2d');

  canvas1.width = innerWidth / 2 - 5;
  canvas1.height = innerHeight - 5;

  const mouse1 = {
    x: canvas1.width / 2,
    y: canvas1.height / 2
  };

  colors = ['blue', 'blueviolet', 'rgb(0, 153, 255)', 'rgb(0, 255, 234)'];

  addEventListener('mousemove', e => {
    mouse1.x = e.clientX;
    mouse1.y = e.clientY;
  });

  function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function Circle1(x, y, radius, color, velocity, radians, distance) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.radians = radians;
    this.distance = distance;
    this.lastMouse = {
      x: x,
      y: y
    };
  }

  Circle1.prototype.draw = function(lastPoint) {
    c1.beginPath();
    c1.strokeStyle = this.color;
    c1.lineWidth = this.radius;
    c1.moveTo(lastPoint.x, lastPoint.y);
    c1.lineTo(this.x, this.y);
    c1.stroke();
    c1.closePath;
  };

  Circle1.prototype.update = function() {
    const lastPoint = { x: this.x, y: this.y };
    this.radians += this.velocity;
    this.lastMouse.x += (mouse1.x - this.lastMouse.x) * 0.07;
    this.lastMouse.y += (mouse1.y - this.lastMouse.y) * 0.07;
    this.x = this.lastMouse.x + Math.cos(this.radians) * this.distance;
    this.y = this.lastMouse.y + Math.sin(this.radians) * this.distance;

    this.draw(lastPoint);
  };

  var objects1 = [];
  function init() {
    for (var i = 0; i < 35; i++) {
      let radius = 2 + Math.random() * 6;
      let color = randomColor(colors);
      let velocity = 0.01 + Math.random() * 0.02;
      let radians = Math.random() * 6;
      let distance = 40 + Math.random() * 100;
      objects1.push(
        new Circle1(
          canvas1.width / 2,
          canvas1.height / 2,
          radius,
          color,
          velocity,
          radians,
          distance
        )
      );
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    c1.fillStyle = 'rgba(0, 0, 0, 0.05)';
    c1.fillRect(0, 0, canvas1.width, canvas1.height);

    objects1.forEach(object => {
      object.update();
    });
  }

  init();
  animate();
}
