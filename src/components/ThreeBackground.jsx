import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 32);

    const N = 2000;
    const positions = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 130;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 130;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
      sizes[i] = Math.random() * 1.6 + 0.2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#1aad4a") },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        void main() {
          vec3 p = position;
          p.y += sin(uTime * 0.35 + position.x * 0.04) * 1.8;
          p.x += cos(uTime * 0.28 + position.z * 0.035) * 1.2;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = size * (220.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.05, d) * 0.55;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    const nodeGroup = new THREE.Group();
    const nodeCount = 35;
    const nodePosArr = [];

    const sphereGeo = new THREE.SphereGeometry(0.2, 10, 10);
    const matDim = new THREE.MeshBasicMaterial({ color: 0x0e6b2e });
    const matBright = new THREE.MeshBasicMaterial({ color: 0x2dd460 });
    const matMid = new THREE.MeshBasicMaterial({ color: 0x1aad4a });

    for (let i = 0; i < nodeCount; i++) {
      const p = new THREE.Vector3(
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 35 - 12,
      );
      nodePosArr.push(p);
      const r = Math.random();
      const mesh = new THREE.Mesh(
        sphereGeo,
        r > 0.75 ? matBright : r > 0.4 ? matMid : matDim,
      );
      mesh.position.copy(p);
      nodeGroup.add(mesh);
    }

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x0a4d21,
      transparent: true,
      opacity: 0.35,
    });
    for (let i = 0; i < nodePosArr.length; i++) {
      for (let j = i + 1; j < nodePosArr.length; j++) {
        if (nodePosArr[i].distanceTo(nodePosArr[j]) < 15) {
          const edgeGeo = new THREE.BufferGeometry().setFromPoints([
            nodePosArr[i],
            nodePosArr[j],
          ]);
          nodeGroup.add(new THREE.Line(edgeGeo, edgeMat));
        }
      }
    }
    scene.add(nodeGroup);

    const ringGeo = new THREE.TorusGeometry(18, 0.06, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0a4d21,
      transparent: true,
      opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(26, 0.04, 8, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x063316,
      transparent: true,
      opacity: 0.15,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 5;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    let targetX = 0,
      targetY = 0;
    const onMouse = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 5;
      targetY = (e.clientY / window.innerHeight - 0.5) * -3.5;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.007;
      pMat.uniforms.uTime.value = t;

      nodeGroup.rotation.y = t * 0.035;
      nodeGroup.rotation.x = Math.sin(t * 0.025) * 0.12;

      ring.rotation.z = t * 0.02;
      ring2.rotation.z = -t * 0.015;
      ring2.rotation.y = t * 0.01;

      camera.position.x += (targetX - camera.position.x) * 0.025;
      camera.position.y += (targetY - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
