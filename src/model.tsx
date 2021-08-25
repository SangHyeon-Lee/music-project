import React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { DDSLoader } from "three-stdlib";
import { Suspense } from "react";

interface ModelProps {}

const Model: React.FC<ModelProps> = ({}) => {
  
  const Scene = () => {
    THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());
    // const materials = useLoader(MTLLoader, "Poimandres.mtl");
    const obj = useLoader(OBJLoader, "model/Urogenital_Male.obj", (loader) => {
      // materials.preload();
    });

    console.log(obj);
    return <primitive object={obj} scale={4} />;
  };
  return (
    <div>
      <Canvas  camera={{ position: [0, 0, 4] }}>
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls />
          <ambientLight />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Model;
