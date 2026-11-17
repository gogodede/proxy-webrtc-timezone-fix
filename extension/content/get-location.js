import {Spinner} from './spinner.js';

// ---------- get location (side effect) -------------------
class GetLocation {

  static {
    this.proxyDiv = document.querySelector('div.proxy-div');
    document.querySelector('.proxy-head button[data-i18n="getLocation"]').addEventListener('click', () => this.process());
  }

  static async process() {
    const ignore = ['127.0.0.1', 'localhost'];

    let {data} = await browser.storage.local.get({data: []});
    data = data.filter(i => i.type !== 'direct' && !ignore.includes(i.hostname)).map(i => i.hostname);
    if (!data[0]) { return; }

    // remove duplicates
    const hosts = [...new Set(data)];

    Spinner.show();
    const json = {};
    await Promise.all(hosts.map(async host => {
      const res = await fetch(`http://ip-api.com/json/${host}?fields=status,countryCode,city`)
        .then(r => r.json()).catch(() => null);
      if (res?.status === 'success') { json[host] = {cc: res.countryCode, city: res.city}; }
    }));
    this.updateLocation(json);
    Spinner.hide();
  }

  static updateLocation(json) {
    // update display
    this.proxyDiv.querySelectorAll('[data-id="cc"], [data-id="city"]').forEach(i => {
      const {hostname, id} = i.dataset;
      // cache old value to compare
      const value = i.value;
      json[hostname]?.[id] && (i.value = json[hostname][id]);
      // dispatch change event
      id === 'cc' && i.value !== value && i.dispatchEvent(new Event('change'));
    });
  }
}