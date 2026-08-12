import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 6, 60);
    pointLight.position.set(6, 6, 6);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xec4899, 6, 60);
    pointLight2.position.set(-6, -6, 6);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x06b6d4, 4, 60);
    pointLight3.position.set(0, 5, -5);
    scene.add(pointLight3);

    // Create 3D Video Editing Elements (Timeline Film Strips, Play Button, Editing Tracks)
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central 3D Play Button / Media Hub Prism
    const prismGeo = new THREE.ConeGeometry(1, 2, 4);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.1,
      metalness: 0.9,
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.rotation.z = -Math.PI / 2;
    prism.position.set(0, 0.5, 0);
    group.add(prism);

    // 2. Video Editing Film Strips / Timeline Tracks
    const stripGeo = new THREE.BoxGeometry(4.5, 0.6, 0.1);
    const stripMats = [
      new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3, metalness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, metalness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3, metalness: 0.7 }),
    ];

    const strips = [];
    for (let i = 0; i < 3; i++) {
      const strip = new THREE.Mesh(stripGeo, stripMats[i]);
      strip.position.set((i - 1) * 1.8, (i - 1) * -1.2, (i - 1) * 0.5);
      strip.rotation.x = 0.2;
      strip.rotation.y = (i - 1) * 0.3;
      group.add(strip);
      strips.push(strip);
    }

    // 3. Floating 3D Nodes / Keyframes
    const nodeGeo = new THREE.SphereGeometry(0.25, 32, 32);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 0.6 });
    const nodes = [];
    for (let i = 0; i < 8; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / 8) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 3.5, Math.sin(angle) * 2.5, (Math.random() - 0.5) * 3);
      group.add(node);
      nodes.push(node);
    }

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      group.rotation.y = elapsedTime * 0.25 + targetX * 0.6;
      group.rotation.x = elapsedTime * 0.15 + targetY * 0.6;

      prism.rotation.y += 0.02;
      prism.position.y = 0.5 + Math.sin(elapsedTime * 2) * 0.2;

      strips.forEach((strip, index) => {
        strip.rotation.z = Math.sin(elapsedTime * 0.5 + index) * 0.1;
      });

      nodes.forEach((node, index) => {
        node.position.y += Math.sin(elapsedTime * 2 + index) * 0.005;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full absolute inset-0 pointer-events-none" />;
}
