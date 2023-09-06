varying vec3 vPosition;
uniform sampler2D uTexture;
varying vec3 vNormal;
varying vec2 vUv;
uniform float uRadius;
uniform float uTime;
varying float vDisplacement;

void main() {
    gl_FragColor = vec4(vec3(vDisplacement),1);
}