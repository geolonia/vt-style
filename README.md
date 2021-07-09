# VT Style

[![build](https://github.com/geolonia/vt-style/actions/workflows/build.yml/badge.svg)](https://github.com/geolonia/vt-style/actions/workflows/build.yml)

VT Style is a YAML to JSON conversion tool with a special focus on [Mapbox GL style](https://docs.mapbox.com/mapbox-gl-js/style-spec/).

## Demo

http://geolonia.github.io/vt-style/

## Usage

### CLI

```shell
$ npm install vt-style -g
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

### Node.js

```shell
$ npm install vt-style -S
```

```typescript
import { Transpiler } from "vt-style";
const yaml = ["---", "hello: 123", 'world: "abc"', ""].join("\n");
const transpiler = new Transpiler(yaml);
const style = transpiler.toJSON();
```

## Development

```shell
$ npm test       # run tests
$ npm start      # start live DEMO
$ npm run build  # build lib and website
```

### Run with maputnik

```shell
$ npm run watch                               # run the CLI in watch mode to create public/style.json
$ maputnik --watch --file ./public/style.json # then run the maputnik to observe public/style.json
```
