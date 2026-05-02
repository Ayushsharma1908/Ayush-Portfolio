import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = window.innerWidth, H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.set(0, 0, 8);

    // ── Lights (much brighter) ──
    scene.add(new THREE.AmbientLight(0x330000, 2));

    const redLight = new THREE.PointLight(0xff2200, 12, 30);
    redLight.position.set(3, 2, 5);
    scene.add(redLight);

    const redLight2 = new THREE.PointLight(0xff0000, 8, 25);
    redLight2.position.set(-4, -1, 4);
    scene.add(redLight2);

    const whiteLight = new THREE.PointLight(0xffffff, 3, 20);
    whiteLight.position.set(0, 5, 6);
    scene.add(whiteLight);

    // ── Wireframe boxes — much more opaque & red ──
    const boxes = [];
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    for (let i = 0; i < 18; i++) {
      const isRed = i % 3 === 0;
      const mat = new THREE.MeshBasicMaterial({
        color: isRed ? 0xff2200 : 0x444444,
        wireframe: true,
        transparent: true,
        opacity: isRed ? 0.55 : 0.18,
      });
      const mesh = new THREE.Mesh(boxGeo, mat);
      const s = 0.4 + Math.random() * 2.2;
      mesh.scale.set(s, s, s);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 13,
        (Math.random() - 0.5) * 8 - 2
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh._rx = (Math.random() - 0.5) * 0.004;
      mesh._ry = (Math.random() - 0.5) * 0.004;
      mesh._rz = (Math.random() - 0.5) * 0.003;
      scene.add(mesh);
      boxes.push(mesh);
    }

    // ── Grid — more visible ──
    const grid = new THREE.GridHelper(60, 40, 0x440000, 0x220000);
    grid.position.y = -6;
    scene.add(grid);

    // ── Particles — brighter ──
    const pCount = 1000;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 30;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x993322, size: 0.03, transparent: true, opacity: 0.9 });
    scene.add(new THREE.Points(pGeo, pMat));

    // ── Torus rings — bright red ──
    const torus1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.025, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0xff2200, transparent: true, opacity: 0.5 })
    );
    torus1.rotation.x = Math.PI / 2;
    scene.add(torus1);

    const torus2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.015, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0xcc1100, transparent: true, opacity: 0.3 })
    );
    torus2.rotation.x = Math.PI / 3;
    torus2.rotation.y = Math.PI / 6;
    scene.add(torus2);

    // ── Icosahedron in center ──
    const icoMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.MeshBasicMaterial({ color: 0xff1100, wireframe: true, transparent: true, opacity: 0.25 })
    );
    scene.add(icoMesh);

    // Mouse
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

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

      torus1.rotation.z  =  t * 0.18;
      torus2.rotation.z  = -t * 0.10;
      torus2.rotation.x  = Math.PI / 3 + Math.sin(t * 0.4) * 0.25;
      icoMesh.rotation.x = t * 0.12;
      icoMesh.rotation.y = t * 0.18;

      // Pulse red light
      redLight.intensity  = 10 + Math.sin(t * 1.5) * 4;
      redLight.position.x = Math.sin(t * 0.6) * 5;
      redLight.position.y = Math.cos(t * 0.4) * 3;
      redLight2.intensity = 6 + Math.cos(t * 1.2) * 3;

      camera.position.x += (mx * 1.5 - camera.position.x) * 0.05;
      camera.position.y += (-my * 0.9 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      const fade = Math.max(0, 1 - scrollY / (window.innerHeight * 0.75));
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

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
