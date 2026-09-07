import { ShowroomItem } from '../../types/salespilot';

export const APPLIANCES_SHOWROOM: ShowroomItem = {
  id: 'appliances',
  name: 'Smart Home Appliances & Connected Kitchen Hub',
  category: 'Smart Home Living & Connected Kitchen Hub',
  tagline: '29" Transparent OLED Hub · AI Twin Chill Cooling · Voice Restocking',
  description: 'Autonomous connected home living appliances equipped with computer vision food tracking, inverter linear compressors, and Agora voice control.',
  badge: 'Smart Living',
  basePrice: 164990,
  accentColor: '#10b981',
  ambientColor: '#064e3b',
  recommendedFor: 'Modern households, luxury residential projects, and smart homeowners looking for effortless energy efficiency.',
  voiceTriggers: ['appliance', 'appliances', 'fridge', 'refrigerator', 'washing machine', 'washer', 'dryer', 'ac', 'air conditioner', 'dyson', 'dishwasher', 'kitchen', 'home'],
  specs: [
    { label: 'Energy Standard', value: '5-Star BEE / A+++ Inverter Efficiency' },
    { label: 'Display Hubs', value: '29" Transparent OLED / 21.5" Family Hub' },
    { label: 'Compressor Tech', value: 'Linear Inverter with 10–20 Year Warranty' },
    { label: 'Smart IoT', value: 'Agora Full-Duplex Voice + Matter + Wi-Fi' },
    { label: 'Noise Signature', value: 'SuperSilence < 38 dBA Whisper Quiet' },
    { label: 'Precision Cooling', value: 'Multi-Zone ±0.2°C Temperature Precision' }
  ],
  hotspots: [
    {
      id: 'hs-screen',
      title: '29" Transparent SmartVision OLED Hub',
      subtitle: 'Voice-directed grocery pantry',
      position: [0.4, 0.5, 0.6],
      details: 'Knock twice or speak to see inside without releasing cold air. Order groceries and control home appliances.',
      metric: '29" Transparent Touch'
    },
    {
      id: 'hs-cooling',
      title: 'Multi-Zone AI Twin Chill Cooling',
      subtitle: 'Precise thermal compartmentalization',
      position: [-0.4, 0.3, 0.4],
      details: 'Independent evaporator loops maintain 70% humidity in the crisper while freezing at -24°C.',
      metric: '±0.2°C Precision'
    },
    {
      id: 'hs-compressor',
      title: 'Zero-Noise Hydro-Compressor',
      subtitle: 'Linear variable displacement',
      position: [0, -0.8, -0.4],
      details: 'Magnetic linear compressor delivering 35% greater energy efficiency and 28 dBA kitchen operation.',
      metric: 'A+++ Energy Efficiency'
    }
  ],
  products: [
    {
      id: 'appliance-1',
      showroomId: 'appliances',
      name: 'LG 630L InstaView Door-in-Door AI Refrigerator',
      brand: 'LG',
      category: 'AI French Door Refrigerator',
      price: 164990,
      priceFormatted: '₹1,64,990',
      tagline: 'Knock Twice InstaView Glass · Linear Cooling · Hygiene Fresh+ · Inverter Linear',
      description: 'Knock twice on the mirrored glass panel to see inside without opening the door, cutting cold air loss by 41%.',
      badge: 'Best Seller',
      has3dModel: true,
      rating: 4.88,
      warranty: '10 Years Inverter Linear Compressor Warranty + 1 Year Comprehensive',
      colors: [{ name: 'Matte Black Steel', hex: '#18181b' }, { name: 'Noble Steel Silver', hex: '#94a3b8' }],
      metrics: [
        { label: 'Net Capacity', value: '630 Litres Large Volume' },
        { label: 'Technology', value: 'InstaView Mirror Glass' },
        { label: 'Compressor', value: 'Inverter Linear (10-Yr Warranty)' },
        { label: 'Energy Rating', value: '5-Star BEE High Efficiency' }
      ],
      specs: [
        { label: 'Cooling System', value: 'DoorCooling+ & LinearCooling (±0.5°C)' },
        { label: 'Air Filter', value: 'Hygiene Fresh+ (5-step bacteria purification)' },
        { label: 'Smart Controls', value: 'LG ThinQ Wi-Fi with Voice Restocking' },
        { label: 'Water Dispenser', value: 'UVnano Self-Sanitizing Water Nozzle' },
        { label: 'Dimensions', value: '912 mm (W) × 1790 mm (H) × 735 mm (D)' }
      ],
      hotspots: [
        { id: 'lg-glass', title: 'InstaView Mirror Glass', subtitle: 'Knock twice to illuminate', position: [0.35, 0.45, 0.65], details: 'Allows you to check drinks without letting cold air escape.', metric: '-41% Cold Loss' }
      ],
      officialSourceUrl: 'https://www.lg.com/in/refrigerators/lg-gr-x29ftqkl'
    },
    {
      id: 'appliance-2',
      showroomId: 'appliances',
      name: 'Samsung Bespoke 467L French Door AI Refrigerator',
      brand: 'Samsung',
      category: 'Custom Modular French Door',
      price: 119990,
      priceFormatted: '₹1,19,990',
      tagline: 'Beverage Center with Autofill Pitcher · Dual Auto Ice Maker · Bespoke Panels',
      description: 'Modular styling with customizable glass panels, hidden internal beverage center, and AI energy saving up to 10%.',
      badge: 'Design Icon',
      has3dModel: true,
      rating: 4.82,
      warranty: '20 Years Digital Inverter Compressor Warranty + 1 Year Full',
      colors: [{ name: 'Clean White Glass', hex: '#f8fafc' }, { name: 'Navy & White', hex: '#1e3a8a' }, { name: 'Glam Charcoal', hex: '#27272a' }],
      metrics: [
        { label: 'Net Capacity', value: '467 Litres Compact Luxury' },
        { label: 'Beverage Center', value: 'Internal Autofill Pitcher' },
        { label: 'Dual Ice Maker', value: 'Cubed Ice & Ice Bites' },
        { label: 'Compressor', value: 'Digital Inverter (20-Yr Warranty)' }
      ],
      specs: [
        { label: 'AI Energy Mode', value: 'SmartThings AI Energy optimizes compressor speed' },
        { label: 'Cooling Technology', value: 'Twin Cooling Plus with separate evaporators' },
        { label: 'Panels', value: 'Interchangeable Bespoke door glass' },
        { label: 'Noise Level', value: '35 dBA Ultra Quiet' }
      ],
      hotspots: [
        { id: 'bespoke-beverage', title: 'Hidden Beverage Center', subtitle: 'Autofill water pitcher', position: [-0.35, 0.45, 0.65], details: '1.4-litre BPA-free pitcher automatically refills with cold filtered water.', metric: 'Autofill Pitcher' }
      ],
      officialSourceUrl: 'https://www.samsung.com/in/refrigerators/french-door/rf59c7002b1-467l-black-rf59c7002b1-tl/'
    },
    {
      id: 'appliance-3',
      showroomId: 'appliances',
      name: 'Samsung Bespoke 653L Side-by-Side Family Hub',
      brand: 'Samsung',
      category: 'AI Family Hub Flagship Refrigerator',
      price: 189990,
      priceFormatted: '₹1,89,990',
      tagline: '21.5" Family Hub Screen · AI View Inside Cameras · 25W AKG Speaker',
      description: 'Stream music, display schedules, and see internal groceries remotely on your phone with AI food management.',
      badge: 'Smart Flagship',
      has3dModel: true,
      rating: 4.93,
      warranty: '20 Years Digital Inverter Compressor Warranty + 2 Years Comprehensive',
      colors: [{ name: 'Clean White Glass', hex: '#ffffff' }, { name: 'Black Caviar Glass', hex: '#18181b' }],
      metrics: [
        { label: 'Total Capacity', value: '653 Litres SpaceMax' },
        { label: 'Display Hub', value: '21.5" Full HD Touchscreen' },
        { label: 'Internal Cameras', value: '3x AI View Inside Sensors' },
        { label: 'Speaker Audio', value: '25W Premium AKG Sound' }
      ],
      specs: [
        { label: 'Smart Connectivity', value: 'SmartThings Hub, Agora Voice AI & Alexa' },
        { label: 'SpaceMax Tech', value: 'Thinner walls with high-efficiency urethane insulation' },
        { label: 'Food Management', value: 'Automatic expiration date tracking via AI camera' },
        { label: 'Door Assist', value: 'Auto-Open Door with touch capacitive sensor' }
      ],
      hotspots: [
        { id: 'hub-touchscreen', title: '21.5" Family Hub Screen', subtitle: 'Central command for home', position: [0.42, 0.5, 0.68], details: 'Control music, video doorbells, and converse with Agora Voice AI.', metric: '21.5" FHD Display' }
      ],
      officialSourceUrl: 'https://www.samsung.com/in/refrigerators/side-by-side/rs76cb811341-653l-white-rs76cb811341tl/'
    },
    {
      id: 'appliance-4',
      showroomId: 'appliances',
      name: 'LG AI Direct Drive 11kg Front Load Washing Machine',
      brand: 'LG',
      category: 'AI Intelligent Laundry Care',
      price: 54990,
      priceFormatted: '₹54,990',
      tagline: 'AI DD Fabric Sensing · TurboWash 360 in 39 Min · Steam+ Allergy Care',
      description: 'Analyzes fabric characteristics to automatically select optimal washing motions with 18% more fabric care.',
      badge: 'Top Rated Washer',
      has3dModel: true,
      rating: 4.87,
      warranty: '10 Years Direct Drive Motor Warranty + 2 Years Machine Cover',
      colors: [{ name: 'Middle Black', hex: '#262626' }, { name: 'Platinum Silver', hex: '#94a3b8' }],
      metrics: [
        { label: 'Drum Capacity', value: '11 kg Heavy Duty Wash' },
        { label: 'AI Protection', value: '+18% Fabric Longevity' },
        { label: 'Cycle Speed', value: 'TurboWash 360 in 39 Mins' },
        { label: 'Steam Hygiene', value: '99.9% Allergy Reduction' }
      ],
      specs: [
        { label: 'Motor', value: 'Inverter Direct Drive (No belts, silent operation)' },
        { label: 'Spin Speed', value: '1400 RPM high extraction' },
        { label: 'Water Jets', value: '4 directional multi-sprinklers' },
        { label: 'Connectivity', value: 'ThinQ Wi-Fi with cycle download and smart diagnostics' }
      ],
      hotspots: [
        { id: 'aidd-drum', title: 'AI Direct Drive Drum', subtitle: 'Detects fabric softness & weight', position: [0, 0, 0.45], details: 'Automatically chooses from 20,000 wash patterns to preserve fabric.', metric: 'AI DD Sensing' }
      ],
      officialSourceUrl: 'https://www.lg.com/in/washing-machines/lg-fhp1411z9b'
    },
    {
      id: 'appliance-5',
      showroomId: 'appliances',
      name: 'Samsung AI EcoBubble 12kg Washer Dryer Combo',
      brand: 'Samsung',
      category: 'Intelligent Washer & Heat Pump Dryer',
      price: 68990,
      priceFormatted: '₹68,990',
      tagline: 'EcoBubble 40x Deep Penetration · Auto Dispense Detergent · Super Speed 39 Min',
      description: 'Combines 12kg washing with 8kg heat pump drying. EcoBubble turns detergent into gentle bubbles that clean in cold water.',
      badge: 'Washer-Dryer Combo',
      has3dModel: true,
      rating: 4.81,
      warranty: '20 Years Digital Inverter Motor Warranty + 3 Years Comprehensive',
      colors: [{ name: 'Inox Silver', hex: '#64748b' }, { name: 'Caviar Black', hex: '#0f172a' }],
      metrics: [
        { label: 'Capacity', value: '12 kg Wash / 8 kg Dry' },
        { label: 'Bubble Technology', value: 'EcoBubble Cold Wash Clean' },
        { label: 'Auto Dispense', value: 'Up to 1 Month Storage' },
        { label: 'Cycle Time', value: 'Super Speed 39 Mins' }
      ],
      specs: [
        { label: 'Motor', value: 'Digital Inverter Motor with magnetic drive' },
        { label: 'AI Control', value: 'Remembers habitual wash cycles' },
        { label: 'Sanitization', value: 'Air Wash removes odors without water' },
        { label: 'Door Glass', value: 'Tempered glass door' }
      ],
      hotspots: [
        { id: 'ecobubble-chamber', title: 'EcoBubble Foam Generator', subtitle: 'Cold wash efficiency', position: [-0.3, -0.3, 0.4], details: 'Pre-mixes air, water, and detergent into micro-bubbles.', metric: '40x Bubble Action' }
      ],
      officialSourceUrl: 'https://www.samsung.com/in/washers-and-dryers/washer-dryer-combo/wd12tp44dsx-tl/'
    },
    {
      id: 'appliance-6',
      showroomId: 'appliances',
      name: 'Bosch Series 8 10kg Front Load Washer',
      brand: 'Bosch',
      category: 'German Engineered Precision Laundry',
      price: 74990,
      priceFormatted: '₹74,990',
      tagline: 'i-DOS Auto Milliliter Dosing · 4D Wash Direct Spray · AntiStain Plus 16 Stains',
      description: 'German engineering with i-DOS automatic dosing measuring detergent to the exact millilitre, preventing residue.',
      badge: 'German Precision',
      has3dModel: true,
      rating: 4.91,
      warranty: '10 Years EcoSilence Drive Motor Warranty + 3 Years Full Coverage',
      colors: [{ name: 'Silver Inox Anti-Fingerprint', hex: '#94a3b8' }, { name: 'Pure White', hex: '#f8fafc' }],
      metrics: [
        { label: 'Dosing Precision', value: 'i-DOS Milliliter Smart Sensing' },
        { label: 'Direct Water Jet', value: '4D Wash Direct Spray' },
        { label: 'Stain Targeting', value: 'AntiStain Plus 16 Stains' },
        { label: 'Spin Speed', value: '1600 RPM Ultra High Spin' }
      ],
      specs: [
        { label: 'Drum Capacity', value: '10 kg VarioDrum' },
        { label: 'Motor', value: 'EcoSilence Drive brushless motor' },
        { label: 'Noise Signature', value: '48 dBA Wash / 71 dBA Spin' },
        { label: 'Smart Features', value: 'Home Connect remote start and diagnostics' }
      ],
      hotspots: [
        { id: 'idos-chamber', title: 'i-DOS Dosing Chamber', subtitle: 'Saves 38% detergent per year', position: [-0.35, 0.4, 0.35], details: 'Dual tanks hold 1.3L liquid detergent and 0.5L softener.', metric: 'i-DOS Precision' }
      ],
      officialSourceUrl: 'https://www.bosch-home.in/products-list/washers-dryers/washing-machines/front-load-washing-machines/WAV28M00IN'
    },
    {
      id: 'appliance-7',
      showroomId: 'appliances',
      name: 'Daikin 1.5 Ton 5-Star Inverter Split AC',
      brand: 'Daikin',
      category: 'Intelligent Climate Control & Air Purification',
      price: 46990,
      priceFormatted: '₹46,990',
      tagline: 'Triple Status Display · Patented Swing Compressor · Dew Clean Frost Wash · PM2.5 Filter',
      description: 'Engineered for extreme heat up to 54°C with patented Swing compressor and Dew Clean coil frost-washing system.',
      badge: 'Extreme Cooling',
      has3dModel: true,
      rating: 4.86,
      warranty: '10 Years Compressor Warranty + 5 Years PCB Warranty',
      colors: [{ name: 'Sparkling White with Chrome Trim', hex: '#f8fafc' }],
      metrics: [
        { label: 'Cooling Capacity', value: '1.5 Ton (5,280 W)' },
        { label: 'Energy Star', value: '5-Star BEE (ISEER 5.20)' },
        { label: 'Extreme Ambient', value: 'Cools at 54°C Heat' },
        { label: 'Coil Cleansing', value: 'Dew Clean Self-Washing' }
      ],
      specs: [
        { label: 'Compressor', value: 'Patented Reluctance DC Swing Inverter Compressor' },
        { label: 'Condenser Coil', value: '100% Grooved Pure Copper Tubes' },
        { label: 'Display Panel', value: 'Triple Display (Power % / Set Temp / Error Code)' },
        { label: 'Air Throw', value: 'Cross Flow Fan with 16-Meter Long Air Throw' }
      ],
      hotspots: [
        { id: 'daikin-display', title: 'Triple Status Front LED', subtitle: 'Monitors real-time power %', position: [0.35, 0.1, 0.25], details: 'Displays power consumption %, room temperature, and error codes.', metric: 'Triple Display' }
      ],
      officialSourceUrl: 'https://www.daikinindia.com/products/room-air-conditioner/inverter-split-ac'
    },
    {
      id: 'appliance-8',
      showroomId: 'appliances',
      name: 'LG Dual Inverter 1.5 Ton 5-Star AI Split AC',
      brand: 'LG',
      category: 'AI Convertible Air Conditioner',
      price: 44990,
      priceFormatted: '₹44,990',
      tagline: 'AI Dual Inverter · 6-in-1 AI Convertible Cooling · Ocean Black Fin Anti-Corrosion',
      description: 'AI Dual Inverter adapts cooling tonnage dynamically based on room occupancy, ambient heat, and target temp.',
      badge: 'AI Climate',
      has3dModel: true,
      rating: 4.84,
      warranty: '10 Years Dual Inverter Compressor Warranty + 5 Years PCB Warranty',
      colors: [{ name: 'Glossy White with Magic Display', hex: '#f1f5f9' }],
      metrics: [
        { label: 'Tonnage Capacity', value: '1.5 Ton Variable' },
        { label: 'Modes', value: '6-in-1 AI Convertible' },
        { label: 'Protection', value: 'Ocean Black Fin Coating' },
        { label: 'Efficiency', value: '5-Star BEE (ISEER 5.20)' }
      ],
      specs: [
        { label: 'Compressor', value: 'Dual Rotary Inverter with twin cylinders' },
        { label: 'Coating', value: 'Ocean Black Protection against salt, dust, and smoke' },
        { label: 'Smart Tech', value: 'ThinQ Wi-Fi with Voice Assistant Control' },
        { label: 'Cooling Range', value: 'Operates stably up to 52°C ambient' }
      ],
      hotspots: [
        { id: 'lg-fin', title: 'Ocean Black Fin Coating', subtitle: 'Anti-corrosion epoxy protection', position: [0, 0, -0.2], details: 'Protects copper condenser from humidity and smog.', metric: 'Ocean Black Fin' }
      ],
      officialSourceUrl: 'https://www.lg.com/in/split-ac/lg-ts-q19ynze'
    },
    {
      id: 'appliance-9',
      showroomId: 'appliances',
      name: 'Dyson Purifier Hot+Cool Formaldehyde HP09',
      brand: 'Dyson',
      category: '3-in-1 AI Purification & Heating',
      price: 59900,
      priceFormatted: '₹59,900',
      tagline: 'HEPA H13 Fully Sealed · Catalytic Formaldehyde Destroyer · Bladeless Air Multiplier',
      description: 'Captures 99.95% of ultrafine particles, permanently destroys formaldehyde, heats in winter, and cools with purified air.',
      badge: 'Luxury Wellness',
      has3dModel: true,
      rating: 4.95,
      warranty: '2 Years Comprehensive Dyson On-Site Warranty + White Glove Setup',
      colors: [{ name: 'White & Gold Flagship Finish', hex: '#d4af37' }, { name: 'Nickel & Gold', hex: '#71717a' }],
      metrics: [
        { label: 'Filtration Standard', value: 'HEPA H13 Whole-Machine Sealed' },
        { label: 'Formaldehyde Destruction', value: 'Cryptomic Catalytic Core' },
        { label: 'Airflow Output', value: '290 L/s Air Multiplier' },
        { label: 'Oscillation', value: '350° Smooth Panoramic Rotation' }
      ],
      specs: [
        { label: 'Sensors', value: '4 continuous sensors (PM2.5, PM10, VOC, NO2, Formaldehyde)' },
        { label: 'Heating Engine', value: 'PTC Ceramic plates with target thermostat control' },
        { label: 'Acoustics', value: '20% quieter than previous gen' },
        { label: 'App Control', value: 'MyDyson app with real-time AQI reports' }
      ],
      hotspots: [
        { id: 'dyson-loop', title: 'Bladeless Air Multiplier Loop', subtitle: 'Amplifies air 10x safely', position: [0, 0.4, 0], details: 'Propels smooth stream of purified air without spinning blades.', metric: '290 L/s Airflow' }
      ],
      officialSourceUrl: 'https://www.dyson.in/products/air-purifiers/dyson-purifier-hot-cool-formaldehyde-hp09'
    },
    {
      id: 'appliance-10',
      showroomId: 'appliances',
      name: 'Bosch Series 6 14-Place Built-in Dishwasher',
      brand: 'Bosch',
      category: 'Hygienic German Dishwasher',
      price: 62990,
      priceFormatted: '₹62,990',
      tagline: 'Zeolith Mineral Moisture Drying · 14 Place Settings · 42 dB SuperSilence · HygienePlus 70°C',
      description: 'Natural Zeolite minerals transform moisture into warm air to dry glassware and plastics spot-free with zero energy use during drying.',
      badge: 'Hygienic Kitchen',
      has3dModel: true,
      rating: 4.89,
      warranty: '10 Years Rust-Through Warranty of Inner Tub + 2 Years Comprehensive',
      colors: [{ name: 'Stainless Steel Fingerprint-Free', hex: '#64748b' }],
      metrics: [
        { label: 'Drying Tech', value: 'Zeolith Natural Mineral Drying' },
        { label: 'Place Capacity', value: '14 Full Place Settings' },
        { label: 'Noise Signature', value: '42 dB SuperSilence' },
        { label: 'Sanitizing Temp', value: 'HygienePlus 70°C Kill 99.9%' }
      ],
      specs: [
        { label: 'Water Consumption', value: '9.5 Litres in Eco cycle (vs 60L hand wash)' },
        { label: 'Baskets', value: 'Max Flex Pro baskets with Rackmatic height adjustment' },
        { label: 'Motor', value: 'EcoSilence Drive brushless motor' },
        { label: 'Safety', value: 'AquaStop 100% lifetime anti-flood warranty' }
      ],
      hotspots: [
        { id: 'zeolith-chamber', title: 'Zeolith Mineral Drying', subtitle: 'Absorbs moisture and releases warmth', position: [0, -0.4, 0.3], details: 'Natural volcanic mineral stores water molecules and produces heat.', metric: 'Zeolith Drying' }
      ],
      officialSourceUrl: 'https://www.bosch-home.in/products-list/dishwashers/built-in-dishwashers/built-in-dishwashers-60-cm/SMV6ZCX07E'
    }
  ]
};
