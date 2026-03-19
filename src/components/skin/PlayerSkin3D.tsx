import { useEffect, useRef } from 'react'
import * as skinview3d from 'skinview3d'

type AnimationType = 'walk' | 'run' | 'idle'

interface PlayerSkin3DProps {
  skinUrl: string
  width?: number
  height?: number
  animation?: AnimationType
  autoRotate?: boolean
}

export function PlayerSkin3D({
  skinUrl,
  width = 220,
  height = 380,
  animation = 'walk',
  autoRotate = false,
}: PlayerSkin3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewerRef = useRef<skinview3d.SkinViewer | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const viewer = new skinview3d.SkinViewer({
      canvas: canvasRef.current,
      width,
      height,
      skin: skinUrl,
    })

    viewer.controls.enabled = true
    viewer.autoRotate = autoRotate
    viewer.globalLight.intensity = 3
    viewer.cameraLight.intensity = 1

    const anim =
      animation === 'walk'
        ? new skinview3d.WalkingAnimation()
        : animation === 'run'
        ? new skinview3d.RunningAnimation()
        : new skinview3d.IdleAnimation()

    anim.speed = animation === 'run' ? 1.5 : 0.8
    viewer.animation = anim

    viewerRef.current = viewer

    return () => {
      viewer.dispose()
      viewerRef.current = null
    }
  }, [skinUrl, width, height, animation, autoRotate])

  return (
    <canvas
      ref={canvasRef}
      style={{ borderRadius: '12px', display: 'block' }}
    />
  )
}
