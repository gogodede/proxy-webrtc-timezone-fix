import {offsets} from './offsets.js';
export const msg = key => chrome.i18n.getMessage(key) || key;
export function i18n(target = document) {
  target.querySelectorAll('[data-i18n]').forEach(i => {
    const [key, attr] = i.dataset.i18n.split('|');
    const text = msg(key);
    attr ? i.setAttribute(attr, text) : i.append(text);
  });
}
export async function request(toolkit, extra = {}) {
  const response = await chrome.runtime.sendMessage({toolkit, ...extra});
  if (!response?.ok) throw new Error(response?.error || msg('errNoBackground'));
  return response.value;
}
export function fillZones(select) {
  for (const zone of Object.keys(offsets).sort()) {
    try {new Intl.DateTimeFormat('en', {timeZone: zone});} catch {continue;}
    select.add(new Option(zone.replaceAll('_', ' '), zone));
  }
}
export function warning({rtc, proxy, settings}) {
  const messages = [];
  if (proxy.levelOfControl === 'controlled_by_other_extensions') messages.push(msg('warnProxyControlled'));
  if (settings.webrtc.enabled && (rtc.levelOfControl !== 'controlled_by_this_extension' || rtc.value !== settings.webrtc.policy)) messages.push(msg('warnRtcNotApplied'));
  return messages.join(' ');
}
