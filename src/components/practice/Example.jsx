import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";


//https://stackoverflow.com/questions/65748729/display-3d-model-format-gltf-with-react-js

function Model(props) {
   const { scene } = useGLTF("../images/GLB-02.glb");
   return <primitive object={scene} />;
}

function Example() {

   return (
      <Canvas
         style={{ width: '1000px', height: '500px', }}
         pixelRatio={[1, 2]}
         camera={{ position: [0, 20, 20], fov: 50 }}>
         <ambientLight intensity={1} />
         <Suspense fallback={null}>
            <Model />
         </Suspense>
         <OrbitControls />
      </Canvas>
   )
}

export default Example
