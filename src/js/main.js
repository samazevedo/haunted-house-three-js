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
camera.position.z = 15
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

// FLOOR
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#b2ff44' })
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// HOUSE
const house = new THREE.Group()
scene.add(house)

// WALLS
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ color: '#ac8e88' })
)
walls.position.y = 2.5 / 2
house.add(walls)

// ROOF
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#2D2D2D' })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 3
house.add(roof)

// DOOR
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({ color: '#aa7b7b' })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// BUSHES
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#1E861A' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.5, 0.3, 2.3)
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.3, 0.3, 0.3)
bush2.position.set(1.9, 0.2, 2.3)
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-1.1, 0.2, 2.3)
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.5, 0.5, 0.5)
bush4.position.set(-1.5, 0.2, 2.3)

house.add(bush1, bush2, bush3, bush4)

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
