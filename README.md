# Proxy WebRTC Timezone fix

A Manifest V3 Chrome extension that combines three privacy tools in one:

- **Proxy management** — pattern-based proxy switching, per-tab proxies,
  import/export (based on [FoxyProxy](https://github.com/foxyproxy/browser-extension) 9.7)
- **WebRTC leak control** — toggle IP handling policies and block WebRTC
  objects that can reveal your real IP behind a proxy
- **Timezone spoofing** — override the timezone reported by `Date`/`Intl`
  to match your exit node

One popup controls all three independently: switching a proxy does not
change WebRTC or timezone settings.

## Install

1. Clone or download this repository.
2. Open `chrome://extensions`, enable **Developer mode**.
3. Click **Load unpacked** and select the `extension/` directory.
4. Import existing FoxyProxy JSON settings on the Options page if needed.

## Usage

- Toolbar popup: pick a proxy, toggle **WebRTC** protection and **timezone**
  spoofing, run IP/leak checks.
- Options page: full FoxyProxy-style proxy editor — patterns, PAC,
  authentication, keyboard shortcuts, import/export.
- IP lookup features use the free [ip-api.com](http://ip-api.com/) service;
  the Location button opens [ipleak.net](https://ipleak.net/) for IP, DNS
  and WebRTC leak checks.

## Limitations

- The timezone override keeps the original `Date` semantics of the source
  extension: it is not a full system-timezone emulation (Web/Service
  Workers are not covered; historical dates and DST edge cases may differ).
- Settings are applied to pages asynchronously — reload already-open tabs
  after changing WebRTC or timezone options.
- Chrome internal pages and the Chrome Web Store do not allow content
  scripts.

## Origin and license

This project is a fork: the proxy core is derived from **FoxyProxy 9.7**
(GPL-2.0, © Eric H. Jung and contributors), the WebRTC and timezone parts
are adapted from the free Chrome add-ons **WebRTC Control 0.3.5** and
**Change Timezone 3.0.0** (license not specified upstream). See
[NOTICE.md](NOTICE.md) for full attribution and [SOURCES.md](SOURCES.md)
for provenance and checksums.

Licensed under [GPL-2.0](LICENSE). Not affiliated with FoxyProxy.
