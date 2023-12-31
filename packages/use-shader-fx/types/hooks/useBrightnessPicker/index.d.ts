import * as THREE from "three";
import { Size } from "@react-three/fiber";
import { HooksReturn } from "../types";
export type BrightnessPickerParams = {
    /** pick brightness from this texture , default:THREE.Texture */
    texture?: THREE.Texture;
    /** default:(0.5,0.5,0.5) */
    brightness?: THREE.Vector3;
    /** default:0.0 */
    min?: number;
    /** default:1.0 */
    max?: number;
};
export type BrightnessPickerObject = {
    scene: THREE.Scene;
    material: THREE.Material;
    camera: THREE.Camera;
    renderTarget: THREE.WebGLRenderTarget;
};
export declare const BRIGHTNESSPICKER_PARAMS: BrightnessPickerParams;
/**
 * @link https://github.com/takuma-hmng8/use-shader-fx#usage
 */
export declare const useBrightnessPicker: ({ size, dpr, }: {
    size: Size;
    dpr: number;
}) => HooksReturn<BrightnessPickerParams, BrightnessPickerObject>;
