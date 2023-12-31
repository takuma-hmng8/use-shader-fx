"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
   useNoise,
   useFluid,
   useFxBlending,
   useColorStrata,
   useBrightnessPicker,
} from "@/packages/use-shader-fx/src";
import {
   NoiseParams,
   NOISE_PARAMS,
} from "@/packages/use-shader-fx/src/hooks/useNoise";
import {
   ColorStrataParams,
   COLORSTRATA_PARAMS,
} from "@/packages/use-shader-fx/src/hooks/useColorStrata";
import GUI from "lil-gui";
import { useGUI } from "@/utils/useGUI";

const CONFIG = {
   colorStrata: {
      ...structuredClone(COLORSTRATA_PARAMS),
      laminateLayer: 20,
      laminateInterval: new THREE.Vector2(0.1, 0.1),
      laminateDetail: new THREE.Vector2(0.7, 0.7),
      distortion: new THREE.Vector2(10.0, 10.0),
      colorFactor: new THREE.Vector3(1, 1, 1),
      timeStrength: new THREE.Vector2(1, 1),
      noiseStrength: new THREE.Vector2(1, 1),
   } as ColorStrataParams,
};

const setGUI = (gui: GUI) => {
   //color strata
   const colorStrata = gui.addFolder("colorStrata");
   colorStrata.add(CONFIG.colorStrata, "laminateLayer", 0, 20, 1);
   colorStrata.add(CONFIG.colorStrata, "scale", 0, 1, 0.01);
   const laminateInterval = colorStrata.addFolder("laminateInterval");
   laminateInterval.add(CONFIG.colorStrata.laminateInterval!, "x", 0, 2, 0.01);
   laminateInterval.add(CONFIG.colorStrata.laminateInterval!, "y", 0, 2, 0.01);
   const laminateDetail = colorStrata.addFolder("laminateDetail");
   laminateDetail.add(CONFIG.colorStrata.laminateDetail!, "x", 0, 10, 0.1);
   laminateDetail.add(CONFIG.colorStrata.laminateDetail!, "y", 0, 10, 0.1);
   const distortion = colorStrata.addFolder("distortion");
   distortion.add(CONFIG.colorStrata.distortion!, "x", 0, 10, 0.01);
   distortion.add(CONFIG.colorStrata.distortion!, "y", 0, 10, 0.01);
   const colorFactor = colorStrata.addFolder("colorFactor");
   colorFactor.add(CONFIG.colorStrata.colorFactor!, "x", 0, 10, 0.01);
   colorFactor.add(CONFIG.colorStrata.colorFactor!, "y", 0, 10, 0.01);
   colorFactor.add(CONFIG.colorStrata.colorFactor!, "z", 0, 10, 0.01);
   const timeStrength = colorStrata.addFolder("timeStrength");
   timeStrength.add(CONFIG.colorStrata.timeStrength!, "x", 0, 2, 0.01);
   timeStrength.add(CONFIG.colorStrata.timeStrength!, "y", 0, 2, 0.01);
   const noiseStrength = colorStrata.addFolder("noiseStrength");
   noiseStrength.add(CONFIG.colorStrata.noiseStrength!, "x", 0, 5, 0.01);
   noiseStrength.add(CONFIG.colorStrata.noiseStrength!, "y", 0, 5, 0.01);
};

const setConfig = () => {
   return {
      colorStrata: { ...CONFIG.colorStrata },
   };
};

export const Playground = () => {
   const updateGUI = useGUI(setGUI);

   const ref = useRef<THREE.ShaderMaterial>(null);
   const { size, dpr } = useThree((state) => {
      return { size: state.size, dpr: state.viewport.dpr };
   });

   const [updateColorStrata] = useColorStrata({ size, dpr });

   useFrame((props) => {
      const colorStrata = updateColorStrata(props, {
         ...setConfig().colorStrata,
         texture: false,
         noise: false,
      });
      ref.current!.uniforms.u_fx.value = colorStrata;
      updateGUI();
   });

   return (
      <mesh>
         <planeGeometry args={[2, 2]} />
         <shaderMaterial
            ref={ref}
            vertexShader={`
					varying vec2 vUv;
						void main() {
							vUv = uv;
							gl_Position = vec4(position, 1.0);
						}
						`}
            fragmentShader={`
						precision highp float;
						varying vec2 vUv;
						uniform sampler2D u_fx;
						
						void main() {
							vec2 uv = vUv;
							gl_FragColor = texture2D(u_fx, uv);
						}
					`}
            uniforms={{
               u_fx: { value: null },
            }}
         />
      </mesh>
   );
};
