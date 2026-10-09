import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Decal, Environment, Float, Lightformer, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const RED = '#ff2b3d'
const DARK = '#0d0d0d'
const STEEL = '#1c1c1c'
const WHITE = '#f2f2f2'

/** Renders only while the canvas is on screen, so several scenes can share a page. */
function useOnScreen() {
  const ref = useRef(null)
  const [onScreen, setOnScreen] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin: '120px' })
    io.observe(node)
    return () => io.disconnect()
  }, [])
  return [ref, onScreen]
}

function SceneCanvas({ className, camera, lite, children }) {
  const [ref, onScreen] = useOnScreen()
  return (
    <div ref={ref} className={className}>
      <Canvas
        frameloop={onScreen ? 'always' : 'never'}
        dpr={lite ? [1, 1.5] : [1, 2]}
        camera={camera}
        gl={{ antialias: true, alpha: true, powerPreference: lite ? 'low-power' : 'high-performance' }}
      >
        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={4} color={WHITE} position={[0, 5, 2]} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={6} color={RED} position={[-5, 1, -2]} scale={[3, 6, 1]} />
          <Lightformer form="ring" intensity={2} color={WHITE} position={[4, 2, 4]} scale={2} />
        </Environment>
        {children}
      </Canvas>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Hero: a developer workstation                                       */
/* ------------------------------------------------------------------ */

const CODE = [
  ['const', ' engineer = {'],
  ['  name', ": 'Shubham Tiwari',"],
  ['  role', ": 'Senior Software Engineer',"],
  ['  stack', ": ['PHP', 'Laravel', 'Node'],"],
  ['  cloud', ": ['AWS', 'Azure', 'Docker'],"],
  ['  uptime', ': 99.9,'],
  ['}', ''],
  ['', ''],
  ['await', ' ship(engineer)'],
]

const CODE_LENGTH = CODE.reduce((n, [a, b]) => n + a.length + b.length, 0)

/** Draws the editor with the first `typed` characters of CODE showing. */
function drawCodeScreen(canvas, typed, cursorOn) {
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#161616'
  ctx.fillRect(0, 0, canvas.width, 54)
  ;['#ff5f56', '#ffbd2e', '#27c93f'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(34 + i * 30, 27, 9, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = '#8f8f8f'
  ctx.font = '24px monospace'
  ctx.fillText('engineer.js', 150, 35)

  ctx.font = 'bold 34px monospace'
  let left = typed
  for (let row = 0; row < CODE.length && left > 0; row += 1) {
    const [key, rest] = CODE[row]
    const y = 110 + row * 52
    ctx.fillStyle = '#4d4d4d'
    ctx.fillText(String(row + 1).padStart(2, ' '), 20, y)
    const k = key.slice(0, left)
    const r = rest.slice(0, Math.max(0, left - key.length))
    left -= key.length + rest.length
    ctx.fillStyle = RED
    ctx.fillText(k, 90, y)
    ctx.fillStyle = WHITE
    ctx.fillText(r, 90 + ctx.measureText(key).width, y)
    if (left <= 0 && cursorOn) {
      ctx.fillStyle = RED
      ctx.fillRect(92 + ctx.measureText(k + r).width, y - 28, 16, 34)
    }
  }
}

/** A code editor that types itself out, drawn to a canvas texture. */
class CodeScreen {
  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = 1024
    this.canvas.height = 600
    this.texture = new THREE.CanvasTexture(this.canvas)
    this.texture.colorSpace = THREE.SRGBColorSpace
    this.chars = 0
  }

  tick(dt) {
    this.chars += dt * 22
    drawCodeScreen(this.canvas, Math.floor(this.chars) % (CODE_LENGTH + 60), Math.floor(this.chars * 2) % 2 === 0)
    this.texture.needsUpdate = true
  }
}

function useCodeScreen() {
  const [screen] = useState(() => new CodeScreen())
  useFrame((_, dt) => screen.tick(dt))
  return screen.texture
}

function Keyboard() {
  const ref = useRef(null)
  const rows = 4
  const cols = 13
  useEffect(() => {
    const m = new THREE.Matrix4()
    let i = 0
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        m.makeTranslation(-0.6 + c * 0.1, 0.04, -0.15 + r * 0.1)
        ref.current.setMatrixAt(i, m)
        i += 1
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <group position={[0, 0.07, 0.55]}>
      <mesh>
        <boxGeometry args={[1.4, 0.05, 0.46]} />
        <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.35} />
      </mesh>
      <instancedMesh ref={ref} args={[null, null, rows * cols]}>
        <boxGeometry args={[0.08, 0.03, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" emissive={RED} emissiveIntensity={0.25} roughness={0.5} />
      </instancedMesh>
    </group>
  )
}

function Workstation() {
  const screen = useCodeScreen()
  const lampHead = useRef(null)

  useFrame((state) => {
    if (lampHead.current) lampHead.current.rotation.z = -0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05
  })

  return (
    <group position={[0, -0.9, 0]}>
      {/* Desk */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.6, 0.1, 1.7]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.06, 0.86]}>
        <boxGeometry args={[3.6, 0.025, 0.02]} />
        <meshBasicMaterial color={RED} toneMapped={false} />
      </mesh>
      {[[-1.7, -0.75], [1.7, -0.75], [-1.7, 0.75], [1.7, 0.75]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -0.8, z]}>
          <boxGeometry args={[0.07, 1.5, 0.07]} />
          <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.3} />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, 0.05, -0.35]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.28, 0.32, 0.04, 32]} />
          <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.35, -0.04]}>
          <boxGeometry args={[0.08, 0.66, 0.06]} />
          <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.25} />
        </mesh>
        <group position={[0, 1.05, 0]} rotation={[-0.06, 0, 0]}>
          <mesh>
            <boxGeometry args={[2.1, 1.24, 0.07]} />
            <meshStandardMaterial color="#090909" metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.037]}>
            <planeGeometry args={[2.0, 1.14]} />
            <meshBasicMaterial map={screen} toneMapped={false} />
          </mesh>
          {/* Bias light glowing behind the screen */}
          <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[2.5, 1.6]} />
            <meshBasicMaterial color={RED} transparent opacity={0.22} toneMapped={false} />
          </mesh>
          <pointLight position={[0, 0, -0.5]} intensity={6} distance={4} color={RED} />
        </group>
      </group>

      <Keyboard />

      {/* Mouse */}
      <mesh position={[1.0, 0.09, 0.55]} scale={[1, 0.6, 1.4]}>
        <sphereGeometry args={[0.08, 24, 16]} />
        <meshStandardMaterial color={WHITE} metalness={0.3} roughness={0.3} />
      </mesh>

      {/* Mug */}
      <group position={[-1.25, 0.05, 0.35]}>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.12, 0.11, 0.28, 32]} />
          <meshStandardMaterial color={RED} metalness={0.2} roughness={0.35} />
        </mesh>
        <mesh position={[0.13, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.06, 0.018, 12, 24]} />
          <meshStandardMaterial color={RED} metalness={0.2} roughness={0.35} />
        </mesh>
      </group>

      {/* Desk lamp */}
      <group position={[1.35, 0.05, -0.45]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.04, 32]} />
          <meshStandardMaterial color={WHITE} metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh position={[-0.12, 0.42, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.018, 0.018, 0.85, 12]} />
          <meshStandardMaterial color={WHITE} metalness={0.6} roughness={0.25} />
        </mesh>
        <group ref={lampHead} position={[-0.25, 0.84, 0]}>
          <mesh rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.15, 0.24, 32, 1, true]} />
            <meshStandardMaterial color={WHITE} metalness={0.6} roughness={0.25} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#fff2e0" toneMapped={false} />
          </mesh>
          <pointLight position={[0, -0.2, 0]} intensity={4} distance={2.5} color="#fff2e0" />
        </group>
      </group>

      {/* A couple of floating cubes for depth */}
      <Float speed={2} floatIntensity={0.6} rotationIntensity={1.4}>
        <mesh position={[-1.5, 1.9, -0.6]}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color={RED} metalness={0.6} roughness={0.2} emissive={RED} emissiveIntensity={0.3} />
        </mesh>
      </Float>
      <Float speed={1.6} floatIntensity={0.8} rotationIntensity={1.2}>
        <mesh position={[1.6, 2.1, -0.2]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color={WHITE} metalness={0.8} roughness={0.15} />
        </mesh>
      </Float>
    </group>
  )
}

