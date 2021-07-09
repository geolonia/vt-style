# VT Style

[![build](https://github.com/geolonia/vt-style/actions/workflows/build.yml/badge.svg)](https://github.com/geolonia/vt-style/actions/workflows/build.yml)

VT Style is a YAML to JSON conversion tool with a special focus on [Mapbox GL style](https://docs.mapbox.com/mapbox-gl-js/style-spec/).

## Demo

http://geolonia.github.io/vt-style/

## Usage

```shell
$ vt-style -h

VT Style is a YAML to JSON conversion tool with a special focus on Mapbox GL style.

Usage
  $ vt-style ./style.yml --output ./style.json
  $ vt-style ./style.yml --output ./style.json --watch
  $ vt-style ./style.yml --output ./style.json --minify --watch

Options
  --help, -h    Show the help.
  --watch, -w   Turn on watch mode. vt-style will continue to watch for changes in input source.
  --minify, -m  Turn on minify flag. vt-style will minify the output JSON.
```

## Development

```shell
$ npm test           # run tests
$ npm run start:docs # start live demo
$ npm run build      # build lib and website
```

### Run with maputnik

```shell
$ npm run watch                               # run the CLI in watch mode to create public/style.json
$ maputnik --watch --file ./public/style.json # then run the maputnik to observe public/style.json
```
