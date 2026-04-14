DELETE FROM equipment;
ALTER SEQUENCE equipment_id_seq RESTART WITH 1;

INSERT INTO equipment
    (name, description, curr_quantity, max_quantity, price_per_day, category)
VALUES
    ('Sony A7II', '4K E-Mount Mirrorless Camera', 1, 1, 49.99, 'Video'),
    ('Sony 50mm 1.8/f', 'Standard prime lens for full-frame cameras.', 1, 1, 24.99, 'Video'),
    ('Tamron 17-28mm f/2.8', 'Wide-angle zoom lens for E-Mount cameras.', 1, 1, 24.99, 'Video'),
    ('Square Softbox', 'Square softbox with a stand and bulb.', 2, 2, 9.99, 'Lighting'),
    ('Umbrella Softbox', 'Umbrella softbox with a stand and bulb.', 2, 2, 9.99, 'Lighting'),
    ('Spotlight', 'Portable spotlight with adjustable brightness.', 2, 2, 9.99, 'Lighting'),
    ('LED Panel', 'Portable LED panel with adjustable brightness.', 2, 2, 9.99, 'Lighting'),
    ('Tripod', 'Standard tripod with 1/4" screw and adjustable height.', 2, 2, 4.99, 'Gear'),
    ('Green Screen', 'Portable green screen for background replacement.', 1, 1, 14.99, 'Gear'),
    ('Backdrop Kit', 'Set of backdrop cloths for various shooting scenarios.', 1, 1, 19.99, 'Gear'),
    ('Lapel Microphone', 'Compact microphone for clear audio capture.', 2, 2, 7.99, 'Audio'),
    ('Shotgun Microphone', 'Directional hotshoe microphone for clear audio capture.', 1, 1, 19.99, 'Audio');