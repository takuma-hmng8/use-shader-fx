import * as THREE from "three";
export declare class BlendingMaterial extends THREE.ShaderMaterial {
    uniforms: {
        u_texture: {
            value: THREE.Texture;
        };
        u_map: {
            value: THREE.Texture;
        };
        u_mapIntensity: {
            value: number;
        };
        u_brightness: {
            value: THREE.Vector3;
        };
        u_min: {
            value: number;
        };
        u_max: {
            value: number;
        };
        u_color: {
            value: THREE.Color;
        };
    };
}
export declare const useMesh: (scene: THREE.Scene) => BlendingMaterial;
