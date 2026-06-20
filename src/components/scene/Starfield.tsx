import { Stars, Sparkles } from '@react-three/drei'

export default function Starfield() {
  return (
    <>
      <Stars
        radius={80}
        depth={50}
        count={4000}
        factor={3.5}
        saturation={0.1}
        fade
        speed={0.4}
      />
      <Sparkles
        count={60}
        scale={18}
        size={1.2}
        speed={0.25}
        opacity={0.5}
        color="#a0c0ff"
      />
    </>
  )
}
