# Source provenance

This extension was assembled from three independently distributed browser
extensions. Original ZIP archives were obtained from the Chrome Web Store:

- `cejckpjfigehbeecbbfhangbknpidcnh.zip` — SHA-256 `d0157e16fd86afe558dce46d8ff184470c3eec3b2f6d7930361f6ed5369448bb`
- `fjkmabmdepjfammlpliljpnbhleegehm.zip` — SHA-256 `7be041ec9b72b0c1850efcb2f781c53a6a5068118dd513b8952d93607b520eef`
- `gcknhkkoolaabfmlnjonogaaifnjlfnp.zip` — SHA-256 `8dea0e32a8cc4a8d42ccb91e20fa0d71e82b67daa6218a556fb51f978449d42d`

| Component | Version | Author / site | License |
|---|---|---|---|
| FoxyProxy | 9.7 | Eric Jung, https://getfoxyproxy.org/ — https://github.com/foxyproxy/browser-extension | GPL-2.0 |
| WebRTC Control | 0.3.5 | https://mybrowseraddon.com/webrtc-control.html | not specified upstream |
| Change Timezone | 3.0.0 | https://change-timezone.pdfwork.com/ | not specified upstream |

The proxy core lives in `extension/content/`, `extension/_locales/` and
`extension/image/` (icons in this fork are new). WebRTC blocking and `Date`
spoofing were adapted into `extension/privacy/` for the MAIN world. The
fork adds a shared Manifest V3 manifest, a common `toolkit` storage area,
popup toggles and a privacy page.

See `NOTICE.md` for attribution details.
