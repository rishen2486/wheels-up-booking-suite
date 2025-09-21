-- Add photos array to cars, tours, and attractions tables
alter table cars add column photos text[];
alter table tours add column photos text[];
alter table attractions add column photos text[];
-- Optionally keep photo_url for backward compatibility