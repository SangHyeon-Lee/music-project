import React, { memo, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { DDSLoader } from "three-stdlib";
import { Suspense } from "react";
import { Group } from "three";

interface ModelProps {}

const Model: React.FC<ModelProps> = ({}) => {
  const [pos, setPos] = useState([
    0.008337695545746877, -0.9525817161016015, 0.19693626481506687,
  ]);


  
  const Scene = () => {
    function handleSubmit(e: any) {
      // e.preventDefault();
      e.stopPropagation();
  
      console.log(e);
      setPos(e.point);
    }
  
    function Node(pos: any) {
      return (
        <mesh position={pos} receiveShadow castShadow>
          <sphereBufferGeometry args={[1000, 16, 16]} />
          <meshBasicMaterial color={"hotpink"} />
        </mesh>
      );
    }
    THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());
    
    const [obj, setobj] = useState(new Group);

    var mtlLoader = new MTLLoader();
    mtlLoader.load("new_new_model/Urogenital_Male.mtl", function (materials) {
      materials.preload();

      var objLoader = new OBJLoader();
      objLoader.setMaterials(materials);

      objLoader.load("new_new_model/Urogenital_Male.obj", function (object) {
        setobj(object);
       
      });

    });
    
    // const materials = useLoader(MTLLoader, "new_model/Urogenital_Male.mtl");
    // const obj = useLoader(OBJLoader, "new_model/Urogenital_Male.obj", (loader) => {
    //   materials.preload();
    //   loader.setMaterials(materials);
    // });

    

    
    return (
      <group>
        <Node pos={pos} />
        <primitive
          onPointerOver={(e: any) => e.stopPropagation()}
          onPointerOut={(e: any) => e.intersections.length === 0}
          onPointerDown={(e: any) => handleSubmit(e)}
          object={obj}
          scale={10}
        />
      </group>
    );
  };
  return (
    <div>
      <Canvas
        style={{ width: "400px", height: "700px", left: "50px" }}
        camera={{ position: [0, 0, 4] }}
      >
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
