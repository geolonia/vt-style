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

const map = new window.geolonia.Map("#map");
const fetchYaml = () => fetch("./style.yml").then((res) => res.text());
const loadMap = () =>
  new Promise((resolve) => map.on("load", () => resolve(map)));

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

const main = async () => {
  const statusControl = new StatusControl();

  const [map, yaml] = await Promise.all([loadMap(), fetchYaml()]);

  // set initial values
  yamlEditor.setValue(yaml, -1);
  jsonEditor.setValue(JSON.stringify(map.getStyle(), null, 2), -1);
  map.addControl(statusControl, "bottom-left");
  statusControl.update("style");

  yamlEditor.session.on("change", (delta) => {
    const yaml = yamlEditor.getValue();
    const transpiler = new window.VT.Transpiler(yaml);
    try {
      const style = transpiler.transpile().toJSON();
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
};
main();
