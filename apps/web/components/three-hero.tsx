"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ThreeHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const container = containerRef.current

    // Setup scene, camera, renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create file cards group
    const fileGroup = new THREE.Group()
    const cardGeometry = new THREE.BoxGeometry(1.4, 1.8, 0.05)
    const colors = [0x0055FF, 0x7B5CF5, 0x22C55E, 0xF59E0B]

    colors.forEach((color, i) => {
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.2,
        roughness: 0.3,
        metalness: 0.1,
      })

      const card = new THREE.Mesh(cardGeometry, material)
      const angle = (i / colors.length) * Math.PI * 2;
      const radius = 2

      card.position.x = Math.cos(angle) * radius
      card.position.z = Math.sin(angle) * radius
      card.position.y = Math.sin(i * 1.5) * 0.5
      card.rotation.y = -angle

      fileGroup.add(card)
    })

    // Central orb
    const orbGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const orbMaterial = new THREE.MeshStandardMaterial({
      color: 0x7B5CF5,
      emissive: 0x7B5CF5,
      emissiveIntensity: 0.5,
    })
    const centralOrb = new THREE.Mesh(orbGeometry, orbMaterial)
    fileGroup.add(centralOrb)

    // Point light inside group
    const pointLight = new THREE.PointLight(0x7B5CF5, 1, 10)
    pointLight.position.set(0, 0, 0)
    fileGroup.add(pointLight)

    scene.add(fileGroup)

    // General lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    camera.position.z = 6
    camera.position.y = 1

    // Mouse parallax tracking
    let mouseX = 0
    let mouseY = 0
    let targetRotationX = 0
    let targetRotationY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Resize handler
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    
    window.addEventListener("resize", handleResize)

    // Animation Loop
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Auto rotation
      fileGroup.rotation.y += 0.003

      // Mouse parallax easing
      targetRotationY = mouseX * 0.15
      targetRotationX = mouseY * 0.15

      fileGroup.rotation.x += (targetRotationX - fileGroup.rotation.x) * 0.05
      fileGroup.rotation.y += (targetRotationY - fileGroup.rotation.y) * 0.05

      // Floating vertical movement
      const time = Date.now() * 0.001
      fileGroup.position.y = Math.sin(time) * 0.2

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      
      // Dispose geometry and materials to prevent memory leak
      cardGeometry.dispose()
      orbGeometry.dispose()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose()
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose())
            } else {
              object.material.dispose()
            }
          }
        }
      })
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
