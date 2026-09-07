import { ShowroomItem } from '../../types/salespilot';

export const LAPTOPS_SHOWROOM: ShowroomItem = {
  id: 'laptops',
  name: 'Next-Gen Neural Laptops & AI Workstations',
  category: 'High-Performance Computing & AI Hardware',
  tagline: '50 TOPS Dedicated NPU · 4K Tandem OLED 120Hz · Dual Vapor Chamber Cooling',
  description: 'Explore elite laptops engineered for AI engineering, 3D rendering, and extreme workflows with dedicated NPUs and RTX graphics.',
  badge: 'AI Workstations',
  basePrice: 249990,
  accentColor: '#4f46e5',
  ambientColor: '#1e1b4b',
  recommendedFor: 'AI researchers, software engineers, and creative directors needing workstation compute on the go.',
  voiceTriggers: ['laptop', 'laptops', 'computer', 'macbook', 'workstation', 'xps', 'dell', 'thinkpad', 'rog', 'pc', 'razer', 'surface', 'alienware'],
  specs: [
    { label: 'Neural TOPS', value: 'Up to 50 TOPS Dedicated NPU' },
    { label: 'Display Standard', value: '4K OLED / Tandem OLED 120Hz' },
    { label: 'GPU Options', value: 'RTX 4090 / M3-M4 Max / Intel Arc' },
    { label: 'Memory Range', value: '32 GB – 128 GB LPDDR5X' },
    { label: 'Battery Stamina', value: 'Up to 22 Hours All-Day Use' },
    { label: 'Agora Voice', value: 'Full-Duplex Dual Beamforming Array' }
  ],
  hotspots: [
    {
      id: 'hs-npu',
      title: '50 TOPS Neural NPU',
      subtitle: 'Sub-5ms local LLM inference',
      position: [0, -0.2, 0.2],
      details: 'Hardware matrix multiplication engine for local AI models, real-time voice synthesis, and vision processing.',
      metric: '50 TOPS Neural Compute'
    },
    {
      id: 'hs-display',
      title: '4K Tandem OLED 120Hz',
      subtitle: '1600 Nits HDR Peak Brightness',
      position: [0, 0.7, -0.6],
      details: 'Infinite contrast OLED panel with 100% DCI-P3 color accuracy and factory Delta E < 1 calibration.',
      metric: '1600 Nits Brightness'
    },
    {
      id: 'hs-cooling',
      title: 'MagLev Dual Vapor Chamber',
      subtitle: 'Zero acoustic throttling',
      position: [-0.6, -0.2, -0.2],
      details: 'Whisper-quiet magnetic levitation fans with liquid metal heat dissipation.',
      metric: '0 dB Whisper Mode'
    }
  ],
  products: [
    {
      id: 'laptop-1',
      showroomId: 'laptops',
      name: 'Dell XPS 16',
      brand: 'Dell',
      category: 'Premium / Creator Laptop',
      price: 249990,
      priceFormatted: '₹2,49,990',
      tagline: '16" 2K InfinityEdge · Intel Core Ultra 7 · Intel AI Boost NPU',
      description: 'CNC aluminum body engineered for AI workloads, content creators, and developers with Dolby Vision.',
      badge: 'Creator Choice',
      has3dModel: true,
      rating: 4.8,
      warranty: '3 Years Premium On-Site + Accidental Damage Support',
      colors: [{ name: 'Platinum Silver', hex: '#e2e8f0' }, { name: 'Graphite Black', hex: '#1e293b' }],
      metrics: [
        { label: 'Sustained Power', value: '65W TDP' },
        { label: 'Display Panel', value: '16" 2K 120Hz InfinityEdge' },
        { label: 'NPU Engine', value: 'Intel AI Boost' },
        { label: 'Memory', value: 'Up to 64 GB LPDDR5X' }
      ],
      specs: [
        { label: 'Processor', value: 'Intel Core Ultra 7 155H (16 cores, up to 4.8 GHz)' },
        { label: 'Graphics', value: 'Intel Arc Graphics' },
        { label: 'Storage', value: '1 TB PCIe Gen4 NVMe SSD' },
        { label: 'Display Brightness', value: '500 nits, Anti-glare' },
        { label: 'Refresh Rate', value: '1–120 Hz Variable' },
        { label: 'Weight', value: '2.13 kg (4.7 lbs)' },
        { label: 'OS', value: 'Windows 11 Pro' }
      ],
      hotspots: [
        { id: 'xps-npu', title: 'Intel AI Boost NPU', subtitle: 'Real-time AI acceleration', position: [0.3, -0.2, 0.3], details: 'Dedicated neural coprocessor for live noise cancellation and local copilot tasks.', metric: 'Integrated NPU' },
        { id: 'xps-screen', title: 'InfinityEdge 120Hz', subtitle: '500 nits Dolby Vision', position: [0, 0.7, -0.5], details: 'Border-less 4-sided InfinityEdge panel with Gorilla Glass 3.', metric: '120Hz VRR' }
      ],
      officialSourceUrl: 'https://www.dell.com/en-in/shop/laptop-notebook-computers/xps-16-laptop-2026/spd/xps-da16260-laptop'
    },
    {
      id: 'laptop-2',
      showroomId: 'laptops',
      name: 'Dell XPS 16 9640',
      brand: 'Dell',
      category: 'Creator / Studio Performance',
      price: 289990,
      priceFormatted: '₹2,89,990',
      tagline: '16.3" 4K OLED Touch · RTX 4070 Ada · 32GB RAM · Dual Vapor Chamber',
      description: 'The pinnacle of Windows creator laptops with up to 3840x2400 OLED touch panel and NVIDIA RTX 4070.',
      badge: 'Studio Flagship',
      has3dModel: true,
      rating: 4.9,
      warranty: '3 Years ProSupport Plus with 24/7 Priority Tech Dispatch',
      colors: [{ name: 'Platinum Silver', hex: '#cbd5e1' }, { name: 'Graphite', hex: '#334155' }],
      metrics: [
        { label: 'Dedicated GPU', value: 'NVIDIA RTX 4070 8GB GDDR6' },
        { label: 'Screen Resolution', value: '16.3" 3.8K (3840×2400) OLED Touch' },
        { label: 'RAM', value: '32 GB LPDDR5X-7467' },
        { label: 'Battery Capacity', value: '99.5 Whr Max Airline Allowed' }
      ],
      specs: [
        { label: 'Processor', value: 'Intel Core Ultra 7 155H / Ultra 9 185H' },
        { label: 'GPU Options', value: 'RTX 4050 / RTX 4060 / RTX 4070' },
        { label: 'Display', value: 'OLED Touch, 100% DCI-P3, 400 nits' },
        { label: 'Storage', value: '2 TB PCIe Gen4 SSD' },
        { label: 'Ports', value: '3x Thunderbolt 4 (USB-C), MicroSD' },
        { label: 'Touchpad', value: 'Seamless glass haptic touchpad' }
      ],
      hotspots: [
        { id: 'xps-rtx', title: 'RTX 4070 Studio Graphics', subtitle: 'AI-accelerated ray tracing', position: [-0.4, -0.2, 0.2], details: 'Accelerates Blender, DaVinci Resolve, and PyTorch training.', metric: 'RTX 4070 8GB' }
      ],
      officialSourceUrl: 'https://www.dell.com/en-in/shop/dell-laptops/xps-16-laptop/spd/xps-16-9640-laptop'
    },
    {
      id: 'laptop-3',
      showroomId: 'laptops',
      name: 'Apple MacBook Pro 16',
      brand: 'Apple',
      category: 'Pro Creative & Neural Engineering',
      price: 349900,
      priceFormatted: '₹3,49,900',
      tagline: 'M3/M4 Max (16-Core CPU, 40-Core GPU) · 16.2" Liquid Retina XDR · 22h Battery',
      description: 'Extreme workstation performance with unified memory architecture, hardware ray tracing, and 1600 nits display.',
      badge: 'Apple Silicon',
      has3dModel: true,
      rating: 4.95,
      warranty: 'AppleCare+ 3 Years Global Coverage with Unlimited Incident Protection',
      colors: [{ name: 'Space Black', hex: '#1c1c1e' }, { name: 'Silver', hex: '#e3e4e6' }],
      metrics: [
        { label: 'Silicon SoC', value: 'M3 / M4 Max 16-Core CPU' },
        { label: 'GPU Cores', value: '40-Core GPU with Ray Tracing' },
        { label: 'Peak Brightness', value: '1600 Nits Liquid Retina XDR' },
        { label: 'Battery Life', value: '22 Hours All-Day Stamina' }
      ],
      specs: [
        { label: 'Unified Memory', value: '48 GB Unified Memory (Up to 128 GB)' },
        { label: 'Storage', value: '1 TB High-Speed SSD (Up to 8 TB)' },
        { label: 'Display', value: '16.2" Liquid Retina XDR (3456×2234), 120Hz' },
        { label: 'Audio', value: 'Six-speaker sound system with spatial audio' },
        { label: 'Neural Engine', value: '16-Core Neural Engine (38 TOPS)' },
        { label: 'Ports', value: '3x Thunderbolt 4, HDMI 2.1, SDXC slot, MagSafe 3' }
      ],
      hotspots: [
        { id: 'mbp-chip', title: 'M3/M4 Max Unified SoC', subtitle: '400 GB/s memory bandwidth', position: [0, -0.2, 0], details: 'Runs 70-billion parameter LLMs directly in unified RAM without thermal throttling.', metric: '400 GB/s Bandwidth' }
      ],
      officialSourceUrl: 'https://www.apple.com/in/macbook-pro/'
    },
    {
      id: 'laptop-4',
      showroomId: 'laptops',
      name: 'ASUS ROG Zephyrus G14',
      brand: 'ASUS ROG',
      category: 'Ultraportable AI Gaming & Studio',
      price: 189990,
      priceFormatted: '₹1,89,990',
      tagline: '14" 3K 120Hz ROG Nebula OLED · AMD Ryzen 9 8945HS · RTX 4070 · 1.50kg',
      description: 'Ultra-sleek all-aluminum unibody gaming notebook with Slash Lighting and 0.2ms OLED response time.',
      badge: 'Esports & Studio',
      has3dModel: true,
      rating: 4.85,
      warranty: '2 Years Comprehensive ASUS Rog Protection + 1 Year Accidental Damage',
      colors: [{ name: 'Eclipse Gray', hex: '#374151' }, { name: 'Platinum White', hex: '#f8fafc' }],
      metrics: [
        { label: 'Chassis Weight', value: '1.50 kg Ultra-Light' },
        { label: 'Display Specs', value: '14" 3K (2880×1800) OLED 120Hz' },
        { label: 'Response Time', value: '0.2 ms Ultra-Fast' },
        { label: 'GPU TDP', value: 'NVIDIA RTX 4070 90W' }
      ],
      specs: [
        { label: 'Processor', value: 'AMD Ryzen 9 8945HS (8 cores, 16 threads, 5.2 GHz)' },
        { label: 'NPU Engine', value: 'AMD Ryzen AI 39 TOPS Total' },
        { label: 'Memory', value: '32 GB LPDDR5X-6400' },
        { label: 'Storage', value: '1 TB PCIe 4.0 NVMe SSD' },
        { label: 'Keyboard', value: '1.7mm travel with single-zone RGB' },
        { label: 'Lid Feature', value: 'Customizable Slash Lighting array' }
      ],
      hotspots: [
        { id: 'rog-oled', title: 'ROG Nebula 3K OLED Display', subtitle: '100% DCI-P3 Color Accuracy', position: [0, 0.6, -0.4], details: 'G-SYNC certified OLED panel with 500 nits peak brightness.', metric: '3K 120Hz OLED' }
      ],
      officialSourceUrl: 'https://rog.asus.com/in/laptops/rog-zephyrus/rog-zephyrus-g14-2024/'
    },
    {
      id: 'laptop-5',
      showroomId: 'laptops',
      name: 'Lenovo ThinkPad X1 Carbon Gen 12',
      brand: 'Lenovo',
      category: 'Enterprise Executive Ultrabook',
      price: 215000,
      priceFormatted: '₹2,15,000',
      tagline: '1.09 kg Carbon Fiber · 14" 2.8K OLED 120Hz · Intel Core Ultra 7 155H · 5G Sub-6',
      description: 'The definitive enterprise business laptop constructed with aerospace carbon fiber and recycled magnesium.',
      badge: 'Enterprise Standard',
      has3dModel: true,
      rating: 4.88,
      warranty: '3 Years Premier Support Onsite + International Warranty Service',
      colors: [{ name: 'Deep Black Carbon', hex: '#0f172a' }],
      metrics: [
        { label: 'Weight', value: '1.09 kg Featherlight' },
        { label: 'Display', value: '14" 2.8K OLED 120Hz Touch' },
        { label: 'Security', value: 'dTPM 2.0 + Match-on-Chip Bio' },
        { label: 'Battery Runtime', value: '19 Hours Enterprise Life' }
      ],
      specs: [
        { label: 'Processor', value: 'Intel Core Ultra 7 155H (16 Cores, NPU onboard)' },
        { label: 'RAM', value: '32 GB LPDDR5X-7500 soldered' },
        { label: 'Storage', value: '1 TB Opal 2.0 PCIe Gen4 SSD' },
        { label: 'Camera', value: '8MP MIPI Communications Bar with Computer Vision' },
        { label: 'Durability', value: 'MIL-STD-810H Military Spec 26 Procedures' },
        { label: 'Connectivity', value: 'Wi-Fi 7 + Optional 5G LTE SIM' }
      ],
      hotspots: [
        { id: 'x1-bar', title: 'Communications Bar & Dual Mic', subtitle: 'Beamforming noise-cancellation', position: [0, 0.9, -0.6], details: 'Integrated 8MP sensor with IR human presence detection.', metric: '8MP AI Bar' }
      ],
      officialSourceUrl: 'https://www.lenovo.com/in/en/p/laptops/thinkpad/thinkpadx1/thinkpad-x1-carbon-gen-12-(14-inch-intel)/len101t0083'
    },
    {
      id: 'laptop-6',
      showroomId: 'laptops',
      name: 'HP Spectre x360 16 2-in-1',
      brand: 'HP',
      category: 'Convertible Creative Flagship',
      price: 179990,
      priceFormatted: '₹1,79,990',
      tagline: '360° Foldable Hinge · 16" 2.8K OLED Touch 120Hz · RTX 4050 · 9MP AI Camera',
      description: 'Transforms from high-performance laptop to creative drafting tablet with 4096-level pressure tilt pen.',
      badge: 'Convertible 2-in-1',
      has3dModel: true,
      rating: 4.78,
      warranty: '2 Years Comprehensive HP Onsite Warranty + Stylus Cover',
      colors: [{ name: 'Nightfall Black with Brass Accents', hex: '#18181b' }, { name: 'Slate Blue', hex: '#1e3a8a' }],
      metrics: [
        { label: 'Form Factor', value: '360° Convertible Tablet / Laptop' },
        { label: 'Display Panel', value: '16" 2.8K (2880×1800) OLED Touch' },
        { label: 'Camera Sensor', value: '9MP AI Auto-Framing Sensor' },
        { label: 'Dedicated GPU', value: 'NVIDIA RTX 4050 6GB' }
      ],
      specs: [
        { label: 'Processor', value: 'Intel Core Ultra 7 155H' },
        { label: 'RAM', value: '32 GB LPDDR5X-6400' },
        { label: 'Storage', value: '2 TB PCIe Gen4 NVMe M.2 SSD' },
        { label: 'Audio', value: 'Poly Studio Quad Speakers with DTS:X Ultra' },
        { label: 'Stylus', value: 'HP Rechargeable MPP 2.0 Tilt Pen included' },
        { label: 'Fast Charge', value: '50% charge in 30 minutes' }
      ],
      hotspots: [
        { id: 'spectre-hinge', title: 'Gem-Cut 360° Steel Hinge', subtitle: 'Dual-torque hinge mechanism', position: [0, -0.25, -0.7], details: 'Enables tent, stand, tablet, and traditional laptop modes.', metric: '360° Rotation' }
      ],
      officialSourceUrl: 'https://www.hp.com/in-en/shop/laptops-tablets/spectre.html'
    },
    {
      id: 'laptop-7',
      showroomId: 'laptops',
      name: 'Razer Blade 16',
      brand: 'Razer',
      category: 'Elite Gaming & Unreal Engine Dev',
      price: 399990,
      priceFormatted: '₹399,990',
      tagline: 'World’s 1st Dual-Mode Mini-LED (4K 120Hz / FHD 240Hz) · RTX 4090 (175W) · i9-14900HX',
      description: 'Desktop replacement in unibody CNC aluminum with switchable native 4K 120Hz and 240Hz modes.',
      badge: 'Apex Performance',
      has3dModel: true,
      rating: 4.92,
      warranty: '2 Years Manufacturer + 2 Years Free Battery Replacement Guarantee',
      colors: [{ name: 'Anodized Matte Black', hex: '#111827' }, { name: 'Mercury White', hex: '#f3f4f6' }],
      metrics: [
        { label: 'GPU TGP', value: 'RTX 4090 16GB at 175W Max' },
        { label: 'Dual-Mode Display', value: '4K 120Hz (UHD) / 240Hz (FHD)' },
        { label: 'Mini-LED Zones', value: '1,024 Local Dimming Zones' },
        { label: 'Peak Nits', value: '1,000 Nits HDR Peak' }
      ],
      specs: [
        { label: 'CPU', value: 'Intel Core i9-14900HX (24 Cores, 32 Threads, 5.8 GHz)' },
        { label: 'Memory', value: '32 GB DDR5-5600 MHz (Upgradable to 96 GB)' },
        { label: 'Storage', value: '2 TB PCIe 4.0 NVMe SSD (Dual M.2 slots)' },
        { label: 'Cooling', value: 'Patented Vacuum-Sealed Copper Vapor Chamber' },
        { label: 'Keyboard', value: 'Per-key Razer Chroma RGB Anti-Ghosting' },
        { label: 'Audio', value: '4-Speaker Array with 2 Smart Amps (THX Spatial Audio)' }
      ],
      hotspots: [
        { id: 'blade-miniled', title: 'Dual-Mode Mini-LED Screen', subtitle: 'Instant resolution / refresh switch', position: [0, 0.7, -0.6], details: 'Switch between 4K 120Hz and fluid 240Hz for gaming.', metric: 'Dual Mode 4K/240Hz' }
      ],
      officialSourceUrl: 'https://www.razer.com/gaming-laptops/razer-blade-16'
    },
    {
      id: 'laptop-8',
      showroomId: 'laptops',
      name: 'Microsoft Surface Laptop 7 Copilot+ PC',
      brand: 'Microsoft',
      category: 'Next-Gen Copilot+ AI PC',
      price: 154999,
      priceFormatted: '₹1,54,999',
      tagline: 'Snapdragon X Elite 12-Core · 45 TOPS Hexagon NPU · 15" PixelSense 120Hz · 22h Battery',
      description: 'Engineered specifically for autonomous AI workflows with dedicated Copilot key and all-day battery.',
      badge: 'Copilot+ AI PC',
      has3dModel: true,
      rating: 4.82,
      warranty: '2 Years Microsoft Hardware Warranty + 90 Days Tech Support',
      colors: [{ name: 'Sapphire Blue', hex: '#2563eb' }, { name: 'Dune Sand', hex: '#d97706' }, { name: 'Platinum', hex: '#e2e8f0' }, { name: 'Black', hex: '#09090b' }],
      metrics: [
        { label: 'AI NPU TOPS', value: '45 TOPS Qualcomm Hexagon' },
        { label: 'Processor', value: 'Snapdragon X Elite (12 Cores)' },
        { label: 'Battery Runtime', value: '22 Hours Video Playback' },
        { label: 'Display Refresh', value: '15" PixelSense 120Hz HDR' }
      ],
      specs: [
        { label: 'RAM', value: '32 GB LPDDR5X' },
        { label: 'Storage', value: '1 TB Removable Gen4 SSD' },
        { label: 'Display Resolution', value: '2496 × 1664 (3:2 Aspect Ratio), Touchscreen' },
        { label: 'Trackpad', value: 'Haptic Precision Glass Touchpad' },
        { label: 'Camera', value: 'Full HD 1080p Studio Camera with Windows Studio Effects' },
        { label: 'Ports', value: '2x USB4 / Thunderbolt 4, Surface Connect' }
      ],
      hotspots: [
        { id: 'surface-npu', title: '45 TOPS Hexagon NPU', subtitle: 'Local speech and vision acceleration', position: [0.5, -0.2, 0.4], details: 'Powers live multi-language captioning and instant local voice search.', metric: '45 TOPS NPU' }
      ],
      officialSourceUrl: 'https://www.microsoft.com/en-in/surface/devices/surface-laptop-7th-edition'
    },
    {
      id: 'laptop-9',
      showroomId: 'laptops',
      name: 'Acer Predator Helios 16',
      brand: 'Acer Predator',
      category: 'Extreme Esports & 3D Simulation',
      price: 229990,
      priceFormatted: '₹2,29,990',
      tagline: '16" WQXGA 240Hz 500 nits · Intel Core i9-14900HX · RTX 4080 (175W) · Liquid Metal',
      description: 'Extreme gaming power with 5th Gen AeroBlade 3D metal fans, liquid metal thermal compound, and 240Hz display.',
      badge: 'Hardcore Esports',
      has3dModel: true,
      rating: 4.79,
      warranty: '2 Years Comprehensive Onsite Predator Protection + 1 Year International Traveler Warranty',
      colors: [{ name: 'Abyssal Black with RGB Infinity Mirror', hex: '#020617' }],
      metrics: [
        { label: 'GPU Subsystem', value: 'RTX 4080 12GB (175W Max MGP)' },
        { label: 'Display Refresh', value: '16" 240Hz WQXGA (2560×1600)' },
        { label: 'Response Time', value: '3ms Overdrive G-SYNC' },
        { label: 'Cooling Fans', value: 'Dual 5th Gen AeroBlade 3D Metal' }
      ],
      specs: [
        { label: 'Processor', value: 'Intel Core i9-14900HX (24 Cores, 32 Threads)' },
        { label: 'RAM', value: '32 GB DDR5-5600 MHz Dual Channel' },
        { label: 'Storage', value: '2 TB PCIe Gen4 NVMe SSD in RAID 0' },
        { label: 'Thermal Interface', value: 'Liquid Metal on CPU & GPU' },
        { label: 'Networking', value: 'Killer Wi-Fi 7 + Killer Ethernet E3100G (2.5G)' },
        { label: 'Audio', value: 'DTS:X Ultra Audio with Smart Amplifier' }
      ],
      hotspots: [
        { id: 'helios-fans', title: '5th Gen AeroBlade 3D Fans', subtitle: 'Bionic 0.08mm blade airflow', position: [-0.6, -0.2, -0.3], details: 'Custom engineered bionic metal fan blades boost airflow by 55%.', metric: '+55% Airflow' }
      ],
      officialSourceUrl: 'https://www.acer.com/in-en/predator/laptops/helios/helios-16'
    },
    {
      id: 'laptop-10',
      showroomId: 'laptops',
      name: 'Alienware m16 R2',
      brand: 'Dell Alienware',
      category: 'Stealth Tactical Performance',
      price: 212990,
      priceFormatted: '₹2,12,990',
      tagline: 'Intel Core Ultra 9 185H · RTX 4070 · 16" QHD+ 240Hz · Stealth Mode Hotkey',
      description: 'Redesigned for 15% smaller footprint, featuring Cryo-tech cooling and an intuitive Stealth Mode hotkey.',
      badge: 'Stealth Power',
      has3dModel: true,
      rating: 4.83,
      warranty: '3 Years Alienware Premium Support + Accidental Damage Protection',
      colors: [{ name: 'Dark Metallic Moon', hex: '#1f2937' }],
      metrics: [
        { label: 'Stealth Mode', value: 'One-touch F2 Acoustic Quiet Key' },
        { label: 'Screen', value: '16" QHD+ (2560×1600) 240Hz 3ms' },
        { label: 'Processor', value: 'Intel Core Ultra 9 185H 16-Core' },
        { label: 'GPU', value: 'NVIDIA RTX 4070 8GB GDDR6' }
      ],
      specs: [
        { label: 'RAM', value: '32 GB DDR5-5600 MHz' },
        { label: 'Storage', value: '1 TB PCIe M.2 SSD' },
        { label: 'Keyboard', value: 'AlienFX 1-Zone RGB' },
        { label: 'Thermal Architecture', value: 'Cryo-tech cooling with quad heat pipes and dual fans' },
        { label: 'Lighting', value: 'Rear stadium lighting loop with micro-LEDs' },
        { label: 'OS', value: 'Windows 11 Home / Pro' }
      ],
      hotspots: [
        { id: 'alienware-stadium', title: 'Rear Stadium Lighting Ring', subtitle: 'Iconic AlienFX illumination', position: [0, -0.15, -0.8], details: 'Rear hexagonal exhaust array surrounded by customizable AlienFX stadium lighting.', metric: 'AlienFX Ring' }
      ],
      officialSourceUrl: 'https://www.dell.com/en-in/shop/gaming-laptops/alienware-m16-r2-gaming-laptop/spd/alienware-m16-r2-laptops'
    }
  ]
};
