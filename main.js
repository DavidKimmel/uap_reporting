require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/widgets/BasemapGallery"
  ], (
    esriConfig, Map, MapView, FeatureLayer,
    Locate, Search, Legend, Expand, BasemapGallery
  ) => {

    // Set your ArcGIS API key
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurEwEJiPsJAv6XK5APCcuFpZEmTCdTdSU9XMQXYBgfL9c5UnZrY4R2UdHgVrW8LfqDFKnjefPQr9XO0pMlE2S9osFC4vlxQEcDC2L-rbRhvnh3cGFmfknrnTY3XSIHKqUu1aHDnbMm61c0aME06Eg9u_NwfzhPyWlPsZlxkyOWLAtootixnskdcZY0pddnIjDLJ19HPMO7YoJRFfo-wFMnrXD59hI_LVwr_BLfWo0dbk7AT1_nGwi5c7J";

    // Initialize the map with a themed basemap
    const map = new Map({ basemap: "streets-night-vector" });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-98, 39],
      zoom: 4
    });

    // Locate and Search widgets
    view.ui.add(new Locate({ view }), "top-left");
    view.ui.add(new Search({ view }), "bottom-right");

    // Custom renderer using your UFO icon
    const uapRenderer = {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: "https://raw.githubusercontent.com/DavidKimmel/uap_reporting/main/ufoicon.png",
        width: "32px",
        height: "32px"
      },
      label: "UAP encounter"
    };

    // Define popupTemplate instead of manual HTML construction
    const popupTemplate = {
      title: "UAP Sighting Report",
      content: [
        {
          type: "fields",
          fieldInfos: [
            { fieldName: "time_of_incident", label: "Time of Incident", format: { dateFormat: "short-date-short-time" }},
            { fieldName: "describe_encounter", label: "Description" },
            { fieldName: "Creator", label: "Submitted By" },
            { fieldName: "CreationDate", label: "Submitted On", format: { dateFormat: "short-date-short-time" }}
          ]
        },
        {
          type: "attachments"  // This auto-displays uploaded images
        }
      ]
    };

    // Define the UAP sightings FeatureLayer
    const uapLayer = new FeatureLayer({
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/survey123_7313cc4fd8bc40c78163e6954fd9dd7f_results/FeatureServer/0",
      outFields: ["*"],
      renderer: uapRenderer,
      popupTemplate: popupTemplate
    });

    map.add(uapLayer);

    // Legend widget setup
    const legend = new Legend({
      view: view,
      layerInfos: [{
        layer: uapLayer,
        title: "UAP Reporting"
      }]
    });

    const legendExpand = new Expand({
      view: view,
      content: legend,
      expanded: false,
      expandTooltip: "Legend"
    });

    // Auto-collapse legend on small screens
    view.watch("widthBreakpoint", (breakpoint) => {
      legendExpand.expanded = (breakpoint !== "xsmall");
    });

    view.ui.add(legendExpand, "bottom-left");

    // Basemap gallery to switch styles (dark, satellite, etc.)
    const basemapGallery = new BasemapGallery({ view: view });
    const galleryExpand = new Expand({
      view: view,
      content: basemapGallery,
      expandTooltip: "Basemap Gallery"
    });
    view.ui.add(galleryExpand, "top-left");
  });