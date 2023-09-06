import * as THREE from 'three'
import { addPass, useCamera, useGui, useRenderSize, useScene, useTick } from './render/init.js'
// import postprocessing passes
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import vertexPars from './shaders/vertex_pars.glsl'
import vertexMain from './shaders/vertex_main.glsl'

import fragmentMain from './shaders/fragment_main.glsl'
import fragmentPars from './shaders/fragment_pars.glsl'

const startApp = () => {
  const scene = useScene()
  const camera = useCamera()
  const gui = useGui()
  const { width, height } = useRenderSize()
  // loadFont()
  // settings
  const MOTION_BLUR_AMOUNT = 0.725

  // lighting
  const dirLight = new THREE.DirectionalLight('#526cff', 0.6)
  dirLight.position.set(2, 2, 2)

  const ambientLight = new THREE.AmbientLight('#4255ff', 0.5)
  scene.add(dirLight, ambientLight)

  // font

  var loader = new FontLoader()
  var pivot;
  var text;
  loader.load("fonts/helvetiker_regular.typeface.json", (font) => {
    console.log("aasdlkjhasld")
    var dummy = new THREE.MeshBasicMaterial({color: '0x00b294',wireframe:'true'})
    obj = new TextGeometry("AT", {

      font: font,
      size: 20,
      height: 5,
      curveSegments: 1,
      bevelEnabled: false
    });
    
    console.log(font)
    text = new THREE.Mesh( obj, dummy );
    text.position.x = 0;
    text.position.y = 0;
    text.position.z = 0;
    // text.rotation.y = 13
    scene.add(text)
  })
  
  // meshes
  const geometry = new THREE.IcosahedronGeometry(0,400)
  const material = new THREE.MeshStandardMaterial({
    onBeforeCompile: (shader) => {
      // store shader reference
      material.userData.shader = shader

      shader.uniforms.uTime = {value : 0}
      
      const parsVertexString = /* glsl */ `#include <displacementmap_pars_vertex>`
      shader.vertexShader = shader.vertexShader.replace(
        parsVertexString,
        parsVertexString + vertexPars
      )

      const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`
      shader.vertexShader = shader.vertexShader.replace(mainVertexString, mainVertexString + vertexMain)

      const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`
      const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`
      shader.fragmentShader = shader.fragmentShader.replace(
        parsFragmentString,
        parsFragmentString + fragmentPars
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        mainFragmentString,
        mainFragmentString + fragmentMain
      )
    }
  })

  const ico = new THREE.Mesh(geometry, material)
  scene.add(ico)

  // GUI
  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'z', 0, 10)
  // cameraFolder.add(material.uniforms.uRadius,"value",0,1).min(0).max(1)

  cameraFolder.open()


  // postprocessing
  const renderTargetParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    stencilBuffer: false,
  }

  addPass(new UnrealBloomPass(new THREE.Vector2(width,height), 0.7, 0.4, 0.4))
  useTick(({ timestamp, timeDiff }) => {
    material.userData.shader.uniforms.uTime.value = timestamp / 5000
  })
}

export default startApp
