const yamlEditor = window.ace.edit("yaml-editor");
const jsonEditor = window.ace.edit("json-editor");
yamlEditor.setValue("# loading..", -1);
jsonEditor.setValue('{ "status": "loading.." }', -1);
yamlEditor.setOptions({ fontSize: "12pt" });
jsonEditor.setOptions({ fontSize: "12pt" });
yamlEditor.getSession().setMode("ace/mode/yaml");
jsonEditor.getSession().setMode("ace/mode/json");
window.ace.config.loadModule("ace/ext/searchbox", (m) => {
  m.Search(jsonEditor);
  m.Search(yamlEditor);
});
yamlEditor.searchBox.hide();
jsonEditor.searchBox.hide();

class StatusControl {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "status-control";
    this.container.textContent = "JSON Content: loading";
    return this.container;
  }
  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
  update(status) {
    this.container.textContent = `JSON Content: ${status}`;
  }
}

class ForkMeControl {
  constructor(options) {
    this.url = options.url;
  }

  onAdd() {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl";

    const img =
      "https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png";
    const style = "position: absolute; top: -159px; left: -10px; border: 0;";

    this.container.innerHTML = `<a><img style="${style}" src="${img}" alt="Fork me on GitHub"></a>`;
    this.container.querySelector("a").href = this.url;

    document.querySelector(".mapboxgl-ctrl-top-left").style.top = "149px";

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
  }

  getDefaultPosition() {
    return "top-left";
  }
}

/**
 * normalize style ref
 * - basic, geolonia/basic, geolonia/basic/master -> geolonia/basic/master
 * - fallback master -> main if not exists
 * @returns string
 */
const fetchYaml = async () => {
  const styleUrlFormat = "https://raw.githubusercontent.com/%s/style.json";

  let styleUrl;

  const styleIdentifier = new URLSearchParams(location.search).get("style");
  if (!styleIdentifier) {
    const yaml = await fetch("./style.yml").then((res) => res.text());
    const json = new window.VT.Transpiler(yaml).toText();
    return { yaml, json };
  } else if (styleIdentifier) {
    if (styleIdentifier.match(/^https:\/\//)) {
      styleUrl = styleIdentifier;
    } else {
      const stylePath = styleIdentifier
        .split(/\//)
        .filter((section) => !!section);
      if (stylePath.length === 1) {
        stylePath.unshift("geolonia");
        stylePath.push("master");
      } else if (stylePath.length === 2) {
        stylePath.push("master");
      }
      styleUrl = styleUrlFormat.replace("%s", stylePath.join("/"));
    }
  }

  if (styleUrl.includes("/master/style.json")) {
    const response = await fetch(styleUrl, { method: "HEAD" });
    if (response.status > 399) {
      const fallbackedStyle = styleUrl.replace(
        "/master/style.json",
        "/main/style.json"
      );
      console.log(
        `[geolonia/preview] style ${styleUrl} is not found. Trying ${fallbackedStyle}..`
      );
      styleUrl = fallbackedStyle;
    }
  }
  const json = await fetch(styleUrl).then((res) => res.text());
  const yaml = window.VT.Transpiler._json2yaml(json);
  return { yaml, json };
};

const main = async () => {
  window.Split(["#left-pane", "#right-pane"], {
    direction: "horizontal",
    onDragEnd: () => {
      map.resize();
      yamlEditor.resize();
      jsonEditor.resize();
    },
  });

  window.Split(["#right-top-pane", "#right-bottom-pane"], {
    direction: "vertical",
    onDragEnd: () => {
      map.resize();
      jsonEditor.resize();
    },
  });

  const statusControl = new StatusControl();
  const forkMeControl = new ForkMeControl({
    url: "https://github.com/geolonia/vt-style",
  });

  const { yaml, json } = await fetchYaml();
  console.log({ json });
  const map = new window.geolonia.Map({
    container: "#map",
    style: JSON.parse(json),
  });
  jsonEditor.resize();

  map.on("load", () => {
    map.addControl(statusControl, "bottom-right");
    map.addControl(forkMeControl, "top-left");
    statusControl.update("style");

    yamlEditor.session.on("change", () => {
      const yaml = yamlEditor.getValue();
      const transpiler = new window.VT.Transpiler(yaml);
      try {
        const style = transpiler.toJSON();
        map.setStyle(style);
        jsonEditor.setValue(JSON.stringify(style, null, 2), -1);
        statusControl.update("style");
      } catch (error) {
        console.error(error);
      }
    });

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point);
      jsonEditor.setValue(JSON.stringify(features, null, 2), -1);
      statusControl.update(`features(${features.length})`);
    });
  });

  // set initial values
  yamlEditor.setValue(yaml, -1);
  jsonEditor.setValue(json, -1);
};
main();
