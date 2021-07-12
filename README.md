# [WIP] VT Style

[![build](https://github.com/geolonia/vt-style/actions/workflows/build.yml/badge.svg)](https://github.com/geolonia/vt-style/actions/workflows/build.yml)

VT Style is a YAML to JSON conversion tool with a special focus on [Mapbox GL style](https://docs.mapbox.com/mapbox-gl-js/style-spec/).

## Demo

http://geolonia.github.io/vt-style/

## Features

- All YAML Syntax
  - Comments(`#`)
  - Anchor(`&`), Alias(`*`) and Extension(`<<: *`)
- Variable declaration with `$` prefix

### yaml input

```yaml
# example
---
$bg_color: "#3a3a3a"
$text_size_small: 12
$text_size_large: 14

layers:
  - id: background
    type: background
    paint:
      background-color: $bg_color
  - id: poi-label
    type: symbol
    layout: &text_layout_base
      text-size: $text_size_small
      text-color: white
      text-halo-color: black
  - id: city-label
    type: symbol
    layout:
      <<: *text_layout_base
      text-size: $text_size_large
```

### JSON output

```json
{
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "#3a3a3a"
      }
    },
    {
      "id": "poi-label",
      "type": "symbol",
      "layout": {
        "text-size": 12,
        "text-color": "white",
        "text-halo-color": "black"
      }
    },
    {
      "id": "city-label",
      "type": "symbol",
      "layout": {
        "text-size": 14,
        "text-color": "white",
        "text-halo-color": "black"
      }
    }
  ]
}
```

## Usage

### CLI

```shell
$ npx vt-style style.yml -o style.json --watch
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
