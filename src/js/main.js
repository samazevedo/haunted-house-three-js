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

// TEXTURES
const textureLoader = new THREE.TextureLoader()

//LIGHTS
// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight('#5697FE', 0.12)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)

// DIRECTIONAL LIGHT
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, -2)
scene.add(moonLight)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)

// FLOOR TEXTURE => GRASS
const grassColorTexture = textureLoader.load(
    '../static/textures/grass/color.jpg'
)
const grassNormalTexture = textureLoader.load(
    '../static/textures/grass/normal.jpg'
)
const grassAmbientOcclusionTexture = textureLoader.load(
    '../static/textures/grass/ambientOcclusion.jpg'
)
const grassRoughnessTexture = textureLoader.load(
    '../static/textures/grass/roughness.jpg'
)

grassColorTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
// FLOOR
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// HOUSE
const house = new THREE.Group()
scene.add(house)

// wall textures
const bricksColorTexture = textureLoader.load(
    '../static/textures/bricks/color.jpg'
)
const bricksNormalTexture = textureLoader.load(
    '../static/textures/bricks/normal.jpg'
)
const bricksAmbientOcclusionTexture = textureLoader.load(
    '../static/textures/bricks/ambientOcclusion.jpg'
)
const bricksRoughnessTexture = textureLoader.load(
    '../static/textures/bricks/roughness.jpg'
)

// WALLS
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
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

// DOOR TEXTURE
const doorColorTexture = textureLoader.load('../static/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('../static/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
    '../static/textures/door/ambientOcclusion.jpg'
)
const doorMeltalnessTexture = textureLoader.load(
    '../static/textures/door/metalness.jpg'
)
const doorRoughnessTexture = textureLoader.load(
    '../static/textures/door/roughness.jpg'
)
const doorHeightTexture = textureLoader.load(
    '../static/textures/door/height.jpg'
)
const doorNormalTexture = textureLoader.load(
    '../static/textures/door/normal.jpg'
)
// DOOR
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMeltalnessTexture,
        roughnessMap: doorRoughnessTexture,
        transparent: true,
    })
)

door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1
door.position.z = 2 + 0.00001
house.add(door)

// DOOR LIGHT
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

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

// GRAVES
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#AEAEAE' })

for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2 // random angles
    const radius = 3 + Math.random() * 6.5 // random radius
    const x = Math.cos(angle) * radius // get the x position using cosinus
    const z = Math.sin(angle) * radius // get the z position using sinus

    // create the mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    // position
    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow = true

    graves.add(grave)
}

// FOG
const fog = new THREE.Fog('#464647', 5, 18)
scene.fog = fog

// GHOSTS
const ghost1 = new THREE.PointLight('#BFFFDE', 2, 3)
const ghost2 = new THREE.PointLight('#1FFF3D', 2, 3)
const ghost3 = new THREE.PointLight('#8E2CFD', 2, 3)
scene.add(ghost1, ghost2, ghost3)

// RENDERER
const renderer = new THREE.WebGL1Renderer({
    canvas,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#464647')

// SHADOWS
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true

floor.receiveShadow = true

// optimize shadows
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.mapSize.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.mapSize.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.mapSize.far = 7

// Animation

const clock = new THREE.Clock()

const looping = () => {
    const elapsedTime = clock.getElapsedTime()

    // update ghost
    const ghost1Angle = elapsedTime
    ghost1.position.x = Math.cos(ghost1Angle) * 5
    ghost1.position.z = Math.sin(ghost1Angle) * 5
    ghost1.position.y = Math.sin(elapsedTime * 2)

    ghost2.position.x = -Math.cos(elapsedTime) * 2
    ghost2.position.z = Math.sin(elapsedTime) * 7
    ghost2.position.y = Math.sin(elapsedTime * 1) + Math.sin(elapsedTime * 0.32)

    ghost3.position.x = -Math.cos(elapsedTime) * 2
    ghost3.position.z = -Math.sin(elapsedTime) * 7
    ghost3.position.y =
        -Math.sin(elapsedTime * 1) + Math.sin(elapsedTime * 0.32)

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(looping)
}
looping()
