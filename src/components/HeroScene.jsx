import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line } from '@react-three/drei'
import * as THREE from 'three'

const LIME = '#b8f000'
const CYAN = '#5eead4'
const STEEL = '#94a3b8'

function Network({ animate }) {
  const group = useRef(null)
  const nodes = useMemo(() => {
    const pts = []
    for (let i = 0; i < 28; i += 1) {
      const a = (i / 28) * Math.PI * 2
      const r = 1.6 + (i % 5) * 0.22
      pts.push(new THREE.Vector3(
        Math.cos(a) * r * (0.7 + (i % 3) * 0.15),
        Math.sin(a * 1.3) * 0.85 + (i % 4) * 0.12,
        Math.sin(a) * r * 0.55 - 0.4,
      ))
    }
    return pts
  }, [])

  const segments = useMemo(() => {
    const lines = []
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        if (nodes[i].distanceTo(nodes[j]) < 1.45) {
          lines.push([nodes[i], nodes[j]])
        }
      }
    }
    return lines
  }, [nodes])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const mx = state.pointer.x
    const my = state.pointer.y
    if (animate) {
      group.current.rotation.y = t * 0.12 + mx * 0.35
      group.current.rotation.x = my * 0.2 + Math.sin(t * 0.4) * 0.08
    } else {
      group.current.rotation.y = mx * 0.15
      group.current.rotation.x = my * 0.1
    }
  })

  return (
    <group ref={group}>
      {segments.map((pts, i) => (
        <Line
          key={`seg-${i}`}
          points={pts}
          color={i % 3 === 0 ? LIME : STEEL}
          lineWidth={1}
          transparent
          opacity={0.35}
        />
      ))}
      {nodes.map((p, i) => (
        <mesh key={`n-${i}`} position={p}>
          <sphereGeometry args={[i % 4 === 0 ? 0.055 : 0.035, 12, 12]} />
          <meshStandardMaterial
            color={i % 5 === 0 ? LIME : i % 3 === 0 ? CYAN : STEEL}
            emissive={i % 5 === 0 ? LIME : '#0a0a0a'}
            emissiveIntensity={i % 5 === 0 ? 0.55 : 0.05}
            roughness={0.35}
            metalness={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

function CoreCrystal({ animate }) {
  const mesh = useRef(null)
  useFrame((state) => {
    if (!mesh.current || !animate) return
    mesh.current.rotation.x = state.clock.elapsedTime * 0.25
    mesh.current.rotation.y = state.clock.elapsedTime * 0.35
  })

  return (
    <Float speed={animate ? 1.4 : 0} rotationIntensity={animate ? 0.4 : 0} floatIntensity={animate ? 0.6 : 0}>
      <mesh ref={mesh} position={[0.2, 0.1, 0.3]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#1a2420"
          emissive={LIME}
          emissiveIntensity={0.22}
          metalness={0.85}
          roughness={0.2}
          wireframe
        />
      </mesh>
      <mesh position={[0.2, 0.1, 0.3]}>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.25}
          transparent
          opacity={0.45}
        />
      </mesh>
    </Float>
  )
}

function Scene({ animate }) {
  return (
    <>
      <color attach="background" args={['#07090c']} />
      <fog attach="fog" args={['#07090c', 4.5, 11]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 3, 2]} intensity={1.1} color="#e8ffe0" />
      <pointLight position={[-3, -1, 2]} intensity={1.2} color={CYAN} />
      <pointLight position={[2, 2, -1]} intensity={0.9} color={LIME} />
      <Network animate={animate} />
      <CoreCrystal animate={animate} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <circleGeometry args={[4, 48]} />
        <meshStandardMaterial color="#0c1110" metalness={0.8} roughness={0.4} />
      </mesh>
    </>
  )
}

export default function HeroScene({ animate = true }) {
  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.35, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene animate={animate} />
        </Suspense>
      </Canvas>
      <div className="hero-scene__veil" />
    </div>
  )
}
