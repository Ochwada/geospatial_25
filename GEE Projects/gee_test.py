import ee

ee.Initialize()

# Load a Sentinel-2 image
image = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
         .filterDate("2024-01-01", "2024-12-31") \
         .sort("system:time_start", False) \
         .first()

# Print metadata
print(image.getInfo())

print("✅ Google Earth Engine is working correctly!")
