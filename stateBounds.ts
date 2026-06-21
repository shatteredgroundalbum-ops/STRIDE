export interface StateBounds {
  name: string;
  abbr: string;
  centerLat: number;
  centerLon: number;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export const US_STATES: StateBounds[] = [
  { name: 'Alabama',        abbr: 'AL', centerLat: 32.806,  centerLon: -86.791, minLat: 30.144, maxLat: 35.008, minLon: -88.473, maxLon: -84.889 },
  { name: 'Alaska',         abbr: 'AK', centerLat: 61.370,  centerLon: -152.404, minLat: 54.560, maxLat: 71.538, minLon: -179.148, maxLon: -129.979 },
  { name: 'Arizona',        abbr: 'AZ', centerLat: 33.729,  centerLon: -111.431, minLat: 31.332, maxLat: 37.003, minLon: -114.815, maxLon: -109.045 },
  { name: 'Arkansas',       abbr: 'AR', centerLat: 34.969,  centerLon: -92.373,  minLat: 33.004, maxLat: 36.500, minLon: -94.618, maxLon: -89.644 },
  { name: 'California',     abbr: 'CA', centerLat: 36.778,  centerLon: -119.417, minLat: 32.534, maxLat: 42.009, minLon: -124.409, maxLon: -114.131 },
  { name: 'Colorado',       abbr: 'CO', centerLat: 39.550,  centerLon: -105.782, minLat: 36.993, maxLat: 41.003, minLon: -109.045, maxLon: -102.041 },
  { name: 'Connecticut',    abbr: 'CT', centerLat: 41.599,  centerLon: -72.755,  minLat: 40.986, maxLat: 42.050, minLon: -73.727, maxLon: -71.787 },
  { name: 'Delaware',       abbr: 'DE', centerLat: 38.910,  centerLon: -75.527,  minLat: 38.451, maxLat: 39.839, minLon: -75.789, maxLon: -75.048 },
  { name: 'Florida',        abbr: 'FL', centerLat: 27.664,  centerLon: -81.515,  minLat: 24.396, maxLat: 31.001, minLon: -87.634, maxLon: -80.031 },
  { name: 'Georgia',        abbr: 'GA', centerLat: 32.157,  centerLon: -82.907,  minLat: 30.357, maxLat: 35.000, minLon: -85.605, maxLon: -80.840 },
  { name: 'Hawaii',         abbr: 'HI', centerLat: 19.898,  centerLon: -155.665, minLat: 18.917, maxLat: 22.236, minLon: -160.248, maxLon: -154.807 },
  { name: 'Idaho',          abbr: 'ID', centerLat: 44.240,  centerLon: -114.478, minLat: 41.988, maxLat: 49.001, minLon: -117.243, maxLon: -111.043 },
  { name: 'Illinois',       abbr: 'IL', centerLat: 40.349,  centerLon: -88.986,  minLat: 36.970, maxLat: 42.508, minLon: -91.513, maxLon: -87.020 },
  { name: 'Indiana',        abbr: 'IN', centerLat: 39.849,  centerLon: -86.258,  minLat: 37.771, maxLat: 41.761, minLon: -88.097, maxLon: -84.785 },
  { name: 'Iowa',           abbr: 'IA', centerLat: 42.011,  centerLon: -93.210,  minLat: 40.376, maxLat: 43.501, minLon: -96.639, maxLon: -90.140 },
  { name: 'Kansas',         abbr: 'KS', centerLat: 38.526,  centerLon: -96.726,  minLat: 36.993, maxLat: 40.003, minLon: -102.051, maxLon: -94.589 },
  { name: 'Kentucky',       abbr: 'KY', centerLat: 37.668,  centerLon: -84.670,  minLat: 36.497, maxLat: 39.147, minLon: -89.571, maxLon: -81.964 },
  { name: 'Louisiana',      abbr: 'LA', centerLat: 31.169,  centerLon: -91.867,  minLat: 28.928, maxLat: 33.019, minLon: -94.043, maxLon: -88.817 },
  { name: 'Maine',          abbr: 'ME', centerLat: 44.693,  centerLon: -69.381,  minLat: 42.977, maxLat: 47.460, minLon: -71.083, maxLon: -66.950 },
  { name: 'Maryland',       abbr: 'MD', centerLat: 39.063,  centerLon: -76.802,  minLat: 37.912, maxLat: 39.723, minLon: -79.487, maxLon: -75.047 },
  { name: 'Massachusetts',  abbr: 'MA', centerLat: 42.230,  centerLon: -71.530,  minLat: 41.237, maxLat: 42.887, minLon: -73.508, maxLon: -69.928 },
  { name: 'Michigan',       abbr: 'MI', centerLat: 44.314,  centerLon: -85.602,  minLat: 41.696, maxLat: 48.306, minLon: -90.418, maxLon: -82.413 },
  { name: 'Minnesota',      abbr: 'MN', centerLat: 46.392,  centerLon: -94.636,  minLat: 43.500, maxLat: 49.385, minLon: -97.239, maxLon: -89.491 },
  { name: 'Mississippi',    abbr: 'MS', centerLat: 32.354,  centerLon: -89.398,  minLat: 30.174, maxLat: 35.008, minLon: -91.655, maxLon: -88.098 },
  { name: 'Missouri',       abbr: 'MO', centerLat: 37.964,  centerLon: -91.831,  minLat: 35.996, maxLat: 40.613, minLon: -95.774, maxLon: -89.099 },
  { name: 'Montana',        abbr: 'MT', centerLat: 46.879,  centerLon: -110.362, minLat: 44.358, maxLat: 49.001, minLon: -116.049, maxLon: -104.040 },
  { name: 'Nebraska',       abbr: 'NE', centerLat: 41.492,  centerLon: -99.901,  minLat: 39.999, maxLat: 43.001, minLon: -104.053, maxLon: -95.308 },
  { name: 'Nevada',         abbr: 'NV', centerLat: 38.802,  centerLon: -116.419, minLat: 35.001, maxLat: 42.002, minLon: -120.005, maxLon: -114.039 },
  { name: 'New Hampshire',  abbr: 'NH', centerLat: 43.452,  centerLon: -71.563,  minLat: 42.697, maxLat: 45.305, minLon: -72.557, maxLon: -70.703 },
  { name: 'New Jersey',     abbr: 'NJ', centerLat: 40.298,  centerLon: -74.521,  minLat: 38.928, maxLat: 41.357, minLon: -75.563, maxLon: -73.893 },
  { name: 'New Mexico',     abbr: 'NM', centerLat: 34.840,  centerLon: -106.248, minLat: 31.332, maxLat: 37.000, minLon: -109.050, maxLon: -103.000 },
  { name: 'New York',       abbr: 'NY', centerLat: 42.165,  centerLon: -74.948,  minLat: 40.496, maxLat: 45.015, minLon: -79.762, maxLon: -71.856 },
  { name: 'North Carolina', abbr: 'NC', centerLat: 35.630,  centerLon: -79.806,  minLat: 33.842, maxLat: 36.588, minLon: -84.322, maxLon: -75.460 },
  { name: 'North Dakota',   abbr: 'ND', centerLat: 47.528,  centerLon: -101.001, minLat: 45.935, maxLat: 49.001, minLon: -104.049, maxLon: -96.554 },
  { name: 'Ohio',           abbr: 'OH', centerLat: 40.388,  centerLon: -82.764,  minLat: 38.403, maxLat: 42.323, minLon: -84.820, maxLon: -80.519 },
  { name: 'Oklahoma',       abbr: 'OK', centerLat: 35.565,  centerLon: -96.928,  minLat: 33.616, maxLat: 37.002, minLon: -103.002, maxLon: -94.431 },
  { name: 'Oregon',         abbr: 'OR', centerLat: 43.804,  centerLon: -120.554, minLat: 41.992, maxLat: 46.292, minLon: -124.566, maxLon: -116.463 },
  { name: 'Pennsylvania',   abbr: 'PA', centerLat: 41.203,  centerLon: -77.194,  minLat: 39.720, maxLat: 42.269, minLon: -80.519, maxLon: -74.690 },
  { name: 'Rhode Island',   abbr: 'RI', centerLat: 41.742,  centerLon: -71.442,  minLat: 41.146, maxLat: 42.019, minLon: -71.862, maxLon: -71.120 },
  { name: 'South Carolina', abbr: 'SC', centerLat: 33.836,  centerLon: -80.945,  minLat: 32.034, maxLat: 35.215, minLon: -83.354, maxLon: -78.541 },
  { name: 'South Dakota',   abbr: 'SD', centerLat: 43.969,  centerLon: -99.901,  minLat: 42.479, maxLat: 45.945, minLon: -104.058, maxLon: -96.436 },
  { name: 'Tennessee',      abbr: 'TN', centerLat: 35.747,  centerLon: -86.692,  minLat: 34.983, maxLat: 36.678, minLon: -90.310, maxLon: -81.647 },
  { name: 'Texas',          abbr: 'TX', centerLat: 31.054,  centerLon: -97.563,  minLat: 25.837, maxLat: 36.500, minLon: -106.646, maxLon: -93.508 },
  { name: 'Utah',           abbr: 'UT', centerLat: 39.320,  centerLon: -111.093, minLat: 36.998, maxLat: 42.001, minLon: -114.053, maxLon: -109.041 },
  { name: 'Vermont',        abbr: 'VT', centerLat: 44.045,  centerLon: -72.710,  minLat: 42.726, maxLat: 45.017, minLon: -73.438, maxLon: -71.465 },
  { name: 'Virginia',       abbr: 'VA', centerLat: 37.431,  centerLon: -78.656,  minLat: 36.541, maxLat: 39.466, minLon: -83.675, maxLon: -75.242 },
  { name: 'Washington',     abbr: 'WA', centerLat: 47.751,  centerLon: -120.740, minLat: 45.543, maxLat: 49.002, minLon: -124.733, maxLon: -116.915 },
  { name: 'West Virginia',  abbr: 'WV', centerLat: 38.491,  centerLon: -80.954,  minLat: 37.201, maxLat: 40.638, minLon: -82.644, maxLon: -77.719 },
  { name: 'Wisconsin',      abbr: 'WI', centerLat: 43.784,  centerLon: -88.787,  minLat: 42.492, maxLat: 47.309, minLon: -92.888, maxLon: -86.249 },
  { name: 'Wyoming',        abbr: 'WY', centerLat: 43.075,  centerLon: -107.290, minLat: 40.995, maxLat: 45.005, minLon: -111.056, maxLon: -104.052 },
];

/** Estimate tile count for a state across zoom levels 12–15 */
export function estimateStateTileCount(state: StateBounds, minZoom = 12, maxZoom = 15): number {
  let total = 0;
  for (let z = minZoom; z <= maxZoom; z++) {
    const xMin = Math.floor(((state.minLon + 180) / 360) * Math.pow(2, z));
    const xMax = Math.floor(((state.maxLon + 180) / 360) * Math.pow(2, z));
    const latRadMax = (state.maxLat * Math.PI) / 180;
    const latRadMin = (state.minLat * Math.PI) / 180;
    const yMin = Math.floor(((1 - Math.log(Math.tan(latRadMax) + 1 / Math.cos(latRadMax)) / Math.PI) / 2) * Math.pow(2, z));
    const yMax = Math.floor(((1 - Math.log(Math.tan(latRadMin) + 1 / Math.cos(latRadMin)) / Math.PI) / 2) * Math.pow(2, z));
    total += (xMax - xMin + 1) * (yMax - yMin + 1);
  }
  return total;
}

/** Rough MB estimate: average tile ≈ 12 KB */
export function estimateStateMB(state: StateBounds): number {
  return Math.round(estimateStateTileCount(state) * 12 / 1024);
}
