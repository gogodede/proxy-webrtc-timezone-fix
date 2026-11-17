import {request, fillZones, warning, i18n, msg} from './ui.js';
i18n();
const byId = id => document.getElementById(id);
const status = byId('status');
fillZones(byId('tz-location'));
function render(data) {
  const {webrtc, timezone} = data.settings;
  for (const key of ['enabled', 'inject', 'devices', 'additional']) byId('rtc-' + key).checked = webrtc[key];
  byId('rtc-policy').value = webrtc.policy;
  byId('tz-enabled').checked = timezone.enabled;
  byId('tz-location').value = timezone.location;
  byId('tz-random').checked = timezone.random;
  byId('tz-manual').checked = timezone.offset !== null;
  byId('tz-offset').disabled = timezone.offset === null;
  byId('tz-offset').value = timezone.offset ?? '';
  status.textContent = warning(data);
}
byId('tz-manual').addEventListener('change', async event => {
  byId('tz-offset').disabled = !event.target.checked;
  if (event.target.checked && byId('tz-offset').value === '') {
    try {byId('tz-offset').value = (await request('analyze', {location: byId('tz-location').value})).offset;}
    catch (error) {status.textContent = error.message;}
  }
});
byId('settings').addEventListener('submit', async event => {
  event.preventDefault();
  const button = byId('save');
  button.disabled = true;
  try {
    const patch = {webrtc: {}, timezone: {}};
    for (const key of ['enabled', 'inject', 'devices', 'additional']) patch.webrtc[key] = byId('rtc-' + key).checked;
    patch.webrtc.policy = byId('rtc-policy').value;
    patch.timezone = {
      enabled: byId('tz-enabled').checked, location: byId('tz-location').value,
      random: byId('tz-random').checked, offset: byId('tz-manual').checked ? byId('tz-offset').valueAsNumber : null,
    };
    const data = await request('save', {patch});
    render(data);
    status.textContent = warning(data) || msg('statusSaved');
  } catch (error) {status.textContent = error.message;}
  finally {button.disabled = false;}
});
byId('reset-timezone').addEventListener('click', async () => {
  try {render(await request('resetTimezone')); status.textContent ||= msg('statusTzReset');}
  catch (error) {status.textContent = error.message;}
});
try {render(await request('get'));} catch (error) {status.textContent = error.message;}
