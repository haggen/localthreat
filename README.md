# localthreat

[![Screenshot of localthreat](localthreat.png)](https://localthreat.xyz)

---

## About

**[localthreat](https://localthreat.xyz/)** is a website that helps players of EVE Online quickly identify friend from foe and assess the level of threat their enemies may present.

### How does it work?

With the window in focus, it listens for paste events from the user. You'll need to copy a chat transcript or a channel member list from in-game and press CTRL+V on this page. Once input is detected, it parses the content for character names and queries information from the game servers and other third-party APIs to offer a complete report of affiliations and PvP statistics for those players.

## Contribution

I accept in-game donations (ISK) as contributions to the project. If you feel like localthreat has helped you, please consider donating. Send any amount to **Jason Chorant**. This helps keep me motivated and assists with the costs of running and maintaining this service.

You can also contribute by reporting bugs, suggesting features, sending feedback and pull requests.

## Development

- 👨‍💻 The code and documentation are hosted on [GitHub](https://github.com/haggen/localthreat).
- 🎨 The design lives on [Figma](https://www.figma.com/file/BPH2xeVvbBDAnWpjMI58GpnW/localthreat.next?node-id=0%3A1).
- 🐛 Bug tracking, feature requests, and other feedback should be submitted via the [repository's issues page](https://github.com/haggen/localthreat/issues/new/choose).

With [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed, and port 80 available, run:

```shell
docker compose up -w
```

This will start everything you need in watch mode.

You can access the application at http://localthreat.local.crz.li, and the API at http://api.localthreat.local.crz.li.

> 💡 local.crz.li is a public wildcard loopback domain. It resolves to `127.0.0.1` (IPv4) or `::1` (IPv6).

## Legal

[The MIT License](LICENSE) © 2017 Arthur Corenzan.

EVE Online and the EVE logo are registered trademarks of CCP hf. All rights reserved. All other trademarks are the property of their respective owners. localthreat is an independent project and is not affiliated with, sponsored, or endorsed by CCP hf.
