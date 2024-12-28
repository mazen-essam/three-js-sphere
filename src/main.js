import * as THREE from "three";
import "./style.css";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//  Scene
const scene = new THREE.Scene();
// Create our Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.3,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Lights
const light = new THREE.PointLight(0xffffff, 150, 150);
light.position.set(0, 10, 10);
// const directionalLight = new THREE.DirectionalLight(0xff0000, 1); // Red light
// directionalLight.position.set(5, 5, 5); // Position the light
// scene.add(directionalLight);
// light.intensity = 20;
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);
// Controls

const controls = new OrbitControls(camera, canvas);
// make smooth moving remove it and try
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  // renderer.render(scene, camera);
});
const loop = () => {
  // mesh.position.y += 0.1;
  // mesh.rotation.x += 0.2;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

//  Timeline Animation
const t1 = gsap.timeline({ defaults: { duration: 1 } });
t1.fromTo(
  mesh.scale,
  { x: 0, y: 0, z: 0, ease: "bounce.out" },
  { x: 1, y: 1, z: 1 }
);
t1.fromTo("nav", { y: "-100%" }, { y: "0%" });
t1.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// Mouse Animation Color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => {
  mouseDown = true;
});
window.addEventListener("mouseup", () => {
  mouseDown = true;
});
window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    // new THREE.Color(`rgb(0,100,150)`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

// Radius control
let radiusInc = document.getElementById("radiusInc");
let radiusDec = document.getElementById("radiusDec");
radiusInc.addEventListener("click", () => {
  mesh.scale.x += 0.1;
  mesh.scale.y += 0.1;
  mesh.scale.z += 0.1;
  if (mesh.scale.x >= 2) {
    mesh.scale.x = 2;
    mesh.scale.y = 2;
    mesh.scale.z = 2;
  }
});
radiusDec.addEventListener("click", () => {
  mesh.scale.x -= 0.1;
  mesh.scale.y -= 0.1;
  mesh.scale.z -= 0.1;
  if (mesh.scale.x <= 0.1) {
    mesh.scale.x = 0.1;
    mesh.scale.y = 0.1;
    mesh.scale.z = 0.1;
  }
});
// Rotation control
let rotate = document.getElementById("toggle");
rotate.addEventListener("click", () => {
  controls.autoRotate = !controls.autoRotate;
  renderer.render(scene, camera);
  console.log(controls.autoRotate);
});
