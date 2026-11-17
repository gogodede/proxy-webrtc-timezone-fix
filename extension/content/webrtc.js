import {App} from './app.js';
const select = document.querySelector('#limitWebRTC');
if (select) {
  select.disabled = true;
  const link = document.createElement('a');
  link.href = '../privacy/options.html';
  link.textContent = 'Настройки WebRTC и часового пояса →';
  select.after(link);
}
const toggle = document.querySelector('#toggleWebRTC');
if (toggle) toggle.disabled = true;
