[![next.localthreat.xyz](localthreat.svg)](https://next.localthreat.xyz)

> Paste the transcript or members from chat to get a report of affiliations and PvP stats.

## About

**[localthreat](https://next.localthreat.xyz/)** is an online tool to help EVE players with threat assessment.

## Development

The code and documentation are hosted on [GitHub](https://github.com/haggen/localthreat). The design lives on [Figma](https://www.figma.com/file/BPH2xeVvbBDAnWpjMI58GpnW/localthreat.next). Bug tracking, feature request, and any other feedback must be made on the [repository's issues page](https://github.com/haggen/localthreat/issues/new).

### Setup

If you've got docker-compose 1.13.0+ installed, simply run:

```shell
$ docker-compose up
```

This will boot everything you need in one go. You can resume your work later with the same command. If it's your first run though, you'll need to also setup the database; with the everything running run:

```shell
$ docker-compose exec -T db psql -h localhost -u postgres postgres < api/migrate.sql
```

Also note that you'll need to setup a local proxy so the client can talk to the API server. Images like [jwilder/nginx-proxy](https://github.com/jwilder/nginx-proxy) can help you with that. The default hostnames are `localthreat.localhost` for the client, and `api.localthreat.localhost` for the API.

### Manual setup

If you don't have Docker or with you don't want to deal with proxies and hostnames you can build and run everything locally.

#### API

You'll need Go 1.11.1+ installed. Hop into the `api/` sub-directory and run:

```shell
$ go get
```

To download all the dependencies and then:

```shell
$ make test
$ make
```

To test and build the binary, respectively.

For persistence you'll need PostgreSQL 9.1+. Load the `migrate.sql` file into your database and run:

```shell
$ DATABASE_URL=postgres://postgres@localhost/postgres ./localthreat
```

To start the API server. Adjust the `DATABASE_URL` env var accordingly.

#### Client

You'll need Node 8.10+ and yarn installed. Hop into the `client/` sub-directory and run:

```shell
$ yarn install
```

To download all the dependencies. Then run:

```shell
$ REACT_APP_API_URL=http://localhost:8080 yarn start
```

To start a development server. Adjust the `REACT_APP_API_URL` env var accordingly.

## Contribution

I do my best to keep the service running at the lowest cost possible, but it still has some. Namely the domain renewal and a \$10 virtual machine on [Digital Ocean](https://www.digitalocean.com/). Help me help you by contributing to the upkeep of localthreat. [Donate via PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=B9KBZJP99YAE8&source=url).

## Legal

[The MIT License](LICENSE) © 2017 Arthur Corenzan

EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf.
