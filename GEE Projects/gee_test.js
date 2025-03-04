
// Define Area of Interest (AOI) - Example: Sylt, Germany
var aoi = ee.Geometry.Rectangle([8.25, 54.8, 8.5, 55]); 


// Load Sentinel-2 (Optical) Data
var s2 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterBounds(aoi)
  .filterDate('2023-01-01', '2023-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
  .median();
  
  // Load Sentinel-1 (SAR) Data
var s1 = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterBounds(aoi)
  .filterDate('2023-01-01', '2023-12-31')
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .select('VV')
  .median();
  
  
// Apply NDWI (Normalized Difference Water Index) to Detect Coastline
var ndwi = s2.normalizedDifference(['B3', 'B8']).rename('NDWI');

// Threshold NDWI to Extract Water (1 = water, 0 = land)
var waterMask = ndwi.gt(0.1).selfMask();

// Visualize in GEE
Map.centerObject(aoi, 10);
Map.addLayer(s2, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'Sentinel-2 RGB');
Map.addLayer(s1, {min: -25, max: 0}, 'Sentinel-1 SAR');
Map.addLayer(waterMask, {palette: 'blue'}, 'Water Mask');

// Export Coastline Change to Google Drive
Export.image.toDrive({
  image: waterMask,
  description: 'Coastline_Change_2023',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF'
});

//gee_vs