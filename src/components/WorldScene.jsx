import { Component, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshDistortMaterial, MeshReflectorMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const RED = '#ff2b3d'
const RED_LIGHT = '#ff6b78'
const CHROME = '#f2f2f2'
const WARM_WHITE = '#ffffff'

/** One stop of the corridor per page section, in page order. */
const SECTIONS = ['home', 'about', 'skills', 'experience', 'projects', 'contact']
const STEP = 12
const DEPTH = SECTIONS.length * STEP + 20

/**
 * Scroll is read as a float "station" index: 2.5 means halfway through the third section.
 * The camera flies down the corridor by that index, so each section meets its own object.
 */
function useWorldInput() {
  const input = useRef({ station: 0, px: 0, py: 0 })

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.5
      let station = 0
      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id)
        if (!el) return
        const top = el.offsetTop
        const h = Math.max(1, el.offsetHeight)
        if (mid >= top) station = i + Math.min(1, (mid - top) / h) * 0.5
      })
      input.current.station = Math.max(0, Math.min(SECTIONS.length - 1, station))
    }
    const onPointer = (e) => {
      input.current.px = (e.clientX / window.innerWidth) * 2 - 1
      input.current.py = (e.clientY / window.innerHeight) * 2 - 1
    }
    onScroll()
    // Content loads async, so section heights settle after mount
    const settle = window.setTimeout(onScroll, 1200)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return input
}

/** Places a station's object: right of the copy on wide screens, small and above it on phones. */
function Station({ index, lite, children }) {
  const ref = useRef(null)
  const aspect = useThree((s) => s.viewport.aspect)
  const narrow = aspect < 1

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = (narrow ? 2.3 : 0.2) + Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.12
  })

  return (
    <group ref={ref} position={[narrow ? 1.5 : 2.6, 0, -index * STEP]} scale={narrow ? 0.5 : lite ? 0.6 : 0.85}>
      {children}
    </group>
  )
}

function Spin({ speed = [0, 0.3, 0], children }) {
  const ref = useRef(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.x += dt * speed[0]
    ref.current.rotation.y += dt * speed[1]
    ref.current.rotation.z += dt * speed[2]
  })
  return <group ref={ref}>{children}</group>
}

function Red(props) {
  return <meshStandardMaterial color={RED} metalness={0.75} roughness={0.25} emissive={RED} emissiveIntensity={0.18} envMapIntensity={1.6} {...props} />
}

function Chrome(props) {
  return <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.22} emissive="#55585e" emissiveIntensity={0.35} envMapIntensity={2} {...props} />
}

function Ring({ radius, tube = 0.02, chrome, tilt = [0, 0, 0], speed = 0.3 }) {
  return (
    <group rotation={tilt}>
      <Spin speed={[0, 0, speed]}>
        <mesh>
          <torusGeometry args={[radius, tube, 16, 160]} />
          {chrome ? <Chrome /> : <Red />}
        </mesh>
      </Spin>
    </group>
  )
}

/* Home: liquid-red core inside chrome rings */
function HomeCore({ lite }) {
  return (
    <>
      <mesh>
        <icosahedronGeometry args={[1, lite ? 8 : 32]} />
        {lite ? (
          <Red roughness={0.3} />
        ) : (
          <MeshDistortMaterial color={RED} metalness={1} roughness={0.14} distort={0.32} speed={1.4} envMapIntensity={2} />
        )}
      </mesh>
      <Ring radius={1.6} chrome tilt={[Math.PI / 2.3, 0.2, 0]} speed={0.35} />
      <Ring radius={1.95} tube={0.012} chrome tilt={[Math.PI / 1.7, -0.5, 0.4]} speed={-0.22} />
      {!lite && <Ring radius={2.3} tube={0.008} tilt={[0.35, 0.9, 0]} speed={0.14} />}
    </>
  )
}

/* About: armillary sphere */
function Armillary() {
  return (
    <Spin speed={[0, 0.25, 0]}>
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <Red />
      </mesh>
      <Ring radius={1.2} tube={0.03} tilt={[0, 0, 0]} speed={0} />
      <Ring radius={1.2} tube={0.03} chrome tilt={[Math.PI / 2, 0, 0]} speed={0} />
      <Ring radius={1.2} tube={0.03} tilt={[0, Math.PI / 2, 0]} speed={0} />
      <Ring radius={1.45} tube={0.02} chrome tilt={[Math.PI / 2.6, 0.4, 0]} speed={0.5} />
      <mesh rotation={[0, 0, 0.41]}>
        <cylinderGeometry args={[0.015, 0.015, 3.4, 8]} />
        <Red />
      </mesh>
    </Spin>
  )
}

/* Skills: chrome crystal */
function Crystal() {
  return (
    <Spin speed={[0.1, 0.4, 0]}>
      <group scale={0.62}>
        <mesh scale={[1, 1.6, 1]}>
        <octahedronGeometry args={[1, 0]} />
        <Chrome flatShading metalness={0.35} roughness={0.3} />
      </mesh>
      <mesh scale={[1.25, 2, 1.25]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={RED} wireframe transparent opacity={0.35} toneMapped={false} />
      </mesh>
      </group>
    </Spin>
  )
}

/* Experience: red slabs rising as a staircase */
function Stairs() {
  return (
    <Spin speed={[0, 0.2, 0]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, -1 + i * 0.5, 0]} rotation={[0, i * 0.45, 0]}>
          <boxGeometry args={[1.5, 0.12, 0.6]} />
          {i % 2 ? <Chrome /> : <Red />}
        </mesh>
      ))}
    </Spin>
  )
}

