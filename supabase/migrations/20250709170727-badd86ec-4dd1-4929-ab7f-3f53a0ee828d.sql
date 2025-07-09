
-- Add comments column to lab_notes table for admin notes
ALTER TABLE public.lab_notes 
ADD COLUMN admin_comments TEXT;

-- Update the default tab configuration to include 5 tabs
ALTER TABLE public.lab_notes 
ALTER COLUMN tab_config SET DEFAULT '[
  {"id": "analysis", "name": "Analysis", "icon": "microscope", "order": 0},
  {"id": "methodology", "name": "Methodology", "icon": "settings", "order": 1},
  {"id": "code", "name": "Code", "icon": "code", "order": 2},
  {"id": "insights", "name": "Insights", "icon": "lightbulb", "order": 3},
  {"id": "considerations", "name": "Considerations", "icon": "brain", "order": 4}
]'::jsonb;

-- Update existing records to have the new default tab configuration with 5 tabs
UPDATE public.lab_notes 
SET tab_config = '[
  {"id": "analysis", "name": "Analysis", "icon": "microscope", "order": 0},
  {"id": "methodology", "name": "Methodology", "icon": "settings", "order": 1},
  {"id": "code", "name": "Code", "icon": "code", "order": 2},
  {"id": "insights", "name": "Insights", "icon": "lightbulb", "order": 3},
  {"id": "considerations", "name": "Considerations", "icon": "brain", "order": 4}
]'::jsonb
WHERE tab_config IS NULL OR jsonb_array_length(tab_config) < 5;
