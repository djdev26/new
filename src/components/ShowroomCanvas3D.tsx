import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShowroomItem, ShowroomHotspot } from '../types/salespilot';
import {
  RotateCcw,
  Sparkles,
  Maximize2,
  Box,
  Layers,
  Volume2,
  Activity,
  Info,
  Zap,
} from 'lucide-react';

interface ShowroomCanvas3DProps {
  showroom: ShowroomItem;
  activeHotspotId?: string | null;
  onSelectHotspot?: (hotspot: ShowroomHotspot | null) => void;
  isAudioActive?: boolean;
  audioLevel?: number;
  isAiSpeaking?: boolean;
}

export const ShowroomCanvas3D: React.FC<ShowroomCanvas3DProps> = ({
  showroom,
  activeHotspotId,
  onSelectHotspot,
  isAudioActive = false,
  audioLevel = 0,
  isAiSpeaking = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<ShowroomHotspot | null>(null);

  useEffect(() => {
    if (activeHotspotId) {
      const found = showroom.hotspots.find((h) => h.id === activeHotspotId);
      if (found) setSelectedHotspot(found);
    }
  }, [activeHotspotId, showroom]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const dynamicMeshesRef = useRef<{
    wheels?: THREE.Mesh[];
    screenMesh?: THREE.Mesh;
    fans?: THREE.Mesh[];
    motorGlow?: THREE.Mesh;
    compressorGlow?: THREE.Mesh;
    dspCore?: THREE.Mesh;
  }>({});

  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraRotRef = useRef({ x: 0.25, y: -0.6, radius: 4.8 });
  const targetCameraRotRef = useRef({ x: 0.25, y: -0.6, radius: 4.8 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(new THREE.Color(showroom.accentColor), 1.6);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const gridHelper = new THREE.GridHelper(8, 20, new THREE.Color(showroom.accentColor).getHex(), 0xcbd5e1);
    gridHelper.position.y = -1.2;
    (gridHelper.material as THREE.Material).opacity = 0.4;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    const floorGeo = new THREE.CircleGeometry(3.6, 64);
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.21;
    scene.add(floor);

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      targetCameraRotRef.current.y -= deltaX * 0.008;
      targetCameraRotRef.current.x = Math.max(
        -Math.PI / 4,
        Math.min(Math.PI / 2.5, targetCameraRotRef.current.x + deltaY * 0.008)
      );
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCameraRotRef.current.radius = Math.max(
        2.2,
        Math.min(7.0, targetCameraRotRef.current.radius + e.deltaY * 0.004)
      );
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    let clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      cameraRotRef.current.x += (targetCameraRotRef.current.x - cameraRotRef.current.x) * 0.1;
      cameraRotRef.current.y += (targetCameraRotRef.current.y - cameraRotRef.current.y) * 0.1;
      cameraRotRef.current.radius += (targetCameraRotRef.current.radius - cameraRotRef.current.radius) * 0.1;

      if (autoRotate && !isDraggingRef.current) {
        targetCameraRotRef.current.y += 0.006;
      }

      const cx = cameraRotRef.current.radius * Math.sin(cameraRotRef.current.y) * Math.cos(cameraRotRef.current.x);
      const cy = cameraRotRef.current.radius * Math.sin(cameraRotRef.current.x) + 0.3;
      const cz = cameraRotRef.current.radius * Math.cos(cameraRotRef.current.y) * Math.cos(cameraRotRef.current.x);
      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 0, 0);

      const dynamicMeshes = dynamicMeshesRef.current;
      const speechIntensity = isAiSpeaking ? 2.0 : isAudioActive ? 1.3 : 0.5;
      const audioPulse = audioLevel ? Math.sin(elapsed * 12) * (audioLevel / 50) : 0;

      // 1. Bike wheels spinning
      if (dynamicMeshes.wheels) {
        dynamicMeshes.wheels.forEach((w) => {
          w.rotation.z -= (4 + speechIntensity * 6) * delta;
        });
      }

      // 2. Motor pulse
      if (dynamicMeshes.motorGlow) {
        const s = 1 + Math.sin(elapsed * 6) * 0.08 + audioPulse * 0.12;
        dynamicMeshes.motorGlow.scale.set(s, s, s);
      }

      // 3. Laptop screen glow shimmer
      if (dynamicMeshes.screenMesh) {
        const mat = dynamicMeshes.screenMesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.emissiveIntensity = 0.4 + Math.sin(elapsed * 4) * 0.15 + (isAiSpeaking ? 0.3 : 0);
        }
      }

      // 4. Server fans
      if (dynamicMeshes.fans) {
        dynamicMeshes.fans.forEach((f) => {
          f.rotation.z += 16 * speechIntensity * delta;
        });
      }

      // 5. Server DSP core pulse
      if (dynamicMeshes.dspCore) {
        const s = 1 + Math.sin(elapsed * 5) * 0.05 + audioPulse * 0.1;
        dynamicMeshes.dspCore.scale.set(s, s, s);
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      renderer.dispose();
    };
  }, []);

  // Rebuild 3D Model on showroom change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (modelGroupRef.current) {
      scene.remove(modelGroupRef.current);
      modelGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
    }

    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    dynamicMeshesRef.current = {};

    const accentColor = new THREE.Color(showroom.accentColor);

    switch (showroom.id) {
      case 'cars':
        buildSportsCar(modelGroup, accentColor, wireframeMode);
        break;
      case 'laptops':
        buildNeuralLaptop(modelGroup, accentColor, wireframeMode);
        break;
      case 'phones':
        buildTitaniumSmartphone(modelGroup, accentColor, wireframeMode);
        break;
      case 'appliances':
      default:
        buildSmartRefrigerator(modelGroup, accentColor, wireframeMode);
        break;
    }

    scene.add(modelGroup);
    targetCameraRotRef.current = { x: 0.25, y: -0.6, radius: 4.8 };
  }, [showroom.id, wireframeMode]);

  // Model Builder 1: Performance Sports Car (Porsche 911 / Luxury SUV)
  const buildSportsCar = (group: THREE.Group, accentColor: THREE.Color, wireframe: boolean) => {
    const wheelList: THREE.Mesh[] = [];

    // Main Sleek Sports Car Body (Chassis)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      metalness: 0.9,
      roughness: 0.15,
      wireframe,
    });

    // Lower Chassis Floor & Diffuser
    const chassisGeo = new THREE.BoxGeometry(3.6, 0.45, 1.7);
    const chassis = new THREE.Mesh(chassisGeo, bodyMat);
    chassis.position.set(0, -0.2, 0);
    group.add(chassis);

    // Aerodynamic Sloping Cabin / Roofline (Greenhouse)
    const cabinGeo = new THREE.BoxGeometry(2.0, 0.55, 1.35);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.1,
      wireframe,
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(-0.2, 0.25, 0);
    group.add(cabin);

    // Front Sloping Hood / Bonnet
    const hoodGeo = new THREE.BoxGeometry(1.2, 0.25, 1.6);
    const hood = new THREE.Mesh(hoodGeo, bodyMat);
    hood.position.set(1.2, -0.05, 0);
    hood.rotation.z = -0.12;
    group.add(hood);

    // Tinted Windshield Glass
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.75,
    });
    const windshieldGeo = new THREE.PlaneGeometry(1.3, 0.7);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.rotation.y = Math.PI / 2;
    windshield.rotation.x = -Math.PI / 3.8;
    windshield.position.set(0.75, 0.25, 0);
    group.add(windshield);

    // Rear Sloping Fastback Glass
    const rearGlass = new THREE.Mesh(windshieldGeo, glassMat);
    rearGlass.rotation.y = -Math.PI / 2;
    rearGlass.rotation.x = -Math.PI / 3.5;
    rearGlass.position.set(-1.15, 0.22, 0);
    group.add(rearGlass);

    // Aerodynamic Rear Wing / Spoiler
    const spoilerWingGeo = new THREE.BoxGeometry(0.3, 0.04, 1.6);
    const spoiler = new THREE.Mesh(spoilerWingGeo, cabinMat);
    spoiler.position.set(-1.75, 0.28, 0);
    group.add(spoiler);

    // Twin Exhaust Tips (Stainless Chrome)
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.98, roughness: 0.1 });
    [-0.35, 0.35].forEach((z) => {
      const tipGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 16);
      const tip = new THREE.Mesh(tipGeo, exhaustMat);
      tip.rotation.z = Math.PI / 2;
      tip.position.set(-1.85, -0.3, z);
      group.add(tip);
    });

    // Iconic Front Dual Oval Headlights (LED Daytime Glow)
    [-0.55, 0.55].forEach((z) => {
      const lightGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const lightMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x93c5fd,
        emissiveIntensity: 1.2,
      });
      const light = new THREE.Mesh(lightGeo, lightMat);
      light.position.set(1.75, -0.05, z);
      group.add(light);
    });

    // Rear Continuous LED Lightbar (Porsche 911 light strip)
    const lightbarGeo = new THREE.BoxGeometry(0.05, 0.06, 1.55);
    const lightbarMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0xef4444,
      emissiveIntensity: 1.5,
    });
    const lightbar = new THREE.Mesh(lightbarGeo, lightbarMat);
    lightbar.position.set(-1.82, 0.02, 0);
    group.add(lightbar);

    // 4 Performance Alloy Wheels with Rubber Tires & Yellow Calipers
    const makeCarWheel = (x: number, y: number, z: number) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      // Tire
      const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 24);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9, wireframe });
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.x = Math.PI / 2;
      wheelGroup.add(tire);

      // Rim (Satin Titanium Alloy)
      const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.24, 20);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.2 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      // Center-lock nut
      const nutGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.26, 12);
      const nutMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8 });
      const nut = new THREE.Mesh(nutGeo, nutMat);
      nut.rotation.x = Math.PI / 2;
      wheelGroup.add(nut);

      // Yellow Performance Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.12, 0.16, 0.25);
      const caliperMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.6 });
      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(0.15, 0.12, 0);
      wheelGroup.add(caliper);

      group.add(wheelGroup);
      wheelList.push(tire);
    };

    // 4 Wheel placements
    makeCarWheel(1.15, -0.4, 0.85);   // Front Left
    makeCarWheel(1.15, -0.4, -0.85);  // Front Right
    makeCarWheel(-1.15, -0.4, 0.85);  // Rear Left
    makeCarWheel(-1.15, -0.4, -0.85); // Rear Right

    dynamicMeshesRef.current.wheels = wheelList;
  };

  const buildElectricBike = (group: THREE.Group, accentColor: THREE.Color, wireframe: boolean) => {
    const wheelList: THREE.Mesh[] = [];

    // Helper: Build a wheel with carbon rim, tire, and disc brake
    const makeWheel = (x: number, y: number) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, 0);

      // Tire (Torus)
      const tireGeo = new THREE.TorusGeometry(0.62, 0.12, 16, 48);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8, wireframe });
      const tire = new THREE.Mesh(tireGeo, tireMat);
      wheelGroup.add(tire);

      // Carbon Rim Disc
      const rimGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.08, 24);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.2,
        wireframe,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      // Disc Brake Rotor (Stainless steel with radial holes)
      const discGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.02, 24);
      const discMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95 });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.rotation.x = Math.PI / 2;
      disc.position.z = 0.06;
      wheelGroup.add(disc);

      // Regenerative hub accent
      const hubGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.14, 16);
      const hubMat = new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 0.4 });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);

      group.add(wheelGroup);
      wheelList.push(tire);
    };

    // Front Wheel & Rear Wheel
    makeWheel(1.3, -0.4);
    makeWheel(-1.3, -0.4);
    dynamicMeshesRef.current.wheels = wheelList;

    // Frame: Carbon Monocoque Top Tube & Seat Stays
    const topTubeGeo = new THREE.BoxGeometry(1.6, 0.18, 0.22);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.3,
      wireframe,
    });
    const topTube = new THREE.Mesh(topTubeGeo, frameMat);
    topTube.position.set(0, 0.35, 0);
    topTube.rotation.z = -0.15;
    group.add(topTube);

    // Down Tube (Thick aero battery enclosure)
    const downTubeGeo = new THREE.BoxGeometry(1.4, 0.35, 0.28);
    const downTube = new THREE.Mesh(downTubeGeo, frameMat);
    downTube.position.set(0.1, -0.05, 0);
    downTube.rotation.z = 0.45;
    group.add(downTube);

    // Glowing 14.4 kWh Battery Pack Module
    const batGeo = new THREE.BoxGeometry(1.1, 0.26, 0.3);
    const batMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      wireframe,
    });
    const battery = new THREE.Mesh(batGeo, batMat);
    battery.position.set(0.1, 0.05, 0);
    battery.rotation.z = 0.45;
    group.add(battery);

    // Rear Swingarm to back wheel
    const swingArmGeo = new THREE.BoxGeometry(1.3, 0.12, 0.16);
    const swingArm = new THREE.Mesh(swingArmGeo, frameMat);
    swingArm.position.set(-0.65, -0.3, 0);
    swingArm.rotation.z = 0.15;
    group.add(swingArm);

    // Front Fork (Dual inverted tubes)
    [-0.1, 0.1].forEach((fz) => {
      const forkGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 16);
      const forkMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
      const fork = new THREE.Mesh(forkGeo, forkMat);
      fork.position.set(1.05, 0.15, fz);
      fork.rotation.z = -0.35;
      group.add(fork);
    });

    // 85kW Motor Casing at bottom bracket
    const motorGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.32, 24);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    const motor = new THREE.Mesh(motorGeo, motorMat);
    motor.rotation.x = Math.PI / 2;
    motor.position.set(-0.15, -0.32, 0);
    group.add(motor);

    // Motor Pulsing Coil Indicator
    const coilGeo = new THREE.TorusGeometry(0.25, 0.03, 16, 32);
    const coilMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.position.set(-0.15, -0.32, 0.18);
    group.add(coil);
    dynamicMeshesRef.current.motorGlow = coil;

    // Handlebars with digital cockpit
    const barGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 16);
    const bar = new THREE.Mesh(barGeo, frameMat);
    bar.rotation.x = Math.PI / 2;
    bar.position.set(0.85, 0.72, 0);
    group.add(bar);

    // Dual LED Projector Headlight
    const lightGeo = new THREE.BoxGeometry(0.15, 0.08, 0.18);
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.0,
    });
    const headlight = new THREE.Mesh(lightGeo, lightMat);
    headlight.position.set(1.15, 0.58, 0);
    group.add(headlight);

    // Ergonomic Racing Saddle
    const seatGeo = new THREE.BoxGeometry(0.65, 0.08, 0.24);
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.9 });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(-0.45, 0.45, 0);
    group.add(seat);
  };

  // Model Builder 2: AeroBook Ultra X16 Neural Laptop
  const buildNeuralLaptop = (group: THREE.Group, accentColor: THREE.Color, wireframe: boolean) => {
    // Bottom Keyboard Base (Chassis)
    const baseGeo = new THREE.BoxGeometry(2.6, 0.08, 1.8);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.2,
      wireframe,
    });
    const base = new THREE.Mesh(baseGeo, metalMat);
    base.position.set(0, -0.3, 0.2);
    group.add(base);

    // Trackpad (Frosted glass haptic pad)
    const padGeo = new THREE.BoxGeometry(0.9, 0.01, 0.6);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.1 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(0, -0.25, 0.65);
    group.add(pad);

    // Backlit Keyboard Array (Recessed keys tray)
    const keyTrayGeo = new THREE.BoxGeometry(2.3, 0.02, 0.85);
    const keyTrayMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: accentColor,
      emissiveIntensity: 0.2,
      wireframe,
    });
    const keyTray = new THREE.Mesh(keyTrayGeo, keyTrayMat);
    keyTray.position.set(0, -0.25, -0.15);
    group.add(keyTray);

    // 50 TOPS NPU Badge beneath the keyboard (Glowing chip emblem)
    const chipGeo = new THREE.BoxGeometry(0.2, 0.01, 0.2);
    const chipMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set(0.85, -0.25, 0.65);
    group.add(chip);

    // Display Lid Hinge Cylinder
    const hingeGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 16);
    const hinge = new THREE.Mesh(hingeGeo, metalMat);
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(0, -0.26, -0.7);
    group.add(hinge);

    // Open Screen Lid (Angled at 110 degrees)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, -0.26, -0.7);
    lidGroup.rotation.x = -Math.PI * 0.42; // Tilted back

    // Outer display shell
    const lidGeo = new THREE.BoxGeometry(2.6, 1.7, 0.04);
    const lid = new THREE.Mesh(lidGeo, metalMat);
    lid.position.set(0, 0.85, 0);
    lidGroup.add(lid);

    // 4K Tandem OLED Display Screen Face
    const screenGeo = new THREE.PlaneGeometry(2.45, 1.55);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: accentColor,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.5,
      wireframe,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.85, 0.025);
    lidGroup.add(screen);
    dynamicMeshesRef.current.screenMesh = screen;

    // Glowing Agora AI Voice Waveform graphic on display
    const waveGeo = new THREE.PlaneGeometry(1.6, 0.3);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    wave.position.set(0, 0.85, 0.03);
    lidGroup.add(wave);

    group.add(lidGroup);
  };

  // Model Builder 3: SmartVision Neo Multi-Door AI Refrigerator
  const buildSmartRefrigerator = (group: THREE.Group, accentColor: THREE.Color, wireframe: boolean) => {
    // Main Stainless Steel Cabinet
    const bodyGeo = new THREE.BoxGeometry(1.7, 2.7, 1.3);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.25,
      wireframe,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Left French Door (Upper)
    const leftDoorGeo = new THREE.BoxGeometry(0.82, 1.45, 0.06);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.92,
      roughness: 0.2,
      wireframe,
    });
    const leftDoor = new THREE.Mesh(leftDoorGeo, doorMat);
    leftDoor.position.set(-0.43, 0.55, 0.68);
    group.add(leftDoor);

    // Vertical Handle for Left Door
    const handleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const handleL = new THREE.Mesh(handleGeo, handleMat);
    handleL.position.set(-0.06, 0.55, 0.74);
    group.add(handleL);

    // Right Door with 29" Transparent SmartVision OLED Hub
    const rightDoorGeo = new THREE.BoxGeometry(0.82, 1.45, 0.06);
    const rightDoor = new THREE.Mesh(rightDoorGeo, doorMat);
    rightDoor.position.set(0.43, 0.55, 0.68);
    group.add(rightDoor);

    // 29" Smart Display Glass Panel on Right Door
    const displayGeo = new THREE.PlaneGeometry(0.68, 1.15);
    const displayMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      emissive: accentColor,
      emissiveIntensity: 0.6,
      roughness: 0.05,
      metalness: 0.8,
      wireframe,
    });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0.43, 0.55, 0.72);
    group.add(display);

    // UI Widget cards on Smart Display (Simulating Agora Voice Assistant & Grocery List)
    for (let w = -0.35; w <= 0.35; w += 0.35) {
      const widgetGeo = new THREE.PlaneGeometry(0.55, 0.22);
      const widgetMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
      });
      const widget = new THREE.Mesh(widgetGeo, widgetMat);
      widget.position.set(0.43, 0.55 + w, 0.725);
      group.add(widget);
    }

    // Lower Freezer Drawer (Horizontal Pullout)
    const freezerGeo = new THREE.BoxGeometry(1.68, 0.9, 0.06);
    const freezer = new THREE.Mesh(freezerGeo, doorMat);
    freezer.position.set(0, -0.75, 0.68);
    group.add(freezer);

    // Horizontal Freezer Handle
    const fHandleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 16);
    const fHandle = new THREE.Mesh(fHandleGeo, handleMat);
    fHandle.rotation.z = Math.PI / 2;
    fHandle.position.set(0, -0.4, 0.74);
    group.add(fHandle);

    // Bottom Inverter Compressor Grill & Status Glow
    const grillGeo = new THREE.BoxGeometry(1.65, 0.2, 0.04);
    const grillMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7 });
    const grill = new THREE.Mesh(grillGeo, grillMat);
    grill.position.set(0, -1.25, 0.66);
    group.add(grill);

    const compGlowGeo = new THREE.BoxGeometry(0.15, 0.04, 0.02);
    const compGlowMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const compGlow = new THREE.Mesh(compGlowGeo, compGlowMat);
    compGlow.position.set(0, -1.25, 0.69);
    group.add(compGlow);
    dynamicMeshesRef.current.compressorGlow = compGlow;
  };

  // Model Builder 4: Neural AI Edge Rack Server
  const buildEdgeServer = (group: THREE.Group, accentColor: THREE.Color, wireframe: boolean) => {
    const chassisGeo = new THREE.BoxGeometry(2.8, 0.7, 2.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
      wireframe,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    group.add(chassis);

    const coverGeo = new THREE.BoxGeometry(2.7, 0.05, 2.1);
    const coverMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.75,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
      wireframe,
    });
    const cover = new THREE.Mesh(coverGeo, coverMat);
    cover.position.y = 0.38;
    group.add(cover);

    const bezelGeo = new THREE.BoxGeometry(2.82, 0.68, 0.08);
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, wireframe });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.z = 1.12;
    group.add(bezel);

    for (let i = -1.1; i <= 1.1; i += 0.3) {
      const bayGeo = new THREE.BoxGeometry(0.24, 0.45, 0.04);
      const bayMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
      const bay = new THREE.Mesh(bayGeo, bayMat);
      bay.position.set(i, 0, 1.16);
      group.add(bay);

      const ledGeo = new THREE.SphereGeometry(0.02, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.3 ? accentColor : 0x10b981 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(i, 0.2, 1.19);
      group.add(led);
    }

    const dspGeo = new THREE.BoxGeometry(0.65, 0.2, 0.65);
    const dspMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
      wireframe,
    });
    const dsp = new THREE.Mesh(dspGeo, dspMat);
    dsp.position.set(0, 0.2, 0.2);
    group.add(dsp);
    dynamicMeshesRef.current.dspCore = dsp;

    for (let f = -0.28; f <= 0.28; f += 0.07) {
      const finGeo = new THREE.BoxGeometry(0.62, 0.15, 0.02);
      const finMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(0, 0.32, 0.2 + f);
      group.add(fin);
    }

    const fanList: THREE.Mesh[] = [];
    [-0.7, 0.7].forEach((fx) => {
      const fanHousingGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.1, 24);
      const fanHousingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const housing = new THREE.Mesh(fanHousingGeo, fanHousingMat);
      housing.rotation.x = Math.PI / 2;
      housing.position.set(fx, 0, -0.9);
      group.add(housing);

      const bladeGeo = new THREE.BoxGeometry(0.46, 0.08, 0.02);
      const bladeMat = new THREE.MeshStandardMaterial({ color: accentColor, wireframe });
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.position.set(fx, 0, -0.9);
      group.add(bladeMesh);
      fanList.push(bladeMesh);
    });
    dynamicMeshesRef.current.fans = fanList;
  };

  // Model Builder 5: Titanium Smartphone (Flagship 6.9" Pro Device)
  const buildTitaniumSmartphone = (group: THREE.Group, accentColor: THREE.Color, wireframe: boolean) => {
    // Phone Chassis (Grade 5 Titanium rounded slab)
    const phoneGeo = new THREE.BoxGeometry(1.2, 2.4, 0.12);
    const phoneMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.95,
      roughness: 0.2,
      wireframe,
    });
    const phoneBody = new THREE.Mesh(phoneGeo, phoneMat);
    group.add(phoneBody);

    // Front OLED Display with high gloss
    const screenGeo = new THREE.PlaneGeometry(1.12, 2.32);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x050b14,
      metalness: 0.8,
      roughness: 0.05,
      emissive: accentColor,
      emissiveIntensity: 0.25,
      wireframe,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.065;
    group.add(screen);
    dynamicMeshesRef.current.screenMesh = screen;

    // Dynamic Island Pill / Camera Cutout
    const pillGeo = new THREE.BoxGeometry(0.26, 0.06, 0.02);
    const pillMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const pill = new THREE.Mesh(pillGeo, pillMat);
    pill.position.set(0, 0.98, 0.07);
    group.add(pill);

    // Rear Camera Bump (Square plateau with glass bevel)
    const bumpGeo = new THREE.BoxGeometry(0.55, 0.55, 0.06);
    const bumpMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.15,
      wireframe,
    });
    const bump = new THREE.Mesh(bumpGeo, bumpMat);
    bump.position.set(-0.25, 0.8, -0.09);
    group.add(bump);

    // 3 Triple Pro Camera Lenses
    const lensPositions: [number, number][] = [
      [-0.35, 0.92],
      [-0.35, 0.68],
      [-0.15, 0.8],
    ];

    lensPositions.forEach(([lx, ly]) => {
      // Outer lens ring
      const ringGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.04, 24);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 1.0, roughness: 0.1 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(lx, ly, -0.13);
      group.add(ring);

      // Inner optics glass
      const glassGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.042, 24);
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.05,
        emissive: accentColor,
        emissiveIntensity: 0.2,
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.rotation.x = Math.PI / 2;
      glass.position.set(lx, ly, -0.131);
      group.add(glass);
    });

    // Titanium Action & Volume buttons
    const buttonGeo = new THREE.BoxGeometry(0.04, 0.18, 0.06);
    const buttonMat = new THREE.MeshStandardMaterial({ color: accentColor, metalness: 0.9 });
    const actionBtn = new THREE.Mesh(buttonGeo, buttonMat);
    actionBtn.position.set(-0.62, 0.6, 0);
    group.add(actionBtn);

    const powerBtn = new THREE.Mesh(buttonGeo, buttonMat);
    powerBtn.position.set(0.62, 0.4, 0);
    group.add(powerBtn);
  };

  const handleHotspotClick = (hotspot: ShowroomHotspot) => {
    setSelectedHotspot(hotspot);
    if (onSelectHotspot) onSelectHotspot(hotspot);
    targetCameraRotRef.current = {
      x: 0.25,
      y: Math.atan2(hotspot.position[0], hotspot.position[2]),
      radius: 3.8,
    };
  };

  return (
    <div className="relative w-full h-[420px] rounded-2xl border border-white bg-gradient-to-b from-white/90 via-white/70 to-slate-100/80 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col justify-between select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Badge & Showroom Title */}
      <div className="relative z-10 p-4 flex items-start justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/90 px-3 py-1 text-xs font-bold text-indigo-700 shadow-xs mb-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Interactive 3D Showroom · {showroom.category}</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            {showroom.name}
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-white shadow-2xs">
              {showroom.badge}
            </span>
          </h2>
          <p className="text-xs text-slate-500 max-w-md hidden sm:block font-medium">
            {showroom.tagline}
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {isAiSpeaking ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-indigo-300 bg-indigo-50/90 px-3 py-1.5 text-xs font-bold text-indigo-800 shadow-xs animate-pulse">
              <Volume2 className="h-4 w-4 text-indigo-600" />
              <span>AI Explaining 3D Features...</span>
            </div>
          ) : isAudioActive ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50/90 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-xs">
              <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>Voice Interruption & Commands Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              <Box className="h-3.5 w-3.5 text-slate-400" />
              <span>Click & Drag to Orbit 3D</span>
            </div>
          )}
        </div>
      </div>

      {/* Hardware Hotspots Row */}
      <div className="relative z-10 px-4 pb-2 flex flex-wrap items-center gap-2 pointer-events-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
          <Layers className="h-3 w-3" />
          Hardware Hotspots:
        </span>
        {showroom.hotspots.map((hs) => {
          const isSelected = selectedHotspot?.id === hs.id;
          return (
            <button
              key={hs.id}
              onClick={() => handleHotspotClick(hs)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200 scale-105'
                  : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-600'} animate-ping`} />
              <span>{hs.title}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Bar: Hotspot Specs & 3D Controls */}
      <div className="relative z-10 p-3 bg-white/80 border-t border-slate-200/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {selectedHotspot ? (
          <div className="flex items-center gap-3 truncate max-w-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{selectedHotspot.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                  {selectedHotspot.metric}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 truncate">{selectedHotspot.details}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>Click any hotspot above or tell the AI: <strong className="text-slate-800">"Switch to cars showroom"</strong> or <strong className="text-slate-800">"Can I get a discount on 10 laptops?"</strong></span>
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              autoRotate
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle Auto-Rotation"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              wireframeMode
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle Wireframe CAD Mode"
          >
            <Box className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => {
              targetCameraRotRef.current = { x: 0.25, y: -0.6, radius: 4.8 };
              setSelectedHotspot(null);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            title="Reset Camera View"
          >
            <Maximize2 className="h-3 w-3" />
            <span>Reset View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
