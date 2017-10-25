const fs = require('fs');
const path = require('path');

global.firebase = { initializeApp: jest.fn() };
global.$ = require('../jsFolder/jquery-3.1.1');
global.Handlebars = require('../jsFolder/handlebars-v4.0.5');
global.Wshapes = [
  {
    "Size": "W36X925",
    "W": 925,
    "A": 272,
    "d": 43.1,
    "ddet": "43  1/8",
    "bf": 18.6,
    "bfdet": "18  5/8",
    "tw": 3.02,
    "tf": 4.53,
    "kdes": 5.28,
    "kdet": "5  3/8",
    "k1": "2  5/16",
    "bf2tf": 2.05,
    "htw": 10.8,
    "Ix": 73000,
    "Zx": 4130,
    "Sx": 3390,
    "rx": 16.4,
    "Iy": 4940,
    "Zy": 862,
    "Sy": 531,
    "ry": 4.26,
    "J": 1430,
    "Cw": 1840000,
    "Wno": 179,
    "Sw1": 3780,
    "Qf": 681,
    "Qw": 2060
  }
];
global.angles = [];
global.beambf = 2;

require('../main.js');

beforeEach(() => {
  const fixturePath = path.normalize(__dirname + '/../index.html');
  document.body.innerHTML = fs.readFileSync(fixturePath);
  $.ready();
  return $.ready;
});

it('does something', () => {
  expect($('#numBolts')).toHaveLength(1);
  $('#theButton').trigger('click');
  const $table = $('#checks');
  const tds = $table.find('td');
  expect(tds).toHaveLength(8);
  expect(tds[0].textContent).toBe('Bolt Shear Strength');
  expect(tds[1].textContent).toBe('24');
  expect(tds[2].textContent).toBe('Bolt Bearing on Beam');
  expect(tds[3].textContent).toBe('530');
  expect(tds[4].textContent).toBe('Bolt Tearout on Beam');
  expect(tds[5].textContent).toBe('1126');
  expect(tds[6].textContent).toBe('Beam web');
  expect(tds[7].textContent).toBe('3.02');
});
