// zones.js - Definición de las zonas delimitadas del modelo

export const ZONES = {
  sala_1: {
    id: "sala_1",
    name: "Sala 1 - Arriba Izquierda",
    bounds: {
      minX: -0.2,
      maxX: 0.05,
      minZ: 0.08,
      maxZ: 0.35,
    },
  },
  sala_2: {
    id: "sala_2",
    name: "Sala 2 - Abajo Izquierda",
    bounds: {
      minX: -0.2,
      maxX: 0.05,
      minZ: -0.15,
      maxZ: 0.08,
    },
  },
  sala_3: {
    id: "sala_3",
    name: "Sala 3 - Centro",
    bounds: {
      minX: 0.25,
      maxX: 0.55,
      minZ: 0.1,
      maxZ: 0.3,
    },
  },
  sala_4: {
    id: "sala_4",
    name: "Sala 4 - Derecha",
    bounds: {
      minX: 0.25,
      maxX: 0.5,
      minZ: 0.1,
      maxZ: 0.3,
    },
  },

  sala_4: {
    id: "sala_4",
    name: "Zona 4 - Franja superior",
    bounds: {
      // estos números definen la franja verde
      minX: -0.35, // más negativo → más a la izquierda
      maxX: 0.85, // más grande → cubre más a la derecha
      minZ: -0.8, // sube/baja la banda
      maxZ: 0.22,
    },
  },
};

// Mapeo HOTSPOT → ZONA
const HOTSPOT_TO_ZONE = {
  sala_2: "sala_1", // Zona 1
  sala_1: "sala_2", // Zona 2
  sala_3: "sala_4", // Zona 3 (ala derecha)
  sala_4: "sala_4_topStrip", // Zona 4 → franja superior
};

export function isInZone(position, zone) {
  return (
    position.x >= zone.bounds.minX &&
    position.x <= zone.bounds.maxX &&
    position.z >= zone.bounds.minZ &&
    position.z <= zone.bounds.maxZ
  );
}

export function getZoneByHotspotId(hotspotId) {
  const zoneId = HOTSPOT_TO_ZONE[hotspotId];
  return ZONES[zoneId];
}
