-- Create spatial indexes for better performance
-- These are automatically created by the backend initialization script
-- Included here for reference

-- Spatial index on landmarks location
CREATE INDEX IF NOT EXISTS idx_landmarks_location 
ON landmarks USING GIST (location);

-- Spatial index on cities bounds
CREATE INDEX IF NOT EXISTS idx_cities_bounds 
ON cities USING GIST (bounds);

-- Spatial index on regions boundary
CREATE INDEX IF NOT EXISTS idx_regions_boundary 
ON regions USING GIST (boundary);

-- Regular indexes
CREATE INDEX IF NOT EXISTS idx_landmarks_city_id ON landmarks(city_id);
CREATE INDEX IF NOT EXISTS idx_discoveries_user_id ON user_discoveries(user_id);
CREATE INDEX IF NOT EXISTS idx_discoveries_landmark_id ON user_discoveries(landmark_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_city ON user_progress(user_id, city_id);
