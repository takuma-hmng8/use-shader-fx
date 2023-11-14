import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader, extend, useThree } from "@react-three/fiber";
import { usePerformanceMonitor } from "@react-three/drei";
import { CONFIG, setGUI } from "./config";
import { useGUI } from "@/utils/useGUI";
import {
   FxTextureMaterial,
   TFxTextureMaterial,
} from "@/utils/fxTextureMaterial";
import {
   useFruid,
   useTransitionBg,
   useFogProjection,
   useNoise,
} from "@/packages/use-shader-fx/src";

extend({ FxTextureMaterial });

export const Demo = () => {
   const [bg, bg2] = useLoader(THREE.TextureLoader, [
      "thumbnail.jpg",
      "momo.jpg",
   ]);
   const updateGUI = useGUI(setGUI);
   const mainShaderRef = useRef<TFxTextureMaterial>();

   const size = useThree((state) => state.size);
   const dpr = useThree((state) => state.viewport.dpr);

   const [updateNoise] = useNoise({ size, dpr });

   const [updateFruid, setFruid] = useFruid({
      size,
      dpr,
   });

   const [updateTransitionBg] = useTransitionBg({ size, dpr });
   const [updateFogProjection] = useFogProjection({ size });

   usePerformanceMonitor({
      onChange({ factor }) {
         setFruid({
            pressure_iterations: Math.max(2, Math.floor(20 * factor)),
         });
      },
   });

   useFrame((props) => {
      const noise = updateNoise(props, {
         timeStrength: 0.3,
         noiseOctaves: 8,
         fbmOctaves: 3,
      });

      const fx = updateFruid(props, {
         density_dissipation: CONFIG.fruid.density_dissipation,
         velocity_dissipation: CONFIG.fruid.velocity_dissipation,
         velocity_acceleration: CONFIG.fruid.velocity_acceleration,
         pressure_dissipation: CONFIG.fruid.pressure_dissipation,
         curl_strength: CONFIG.fruid.curl_strength,
         splat_radius: CONFIG.fruid.splat_radius,
         fruid_color: CONFIG.fruid.fruid_color,
      });

      let postFx = updateTransitionBg(props, {
         imageResolution: CONFIG.transitionBg.imageResolution,
         noiseStrength: CONFIG.transitionBg.noiseStrength,
         progress: CONFIG.transitionBg.progress,
         dir: CONFIG.transitionBg.dir,
         texture0: bg,
         texture1: bg2,
         noiseMap: noise,
      });

      if (CONFIG.fogProjection.active) {
         postFx = updateFogProjection(props, {
            distortionStrength: CONFIG.fogProjection.distortionStrength,
            fogEdge0: CONFIG.fogProjection.fogEdge0,
            fogEdge1: CONFIG.fogProjection.fogEdge1,
            fogColor: CONFIG.fogProjection.fogColor,
            texture: postFx,
            noiseMap: noise,
         });
      }

      const main = mainShaderRef.current;
      if (main) {
         main.u_fx = fx;
         main.u_postFx = postFx;
      }
      updateGUI();
   });

   return (
      <mesh>
         <planeGeometry args={[2, 2]} />
         <fxTextureMaterial key={FxTextureMaterial.key} ref={mainShaderRef} />
      </mesh>
   );
};