/* Projects: frames orbiting a centre */
function Frames() {
  return (
    <Spin speed={[0, 0.35, 0]}>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(a) * 1.3, 0, Math.sin(a) * 1.3]} rotation={[0, -a + Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[0.9, 0.62, 0.04]} />
              {i % 2 ? <Chrome emissive={CHROME} emissiveIntensity={0.08} /> : <Red emissive={RED} emissiveIntensity={0.12} />}
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.8, 0.52]} />
              <meshBasicMaterial color={RED_LIGHT} transparent opacity={0.1} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          </group>
        )
      })}
    </Spin>
  )
}

/* Contact: red torus knot */
function Knot({ lite }) {
  return (
    <Spin speed={[0.2, 0.3, 0]}>
      <mesh>
        <torusKnotGeometry args={[0.85, 0.26, lite ? 96 : 220, lite ? 12 : 32]} />
        <Red />
      </mesh>
    </Spin>
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
  const red = new THREE.Color(RED_LIGHT)
  const chrome = new THREE.Color(CHROME)
  const white = new THREE.Color(WARM_WHITE)
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (rand() - 0.5) * 40
    positions[i * 3 + 1] = rand() * 18 - 3
    positions[i * 3 + 2] = 10 - rand() * DEPTH
    const roll = rand()
    const c = roll < 0.25 ? red : roll < 0.5 ? chrome : white
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return g
}

function Starfield({ lite }) {
  const geometry = useMemo(() => buildStarfield(lite ? 600 : 2200), [lite])
  return (
    <points geometry={geometry}>
      <pointsMaterial size={lite ? 0.06 : 0.045} vertexColors transparent opacity={0.85} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/** Reflective floor with a red grid running the length of the corridor. */
function Floor({ lite }) {
  return (
    <group position={[0, -2.2, 10 - DEPTH / 2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, DEPTH]} />
        {lite ? (
          <meshStandardMaterial color="#080808" metalness={0.8} roughness={0.5} />
        ) : (
          <MeshReflectorMaterial
            resolution={512}
            blur={[300, 80]}
            mixBlur={1}
            mixStrength={8}
            roughness={0.85}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#080808"
            metalness={0.6}
          />
        )}
      </mesh>
      <gridHelper
        args={[DEPTH, DEPTH / 2, RED, '#3a0a10']}
        position={[0, 0.01, 0]}
        material-transparent
        material-opacity={lite ? 0.18 : 0.35}
      />
    </group>
  )
}

function Rig({ input, lite }) {
  useFrame((state, dt) => {
    const { px, py, station } = input.current
    const ease = 1 - Math.exp(-dt * 2.5)
    const cam = state.camera
    cam.position.x += ((lite ? 0 : px * 0.5) - cam.position.x) * ease
    cam.position.y += ((lite ? 0.3 : 0.3 - py * 0.3) - cam.position.y) * ease
    cam.position.z += (8.5 - station * STEP - cam.position.z) * ease
    cam.lookAt(cam.position.x * 0.4, 0, cam.position.z - 8)
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
  const objects = [
    <HomeCore key="home" lite={lite} />,
    <Armillary key="about" />,
    <Crystal key="skills" />,
    <Stairs key="experience" />,
    <Frames key="projects" />,
    <Knot key="contact" lite={lite} />,
  ]

  return (
    <SceneBoundary>
      <div className="world-scene" aria-hidden="true">
        <Canvas
          dpr={lite ? [1, 1.5] : [1, 1.75]}
          camera={{ position: [0, 0.3, 8.5], fov: 45, near: 0.1, far: 120 }}
          gl={{ antialias: !lite, alpha: true, powerPreference: lite ? 'low-power' : 'high-performance' }}
        >
          <fog attach="fog" args={["#050505", 9, 16]} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 6, 3]} intensity={1.8} color={WARM_WHITE} />
          <Environment resolution={lite ? 32 : 128} frames={1}>
            <color attach="background" args={['#050505']} />
            <Lightformer form="rect" intensity={6} color={RED_LIGHT} position={[4, 3, 2]} scale={[5, 5, 1]} />
            <Lightformer form="rect" intensity={5} color={CHROME} position={[-5, -1, 2]} scale={[5, 6, 1]} />
            <Lightformer form="ring" intensity={3} color="#ffffff" position={[0, 4, -3]} scale={3} />
          </Environment>
          <Starfield lite={lite} />
          <Floor lite={lite} />
          {!lite && (
            <Sparkles count={160} scale={[16, 6, DEPTH]} position={[0, 0.5, 10 - DEPTH / 2]} size={2.2} speed={0.3} color={RED_LIGHT} opacity={0.7} />
          )}
          {objects.map((obj, i) => (
            <Station key={SECTIONS[i]} index={i} lite={lite}>
              {obj}
            </Station>
          ))}
          <Rig input={input} lite={lite} />
        </Canvas>
      </div>
    </SceneBoundary>
  )
}