export function HeroWorkstation({ lite = false }) {
  return (
    <SceneCanvas className="p-scene p-scene--hero" lite={lite} camera={{ position: [3.2, 1.6, 4.2], fov: 38 }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <Workstation />
      <ContactShadows position={[0, -1.75, 0]} opacity={0.6} scale={8} blur={2.4} far={2} color="#000000" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.7}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0, 0]}
      />
    </SceneCanvas>
  )
}

/* ------------------------------------------------------------------ */
/* Skills: floating tech balls                                         */
/* ------------------------------------------------------------------ */

function labelTexture(text) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')
  ctx.fillStyle = RED
  ctx.beginPath()
  ctx.arc(128, 128, 118, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const words = text.length > 9 ? text.split(/\s+/).slice(0, 2) : [text]
  const size = Math.min(92, Math.floor(330 / Math.max(...words.map((w) => w.length))))
  ctx.font = `bold ${size}px "Space Grotesk", sans-serif`
  words.forEach((w, i) => ctx.fillText(w, 128, 128 + (i - (words.length - 1) / 2) * size * 1.05))
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function Ball({ label, position }) {
  const ref = useRef(null)
  const map = useMemo(() => labelTexture(label), [label])
  const [hover, setHover] = useState(false)

  useFrame((state, dt) => {
    if (!ref.current) return
    // Face the viewer, wobble a little, and spin when hovered
    const t = state.clock.elapsedTime
    ref.current.rotation.y += hover ? dt * 6 : (Math.sin(t + position[0]) * 0.12 - ref.current.rotation.y) * dt * 2
    const s = hover ? 1.15 : 1
    ref.current.scale.setScalar(ref.current.scale.x + (s - ref.current.scale.x) * dt * 8)
  })

  return (
    <Float speed={1.6} rotationIntensity={0} floatIntensity={1}>
      <mesh
        ref={ref}
        position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <icosahedronGeometry args={[0.56, 1]} />
        <meshStandardMaterial color={WHITE} metalness={0.2} roughness={0.35} flatShading polygonOffset polygonOffsetFactor={-5} />
        <Decal position={[0, 0, 0.56]} rotation={[0, 0, 0]} scale={0.95} map={map} />
      </mesh>
    </Float>
  )
}

export function TechBalls({ skills, lite = false }) {
  const cols = lite ? 4 : 8
  const rows = Math.ceil(skills.length / cols)
  const gap = 1.35
  const height = rows * (lite ? 92 : 120)

  return (
    <div style={{ height }}>
      <SceneCanvas
        className="p-scene p-scene--balls"
        lite={lite}
        camera={{ position: [0, 0, rows * gap + 2.6], fov: 30 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 2, 5]} intensity={1.2} />
        {skills.map((label, i) => {
          const r = Math.floor(i / cols)
          const inRow = Math.min(cols, skills.length - r * cols)
          const c = i % cols
          return (
            <Ball
              key={label}
              label={label}
              position={[(c - (inRow - 1) / 2) * gap, ((rows - 1) / 2 - r) * gap, 0]}
            />
          )
        })}
      </SceneCanvas>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Contact: dotted globe with a pin on Bengaluru                       */
/* ------------------------------------------------------------------ */

function latLon(lat, lon, r) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon + 180)
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

const HOME = [12.97, 77.59]
const CITIES = [
  [37.77, -122.42],
  [51.5, -0.12],
  [1.35, 103.82],
  [25.2, 55.27],
  [40.71, -74.0],
  [-33.87, 151.2],
]

function arcGeometry(from, to) {
  const a = latLon(...from, 1)
  const b = latLon(...to, 1)
  const mid = a.clone().add(b).multiplyScalar(0.5)
  mid.setLength(1 + a.distanceTo(b) * 0.45)
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
  return new THREE.BufferGeometry().setFromPoints(curve.getPoints(48))
}

function Globe({ lite }) {
  const dots = useMemo(() => {
    const n = lite ? 1400 : 2600
    const pos = new Float32Array(n * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < n; i += 1) {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = golden * i
      pos.set([Math.cos(th) * r * 1.002, y * 1.002, Math.sin(th) * r * 1.002], i * 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [lite])
  const arcs = useMemo(() => CITIES.map((c) => arcGeometry(HOME, c)), [])
  const pin = useMemo(() => latLon(...HOME, 1.02), [])
  const pulse = useRef(null)

  useFrame((state) => {
    if (!pulse.current) return
    const k = (state.clock.elapsedTime % 1.6) / 1.6
    pulse.current.scale.setScalar(1 + k * 3)
    pulse.current.material.opacity = 0.8 * (1 - k)
  })

  return (
    <group rotation={[0.35, -1.9, 0]}>
      <mesh>
        <sphereGeometry args={[0.99, 64, 64]} />
        <meshStandardMaterial color="#0b0b0b" metalness={0.5} roughness={0.6} />
      </mesh>
      <points geometry={dots}>
        <pointsMaterial size={0.012} color="#6b6b6b" sizeAttenuation />
      </points>
      {/* Atmosphere rim */}
      <mesh scale={1.12}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color={RED} transparent opacity={0.07} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      {arcs.map((g, i) => (
        <line key={i} geometry={g}>
          <lineBasicMaterial color={RED} transparent opacity={0.75} toneMapped={false} />
        </line>
      ))}
      {CITIES.map((c) => (
        <mesh key={c.join()} position={latLon(...c, 1.01)}>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshBasicMaterial color={WHITE} toneMapped={false} />
        </mesh>
      ))}
      <group position={pin}>
        <mesh>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={RED} toneMapped={false} />
        </mesh>
        <mesh ref={pulse}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={RED} transparent toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

export function ContactGlobe({ lite = false }) {
  return (
    <SceneCanvas className="p-scene p-scene--globe" lite={lite} camera={{ position: [0, 0, 3.1], fov: 40 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[-3, 2, 3]} intensity={1.2} />
      <Globe lite={lite} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
    </SceneCanvas>
  )
}
