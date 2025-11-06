-- Enable PostGIS extension
-- This is automatically run by the backend initialization script
-- Included here for reference

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verify PostGIS installation
SELECT PostGIS_version();
