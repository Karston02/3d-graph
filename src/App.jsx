import { useEffect } from 'react'
import * as THREE from 'three'
import SceneInit from './SceneInit'
import axios from 'axios'
import data_file from './data-handling/organized_data.json'

function App() {
  useEffect(() => {
    const scene = new SceneInit('graphCanvas');
    scene.initialize();
    scene.animate();

    let nodeDictionary = {};

    // get info from data file
    axios.get(data_file).then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    })

    // create nodes (spheres) & add to dictionary
    for (let i = 0; i < 50; i++) {
      const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
      const sphereMaterial = new THREE.MeshNormalMaterial();
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

      sphereMesh.position.x = Math.random() * 40 - 20; // Adjust the range as needed
      sphereMesh.position.y = Math.random() * 40 - 20;
      sphereMesh.position.z = Math.random() * 40 - 20;

      // add position to dictionary w key of node id
      nodeDictionary[i] = [sphereMesh.position.x, sphereMesh.position.y, sphereMesh.position.z];

      scene.scene.add(sphereMesh)
    }

    // create edges (lines) and connect them to 2 random nodes
    for (let i = 0; i < 100; i++) {
      const node1 = Math.floor(Math.random() * 100);
      const node2 = Math.floor(Math.random() * 100);

      const node1Pos = nodeDictionary[node1];
      const node2Pos = nodeDictionary[node2];

      // Create line geometry
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([...node1Pos, ...node2Pos]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

      // Create line material
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });

      // Create line mesh
      const lineMesh = new THREE.Line(geometry, material);

      scene.scene.add(lineMesh);
    }
  }, []);

  return (
    <div>
      <canvas id="graphCanvas"/>
    </div>
  )
}

export default App
