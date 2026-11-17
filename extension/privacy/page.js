// Adapted from the supplied Change Timezone 3.0.0 and WebRTC Control 0.3.5.
// MAIN-world content scripts avoid page CSP blocking extension script elements.
(() => {
class TimezoneChangeInject {
    init(prefs) { Date.prefs = prefs; this.runInjectCode(); }
    runInjectCode() {
        Date.prefs = Date.prefs || [
            'Etc/GMT', 0, new Date().getTimezoneOffset(), 'London Standard Time'
        ];
        const ODateTimeFormat = Intl.DateTimeFormat;
        globalThis.Intl.DateTimeFormat = function (locales, options = {}) {
            return ODateTimeFormat(locales, {timeZone: Date.prefs[0], ...options});
        };
        globalThis.Intl.DateTimeFormat.prototype = ODateTimeFormat.prototype;
        globalThis.Intl.DateTimeFormat.supportedLocalesOf = ODateTimeFormat.supportedLocalesOf;
    
        const clean = str => {
            const toGMT = offset => {
                const z = n => (n < 10 ? '0' : '') + n;
                const sign = offset <= 0 ? '+' : '-';
                offset = Math.abs(offset);
                return sign + z(offset / 60 | 0) + z(offset % 60);
            };
            str = str.replace(/GMT[+-]\d{4}/g, 'GMT' + toGMT(Date.prefs[1]));
            if (str.indexOf(' (') !== -1) {
                str = str.split(' (')[0] + ' (' + Date.prefs[3] + ')';
            }
            return str;
        }
    
        const ODate = Date;
        const {
            getTime, getDate, getDay, getFullYear, getHours, getMilliseconds, getMinutes, getMonth, getSeconds, getYear,
            toDateString, toLocaleString, toString, toTimeString, toLocaleTimeString, toLocaleDateString,
            setYear, setHours, setTime, setFullYear, setMilliseconds, setMinutes, setMonth, setSeconds, setDate,
            setUTCDate, setUTCFullYear, setUTCHours, setUTCMilliseconds, setUTCMinutes, setUTCMonth, setUTCSeconds
        } = ODate.prototype;
        const ShiftedDate = class extends ODate {
            constructor(...args) {
                super(...args);
                this.nd = new ODate(
                    getTime.apply(this) + (Date.prefs[2] - Date.prefs[1]) * 60 * 1000
                );
            }
            // get
            toLocaleString(...args) {
                return toLocaleString.call(this, args[0], {timeZone: Date.prefs[0], ...args[1]});
            }
            toLocaleTimeString(...args) {
                return toLocaleTimeString.call(this, args[0], {timeZone: Date.prefs[0], ...args[1]});
            }
            toLocaleDateString(...args) {
                return toLocaleDateString.call(this, args[0], {timeZone: Date.prefs[0], ...args[1]});
            }
            toDateString(...args) {
                return toDateString.apply(this.nd, args);
            }
            getDate(...args) {
                return getDate.apply(this.nd, args);
            }
            getDay(...args) {
                return getDay.apply(this.nd, args);
            }
            getFullYear(...args) {
                return getFullYear.apply(this.nd, args);
            }
            getHours(...args) {
                return getHours.apply(this.nd, args);
            }
            getMilliseconds(...args) {
                return getMilliseconds.apply(this.nd, args);
            }
            getMinutes(...args) {
                return getMinutes.apply(this.nd, args);
            }
            getMonth(...args) {
                return getMonth.apply(this.nd, args);
            }
            getSeconds(...args) {
                return getSeconds.apply(this.nd, args);
            }
            getYear(...args) {
                return getYear.apply(this.nd, args);
            }
            // set
            setHours(...args) {
                const a = getTime.call(this.nd);
                const b = setHours.apply(this.nd, args);
                setTime.call(this, getTime.call(this) + b - a);
                return b;
            }
            setFullYear(...args) {
                const a = getTime.call(this.nd);
                const b = setFullYear.apply(this.nd, args);
                setTime.call(this, getTime.call(this) + b - a);
                return b;
            }
            setMilliseconds(...args) {
                const a = getTime.call(this.nd);
                const b = setMilliseconds.apply(this.nd, args);
                setTime.call(this, getTime.call(this) + b - a);
                return b;
            }
            setMinutes(...args) {
                const a = getTime.call(this.nd);
                const b = setMinutes.apply(this.nd, args);
                setTime.call(this, getTime.call(this) + b - a);
                return b;
            }
            setMonth(...args) {
                const a = getTime.call(this.nd);
                const b = setMonth.apply(this.nd, args);
                setTime.call(this, getTime.call(this) + b - a);
                return b;
            }
            setSeconds(...args) {
                const a = getTime.call(this.nd);
                const b = setSeconds.apply(this.nd, args);
                setTime.call(this, getTime.call(this) + b - a);
                return b;
            }
            setDate(...args) {
                const a = getTime.call(this.nd);
                const b = setDate.apply(this.nd, args);
                setTime.call(this, getTime.call(this) + b - a);
                return b;
            }
            setYear(...args) {
                const a = getTime.call(this.nd);
                const b = setYear.apply(this.nd, args);
                setTime.call(this, getTime.call(this) + b - a);
                return b;
            }
            setTime(...args) {
                const a = getTime.call(this);
                const b = setTime.apply(this, args);
                setTime.call(this.nd, getTime.call(this.nd) + b - a);
                return b;
            }
            setUTCDate(...args) {
                const a = getTime.call(this);
                const b = setUTCDate.apply(this, args);
                setTime.call(this.nd, getTime.call(this.nd) + b - a);
                return b;
            }
            setUTCFullYear(...args) {
                const a = getTime.call(this);
                const b = setUTCFullYear.apply(this, args);
                setTime.call(this.nd, getTime.call(this.nd) + b - a);
                return b;
            }
            setUTCHours(...args) {
                const a = getTime.call(this);
                const b = setUTCHours.apply(this, args);
                setTime.call(this.nd, getTime.call(this.nd) + b - a);
                return b;
            }
            setUTCMilliseconds(...args) {
                const a = getTime.call(this);
                const b = setUTCMilliseconds.apply(this, args);
                setTime.call(this.nd, getTime.call(this.nd) + b - a);
                return b;
            }
            setUTCMinutes(...args) {
                const a = getTime.call(this);
                const b = setUTCMinutes.apply(this, args);
                setTime.call(this.nd, getTime.call(this.nd) + b - a);
                return b;
            }
            setUTCMonth(...args) {
                const a = getTime.call(this);
                const b = setUTCMonth.apply(this, args);
                setTime.call(this.nd, getTime.call(this.nd) + b - a);
                return b;
            }
            setUTCSeconds(...args) {
                const a = getTime.call(this);
                const b = setUTCSeconds.apply(this, args);
                setTime.call(this.nd, getTime.call(this.nd) + b - a);
                return b;
            }
            // toString
            toString(...args) {
                return clean(toString.apply(this.nd, args));
            }
            toTimeString(...args) {
                return clean(toTimeString.apply(this.nd, args));
            }
            // offset
            getTimezoneOffset() {
                return Date.prefs[1];
            }
        }
    
        globalThis.Date = new Proxy(ShiftedDate, {apply() { return new ShiftedDate().toString(); }});
    }
    
}

window.addEventListener('proxy-toolkit-config', event => {
  try {
    const config = JSON.parse(event.detail);
    if (config.timezone) new TimezoneChangeInject().init(config.timezone);
    if (config.webrtc?.enabled) {
if (config.webrtc.inject) {
  if (typeof navigator.getUserMedia !== "undefined") navigator.getUserMedia = undefined;
  if (typeof window.MediaStreamTrack !== "undefined") window.MediaStreamTrack = undefined;
  if (typeof window.RTCPeerConnection !== "undefined") window.RTCPeerConnection = undefined;
  if (typeof window.RTCSessionDescription !== "undefined") window.RTCSessionDescription = undefined;
  //
  if (typeof navigator.mozGetUserMedia !== "undefined") navigator.mozGetUserMedia = undefined;
  if (typeof window.mozMediaStreamTrack !== "undefined") window.mozMediaStreamTrack = undefined;
  if (typeof window.mozRTCPeerConnection !== "undefined") window.mozRTCPeerConnection = undefined;
  if (typeof window.mozRTCSessionDescription !== "undefined") window.mozRTCSessionDescription = undefined;
  //
  if (typeof navigator.webkitGetUserMedia !== "undefined") navigator.webkitGetUserMedia = undefined;
  if (typeof window.webkitMediaStreamTrack !== "undefined") window.webkitMediaStreamTrack = undefined;
  if (typeof window.webkitRTCPeerConnection !== "undefined") window.webkitRTCPeerConnection = undefined;
  if (typeof window.webkitRTCSessionDescription !== "undefined") window.webkitRTCSessionDescription = undefined;
}

if (config.webrtc.devices) {
  if (typeof navigator.mediaDevices !== "undefined") {
    navigator.mediaDevices = undefined;
    //
    Object.defineProperty(navigator, "mediaDevices", {
      "value": null,
      "writable": false,
      "configurable": false
    });
  }
  //
  Object.defineProperty(navigator.__proto__,  "mediaDevices", {
    "value": function () {
      return null;
    }
  });
}

if (config.webrtc.additional) {
  if (typeof window.RTCDataChannel !== "undefined") window.RTCDataChannel = undefined;
  if (typeof window.RTCIceCandidate !== "undefined") window.RTCIceCandidate = undefined;
  if (typeof window.RTCConfiguration !== "undefined") window.RTCConfiguration = undefined;
}

    }
  } catch (error) { console.warn('Proxy WebRTC Timezone fix:', error); }
}, {once: true});
})();
