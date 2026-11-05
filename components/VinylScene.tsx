"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";

/* ---------- Texturas generadas en canvas (sin assets externos) ---------- */

function makeGrooveMaps() {
  const S = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const r = document.createElement("canvas");
  r.width = r.height = S;
  const rg = r.getContext("2d")!;

  g.fillStyle = "#070707";
  g.fillRect(0, 0, S, S);
  rg.fillStyle = "#404040";
  rg.fillRect(0, 0, S, S);

  const cx = S / 2;
  // Surcos: anillos finos con variaciones; bandas "entre pistas" más lisas
  for (let rad = S * 0.18; rad < S * 0.495; rad += 1.6) {
    const t = (rad - S * 0.18) / (S * 0.315);
    const gap = Math.sin(t * Math.PI * 5.5) > 0.96; // separación entre pistas
    const v = gap ? 22 : 10 + Math.random() * 10;
    g.strokeStyle = `rgb(${v},${v},${v})`;
    g.lineWidth = 0.9;
    g.beginPath();
    g.arc(cx, cx, rad, 0, Math.PI * 2);
    g.stroke();
    const rv = gap ? 30 : 70 + Math.random() * 60;
    rg.strokeStyle = `rgb(${rv},${rv},${rv})`;
    rg.lineWidth = 1;
    rg.beginPath();
    rg.arc(cx, cx, rad, 0, Math.PI * 2);
    rg.stroke();
  }
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const rough = new THREE.CanvasTexture(r);
  rough.anisotropy = 8;
  return { map, rough };
}

// Las fuentes vienen de next/font: su nombre real está en las variables CSS.
function fontVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

function makeLabel() {
  const S = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const display = fontVar("--font-anton", "Impact, sans-serif");
  const mono = fontVar("--font-jetbrains", "monospace");
  drawLabel(g, S, display, mono);
  // Si la tipografía aún no estaba lista, se redibuja la etiqueta cuando llega.
  if (document.fonts && !document.fonts.check(`128px ${display}`)) {
    Promise.all([document.fonts.load(`128px ${display}`), document.fonts.load(`28px ${mono}`)]).then(() => {
      drawLabel(g, S, display, mono);
      tex.needsUpdate = true;
    });
  }
  return tex;
}

function drawLabel(g: CanvasRenderingContext2D, S: number, display: string, mono: string) {
  const cx = S / 2;
  g.clearRect(0, 0, S, S);

  g.fillStyle = "#f4f1ea";
  g.beginPath();
  g.arc(cx, cx, cx, 0, Math.PI * 2);
  g.fill();

  // Anillo exterior con motivo geométrico tipo kente / adinkra
  g.save();
  g.translate(cx, cx);
  for (let i = 0; i < 48; i++) {
    g.rotate((Math.PI * 2) / 48);
    g.fillStyle = i % 2 ? "#0a0a0a" : "#f4f1ea";
    g.fillRect(-12, -cx + 18, 24, 60);
    if (i % 2 === 0) {
      g.fillStyle = "#0a0a0a";
      g.beginPath();
      g.moveTo(0, -cx + 96);
      g.lineTo(14, -cx + 118);
      g.lineTo(0, -cx + 140);
      g.lineTo(-14, -cx + 118);
      g.closePath();
      g.fill();
    }
  }
  g.restore();

  g.strokeStyle = "#0a0a0a";
  g.lineWidth = 6;
  g.beginPath();
  g.arc(cx, cx, cx - 160, 0, Math.PI * 2);
  g.stroke();

  g.fillStyle = "#0a0a0a";
  g.textAlign = "center";
  g.font = `bold 128px ${display}`;
  g.fillText("ALEX", cx, cx - 30);
  g.font = `bold 74px ${display}`;
  g.fillText("RECORDS", cx, cx + 150);
  g.font = `28px ${mono}`;
  g.fillText("ACETATO · LADO A · 33⅓", cx, cx + 205);
  g.fillText("IMPORTADO DE ÁFRICA", cx, cx - 150);
}

