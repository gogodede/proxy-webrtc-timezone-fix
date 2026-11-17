import {offsets} from './offsets.js';

const defaults = {
  webrtc: {enabled: false, policy: 'disable_non_proxied_udp', inject: true, devices: false, additional: false},
  timezone: {enabled: false, location: 'Etc/GMT', random: false, offset: null},
};
const policies = ['default', 'default_public_and_private_interfaces', 'default_public_interface_only', 'disable_non_proxied_udp'];
const randomZones = new Map();
let pending = Promise.resolve();

async function read() {
  const {toolkit = {}} = await chrome.storage.local.get('toolkit');
  return {webrtc: {...defaults.webrtc, ...toolkit.webrtc}, timezone: {...defaults.timezone, ...toolkit.timezone}};
}

function analyze(location) {
  if (!Object.hasOwn(offsets, location)) throw new Error('Неизвестный часовой пояс');
  const date = new Date();
  // Use Chrome's timezone database rather than the old Moment 2020 database.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: location, timeZoneName: 'longOffset', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const label = parts.find(p => p.type === 'timeZoneName').value;
  const match = label.match(/GMT([+-])(\d{2}):(\d{2})/);
  const offset = match ? (Number(match[2]) * 60 + Number(match[3])) * (match[1] === '+' ? 1 : -1) : 0;
  const name = new Intl.DateTimeFormat('en-US', {timeZone: location, timeZoneName: 'long'})
    .formatToParts(date).find(p => p.type === 'timeZoneName').value;
  return {offset, storage: {offset: offsets[location].offset, msg: {standard: name, daylight: name}}};
}

async function applyWebRTC(settings) {
  const policy = chrome.privacy.network.webRTCIPHandlingPolicy;
  if (settings.webrtc.enabled) {
    await policy.set({value: settings.webrtc.policy, scope: 'regular'});
  } else {
    await policy.clear({scope: 'regular'});
  }
}

async function status() {
  const settings = await read();
  const [rtc, proxy] = await Promise.all([
    chrome.privacy.network.webRTCIPHandlingPolicy.get({}), chrome.proxy.settings.get({}),
  ]);
  return {settings, rtc, proxy};
}

async function save(patch) {
  const settings = await read();
  for (const group of ['webrtc', 'timezone']) {
    for (const [key, value] of Object.entries(patch?.[group] || {})) {
      if (!Object.hasOwn(defaults[group], key)) throw new Error('Неизвестная настройка');
      if (typeof defaults[group][key] === 'boolean' && typeof value !== 'boolean') throw new Error('Некорректная настройка');
      settings[group][key] = value;
    }
  }
  if (!policies.includes(settings.webrtc.policy)) throw new Error('Неизвестная политика WebRTC');
  analyze(settings.timezone.location);
  const offset = settings.timezone.offset;
  if (offset !== null && (typeof offset !== 'number' || !Number.isFinite(offset) || Math.abs(offset) > 840)) {
    throw new Error('Смещение должно быть числом от −840 до 840 минут');
  }
  await applyWebRTC(settings);
  await chrome.storage.local.set({toolkit: settings});
  randomZones.clear();
  return status();
}

async function pagePreferences(sender) {
  const settings = await read();
  const timezone = settings.timezone;
  let prefs = null;
  if (timezone.enabled) {
    let location = timezone.location;
    if (timezone.random) {
      const tabId = sender.tab?.id;
      const zones = Object.keys(offsets).filter(zone => {try {analyze(zone); return true;} catch {return false;}});
      if (sender.frameId === 0 || !randomZones.has(tabId)) {
        randomZones.set(tabId, zones[Math.floor(Math.random() * zones.length)]);
      }
      location = randomZones.get(tabId);
    }
    const resolved = analyze(location);
    const offset = timezone.random || timezone.offset === null ? resolved.offset : timezone.offset;
    prefs = [location, -offset, new Date().getTimezoneOffset(), resolved.storage.msg.standard];
  }
  return {webrtc: settings.webrtc, timezone: prefs};
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !Object.hasOwn(message, 'toolkit')) return;
  if (sender.id !== chrome.runtime.id) return;
  const page = message.toolkit === 'page';
  // Only bundled extension pages may change settings or read proxy status.
  if (!page && !sender.url?.startsWith(chrome.runtime.getURL(''))) return;
  const task = async () => {
    switch (message.toolkit) {
      case 'get': return status();
      case 'save': return save(message.patch);
      case 'resetTimezone': return save({timezone: defaults.timezone});
      case 'analyze': return analyze(message.location);
      case 'page': return pagePreferences(sender);
      default: throw new Error('Неизвестная команда');
    }
  };
  const result = pending.then(task);
  pending = result.catch(() => {});
  result.then(value => sendResponse({ok: true, value}), error => sendResponse({ok: false, error: error.message}));
  return true;
});

chrome.tabs.onRemoved.addListener(tabId => randomZones.delete(tabId));
chrome.runtime.onInstalled.addListener(() => {pending = pending.then(async () => applyWebRTC(await read())).catch(console.error);});
chrome.runtime.onStartup.addListener(() => {pending = pending.then(async () => applyWebRTC(await read())).catch(console.error);});
