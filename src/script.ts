import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import { times } from "lodash";

//
const loadingManager = new THREE.LoadingManager()
loadingManager.onError = (reason: any) =>
{
    console.log(`loading error ${reason}`)
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const spherecolorTexture = textureLoader.load('/generative/Abstract_011_basecolor.jpg');
const sphereambiantOcclusionTexture = textureLoader.load('/generative/Abstract_011_ambientOcclusion.jpg');
const sphereheightTexture = textureLoader.load('/generative/Abstract_011_height.png');
const spheremetallicTexture = textureLoader.load('/generative/Abstract_011_metallic.jpg');
const sphereroughnessTexture = textureLoader.load('/generative/Abstract_011_roughness.jpg');
const spherenormalMapTexture = textureLoader.load('/generative/Abstract_011_normal.jpg');

const planecolorTexture = textureLoader.load('/metal/Metal_scratched_009_basecolor.jpg');
const planeambiantOcclusionTexture = textureLoader.load('/metal/Metal_scratched_009_ambientOcclusion.jpg');
const planeheightTexture = textureLoader.load('/metal/Metal_scratched_009_height.png');
const planemetallicTexture = textureLoader.load('/metal/Metal_scratched_009_metallic.jpg');
const planeroughnessTexture = textureLoader.load('/metal/Metal_scratched_009_roughness.jpg');
const planenormalMapTexture = textureLoader.load('/metal/Metal_scratched_009_normal.jpg');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

times(5, () => {
    const pointLight = new THREE.PointLight(0xffffff, 0.25);
    pointLight.position.x = 10 * Math.random();
    pointLight.position.y = 10 * Math.random();
    pointLight.position.z = 10 * Math.random();
    scene.add(pointLight);
})

// Objects
const geometry = new THREE.SphereGeometry(1, 128, 128);
const material = new THREE.MeshStandardMaterial({
    map: spherecolorTexture,
    aoMap: sphereambiantOcclusionTexture,
    aoMapIntensity: 1,
    displacementMap: sphereheightTexture,
    displacementScale: 0.25,
    metalnessMap: spheremetallicTexture,
    roughnessMap: sphereroughnessTexture,
    normalMap: spherenormalMapTexture
});
const mesh = new THREE.Mesh(geometry, material);

const plane = new THREE.BoxGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
    map: planecolorTexture,
    aoMap: planeambiantOcclusionTexture,
    aoMapIntensity: 1,
    displacementMap: planeheightTexture,
    displacementScale: 0.25,
    metalnessMap: planemetallicTexture,
    roughnessMap: planeroughnessTexture,
    normalMap: planenormalMapTexture
});
const basicMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff })
const planeMesh = new THREE.Mesh(plane, planeMaterial);
planeMesh.position.set(0, -1.75, 0);
planeMesh.rotateX(-Math.PI/2)


scene.add(mesh, planeMesh);


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Axe Helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
});

renderer.setSize(sizes.width, sizes.height);
//renderer.render(scene, camera);


const controls = new OrbitControls( camera, renderer.domElement );

/**
 * Animate
 */
const clock = new THREE.Clock();


function tick()
{
    const elapsedTime = clock.getDelta();

    mesh.rotation.x += 0.1 * elapsedTime;
    mesh.rotation.y += 0.25 * elapsedTime;
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

/**
 * Debug
 */
const gui = new dat.GUI();
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
mesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2));

window.onload = () => {
    tick();
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement;
    const canvas = document.querySelector('canvas.webgl');

    if(!canvas) {
        return;
    }

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        
    }
})