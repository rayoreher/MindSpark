/*
  # Add visibility column to questions table

  1. Changes
    - Add `visibility` column to `questions` table with type text
    - Set default value to 'private'
    - Add constraint to only allow 'private' or 'public' values
    - Update existing records to have 'private' visibility

  2. Security
    - No RLS changes needed as this is just adding a column
*/

-- Add visibility column to questions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'visibility'
  ) THEN
    ALTER TABLE questions ADD COLUMN visibility text DEFAULT 'private' NOT NULL;
    
    -- Add check constraint to ensure only valid values
    ALTER TABLE questions ADD CONSTRAINT questions_visibility_check 
      CHECK (visibility IN ('private', 'public'));
    
    -- Update any existing records to have 'private' visibility
    UPDATE questions SET visibility = 'private' WHERE visibility IS NULL;
  END IF;
END $$;