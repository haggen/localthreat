<p align="center">
  <a href="https://localthreat.xyz/"><img src="localthreat.svg" alt="localthreat"></a>
</p>
<p align="center">Paste the transcript or members from chat channels to get a report of affiliations and PvP stats.</p>

---

## About

**[localthreat](https://localthreat.xyz/)** is an online tool to help EVE players with threat assessment.

## Feedback

Opinions, suggestions, issues, or whatever the case, get in touch by [creating a new issue](https://github.com/haggen/localthreat/issues/new).

## Contribution

I do my best to keep the service running at the lowest cost possible, but it still has some. Namely the annual renewal for the domain. Help me help you by contributing to the upkeep of localthreat.xyz. 100% of the proceedings (minus the transfer fees) is destined to the project.

<p align="center">
  <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=B9KBZJP99YAE8&source=url">
    Donate&nbsp;via&nbsp;&nbsp;&nbsp;<img src="paypal.svg" alt="PayPal" valign="middle" width="100px">
  </a>
</p>

## Development

### Docker

If you've got `docker-compose-1.13.0` or newer simply run:

```shell
$ docker-compose up
```

You can customize the runtime by editting the `docker-compose.yml` file.

### API

You'll need `go-1.11.1` or newer installed. Hop into the `api/` sub-directory and run:

```shell
$ go get
```

To download all the dependencies.

```shell
$ make test
$ make
```

To test and build the binary, respectively.

For the database you'll need `postgreql-9.1` or newer running. Load the `migrate.sql` file and then execute:

```shell
$ DATABASE_URL=postgres://... ./localthreat
```

To boot up the API server.

### Client

You'll need `node-8.10` or newer and `yarn` installed. Hop into the `client/` sub-directory and run:

```shell
$ yarn install
```

To download all the dependencies.

```shell
$ yarn start
```

To start a development server that watches for changes.

## Legal

[The MIT License](LICENSE) © 2017 Arthur Corenzan

EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf.
