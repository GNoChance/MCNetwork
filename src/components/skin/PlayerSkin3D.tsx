import { useEffect, useRef } from 'react'
import * as skinview3d from 'skinview3d'

type AnimationType = 'walk' | 'run' | 'idle'

interface PlayerSkin3DProps {
  skinUrl: string
  width?: number
  height?: number
  animation?: AnimationType
  autoRotate?: boolean
  mouseTrack?: boolean
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function PlayerSkin3D({
  skinUrl,
  width = 220,
  height = 380,
  animation = 'walk',
  autoRotate = false,
  mouseTrack = false,
}: PlayerSkin3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const viewer = new skinview3d.SkinViewer({
      canvas: canvasRef.current,
      width,
      height,
      skin: skinUrl,
    })

    viewer.globalLight.intensity = 0.8
    viewer.cameraLight.intensity = 0.4

    if (mouseTrack) {
      // ── Mouse tracking : tête + bras, corps presque fixe ──

      // État souris partagé par closure
      const mouse = { x: 0, y: 0 }

      const onMouseMove = (e: MouseEvent) => {
        mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1  // -1..1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1  // -1..1 (inversé)
      }
      window.addEventListener('mousemove', onMouseMove)

      // Animation custom — appelée chaque frame par skinview3d
      const customAnim: skinview3d.AnimationFn = (player, time) => {
        const { skin } = player

        // ── TÊTE : suit la souris pleinement ──
        skin.head.rotation.y = lerp(skin.head.rotation.y, mouse.x * 0.65, 0.08)
        skin.head.rotation.x = lerp(skin.head.rotation.x, -mouse.y * 0.28, 0.08)

        // ── CORPS : très légère orientation + respiration ──
        skin.body.rotation.y = lerp(skin.body.rotation.y, mouse.x * 0.06, 0.04)
        skin.body.rotation.z = Math.sin(time * 0.9) * 0.012

        // ── BRAS DROIT : réagit à la souris + idle ──
        skin.rightArm.rotation.z = lerp(
          skin.rightArm.rotation.z,
          -0.08 + mouse.x * -0.18 + Math.sin(time * 1.1) * 0.035,
          0.065
        )
        skin.rightArm.rotation.x = lerp(
          skin.rightArm.rotation.x,
          mouse.y * 0.22 + Math.sin(time * 0.8) * 0.04,
          0.065
        )

        // ── BRAS GAUCHE : miroir du droit ──
        skin.leftArm.rotation.z = lerp(
          skin.leftArm.rotation.z,
          0.08 + mouse.x * 0.18 + Math.sin(time * 1.1 + Math.PI) * 0.035,
          0.065
        )
        skin.leftArm.rotation.x = lerp(
          skin.leftArm.rotation.x,
          mouse.y * 0.22 + Math.sin(time * 0.8 + Math.PI) * 0.04,
          0.065
        )

        // ── JAMBES : légère oscillation idle (quasi invisible) ──
        skin.rightLeg.rotation.x = Math.sin(time * 0.8) * 0.025
        skin.leftLeg.rotation.x  = Math.sin(time * 0.8 + Math.PI) * 0.025
      }

      viewer.animations.add(customAnim)

      return () => {
        window.removeEventListener('mousemove', onMouseMove)
        viewer.dispose()
      }

    } else {
      // ── Mode normal : OrbitControls + animation standard ──
      const controls = skinview3d.createOrbitControls(viewer)
      controls.enableRotate = true
      controls.enableZoom = false
      controls.enablePan = false
      controls.autoRotate = autoRotate
      controls.autoRotateSpeed = 1.2

      const anim =
        animation === 'walk'
          ? skinview3d.WalkingAnimation
          : animation === 'run'
          ? skinview3d.RunningAnimation
          : skinview3d.IdleAnimation

      const handle = viewer.animations.add(anim)
      handle.speed = animation === 'run' ? 1.5 : 0.8

      return () => {
        viewer.dispose()
      }
    }
  }, [skinUrl, width, height, animation, autoRotate, mouseTrack])

  return (
    <canvas
      ref={canvasRef}
      style={{ borderRadius: '12px', display: 'block' }}
    />
  )
}
