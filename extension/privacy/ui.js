import {offsets} from './offsets.js';
export async function request(toolkit, extra = {}) {
  const response = await chrome.runtime.sendMessage({toolkit, ...extra});
  if (!response?.ok) throw new Error(response?.error || 'Фоновый процесс не ответил');
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
  if (proxy.levelOfControl === 'controlled_by_other_extensions') messages.push('Прокси управляется другим расширением.');
  if (settings.webrtc.enabled && (rtc.levelOfControl !== 'controlled_by_this_extension' || rtc.value !== settings.webrtc.policy)) messages.push('Политика WebRTC не применена: проверь другие расширения или политики Chrome.');
  return messages.join(' ');
}
