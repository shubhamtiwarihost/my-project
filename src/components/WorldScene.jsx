import { Component, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const LIME = '#b8f000'
const CYAN = '#5eead4'

/**
 * Where the core sits as the page scrolls (p = 0 top … 1 bottom).
 * Headings and copy are left-aligned, so the core stays on the right-hand side
 * and only bobs in height and size — it never ends up behind text.
 */
const PATH = [
  { p: 0, x: 2.0, y: 0.35, s: 0.86 },
  { p: 0.14, x: 3.15, y: 0.9, s: 0.6 },
  { p: 0.36, x: 3.3, y: -0.5, s: 0.56 },
  { p: 0.58, x: 3.2, y: 0.6, s: 0.6 },
  { p: 0.8, x: 3.3, y: -0.3, s: 0.6 },
  { p: 1, x: 3.2, y: 0.8, s: 0.62 },
]

function samplePath(p) {
  let i = 0
  while (i < PATH.length - 2 && p > PATH[i + 1].p) i += 1
  const a = PATH[i]
  const b = PATH[i + 1]
  const t = THREE.MathUtils.smoothstep(p, a.p, b.p)
  return {
    x: THREE.MathUtils.lerp(a.x, b.x, t),
    y: THREE.MathUtils.lerp(a.y, b.y, t),
    s: THREE.MathUtils.lerp(a.s, b.s, t),
  }
}

/** Scroll progress and pointer position, read by the render loop without re-rendering React. */
function useWorldInput() {
  const input = useRef({ scroll: 0, px: 0, py: 0 })

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      input.current.scroll = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    const onPointer = (e) => {
      input.current.px = (e.clientX / window.innerWidth) * 2 - 1
      input.current.py = (e.clientY / window.innerHeight) * 2 - 1
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return input
}

function useGlowTexture() {
  return useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(184, 240, 0, 0.55)')
    g.addColorStop(0.35, 'rgba(94, 234, 212, 0.22)')
    g.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    return new THREE.CanvasTexture(canvas)
  }, [])
}

function Ring({ radius, tube, color, tilt, speed, satellite }) {
  const ref = useRef(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed
  })
  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <mesh>
          <torusGeometry args={[radius, tube, 12, 160]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
        </mesh>
        {satellite && (
          <mesh position={[radius, 0, 0]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        )}
      </group>
    </group>
  )
}

function Core({ input, lite }) {
  const group = useRef(null)
  const body = useRef(null)
  const shell = useRef(null)
  const glow = useGlowTexture()
  const aspect = useThree((s) => s.viewport.aspect)

  useFrame((state, dt) => {
    if (!group.current) return
    const { scroll, px, py } = input.current
    const target = samplePath(scroll)
    // Narrow screens: pull the path inwards and lift the core above the hero copy
    const k = Math.min(1, aspect / 1.6)
    const lift = (1 - k) * 2
    // On phones there is no free side column, so the core bows out after the hero
    const fade = k < 0.7 ? 1 - THREE.MathUtils.smoothstep(scroll, 0.02, 0.09) : 1
    const ease = 1 - Math.exp(-dt * 3)

    group.current.position.x += (target.x * k + px * 0.12 - group.current.position.x) * ease
    group.current.position.y += (target.y + lift - py * 0.1 - group.current.position.y) * ease
    const scale = Math.max(0.0001, target.s * (0.62 + 0.38 * k) * fade)
    group.current.scale.setScalar(group.current.scale.x + (scale - group.current.scale.x) * ease)

    const t = state.clock.elapsedTime
    if (body.current) {
      body.current.rotation.y = t * 0.22 + scroll * Math.PI * 2
      body.current.rotation.x = Math.sin(t * 0.3) * 0.25 + scroll * Math.PI
    }
    if (shell.current) {
      shell.current.rotation.y = -t * 0.12
      shell.current.rotation.z = t * 0.07 + scroll * Math.PI
    }
  })

  return (
    <group ref={group} position={[PATH[0].x, PATH[0].y, 0]}>
      <sprite scale={[6.5, 6.5, 1]} position={[0, 0, -0.6]}>
        <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.55} />
      </sprite>

      <mesh ref={body}>
        <icosahedronGeometry args={[1, lite ? 6 : 24]} />
        {lite ? (
          <meshStandardMaterial color="#12201a" emissive="#274a10" emissiveIntensity={0.9} metalness={0.9} roughness={0.25} flatShading />
        ) : (
          <MeshDistortMaterial
            color="#131d18"
            emissive="#1f4410"
            emissiveIntensity={0.42}
            metalness={0.95}
            roughness={0.16}
            distort={0.36}
            speed={1.5}
            envMapIntensity={2.2}
          />
        )}
      </mesh>

      <mesh ref={shell}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color={LIME} wireframe transparent opacity={0.2} toneMapped={false} />
      </mesh>

      <Ring radius={1.95} tube={0.008} color={CYAN} tilt={[Math.PI / 2.3, 0.2, 0]} speed={0.35} satellite />
      <Ring radius={2.3} tube={0.006} color={LIME} tilt={[Math.PI / 1.7, -0.5, 0.4]} speed={-0.22} satellite />
      {!lite && <Ring radius={2.7} tube={0.004} color="#e8ffe0" tilt={[0.35, 0.9, 0]} speed={0.14} />}

      {!lite && <Sparkles count={46} scale={5.2} size={2.4} speed={0.35} color={LIME} opacity={0.75} />}
    </group>
  )
}

