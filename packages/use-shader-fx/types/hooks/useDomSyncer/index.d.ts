/// <reference types="react" />
import * as THREE from "three";
import { Size } from "@react-three/fiber";
import { HooksReturn } from "../types";
import { IsIntersecting } from "./utils/useIsIntersecting";
export type DomSyncerParams = {
    /** DOM array you want to synchronize */
    dom?: (HTMLElement | Element | null)[];
    /** Texture array that you want to synchronize with the DOM rectangle */
    texture?: THREE.Texture[];
    /** Texture resolution array to pass */
    resolution?: THREE.Vector2[];
    /** default:0.0[] */
    boderRadius?: number[];
    /** the angle you want to rotate */
    rotation?: THREE.Euler[];
    /** Array of callback functions when crossed */
    onIntersect?: ((entry: IntersectionObserverEntry) => void)[];
};
export type DomSyncerObject = {
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderTarget: THREE.WebGLRenderTarget;
    /**
     * A function that returns a determination whether the DOM intersects or not.
     * The boolean will be updated after executing the onIntersect function.
     * @param index - Index of the dom for which you want to return an intersection decision. -1 will return the entire array.
     * @param once - If set to true, it will continue to return true once crossed.
     */
    isIntersecting: IsIntersecting;
    /** Returns the target's DOMRect[] */
    DOMRects: DOMRect[];
};
export declare const DOMSYNCER_PARAMS: DomSyncerParams;
/**
 * @link https://github.com/takuma-hmng8/use-shader-fx#usage
 */
export declare const useDomSyncer: ({ size, dpr, }: {
    size: Size;
    dpr: number;
}, dependencies?: import("react").DependencyList) => HooksReturn<DomSyncerParams, DomSyncerObject>;
