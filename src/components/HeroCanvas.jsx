import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = window.innerWidth, H = window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.set(0, 0, 8);

    // Ambient + point lights
    scene.add(new THREE.AmbientLight(0x111111, 1));
    const redLight = new THREE.PointLight(0xc0392b, 3, 20);
    redLight.position.set(3, 2, 4);
    scene.add(redLight);
    const blueLight = new THREE.PointLight(0x1a1a1a, 2, 15);
    blueLight.position.set(-4, -2, 3);
    scene.add(blueLight);

    // — Wireframe floating boxes —
    const boxes = [];
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    for (let i = 0; i < 14; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0xc0392b : 0x222222,
        wireframe: true,
        transparent: true,
        opacity: i % 3 === 0 ? 0.12 : 0.06,
      });
      const mesh = new THREE.Mesh(boxGeo, mat);
      const s = 0.4 + Math.random() * 2;
      mesh.scale.set(s, s, s);
      mesh.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 3
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh._rx = (Math.random() - 0.5) * 0.003;
      mesh._ry = (Math.random() - 0.5) * 0.003;
      mesh._rz = (Math.random() - 0.5) * 0.002;
      scene.add(mesh);
      boxes.push(mesh);
    }

    // — Grid plane —
    const gridHelper = new THREE.GridHelper(50, 40, 0x1a1a1a, 0x111111);
    gridHelper.position.y = -6;
    scene.add(gridHelper);

    // — Particle field —
    const pCount = 800;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 30;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x333333, size: 0.02, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Points(pGeo, pMat));

    // — Central spinning torus —
    const torusGeo = new THREE.TorusGeometry(2.5, 0.015, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0xc0392b, transparent: true, opacity: 0.15 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 2;
    scene.add(torus);

    const torus2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.01, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x8b1a1a, transparent: true, opacity: 0.08 })
    );
    torus2.rotation.x = Math.PI / 3;
    torus2.rotation.y = Math.PI / 6;
    scene.add(torus2);

    // Mouse parallax
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // Scroll fade
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll);

    // Resize
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animate
    let frame;
    const clock = new THREE.Clock();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      boxes.forEach(b => {
        b.rotation.x += b._rx;
        b.rotation.y += b._ry;
        b.rotation.z += b._rz;
      });

      torus.rotation.z = t * 0.15;
      torus2.rotation.z = -t * 0.08;
      torus2.rotation.x = Math.PI / 3 + Math.sin(t * 0.3) * 0.2;

      redLight.position.x = Math.sin(t * 0.5) * 5;
      redLight.position.y = Math.cos(t * 0.3) * 3;

      camera.position.x += (mx * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (-my * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      const fade = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
      renderer.domElement.style.opacity = fade;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
