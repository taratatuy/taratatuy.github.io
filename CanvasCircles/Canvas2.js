// const canvas = document.querySelector('canvas');

{
  const canvas = document.getElementById('v2');
  const c = canvas.getContext('2d');

  canvas.width = innerWidth / 2 - 5;
  canvas.height = innerHeight - 5;

  const mouse = {
    x: canvas.width + innerWidth / 2 / 2,
    y: canvas.height / 2
  };

  colors = ['blue', 'blueviolet', 'rgb(0, 153, 255)', 'rgb(0, 255, 234)'];

  addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function Circle(x, y, radius, color, velocity, radians, distance) {
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

  Circle.prototype.draw = function(lastPoint) {
    c.beginPath();
    c.strokeStyle = this.color;
    c.lineWidth = this.radius;
    c.moveTo(lastPoint.x, lastPoint.y);
    c.lineTo(this.x, this.y);
    c.stroke();
    c.closePath;
  };

  Circle.prototype.update = function() {
    const lastPoint = { x: this.x, y: this.y };
    this.radians += this.velocity;
    this.lastMouse.x += (mouse.x - innerWidth / 2 - this.lastMouse.x) * 0.07;
    this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.07;
    this.x = this.lastMouse.x + Math.cos(this.radians) * this.distance;
    this.y = this.lastMouse.y + Math.sin(this.radians) * this.distance;

    this.draw(lastPoint);
  };

  var objects = [];
  function init() {
    for (var i = 0; i < 35; i++) {
      let radius = 2 + Math.random() * 6;
      let color = randomColor(colors);
      let velocity = 0.01 + Math.random() * 0.02;
      let directoin = Math.floor(Math.random() * 2);
      velocity = directoin ? velocity : -velocity;
      let radians = Math.random() * 6;
      let distance = 40 + Math.random() * 100;
      objects.push(
        new Circle(
          canvas.width / 2,
          canvas.height / 2,
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
    c.fillStyle = 'rgba(0, 0, 0, 0.05)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    objects.forEach(object => {
      object.update();
    });
  }

  init();
  animate();
}