function makeSoftDot() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.4, "rgba(255,255,255,0.35)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/* ---------- Disco ---------- */

function Vinyl() {
  const group = useRef<THREE.Group>(null!);
  const disc = useRef<THREE.Group>(null!);
  const { map, rough } = useMemo(makeGrooveMaps, []);
  const label = useMemo(makeLabel, []);
  const faceMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map,
        roughnessMap: rough,
        roughness: 0.5,
        metalness: 0.35,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
      }),
    [map, rough]
  );

  useFrame((state, delta) => {
    // Al volver de una pausa (escena fuera de pantalla) el delta llega enorme: se limita
    const dt = Math.min(delta, 0.1);
    // Rotación 33⅓ rpm estilizada, acelera con el scroll
    disc.current.rotation.z -= dt * (0.9 + scrollState.hero * 3);
    const tx = -0.35 + scrollState.mouseY * 0.18 - scrollState.hero * 0.6;
    const ty = scrollState.mouseX * 0.35 + scrollState.hero * 0.8;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tx, 3, dt);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ty, 3, dt);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, scrollState.hero * -0.8, 4, dt);
    const s = 1 - scrollState.hero * 0.25;
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, s, 4, dt));
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
        <group ref={disc}>
          {/* Cuerpo del disco: laca negra con clearcoat = reflejos tipo vidrio */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2, 2, 0.035, 160, 1]} />
            <meshPhysicalMaterial color="#0a0a0a" roughness={0.35} metalness={0.2} clearcoat={1} clearcoatRoughness={0.05} />
          </mesh>
          {/* Caras con surcos: un solo material compartido, solo clearcoat
              (sin sheen ni iridiscencia, que son las capas más caras del shader físico) */}
          {[0.0181, -0.0181].map((z, i) => (
            <mesh key={z} position={[0, 0, z]} rotation={[0, i ? Math.PI : 0, 0]} material={faceMat}>
              <circleGeometry args={[1.995, 128]} />
            </mesh>
          ))}
          {/* Sello central */}
          {[0.0192, -0.0192].map((z, i) => (
            <mesh key={z} position={[0, 0, z]} rotation={[0, i ? Math.PI : 0, 0]}>
              <circleGeometry args={[0.66, 96]} />
              <meshStandardMaterial map={label} roughness={0.75} />
            </mesh>
          ))}
          {/* Orificio */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.045, 32]} />
            <meshStandardMaterial color="#000" />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

/* ---------- Vapor sutil ---------- */

