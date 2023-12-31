import * as THREE from "three";
import { Size } from "@react-three/fiber";
import { HooksReturn } from "../types";
export type FxBlendingParams = {
    /** Make this texture Blending , default:THREE.Texture */
    texture?: THREE.Texture;
    /** map texture, default:THREE.Texture */
    map?: THREE.Texture;
    /** map strength , r,g value are affecting , default:0.3 */
    mapIntensity?: number;
};
export type FxBlendingObject = {
    scene: THREE.Scene;
    material: THREE.Material;
    camera: THREE.Camera;
    renderTarget: THREE.WebGLRenderTarget;
};
export declare const FXBLENDING_PARAMS: FxBlendingParams;
/**
 * Blend map to texture. You can change the intensity of fx applied by the rg value of map. Unlike "useBlending", the map color is not reflected.
 * @link https://github.com/takuma-hmng8/use-shader-fx#usage
 */
export declare const useFxBlending: ({ size, dpr, }: {
    size: Size;
    dpr: number;
}) => HooksReturn<FxBlendingParams, FxBlendingObject>;
