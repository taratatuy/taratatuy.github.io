const fs = require('fs');
const pathToTemp = '/sys/class/thermal/thermal_zone0/temp';
const tempArray = [];

function getTemp() {
  tempArray.push(fs.readFileSync('./app.js', { encoding: 'UTF8' }));
}

console.log(str);