function Steam() {
  const ref = useRef<THREE.Group>(null!);
  const tex = useMemo(makeSoftDot, []);
  const puffs = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: (Math.random() - 0.5) * 2.4,
        z: (Math.random() - 0.5) * 1.2 - 0.6,
        speed: 0.12 + Math.random() * 0.18,
        offset: Math.random() * 4,
        scale: 1.2 + Math.random() * 1.6,
        key: i,
      })),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.children.forEach((m, i) => {
      const p = puffs[i];
      const life = ((t * p.speed + p.offset) % 4) / 4; // 0 → 1
      m.position.set(p.x + Math.sin(t * 0.6 + i) * 0.25, -1.2 + life * 4.2, p.z);
      m.scale.setScalar(p.scale * (0.6 + life));
      const mat = (m as THREE.Sprite).material as THREE.SpriteMaterial;
      mat.opacity = Math.sin(life * Math.PI) * 0.07;
    });
  });

  return (
    <group ref={ref}>
      {puffs.map((p) => (
        <sprite key={p.key}>
          <spriteMaterial map={tex} transparent depthWrite={false} opacity={0} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </group>
  );
}

/* ---------- Partículas de especias ---------- */

// Todo el movimiento ocurre en la GPU: la CPU solo actualiza un uniform de tiempo
// por frame (antes se recorrían y subían 900 posiciones en cada frame).
const spiceVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  void main() {
    vec3 p = position;
    // Subida continua con vuelta al fondo (mismo rango que antes: -2.6 → 2.6)
    p.y = mod(p.y + 2.6 + uTime * (0.05 + aSeed * 0.12), 5.2) - 2.6;
    // Deriva lateral suave
    p.x += sin(uTime * 0.4 + aSeed * 10.0) * 0.06;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (uScale / -mv.z);
  }
`;

const spiceFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    // Punto suave equivalente al antiguo degradado en canvas (1 → 0.35 → 0)
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = d < 0.4 ? mix(1.0, 0.35, d / 0.4) : mix(0.35, 0.0, (d - 0.4) / 0.6);
    if (a <= 0.0) discard;
    gl_FragColor = vec4(uColor, a * uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Spices({ count = 300 }) {
  const ref = useRef<THREE.Points>(null!);
  const [positions, seeds] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2.3 + Math.random() * 3.2;
      const a = Math.random() * Math.PI * 2;
      p[i * 3] = Math.cos(a) * r;
      p[i * 3 + 1] = (Math.random() - 0.5) * 5;
      p[i * 3 + 2] = Math.sin(a) * r - 1;
      s[i] = Math.random();
    }
    return [p, s];
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: spiceVertex,
        fragmentShader: spiceFragment,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 0.035 },
          uScale: { value: 400 },
          uColor: { value: new THREE.Color("#f4f1ea") },
          uOpacity: { value: 0.75 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(({ clock, size, viewport }) => {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;
    // Misma atenuación por distancia que PointsMaterial (mitad de la altura en píxeles reales)
    material.uniforms.uScale.value = size.height * viewport.dpr * 0.5;
    ref.current.rotation.y = t * 0.03;
  });

  return (
    <points ref={ref} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
    </points>
  );
}

/* ---------- Iluminación dinámica ---------- */

function DynamicLights() {
  const key = useRef<THREE.SpotLight>(null!);
  const rim = useRef<THREE.PointLight>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    key.current.position.x = Math.sin(t * 0.35) * 5 + scrollState.mouseX * 2;
    key.current.position.z = Math.cos(t * 0.35) * 5;
    rim.current.intensity = 18 + Math.sin(t * 1.3) * 6;
  });
  return (
    <>
      <ambientLight intensity={0.08} />
      <spotLight ref={key} position={[4, 6, 4]} angle={0.45} penumbra={1} intensity={120} />
      <pointLight ref={rim} position={[-3, -1, -3]} intensity={20} color="#ffffff" />
    </>
  );
}

export default function VinylScene({ active = true }: { active?: boolean }) {
  // dpr máximo 1.5; si el dispositivo no aguanta, PerformanceMonitor lo baja a 1
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      dpr={[1, dpr]}
      // Fuera de pantalla no se renderiza nada
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.4, 6.2], fov: 35 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, alpha: true, powerPreference: "high-performance" }}
    >
      <PerformanceMonitor onIncline={() => setDpr(1.5)} onDecline={() => setDpr(1)} flipflops={3} onFallback={() => setDpr(1)} />
      <DynamicLights />
      <Vinyl />
      <Steam />
      <Spices />
      {/* Sombra de contacto calculada una sola vez */}
      <ContactShadows frames={1} position={[0, -2.1, 0]} opacity={0.6} scale={10} blur={2.6} far={4} />
      {/* Entorno de estudio hecho con Lightformers: reflejos realistas sin descargar HDRIs */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer form="rect" intensity={4} position={[0, 5, -9]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 1, 1]} />
          <Lightformer form="rect" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 0.6, 1]} />
          <Lightformer form="ring" intensity={3} position={[0, 2, 6]} scale={3} />
        </group>
      </Environment>
    </Canvas>
  );
}
