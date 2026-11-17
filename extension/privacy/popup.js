import {request, fillZones, warning, msg} from './ui.js';
const rtc = document.querySelector('#rtc-enabled');
const tz = document.querySelector('#tz-enabled');
const location = document.querySelector('#tz-location');
const status = document.querySelector('#toolkit-status');
fillZones(location);
function render(data) {
  rtc.checked = data.settings.webrtc.enabled;
  tz.checked = data.settings.timezone.enabled;
  location.value = data.settings.timezone.location;
  location.disabled = !tz.checked;
  status.textContent = warning(data);
}
async function update(patch) {
  try {
    const data = await request('save', {patch});
    render(data);
    status.textContent = warning(data) || msg('statusSaved');
  } catch (error) {status.textContent = error.message;}
}
rtc.addEventListener('change', () => update({webrtc: {enabled: rtc.checked}}));
tz.addEventListener('change', () => update({timezone: {enabled: tz.checked}}));
location.addEventListener('change', () => update({timezone: {location: location.value, offset: null, random: false}}));
try {render(await request('get'));} catch (error) {status.textContent = error.message;}
