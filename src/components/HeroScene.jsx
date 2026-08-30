import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line } from '@react-three/drei'
import * as THREE from 'three'

const LIME = '#b8f000'
const CYAN = '#5eead4'
const STEEL = '#94a3b8'

function Network({ animate, lite }) {
  const group = useRef(null)
  const count = lite ? 14 : 28
  const linkDist = lite ? 1.7 : 1.45

  const nodes = useMemo(() => {
    const pts = []
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2
      const r = 1.6 + (i % 5) * 0.22
      pts.push(new THREE.Vector3(
        Math.cos(a) * r * (0.7 + (i % 3) * 0.15),
        Math.sin(a * 1.3) * 0.85 + (i % 4) * 0.12,
        Math.sin(a) * r * 0.55 - 0.4,
      ))
    }
    return pts
  }, [count])

  const segments = useMemo(() => {
    const lines = []
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        if (nodes[i].distanceTo(nodes[j]) < linkDist) {
          lines.push([nodes[i], nodes[j]])
        }
      }
    }
    return lines
  }, [nodes, linkDist])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const mx = lite ? 0 : state.pointer.x
    const my = lite ? 0 : state.pointer.y
    if (animate) {
      group.current.rotation.y = t * (lite ? 0.18 : 0.12) + mx * 0.35
      group.current.rotation.x = my * 0.2 + Math.sin(t * 0.4) * (lite ? 0.12 : 0.08)
    } else {
      group.current.rotation.y = mx * 0.15
      group.current.rotation.x = my * 0.1
    }
  })

  const segmentsToDraw = lite ? segments.filter((_, i) => i % 2 === 0) : segments

  return (
    <group ref={group}>
      {segmentsToDraw.map((pts, i) => (
        <Line
          key={`seg-${i}`}
          points={pts}
          color={i % 3 === 0 ? LIME : STEEL}
          lineWidth={lite ? 1.25 : 1}
          transparent
          opacity={lite ? 0.45 : 0.35}
        />
      ))}
      {nodes.map((p, i) => (
        <mesh key={`n-${i}`} position={p}>
          <sphereGeometry args={[i % 4 === 0 ? 0.055 : 0.035, lite ? 8 : 12, lite ? 8 : 12]} />
          {lite ? (
            <meshBasicMaterial
              color={i % 5 === 0 ? LIME : i % 3 === 0 ? CYAN : STEEL}
              transparent
              opacity={0.95}
            />
          ) : (
            <meshStandardMaterial
              color={i % 5 === 0 ? LIME : i % 3 === 0 ? CYAN : STEEL}
              emissive={i % 5 === 0 ? LIME : '#0a0a0a'}
              emissiveIntensity={i % 5 === 0 ? 0.55 : 0.05}
              roughness={0.35}
              metalness={0.7}
            />
          )}
        </mesh>
      ))}
    </group>
  )
}

function CoreCrystal({ animate, lite }) {
  const mesh = useRef(null)
  useFrame((state) => {
    if (!mesh.current || !animate) return
    mesh.current.rotation.x = state.clock.elapsedTime * 0.25
    mesh.current.rotation.y = state.clock.elapsedTime * 0.35
  })

  const content = (
    <>
      <mesh ref={mesh} position={[0.2, 0.1, 0.3]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial color={LIME} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh position={[0.2, 0.1, 0.3]}>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.35} />
      </mesh>
    </>
  )

  if (lite) return <group>{content}</group>

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

function Scene({ animate, lite }) {
  return (
    <>
      <color attach="background" args={['#07090c']} />
      <fog attach="fog" args={['#07090c', lite ? 5.5 : 4.5, lite ? 12 : 11]} />
      <ambientLight intensity={lite ? 0.7 : 0.35} />
      {!lite && (
        <>
          <directionalLight position={[4, 3, 2]} intensity={1.1} color="#e8ffe0" />
          <pointLight position={[-3, -1, 2]} intensity={1.2} color={CYAN} />
          <pointLight position={[2, 2, -1]} intensity={0.9} color={LIME} />
        </>
      )}
      <Network animate={animate} lite={lite} />
      <CoreCrystal animate={animate} lite={lite} />
      {!lite && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
          <circleGeometry args={[4, 48]} />
          <meshStandardMaterial color="#0c1110" metalness={0.8} roughness={0.4} />
        </mesh>
      )}
    </>
  )
}

export default function HeroScene({ animate = true, lite = false }) {
  return (
    <div className={`hero-scene${lite ? ' hero-scene--lite' : ''}`} aria-hidden="true">
      <Canvas
        dpr={lite ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0.35, lite ? 4.6 : 4.2], fov: lite ? 46 : 42 }}
        gl={{
          antialias: !lite,
          alpha: false,
          powerPreference: lite ? 'low-power' : 'high-performance',
        }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <Scene animate={animate} lite={lite} />
        </Suspense>
      </Canvas>
      <div className="hero-scene__veil" />
    </div>
  )
}
