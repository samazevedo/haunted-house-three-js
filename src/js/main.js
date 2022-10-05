import '../styles/style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// DEBUG
const gui = new dat.GUI()

// canvas
const canvas = document.getElementById('canvas')
const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

// CAMERA
let fov = 50
let near = 0.1
let far = 100
let aspect = sizes.width / sizes.height

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 5
camera.position.x = 4
camera.position.y = 2
scene.add(camera)

// CONTROLS
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// RESIZE WINDOW
window.addEventListener('resize', () => {
    // update size
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // update aspect ratio
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// FULLSCREEN double click

window.addEventListener('dblclick', () => {
    const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
})

// OBJECTS

const material = new THREE.MeshBasicMaterial({ color: '#b2ff44' })
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)

// FLOOR
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#b2ff44' })
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

//LIGHTS
// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.5)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)

// DIRECTIONAL LIGHT
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, -2)
scene.add(moonLight)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)

// RENDERER
const renderer = new THREE.WebGL1Renderer({
    canvas,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animation
const looping = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(looping)
}
looping()