function buildStarfield(count) {
  // Deterministic pseudo-random so the field is stable between renders
  let seed = 7
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const lime = new THREE.Color(LIME)
  const cyan = new THREE.Color(CYAN)
  const white = new THREE.Color('#dfe9e2')
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (rand() - 0.5) * 26
    positions[i * 3 + 1] = (rand() - 0.5) * 22
    positions[i * 3 + 2] = -rand() * 16 + 2
    const roll = rand()
    const c = roll < 0.18 ? lime : roll < 0.4 ? cyan : white
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return g
}

/** Deep particle field that drifts and parallaxes with scroll. */
function Starfield({ input, lite }) {
  const ref = useRef(null)
  const count = lite ? 420 : 1500

  const geometry = useMemo(() => buildStarfield(count), [count])

  useFrame((state, dt) => {
    if (!ref.current) return
    const { scroll } = input.current
    ref.current.rotation.y = state.clock.elapsedTime * 0.012
    ref.current.position.y += (scroll * 5 - ref.current.position.y) * (1 - Math.exp(-dt * 3))
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={lite ? 0.05 : 0.04} vertexColors transparent opacity={0.8} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/** Wireframe and metal shapes spread down the page; they drift past as you scroll. */
const DRIFTERS = [
  { kind: 'octa', pos: [-5.2, -3.2, -3], size: 0.55, color: CYAN },
  { kind: 'torus', pos: [5.2, -6.4, -2.2], size: 0.6, color: LIME },
  { kind: 'knot', pos: [-5.2, -10.2, -3.4], size: 0.5, color: LIME },
  { kind: 'box', pos: [5.2, -13.6, -2.6], size: 0.6, color: CYAN },
  { kind: 'octa', pos: [-5.2, -17.2, -2.4], size: 0.7, color: LIME },
  { kind: 'torus', pos: [5.2, -20.6, -3.2], size: 0.7, color: CYAN },
  { kind: 'knot', pos: [-5.2, -24, -2.8], size: 0.55, color: CYAN },
]

function Drifter({ kind, pos, size, color, index }) {
  const ref = useRef(null)
  useFrame((state, dt) => {
    if (!ref.current) return
    ref.current.rotation.x += dt * (0.12 + (index % 3) * 0.05)
    ref.current.rotation.y += dt * (0.16 + (index % 4) * 0.04)
    ref.current.position.y = pos[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.25
  })
  return (
    <mesh ref={ref} position={pos} scale={size}>
      {kind === 'octa' && <octahedronGeometry args={[1, 0]} />}
      {kind === 'torus' && <torusGeometry args={[0.8, 0.28, 10, 28]} />}
      {kind === 'knot' && <torusKnotGeometry args={[0.7, 0.2, 80, 10]} />}
      {kind === 'box' && <boxGeometry args={[1.2, 1.2, 1.2]} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.24} toneMapped={false} />
    </mesh>
  )
}

function Drifters({ input, lite }) {
  const ref = useRef(null)
  const list = lite ? DRIFTERS.filter((_, i) => i % 2 === 0) : DRIFTERS

  useFrame((_, dt) => {
    if (!ref.current) return
    // The whole field rises as the page scrolls down, like descending through it
    const target = input.current.scroll * 24
    ref.current.position.y += (target - ref.current.position.y) * (1 - Math.exp(-dt * 3))
  })

  return (
    <group ref={ref}>
      {list.map((d, i) => (
        <Drifter key={`${d.kind}-${d.pos[1]}`} index={i} {...d} />
      ))}
    </group>
  )
}

function Rig({ input, lite }) {
  useFrame((state, dt) => {
    const { px, py, scroll } = input.current
    const ease = 1 - Math.exp(-dt * 2.5)
    const cam = state.camera
    cam.position.x += ((lite ? 0 : px * 0.4) - cam.position.x) * ease
    cam.position.y += ((lite ? 0 : -py * 0.28) - cam.position.y) * ease
    cam.position.z += (6 + Math.sin(scroll * Math.PI) * 0.6 - cam.position.z) * ease
    cam.lookAt(0, 0, 0)
  })
  return null
}

/** WebGL can be unavailable (old GPU, blocked context) — the page must still work without it. */
class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function WorldScene({ lite = false }) {
  const input = useWorldInput()

  return (
    <SceneBoundary>
      <div className="world-scene" aria-hidden="true">
        <Canvas
          dpr={lite ? [1, 1.5] : [1, 1.75]}
          camera={{ position: [0, 0, 6], fov: 40 }}
          gl={{ antialias: !lite, alpha: true, powerPreference: lite ? 'low-power' : 'high-performance' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 3, 3]} intensity={1.6} color="#e8ffe0" />
          <pointLight position={[-4, -1, 3]} intensity={30} color={CYAN} />
          <pointLight position={[3, 2, -2]} intensity={24} color={LIME} />
          {!lite && (
            <Environment resolution={64} frames={1}>
              <color attach="background" args={['#040605']} />
              <Lightformer form="rect" intensity={7} color={LIME} position={[4, 3, 2]} scale={[5, 5, 1]} />
              <Lightformer form="rect" intensity={6} color={CYAN} position={[-5, -1, 2]} scale={[5, 6, 1]} />
              <Lightformer form="ring" intensity={3} color="#ffffff" position={[0, 4, -3]} scale={3} />
            </Environment>
          )}
          <Starfield input={input} lite={lite} />
          <Drifters input={input} lite={lite} />
          <Core input={input} lite={lite} />
          <Rig input={input} lite={lite} />
        </Canvas>
      </div>
    </SceneBoundary>
  )
}
