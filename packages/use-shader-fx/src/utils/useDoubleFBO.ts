import * as THREE from "three";
import {
   useCallback,
   useEffect,
   useLayoutEffect,
   useMemo,
   useRef,
} from "react";
import { FBO_OPTION } from "./useSingleFBO";
import { useResolution } from "./useResolution";
import { DoubleRenderTarget, UseFboProps } from "./types";

interface RenderTarget extends DoubleRenderTarget {
   swap: () => void;
}

type FBOUpdateFunction = (
   gl: THREE.WebGLRenderer,
   /**  call before FBO is rendered */
   onBeforeRender?: ({
      read,
      write,
   }: {
      read: THREE.Texture;
      write: THREE.Texture;
   }) => void
) => THREE.Texture;

type UseDoubleFBOReturn = [
   { read: THREE.WebGLRenderTarget; write: THREE.WebGLRenderTarget },
   FBOUpdateFunction
];

/**
 * @param dpr If dpr is set, dpr will be multiplied, default:false
 * @param isSizeUpdate Whether to resize when resizing occurs. If isDpr is true, set FBO to setSize even if dpr is changed, default:false
 * @returns [{read:THREE.WebGLRenderTarget,write:THREE.WebGLRenderTarget} , updateFBO] -Receives the RenderTarget as the first argument and the update function as the second argument.
 */
export const useDoubleFBO = ({
   scene,
   camera,
   size,
   dpr = false,
   isSizeUpdate = false,
}: UseFboProps): UseDoubleFBOReturn => {
   const renderTarget = useRef<RenderTarget>({
      read: null,
      write: null,
      swap: function () {
         let temp = this.read;
         this.read = this.write;
         this.write = temp;
      },
   });

   const resolution = useResolution(size, dpr);
   const initRenderTargets = useMemo(() => {
      const read = new THREE.WebGLRenderTarget(
         resolution.x,
         resolution.y,
         FBO_OPTION
      );
      const write = new THREE.WebGLRenderTarget(
         resolution.x,
         resolution.y,
         FBO_OPTION
      );
      return { read, write };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   renderTarget.current.read = initRenderTargets.read;
   renderTarget.current.write = initRenderTargets.write;

   useLayoutEffect(() => {
      if (isSizeUpdate) {
         renderTarget.current.read?.setSize(resolution.x, resolution.y);
         renderTarget.current.write?.setSize(resolution.x, resolution.y);
      }
   }, [resolution, isSizeUpdate]);

   useEffect(() => {
      const currentRenderTarget = renderTarget.current;
      return () => {
         currentRenderTarget.read?.dispose();
         currentRenderTarget.write?.dispose();
      };
   }, []);

   const updateRenderTarget: FBOUpdateFunction = useCallback(
      (gl, onBeforeRender) => {
         const fbo = renderTarget.current;
         gl.setRenderTarget(fbo.write);
         onBeforeRender &&
            onBeforeRender({
               read: fbo.read!.texture,
               write: fbo.write!.texture,
            });
         gl.render(scene, camera);
         fbo.swap();
         gl.setRenderTarget(null);
         gl.clear();
         return fbo.read?.texture as THREE.Texture;
      },
      [scene, camera]
   );

   return [
      { read: renderTarget.current.read, write: renderTarget.current.write },
      updateRenderTarget,
   ];
};
