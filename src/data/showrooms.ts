import { ShowroomItem, ShowroomId } from '../types/salespilot';

export const SHOWROOMS_DATA: Record<ShowroomId, ShowroomItem> = {
  bike: {
    id: 'bike',
    name: 'Apex Cyber-Pulse Electric Superbike (Veloce 800)',
    category: 'Next-Gen Mobility & Electric Vehicles',
    tagline: 'Dual 85kW Motor · 220-Mile Solid-State Range · Agora Smart Helmet Voice OS',
    description: 'Aerodynamic electric superbike engineered with aircraft-grade carbon monocoque, dual regenerative braking hubs, and integrated Agora voice navigation that cancels 120km/h wind noise.',
    badge: 'EV Superbike',
    basePrice: 480000,
    accentColor: '#06b6d4', // Cyan
    ambientColor: '#083344',
    recommendedFor: 'Fleet operators, luxury moto-sport teams, and urban mobility commuters seeking zero emissions with extreme performance.',
    voiceTriggers: ['bike', 'superbike', 'motorcycle', 'ebike', 'veloce', 'two wheeler', 'ev', 'vehicle', 'ride'],
    specs: [
      { label: 'Peak Power', value: '85 kW (114 HP)' },
      { label: '0-60 mph', value: '2.6 Seconds' },
      { label: 'Battery Capacity', value: '14.4 kWh Solid-State' },
      { label: 'Max Range', value: '220 Miles (354 km)' },
      { label: 'Fast Charging', value: '18 Mins to 80%' },
      { label: 'Voice OS', value: 'Agora Full-Duplex Noise-Cancellation' },
    ],
    hotspots: [
      {
        id: 'hs-motor',
        title: 'Liquid-Cooled 85kW Motor',
        subtitle: 'Sub-2.6s 0-60 Acceleration',
        position: [0, -0.2, 0],
        details: 'High-torque permanent magnet motor with dual inverter vector control and carbon-wrapped rotor delivering 190 Nm torque.',
        metric: '85 kW Peak Power',
      },
      {
        id: 'hs-battery',
        title: '14.4 kWh Solid-State Battery',
        subtitle: 'Ultra-dense energy storage',
        position: [0, 0.2, 0],
        details: 'Non-flammable solid electrolyte cell architecture offering 400 Wh/kg specific energy and 18-minute 350kW DC fast charging.',
        metric: '220 Mile Range',
      },
      {
        id: 'hs-voice-cockpit',
        title: 'Agora Smart Cockpit Audio Hub',
        subtitle: 'Real-time wind cancellation',
        position: [0.7, 0.7, 0],
        details: 'Integrated beamforming microphones and helmet intercom linking directly through Agora SD-RTN for hands-free autonomous negotiation and telematics.',
        metric: '< 25ms Voice Latency',
      },
    ],
  },

  laptop: {
    id: 'laptop',
    name: 'AeroBook Ultra X16 Neural Laptop',
    category: 'AI Workstation & High-Performance Computing',
    tagline: '50 TOPS NPU · 4K Tandem OLED 120Hz · Dual Vapor Chamber Cooling',
    description: 'Ultra-thin magnesium alloy chassis powered by a 50 TOPS neural accelerator, capable of running local quantized LLMs at sub-5ms latency with 22-hour battery life.',
    badge: 'Pro AI Laptop',
    basePrice: 165000,
    accentColor: '#4f46e5', // Indigo
    ambientColor: '#1e1b4b',
    recommendedFor: 'Software engineers, AI researchers, creative studios, and enterprise power users demanding desktop performance on the go.',
    voiceTriggers: ['laptop', 'aerobook', 'computer', 'pc', 'notebook', 'macbook', 'workstation', 'display', 'screen'],
    specs: [
      { label: 'Neural Engine', value: '50 TOPS Dedicated NPU' },
      { label: 'Display', value: '16" 4K Tandem OLED 120Hz' },
      { label: 'Memory', value: '64 GB LPDDR5X-8533' },
      { label: 'Storage', value: '2 TB PCIe Gen5 SSD' },
      { label: 'Battery Life', value: '22 Hours Productivity' },
      { label: 'Weight', value: '1.42 kg (3.13 lbs)' },
    ],
    hotspots: [
      {
        id: 'hs-npu',
        title: 'Neural NPU 50 TOPS AI Accelerator',
        subtitle: 'Sub-5ms local inference',
        position: [0, -0.2, 0.2],
        details: 'Hardware matrix multiplication engine optimized for local voice synthesis, real-time transcription, and offline quantized reasoning.',
        metric: '50 TOPS Neural Compute',
      },
      {
        id: 'hs-display',
        title: '4K Tandem OLED 120Hz Display',
        subtitle: '1600 Nits HDR Peak',
        position: [0, 0.7, -0.6],
        details: 'Dual-layer OLED panel delivering true black contrast, 1,000,000:1 dynamic range, and 100% DCI-P3 color reproduction.',
        metric: '1600 Nits Brightness',
      },
      {
        id: 'hs-vapor',
        title: 'MagLev Dual Vapor Chamber Cooling',
        subtitle: 'Zero acoustic throttling',
        position: [-0.6, -0.2, -0.2],
        details: 'Whisper-quiet magnetic levitation fans maintaining full 65W thermal dissipation without acoustic distraction in meeting rooms.',
        metric: '0 dB Silent Operation',
      },
    ],
  },

  appliances: {
    id: 'appliances',
    name: 'SmartVision Neo Multi-Door AI Refrigerator',
    category: 'Smart Home Appliances & Connected Kitchen Hub',
    tagline: '29" Transparent OLED Display · Voice Inventory · AI Twin Chill Cooling',
    description: 'Luxury 4-door smart refrigerator featuring voice-controlled grocery restocking, internal computer vision inventory tracking, and triple-inverter humidity balancing.',
    badge: 'Smart Living',
    basePrice: 125000,
    accentColor: '#10b981', // Emerald
    ambientColor: '#064e3b',
    recommendedFor: 'Modern smart households, luxury residential projects, and hospitality suites desiring an intelligent voice-managed culinary assistant.',
    voiceTriggers: ['appliance', 'appliances', 'fridge', 'refrigerator', 'kitchen', 'home', 'freezer', 'cooling', 'food'],
    specs: [
      { label: 'Net Capacity', value: '680 Litres (24 cu.ft)' },
      { label: 'Display Door', value: '29" Transparent OLED Touch' },
      { label: 'Cooling Engine', value: 'Twin Inverter Dual Chill' },
      { label: 'Internal Cameras', value: '3x Ultra-Wide Inventory Vision' },
      { label: 'Energy Rating', value: '5-Star BEE / A+++ Global' },
      { label: 'Voice Protocol', value: 'Agora Conversational AI Assistant' },
    ],
    hotspots: [
      {
        id: 'hs-screen',
        title: '29" Transparent SmartVision OLED Hub',
        subtitle: 'Voice-directed grocery pantry',
        position: [0.4, 0.5, 0.6],
        details: 'Knock twice or speak to see inside without releasing cold air; order groceries, manage recipes, and control smart home appliances.',
        metric: '29" Transparent Touch',
      },
      {
        id: 'hs-cooling',
        title: 'Multi-Zone AI Twin Chill Cooling',
        subtitle: 'Precise thermal compartmentalization',
        position: [-0.4, 0.3, 0.4],
        details: 'Independent evaporator loops maintain 70% humidity in the crisper while freezing meat at -24°C with zero odor cross-contamination.',
        metric: '±0.2°C Precision',
      },
      {
        id: 'hs-compressor',
        title: 'Zero-Noise Hydro-Compressor',
        subtitle: 'Linear variable displacement',
        position: [0, -0.8, -0.4],
        details: 'Magnetic linear compressor delivering 35% greater energy efficiency and virtually silent 28 dBA kitchen operation.',
        metric: 'A+++ Energy Efficiency',
      },
    ],
  },
};

export const SHOWROOM_KEYS: ShowroomId[] = ['bike', 'laptop', 'appliances'];
