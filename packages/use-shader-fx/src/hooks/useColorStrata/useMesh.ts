import { useMemo } from "react";
import * as THREE from "three";
import vertexShader from "./shader/main.vert";
import fragmentShader from "./shader/main.frag";
import { useAddMesh } from "../../utils/useAddMesh";

export class ColorStrataMaterial extends THREE.ShaderMaterial {
   uniforms!: {
      uTexture: { value: THREE.Texture };
      isTexture: { value: boolean };
      laminateLayer: { value: number };
      laminateInterval: { value: THREE.Vector2 };
      laminateDetail: { value: THREE.Vector2 };
      distortion: { value: THREE.Vector2 };
      colorFactor: { value: THREE.Vector3 };
   };
}

export const useMesh = (scene: THREE.Scene) => {
   const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
   const material = useMemo(
      () =>
         new THREE.ShaderMaterial({
            uniforms: {
               uTexture: { value: new THREE.Texture() },
               isTexture: { value: false },
               laminateLayer: { value: 1.0 },
               laminateInterval: { value: new THREE.Vector2(0.1, 0.1) },
               laminateDetail: { value: new THREE.Vector2(1, 1) },
               distortion: { value: new THREE.Vector2(0, 0) },
               colorFactor: { value: new THREE.Vector3(1, 1, 1) },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
         }),
      []
   );
   useAddMesh(scene, geometry, material);
   return material as ColorStrataMaterial;
};
