// ./js/hotspots.js

const HOTSPOTS_LOWER_768 = [
  {
    key: "about",
    buttonX: 0.15,
    buttonZ: -0.3,
    focusX: 2.4,
    focusZ: 0.35,
    focusY: -0.18,
  },
  {
    key: "solutions",
    buttonX: -0.15,
    buttonZ: -0.3,
    focusX: -0.36,
    focusZ: -0.82,
    focusY: 0.45,
  },
  {
    key: "resources",
    buttonX: 0.4,
    buttonZ: -0.3,
    focusX: 0.82,
    focusZ: -0.6,
    focusY: 0.02,
  },
  {
    key: "technology",
    buttonX: 0.15,
    buttonZ: -0.01,
    focusX: -0.01,
    focusZ: -0.05,
    focusY: 0.02,
  },
];

const HOTSPOTS_LOWER_1032 = [
  {
    key: "about",
    buttonX: 0.2,
    buttonZ: -0.3,
    focusX: 2.4,
    focusZ: 0.35,
    focusY: -0.18,
  },
  {
    key: "solutions",
    buttonX: -0.15,
    buttonZ: -0.5,
    focusX: -0.36,
    focusZ: -0.82,
    focusY: 0.45,
  },
  {
    key: "resources",
    buttonX: 0.7,
    buttonZ: -0.5,
    focusX: 0.82,
    focusZ: -0.6,
    focusY: 0.02,
  },
  {
    key: "technology",
    buttonX: -0.01,
    buttonZ: -0.01,
    focusX: -0.01,
    focusZ: -0.05,
    focusY: 0.02,
  },
];

const HOTSPOTS_DEFAULT = [
  {
    key: "about",
    buttonX: 0.82,
    buttonZ: -0.6,
    focusX: 2.4,
    focusZ: 0.35,
    focusY: -0.18,
  },
  {
    key: "solutions",
    buttonX: -0.19,
    buttonZ: -0.6,
    focusX: -0.36,
    focusZ: -0.82,
    focusY: 0.45,
  },
  {
    key: "resources",
    buttonX: 0.4,
    buttonZ: -0.6,
    focusX: 0.82,
    focusZ: -0.6,
    focusY: 0.02,
  },
  {
    key: "technology",
    buttonX: -0.01,
    buttonZ: -0.05,
    focusX: -0.01,
    focusZ: -0.05,
    focusY: 0.02,
  },
];

export function getHotspotsForWidth(width) {
  if (width <= 768) return HOTSPOTS_LOWER_768;
  if (width <= 1032) return HOTSPOTS_LOWER_1032;
  return HOTSPOTS_DEFAULT;
}
