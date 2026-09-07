import { ShowroomItem } from '../../types/salespilot';

export const CARS_SHOWROOM: ShowroomItem = {
  id: 'cars',
  name: 'Performance Sports Cars & Luxury SUVs',
  category: 'Supercars, Electric Mobility & Luxury SUVs',
  tagline: 'Twin-Turbo Flat-6 · 0-100 in 2.7s · Porsche Active Suspension & Level 2 ADAS',
  description: 'Autonomous multi-tier showroom showcasing track-bred sports supercars, ultra-luxury flagship SUVs, and next-gen electric mobility vehicles.',
  badge: 'Supercars & SUVs',
  basePrice: 21100000,
  accentColor: '#dc2626',
  ambientColor: '#450a0a',
  recommendedFor: 'Automotive connoisseurs, high-net-worth enthusiasts, luxury fleet operators, and executive drivers.',
  voiceTriggers: ['car', 'cars', 'porsche', 'suv', '911', 'carrera', 'turbo', 'range rover', 'bmw', 'mercedes', 'thar', 'nexon', 'xuv700', 'land cruiser', 'vehicle', 'drive'],
  specs: [
    { label: 'Peak Horsepower', value: 'Up to 650 PS (641 HP) Twin-Turbo' },
    { label: 'Fastest 0–100 km/h', value: '2.7 Seconds (Porsche 911 Turbo S)' },
    { label: 'Chassis Tech', value: 'PDCC / E-KDSS / AIRMATIC Adaptive Suspension' },
    { label: 'Autonomous Safety', value: 'Level 2 ADAS Radar + 360° Surround Vision' },
    { label: 'Cockpit Audio', value: 'Burmester High-End / Meridian 1600W / Sony 3D' },
    { label: 'Agora In-Car', value: 'Hands-free voice telematics with sub-25ms latency' }
  ],
  hotspots: [
    {
      id: 'hs-engine',
      title: 'Twin-Turbocharged Flat-6 Engine',
      subtitle: 'Sub-3.0s 0-100 km/h acceleration',
      position: [0, 0, -1.2],
      details: 'Rear-mounted high-revving boxer engine with twin turbochargers, intercooler bypass, and dynamic engine mounts.',
      metric: '650 PS Peak Output'
    },
    {
      id: 'hs-brakes',
      title: 'Porsche Ceramic Composite Brakes (PCCB)',
      subtitle: '10-Piston monobloc calipers',
      position: [0.9, -0.3, 0.8],
      details: '420mm carbon-fiber reinforced ceramic brake discs delivering fade-free deceleration from 300+ km/h.',
      metric: '420mm Ceramic Discs'
    },
    {
      id: 'hs-cockpit',
      title: 'Connected Cockpit with Agora Voice Navigation',
      subtitle: 'Wind-cancelling beamforming speech',
      position: [0, 0.4, 0.1],
      details: 'Seamless voice-controlled telemetry, track-mode telemetry overlays, and hands-free autonomous negotiation.',
      metric: '< 25ms Voice Latency'
    }
  ],
  products: [
    {
      id: 'car-1',
      showroomId: 'cars',
      name: 'Porsche 911 Carrera (992.2)',
      brand: 'Porsche',
      category: 'Iconic Sports Coupe',
      price: 21100000,
      priceFormatted: '₹2.11 Crore',
      tagline: '3.0L Twin-Turbo Boxer 6 · 394 PS · 0-100 in 3.9s · 8-Speed PDK',
      description: 'The archetype of the everyday sports car. Rear-engine boxer with razor-sharp steering feedback and timeless 911 silhouette.',
      badge: 'Sports Flagship',
      has3dModel: true,
      rating: 4.96,
      warranty: '3 Years Porsche Approved Worldwide Warranty + 12-Year Rust Warranty',
      colors: [
        { name: 'Guards Red', hex: '#dc2626' },
        { name: 'GT Silver Metallic', hex: '#94a3b8' },
        { name: 'Racing Yellow', hex: '#eab308' },
        { name: 'Jet Black Metallic', hex: '#0f172a' }
      ],
      metrics: [
        { label: 'Max Power', value: '394 PS (390 HP)' },
        { label: '0–100 km/h', value: '3.9 Seconds (Sport Chrono)' },
        { label: 'Top Speed', value: '294 km/h' },
        { label: 'Peak Torque', value: '450 Nm at 1950–5000 RPM' }
      ],
      specs: [
        { label: 'Engine', value: '3.0-litre Twin-Turbo 6-Cylinder Boxer' },
        { label: 'Transmission', value: '8-Speed Porsche Doppelkupplung (PDK)' },
        { label: 'Drivetrain', value: 'Rear-Wheel Drive (RWD)' },
        { label: 'Brakes', value: '4-Piston aluminum monobloc fixed calipers' },
        { label: 'Exhaust System', value: 'Dual twin-tube stainless steel tailpipes' },
        { label: 'Wheels', value: '19"/20" Carrera alloy wheels with staggered width' }
      ],
      hotspots: [
        { id: 'carrera-exhaust', title: 'Sport Exhaust System', subtitle: 'Twin oval stainless steel pipes', position: [0, -0.3, -1.5], details: 'Acoustically tuned exhaust valves open automatically under load.', metric: 'Acoustic Exhaust' }
      ],
      officialSourceUrl: 'https://www.porsche.com/india/models/911/911-carrera-models/carrera/'
    },
    {
      id: 'car-2',
      showroomId: 'cars',
      name: 'Porsche 911 Carrera 4 GTS (T-Hybrid)',
      brand: 'Porsche',
      category: 'Hybrid Supercar Coupe',
      price: 28200000,
      priceFormatted: '₹2.82 Crore',
      tagline: 'T-Hybrid 3.6L Boxer + Electric Turbo · 541 PS · 0-100 in 3.0s · AWD',
      description: 'Revolutionary T-Hybrid powertrain with electrically driven turbocharger and 40kW PDK transmission motor for instant electric torque.',
      badge: 'T-Hybrid GTS',
      has3dModel: true,
      rating: 4.98,
      warranty: '3 Years Porsche Approved Warranty + 8 Years / 160,000 km High-Voltage Battery Guarantee',
      colors: [
        { name: 'Carmine Red', hex: '#991b1b' },
        { name: 'Chalk White', hex: '#e2e8f0' },
        { name: 'Shade Green', hex: '#15803d' },
        { name: 'Jet Black', hex: '#09090b' }
      ],
      metrics: [
        { label: 'Total Output', value: '541 PS (534 HP)' },
        { label: '0–100 km/h', value: '3.0 Seconds Flat' },
        { label: 'Top Track Speed', value: '312 km/h' },
        { label: 'Electric Assist', value: '40 kW Motor + Electric Turbo' }
      ],
      specs: [
        { label: 'Engine', value: '3.6L Boxer 6-Cylinder with e-Turbo' },
        { label: 'Battery', value: '1.9 kWh lightweight 400V traction battery' },
        { label: 'Chassis', value: 'PASM sport suspension (-10mm) + Rear-Axle Steering' },
        { label: 'Wheels', value: 'Center-lock 20"/21" Turbo S wheels in Satin Black' },
        { label: 'Drivetrain', value: 'Porsche Traction Management (PTM) AWD' }
      ],
      hotspots: [
        { id: 'gts-centerlock', title: 'Motorsport Center-Lock Wheels', subtitle: 'Single nut forged alloy', position: [0.95, -0.3, 0.8], details: 'Motorsport single forged center-locking nut for lower unsprung mass.', metric: 'Center-Lock' }
      ],
      officialSourceUrl: 'https://www.porsche.com/india/models/911/911-gts-models/carrera-4-gts/'
    },
    {
      id: 'car-3',
      showroomId: 'cars',
      name: 'Porsche 911 Turbo S',
      brand: 'Porsche',
      category: 'Ultimate Supercar Flagship',
      price: 38200000,
      priceFormatted: '₹3.82 Crore',
      tagline: '3.8L Twin-Turbo VTG Boxer · 650 PS · 800 Nm · 0-100 in 2.7s · PCCB',
      description: 'The benchmark of supercar acceleration with Variable Turbine Geometry (VTG), active front spoiler, and 10-piston ceramic brakes.',
      badge: 'Hypercar Killer',
      has3dModel: true,
      rating: 4.99,
      warranty: '3 Years Factory Warranty + 24/7 Roadside Assistance',
      colors: [
        { name: 'Racing Yellow', hex: '#facc15' },
        { name: 'GT Silver', hex: '#cbd5e1' },
        { name: 'Guards Red', hex: '#dc2626' },
        { name: 'Gentian Blue', hex: '#1d4ed8' }
      ],
      metrics: [
        { label: 'Max Power', value: '650 PS (641 HP)' },
        { label: '0–100 km/h', value: '2.7 Seconds Extreme' },
        { label: 'Top Track Speed', value: '330 km/h' },
        { label: 'Peak Torque', value: '800 Nm Massive Torque' }
      ],
      specs: [
        { label: 'Engine', value: '3.8-litre Boxer with twin Variable Turbine Geometry (VTG)' },
        { label: 'Transmission', value: '8-Speed PDK with Launch Control' },
        { label: 'Braking System', value: 'PCCB 420mm ceramic discs with 10-piston yellow calipers' },
        { label: 'Aerodynamics', value: 'Deployable front & rear active spoilers' },
        { label: 'Body Width', value: '1,900 mm wide rear fender hips' }
      ],
      hotspots: [
        { id: 'turbos-pccb', title: '10-Piston PCCB Calipers', subtitle: '420mm ceramic rotors', position: [0.95, -0.3, 0.8], details: 'Fade-resistant carbon ceramic disc brakes that weigh 50% less.', metric: '10-Piston PCCB' }
      ],
      officialSourceUrl: 'https://www.porsche.com/india/models/911/911-turbo-models/911-turbo-s/'
    },
    {
      id: 'car-4',
      showroomId: 'cars',
      name: 'Land Rover Range Rover SV',
      brand: 'Land Rover',
      category: 'Ultra-Luxury Flagship SUV',
      price: 31500000,
      priceFormatted: '₹3.15 Crore',
      tagline: '4.4L Twin-Turbo V8 · 530 PS · Executive Class Rear Suite · 900mm Wading',
      description: 'The pinnacle of bespoke luxury SUV travel with ceramic switchgear, rear executive airline lounge seats, and 1600W Meridian 3D sound.',
      badge: 'Ultra Luxury',
      has3dModel: true,
      rating: 4.94,
      warranty: '5 Years Manufacturer Warranty + 5 Years Complimentary Maintenance Service',
      colors: [
        { name: 'British Racing Green', hex: '#14532d' },
        { name: 'Santorini Black', hex: '#0a0a0a' },
        { name: 'SV Bespoke Flux Silver', hex: '#e2e8f0' }
      ],
      metrics: [
        { label: 'Engine Output', value: '530 PS (523 HP) Twin-Turbo V8' },
        { label: '0–100 km/h', value: '4.6 Seconds' },
        { label: 'Wading Depth', value: '900 mm Water Crossing' },
        { label: 'Audio System', value: '1600W Meridian Signature 35 Speakers' }
      ],
      specs: [
        { label: 'Engine', value: '4.4-litre Twin-Turbocharged V8' },
        { label: 'Torque', value: '750 Nm available from 1800 RPM' },
        { label: 'Suspension', value: 'Electronic Air Suspension with Dynamic Response Pro' },
        { label: 'Steering', value: 'All-Wheel Steering (Rear wheels turn up to 7.3°)' },
        { label: 'Rear Comfort', value: 'SV Signature Suite with motorized table and champagne cooler' }
      ],
      hotspots: [
        { id: 'sv-lounge', title: 'Executive SV Rear Suite', subtitle: '24-way heated & hot stone massage', position: [0, 0.4, -0.4], details: 'Club-class seating with deployable footrest and 13.1" screens.', metric: 'SV Suite' }
      ],
      officialSourceUrl: 'https://www.landrover.in/range-rover/range-rover/sv.html'
    },
    {
      id: 'car-5',
      showroomId: 'cars',
      name: 'BMW X5 xDrive40i M Sport',
      brand: 'BMW',
      category: 'Luxury Performance SUV',
      price: 11200000,
      priceFormatted: '₹1.12 Crore',
      tagline: '3.0L TwinPower Turbo Inline-6 + 48V Mild Hybrid · 381 PS · Curved Display · Sky Lounge',
      description: 'Sports activity vehicle with silky B58 inline-6 engine, 48V mild hybrid boost, illuminated kidney grille, and dual-axle air suspension.',
      badge: 'Sports Activity SUV',
      has3dModel: true,
      rating: 4.88,
      warranty: '3 Years Unlimited Kms Warranty + BMW Service Inclusive Package',
      colors: [
        { name: 'Carbon Black', hex: '#172554' },
        { name: 'Mineral White', hex: '#f8fafc' },
        { name: 'Brooklyn Grey', hex: '#64748b' }
      ],
      metrics: [
        { label: 'Engine Power', value: '381 PS (375 HP)' },
        { label: '0–100 km/h', value: '5.4 Seconds' },
        { label: 'Mild Hybrid', value: '48V e-Boost (12 HP / 200 Nm)' },
        { label: 'Top Speed', value: '250 km/h Electronically Limited' }
      ],
      specs: [
        { label: 'Engine', value: '3.0L BMW TwinPower Turbo Inline 6-Cylinder' },
        { label: 'Transmission', value: '8-Speed Steptronic Sport with Launch Control' },
        { label: 'Cockpit Screen', value: 'BMW Curved Display (12.3" cluster + 14.9" screen)' },
        { label: 'Drivetrain', value: 'xDrive intelligent all-wheel-drive' },
        { label: 'Roof', value: 'Sky Lounge panoramic glass roof with 15,000 light dots' }
      ],
      hotspots: [
        { id: 'x5-grille', title: 'BMW Iconic Glow Grille', subtitle: 'Cascade lighting contour', position: [0, 0, 1.8], details: 'Subtle white LED contour lighting illuminates the twin kidney grille.', metric: 'Iconic Glow' }
      ],
      officialSourceUrl: 'https://www.bmw.in/en/all-models/x-series/X5/2023/bmw-x5-overview.html'
    },
    {
      id: 'car-6',
      showroomId: 'cars',
      name: 'Mercedes-Benz GLE 450d 4MATIC',
      brand: 'Mercedes-Benz',
      category: 'Executive Luxury Diesel SUV',
      price: 11800000,
      priceFormatted: '₹1.18 Crore',
      tagline: '3.0L Inline-6 Turbo Diesel · 367 PS · 750 Nm · AIRMATIC Suspension · Burmester',
      description: 'Effortless cross-country cruising with bulletproof straight-six diesel engine delivering 750 Nm torque and self-leveling AIRMATIC suspension.',
      badge: 'Executive Tourer',
      has3dModel: true,
      rating: 4.89,
      warranty: '3 Years Star Care Warranty + 10-Year Anti-Perforation Warranty',
      colors: [
        { name: 'Obsidian Black', hex: '#0a0a0a' },
        { name: 'Polar White', hex: '#f8fafc' },
        { name: 'Sodalite Blue', hex: '#1e3a8a' }
      ],
      metrics: [
        { label: 'Engine Output', value: '367 PS + 20 PS EQ Boost' },
        { label: 'Peak Torque', value: '750 Nm at 1,350 RPM' },
        { label: '0–100 km/h', value: '5.6 Seconds' },
        { label: 'Towing Capacity', value: '3,500 kg Heavy Load' }
      ],
      specs: [
        { label: 'Engine', value: '3.0-litre Inline 6-Cylinder Turbocharged OM656 Diesel' },
        { label: 'Transmission', value: '9G-TRONIC 9-Speed Automatic' },
        { label: 'Suspension', value: 'AIRMATIC Air Suspension with ADS+' },
        { label: 'Headlamps', value: 'Multibeam LED with 84 individual diodes' },
        { label: 'Audio', value: 'Burmester Surround Sound (13 speakers, 590W)' }
      ],
      hotspots: [
        { id: 'gle-airmatic', title: 'AIRMATIC Air Suspension', subtitle: 'Continuous damping system', position: [0.8, -0.3, 0], details: 'Lowers by 15mm at high speeds; raises 60mm for off-roading.', metric: 'AIRMATIC' }
      ],
      officialSourceUrl: 'https://www.mercedes-benz.co.in/passengercars/models/suv/gle/overview.html'
    },
    {
      id: 'car-7',
      showroomId: 'cars',
      name: 'Toyota Land Cruiser 300 ZX',
      brand: 'Toyota',
      category: 'Legendary Unbreakable 4WD',
      price: 21000000,
      priceFormatted: '₹2.10 Crore',
      tagline: '3.3L Twin-Turbo V6 Diesel · 309 PS · 700 Nm · E-KDSS · Crawl Control',
      description: 'The King of 4WD built on GA-F ladder frame with Electronic Kinetic Dynamic Suspension System (E-KDSS) and multi-terrain monitor.',
      badge: 'King of Off-Road',
      has3dModel: true,
      rating: 4.95,
      warranty: '3 Years / 100,000 km Toyota Standard Warranty + Roadside Assistance',
      colors: [
        { name: 'Precious White Pearl', hex: '#f8fafc' },
        { name: 'Attitude Black', hex: '#0f172a' },
        { name: 'Dark Red Mica', hex: '#7f1d1d' }
      ],
      metrics: [
        { label: 'Engine Torque', value: '700 Nm at 1600 RPM' },
        { label: 'Engine Power', value: '309 PS (304 HP)' },
        { label: 'Drivetrain', value: 'Full-Time 4WD with Torsen LSD' },
        { label: 'Suspension System', value: 'E-KDSS Electronic Kinetic' }
      ],
      specs: [
        { label: 'Engine', value: '3.3-litre Twin-Turbo V6 Diesel' },
        { label: 'Transmission', value: '10-Speed Direct Shift Automatic' },
        { label: 'Chassis', value: 'GA-F body-on-frame 200kg lighter' },
        { label: 'Off-Road Tech', value: 'Crawl Control with 5 presets + Turn Assist' },
        { label: 'Audio & Screen', value: '12.3" Navigation Display with 14-Speaker JBL' }
      ],
      hotspots: [
        { id: 'lc-ekdss', title: 'Electronic E-KDSS Suspension', subtitle: 'Unlocks stabilizer bars off-road', position: [0, -0.4, 0], details: 'Disengages stabilizer bars for extreme wheel articulation.', metric: 'E-KDSS' }
      ],
      officialSourceUrl: 'https://www.toyotabharat.com/showroom/land-cruiser-300/'
    },
    {
      id: 'car-8',
      showroomId: 'cars',
      name: 'Tata Nexon EV Empowered Plus LR',
      brand: 'Tata Motors',
      category: 'India’s #1 Selling Electric SUV',
      price: 1949000,
      priceFormatted: '₹19.49 Lakh',
      tagline: '40.5 kWh High Energy Pack · 465 km ARAI Range · V2V & V2L Power Bank · 12.3" HARMAN',
      description: 'India’s electric leader featuring bidirectional charging (powers home appliances or another EV) and paddle shifters for regen braking.',
      badge: 'EV Best-Seller',
      has3dModel: true,
      rating: 4.83,
      warranty: '8 Years / 160,000 km Battery & Motor Warranty',
      colors: [
        { name: 'Empowered Oxide', hex: '#64748b' },
        { name: 'Intensi-Teal', hex: '#0d9488' },
        { name: 'Pristine White', hex: '#f8fafc' },
        { name: 'Daytona Grey', hex: '#374151' }
      ],
      metrics: [
        { label: 'ARAI Range', value: '465 km Long Range' },
        { label: 'Battery Capacity', value: '40.5 kWh IP67 Liquid-Cooled' },
        { label: '0–100 km/h', value: '8.9 Seconds' },
        { label: 'Fast Charging', value: '10–80% in 56 Mins DC' }
      ],
      specs: [
        { label: 'Electric Motor', value: 'Permanent Magnet Synchronous (145 PS / 215 Nm)' },
        { label: 'Bidirectional Tech', value: 'V2V & V2L power bank up to 3.3 kW' },
        { label: 'Screen', value: '12.3" Cinematic Touchscreen by HARMAN' },
        { label: 'Audio', value: 'JBL 9-Speaker Audio with Subwoofer' },
        { label: 'Regen Braking', value: '4-Level smart paddle shifters' }
      ],
      hotspots: [
        { id: 'nexon-v2l', title: 'V2L Reverse Power Socket', subtitle: 'Power appliances anywhere off-grid', position: [0.85, 0, -1.0], details: 'Supplies up to 3.3 kW AC power directly from the vehicle.', metric: '3.3 kW V2L' }
      ],
      officialSourceUrl: 'https://ev.tatamotors.com/nexon-ev.html'
    },
    {
      id: 'car-9',
      showroomId: 'cars',
      name: 'Mahindra Thar Roxx AX7L 4x4',
      brand: 'Mahindra',
      category: '5-Door Rugged Adventure SUV',
      price: 2249000,
      priceFormatted: '₹22.49 Lakh',
      tagline: '5-Door Iconic Thar · 2.2L mHawk (175 PS / 380 Nm) · Panoramic Skyroof · Level 2 ADAS',
      description: 'The legendary off-roader reborn as a 5-door icon with panoramic skyroof, electronic rear locking diff, and Level 2 ADAS.',
      badge: 'Adventure Legend',
      has3dModel: true,
      rating: 4.87,
      warranty: '3 Years / 100,000 km Warranty + 2 Years Extended Option',
      colors: [
        { name: 'Stealth Black', hex: '#09090b' },
        { name: 'Tango Red', hex: '#b91c1c' },
        { name: 'Everest White', hex: '#f8fafc' },
        { name: 'Deep Forest', hex: '#14532d' }
      ],
      metrics: [
        { label: 'Engine Output', value: '175 PS / 380 Nm mHawk' },
        { label: 'Drivetrain', value: '4XPLOR 4x4 with Electronic Lock' },
        { label: 'Sunroof', value: 'Dual-Pane Panoramic Skyroof' },
        { label: 'Safety Assist', value: 'Level 2 ADAS (10+ Features)' }
      ],
      specs: [
        { label: 'Engine', value: '2.2-litre mHawk CRDe Turbocharged Diesel' },
        { label: 'Transmission', value: '6-Speed Aisin Torque Converter Automatic' },
        { label: 'Suspension', value: 'Pentalink with Watts linkage & FSD dampers' },
        { label: 'Wheels', value: '19" Diamond-Cut Alloy Wheels' },
        { label: 'Wading Ability', value: '650 mm Water Wading Depth' }
      ],
      hotspots: [
        { id: 'tharroxx-skyroof', title: 'Dual-Pane Panoramic Skyroof', subtitle: 'Largest glass roof in its class', position: [0, 0.9, 0], details: 'Acoustic glass roof brings natural daylight to all passengers.', metric: 'Skyroof' }
      ],
      officialSourceUrl: 'https://auto.mahindra.com/suv/thar-roxx'
    },
    {
      id: 'car-10',
      showroomId: 'cars',
      name: 'Mahindra XUV700 AX7 Luxury AWD',
      brand: 'Mahindra',
      category: '7-Seater Premium Tech SUV',
      price: 2599000,
      priceFormatted: '₹25.99 Lakh',
      tagline: '2.2L mHawk (185 PS / 450 Nm) · AWD · Sony 12-Speaker 3D Immersive · Level 2 ADAS',
      description: 'Flagship smart SUV with dual 10.25" curved superscreens, Sony 3D spatial roof speakers, smart flush handles, and Level 2 ADAS.',
      badge: 'Tech Flagship SUV',
      has3dModel: true,
      rating: 4.89,
      warranty: '3 Years / 100,000 km Warranty + 24x7 Roadside Assistance',
      colors: [
        { name: 'Midnight Black', hex: '#0f172a' },
        { name: 'Electric Blue', hex: '#2563eb' },
        { name: 'Dazzling Silver', hex: '#cbd5e1' },
        { name: 'Red Rage', hex: '#dc2626' }
      ],
      metrics: [
        { label: 'Engine Torque', value: '450 Nm at 1750–2800 RPM' },
        { label: 'Peak Power', value: '185 PS (182 HP)' },
        { label: 'Drivetrain', value: 'All-Wheel Drive (AWD)' },
        { label: '3D Audio', value: 'Sony 12-Speaker 3D Surround' }
      ],
      specs: [
        { label: 'Engine', value: '2.2L Turbocharged mHawk Diesel' },
        { label: 'Transmission', value: '6-Speed Automatic with Drive Modes' },
        { label: 'Safety', value: 'Level 2 ADAS + 7 Airbags' },
        { label: 'Seating', value: '7-Seater with 6-way power memory seat' },
        { label: 'Door Handles', value: 'Smart motorized flush handles' }
      ],
      hotspots: [
        { id: 'xuv-sony', title: 'Sony 3D Immersive Sound', subtitle: '12 custom speakers + roof exciters', position: [0, 0.7, 0.2], details: 'Sony Sound with roof-mounted height channels and subwoofer.', metric: 'Sony 3D Sound' }
      ],
      officialSourceUrl: 'https://auto.mahindra.com/suv/xuv700'
    }
  ]
};
