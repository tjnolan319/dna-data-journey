
-- Add a new column to store tab configuration for each lab note
ALTER TABLE public.lab_notes 
ADD COLUMN tab_config JSONB DEFAULT '[
  {"id": "analysis", "name": "Analysis", "icon": "microscope", "order": 0},
  {"id": "methodology", "name": "Methodology", "icon": "settings", "order": 1},
  {"id": "code", "name": "Code", "icon": "code", "order": 2},
  {"id": "insights", "name": "Insights", "icon": "lightbulb", "order": 3}
]'::jsonb;

-- Update existing records to have the default tab configuration
UPDATE public.lab_notes 
SET tab_config = '[
  {"id": "analysis", "name": "Analysis", "icon": "microscope", "order": 0},
  {"id": "methodology", "name": "Methodology", "icon": "settings", "order": 1},
  {"id": "code", "name": "Code", "icon": "code", "order": 2},
  {"id": "insights", "name": "Insights", "icon": "lightbulb", "order": 3}
]'::jsonb
WHERE tab_config IS NULL;
