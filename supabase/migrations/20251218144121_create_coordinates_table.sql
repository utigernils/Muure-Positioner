/*
  # Create coordinates table

  1. New Tables
    - `coordinates`
      - `id` (uuid, primary key) - Unique identifier for each coordinate entry
      - `latitude` (numeric) - Latitude value
      - `longitude` (numeric) - Longitude value
      - `created_at` (timestamptz) - Timestamp when the coordinate was saved
  
  2. Security
    - Enable RLS on `coordinates` table
    - Add policy for public read access (anyone can view latest coordinates)
    - Add policy for public insert access (anyone can add coordinates)
  
  3. Notes
    - Table stores all coordinate updates with timestamps
    - Latest entry can be retrieved by sorting on created_at DESC
*/

CREATE TABLE IF NOT EXISTS coordinates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coordinates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view coordinates"
  ON coordinates
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert coordinates"
  ON coordinates
  FOR INSERT
  WITH CHECK (true);