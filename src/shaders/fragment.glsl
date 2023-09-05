varying vec3 vPosition;
uniform sampler2D uTexture;
varying vec3 vNormal;
varying vec2 vUv;
uniform float uRadius;

// signed distance fields
float drawCircle(vec2 position, vec2 center, float radius) {
    return step(radius, distance(position, center));
}

void main() {
    // mix(0.5, 1.0, vUv.x)
    // vec3 viewDirection = normalize(cameraPosition - vPosition);
    // float fresnel = dot(viewDirection, vNormal);
    // line: vec3(step(0.9,1.0 - abs(vUv.x - 0.5)))
    // circle: step(0.6,length(vUv-0.5)))
    // drawCircle: drawCircle(vUv, vec2(0.5), uRadius) | vec3(drawCircle(vUv,vec2(0.5),uRadius))
    // 
    const vec3 DESATURATE = vec3(0.2126, 0.7152, 0.0722);
	vec3 color = texture2D(uTexture, vUv).xyz;
    
    float finalColor = dot(DESATURATE, color);

    gl_FragColor = vec4(vec3(finalColor), 1.0 );
}