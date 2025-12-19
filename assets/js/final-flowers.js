import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.151.0/three.module.js";

const wrapper = document.querySelector('.final-section__canvas-wrapper');
const HORIZONTAL_MARGIN = 0.05;
const TOP_MARGIN = 0.15;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let autoBloomInterval = null;

if (wrapper) {
    // Limpa qualquer conteúdo existente no wrapper
    wrapper.innerHTML = '';
    
    // Cria o container das flores
    const container = document.createElement('div');
    container.className = 'flowers-container';
    
    // Cria o canvas
    const canvasEl = document.createElement('canvas');
    canvasEl.id = 'canvas';
    container.appendChild(canvasEl);
    
    // Cria o texto de instrução
    const nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.innerHTML = '<span>Toque para adicionar flores</span>';
    container.appendChild(nameDiv);
    
    // Adiciona ao wrapper
    wrapper.appendChild(container);
    wrapper.classList.add('final-section__canvas-wrapper--ready');

    const pointer = { x: 0.6, y: 0.08, clicked: true };

    if (!prefersReducedMotion.matches) {
        window.setTimeout(() => {
            pointer.x = 0.72;
            pointer.y = 0.18;
            pointer.clicked = true;
        }, 400);

        window.setTimeout(() => {
            pointer.x = 0.32;
            pointer.y = 0.05;
            pointer.clicked = true;
        }, 700);
    }

    let isStart = true;
    let isRendering = true;

    let renderer;
    let shaderScene;
    let mainScene;
    let renderTargets;
    let camera;
    let clock;
    let basicMaterial;
    let shaderMaterial;

    const backgroundColor = new THREE.Color(0xf5f0eb);

    const FRAGMENT_SHADER = `
uniform float u_ratio;
uniform vec2 u_point;
uniform float u_time;
uniform float u_stop_time;
uniform vec3 u_stop_randomizer;
uniform sampler2D u_texture;
uniform vec3 u_background_color;

varying vec2 vUv;

#define PI 3.14159265359

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float get_dot_shape(vec2 dist, float radius_max, float radius_line) {
    return 1. - smoothstep(radius_line * radius_max, radius_max, dot(dist, dist) * 4.0);
}

float get_stem_shape(vec2 _cursor, vec2 _uv, float _t, float _size, float _flowery, vec2 _rand) {
    float stroke_width = .01;
    float noise_power = .2;
    float cursor_horizontal_noise = noise_power * (1. + (1. - _flowery)) * snoise(3. * _uv * (_rand - .5));
    cursor_horizontal_noise *= pow(dot(_cursor.y, _cursor.y), .3 * _flowery);
    cursor_horizontal_noise *= pow(dot(_uv.y, _uv.y), .3);
    _cursor.x += cursor_horizontal_noise;
    _cursor.y *= (1. - ((1. - _flowery) * .7));
    _cursor.y += ((1. - _flowery) * .7 * _rand.x);
    stroke_width = (1. - _flowery) * .9 * pow(dot(_uv.y, _cursor.x), 1.) + _flowery * .03;
    stroke_width -= .02;
    float left = smoothstep(-stroke_width, 0., _cursor.x);
    float right = smoothstep(stroke_width, 0., _cursor.x);
    float stem_shape = left * right;
    float stem_top_mask = smoothstep(_cursor.y - .1, _cursor.y, min(-.1, _t - 1.));
    stem_shape *= stem_top_mask;
    stem_shape += .5 * get_dot_shape(_cursor + vec2(0., .02), .15 * _size, .5);
    stem_shape *= stem_top_mask;
    return stem_shape;
}

void main() {
    float speed = 1.3;
    float t = speed * u_stop_time;
    vec2 uv = vUv;
    uv += 0.00007 * snoise(vUv * 6.0 + vec2(0.0, 15.0 * cos(0.1 * u_time)));
    uv.y += 0.00005;
    vec3 color = texture2D(u_texture, uv).xyz;
    color += 0.0015 * u_background_color;
    vec2 cursor = uv - u_point.xy;
    cursor.x *= u_ratio;
    float base_radius = .02 + .2 * u_stop_randomizer.y;
    float grow_duration = .6;
    float grow_speed = 2. * speed;
    float bloom_duration = .3 * u_stop_randomizer.y;
    float is_open = step(.1, base_radius);
    if (t < grow_duration) {
        vec3 stem_color = u_background_color - normalize(vec3(.3, .5, .1));
        float stem_shape = get_stem_shape(cursor, uv, grow_speed * t, base_radius, 1., u_stop_randomizer.xy);
        stem_shape += get_stem_shape(cursor, uv, grow_speed * t, 0., 0., u_stop_randomizer.yz);
        stem_shape += get_stem_shape(cursor, uv, grow_speed * t, 0., 0., u_stop_randomizer.zy);
        vec3 stem = stem_shape * stem_color;
        color -= stem;
    }
    if (t < grow_duration + is_open * bloom_duration) {
        float blooming_time = max(0., pow(1.1 * t, 2.) - .05);
        float radius = base_radius * blooming_time;
        vec2 noisy_cursor = vUv - u_point.xy;
        noisy_cursor.x *= u_ratio;
        noisy_cursor.y *= (1. + u_stop_randomizer.y * is_open);
        noisy_cursor -= .02 * snoise(noisy_cursor * 10. + vec2(0., 10. * sin(.5 * t + PI)));
        vec3 flower_color = u_background_color;
        flower_color -= normalize(vec3(.5 + .5 * sin(2. * u_time), .3, .5 + .5 * sin(2. * u_time + PI)));
        color -= .4 * get_dot_shape(noisy_cursor, 1.5 * radius, .0) * flower_color;
        color = .7 * color + .3 * mix(u_background_color, color, 1. - get_dot_shape(noisy_cursor, radius, 0.));
        noisy_cursor.y -= .02;
        float inner_r = .7 * radius;
        float inner_w = .2 * radius;
        float ring_shape = get_dot_shape(noisy_cursor, inner_r + inner_w, .9) - get_dot_shape(noisy_cursor, inner_r, .9);
        color += .2 * blooming_time * ring_shape * step(.1, base_radius);
        inner_r = .4 * radius;
        float inner_w2 = .1 * radius;
        float ring_shape2 = get_dot_shape(noisy_cursor, inner_r + inner_w2, .9) - get_dot_shape(noisy_cursor, inner_r, .9);
        color += .1 * pow(t, .5) * ring_shape2 * step(.1, base_radius);
        vec2 low_noise_cursor = vUv - u_point.xy;
        low_noise_cursor.x *= .5 * u_ratio;
        low_noise_cursor.y += .02;
        low_noise_cursor += .01 * snoise(low_noise_cursor * 10. + t);
        color -= is_open * pow(t, 5.) * get_dot_shape(low_noise_cursor, .01 * radius, 0.);
    }
    gl_FragColor = vec4(color, 1.0);
}
`;

    const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.);
}
`;

    initScene();
    updateSize();
    render();
    handleMotionPreference();

    window.addEventListener('resize', updateSize);

    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => updateSize());
        resizeObserver.observe(wrapper);
        resizeObserver.observe(container);
    }

    container.addEventListener('click', handleInteraction);
    container.addEventListener('touchstart', handleInteraction, { passive: false });

    document.addEventListener('visibilitychange', () => {
        isRendering = !document.hidden;
        if (isRendering) {
            clock.getDelta();
            startAutoBloom();
        } else {
            stopAutoBloom();
        }
    });

    if (typeof prefersReducedMotion.addEventListener === 'function') {
        prefersReducedMotion.addEventListener('change', handleMotionPreference);
    } else if (typeof prefersReducedMotion.addListener === 'function') {
        prefersReducedMotion.addListener(handleMotionPreference);
    }

    function handleMotionPreference() {
        if (prefersReducedMotion.matches) {
            stopAutoBloom();
        } else if (isRendering) {
            startAutoBloom();
        }
    }

    function initScene() {
        const { width, height } = getContainerSize();

        renderer = new THREE.WebGLRenderer({
            canvas: canvasEl,
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);
        renderer.setClearColor(0x000000, 0);

        shaderScene = new THREE.Scene();
        mainScene = new THREE.Scene();

        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        clock = new THREE.Clock();

        renderTargets = [
            new THREE.WebGLRenderTarget(width, height),
            new THREE.WebGLRenderTarget(width, height)
        ];

        const planeGeometry = new THREE.PlaneGeometry(2, 2);

        shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_ratio: { value: width / height },
                u_point: { value: new THREE.Vector2(pointer.x, 1 - pointer.y) },
                u_time: { value: 0 },
                u_stop_time: { value: 0 },
                u_stop_randomizer: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
                u_texture: { value: renderTargets[0].texture },
                u_background_color: { value: backgroundColor.clone() }
            },
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            transparent: true
        });

        basicMaterial = new THREE.MeshBasicMaterial({ transparent: true });

        const backgroundMaterial = new THREE.MeshBasicMaterial({
            color: backgroundColor,
            transparent: true
        });

        const shaderPlane = new THREE.Mesh(planeGeometry, shaderMaterial);
        const basicPlane = new THREE.Mesh(planeGeometry, basicMaterial);
        const backgroundPlane = new THREE.Mesh(planeGeometry, backgroundMaterial);

        shaderScene.add(shaderPlane);
        mainScene.add(backgroundPlane);

        renderer.setRenderTarget(renderTargets[0]);
        renderer.render(mainScene, camera);

        renderer.setRenderTarget(renderTargets[1]);
        renderer.render(mainScene, camera);

        mainScene.remove(backgroundPlane);
        mainScene.add(basicPlane);

        renderer.setRenderTarget(null);
        basicMaterial.map = renderTargets[0].texture;
    }

    function getContainerSize() {
        const rect = container.getBoundingClientRect();
        let width = Math.floor(rect.width);
        let height = Math.floor(rect.height);

        if (width <= 0) {
            const wrapperRect = wrapper.getBoundingClientRect();
            width = Math.floor(wrapperRect.width);
        }

        if (height <= 0) {
            height = Math.floor(width * 0.7);
        }

        if (width <= 0) width = 320;
        if (height <= 0) height = 240;

        return { width, height };
    }

    function primeRenderTargets() {
        renderer.setClearColor(backgroundColor, 1);
        renderTargets.forEach(target => {
            renderer.setRenderTarget(target);
            renderer.clear();
        });
        renderer.setRenderTarget(null);
        renderer.setClearColor(0x000000, 0);
        shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;
        basicMaterial.map = renderTargets[0].texture;
    }

    function updateSize() {
        if (!renderer) return;
        const { width, height } = getContainerSize();
        renderer.setSize(width, height, false);
        renderTargets.forEach(target => target.setSize(width, height));
        shaderMaterial.uniforms.u_ratio.value = width / height;
        primeRenderTargets();
        shaderMaterial.uniforms.u_stop_time.value = 0;
    }

    function startAutoBloom() {
        stopAutoBloom();
        if (prefersReducedMotion.matches || !isRendering) return;
        autoBloomInterval = window.setInterval(() => {
            generateRandomFlower();
        }, 4000);
    }

    function stopAutoBloom() {
        if (autoBloomInterval) {
            window.clearInterval(autoBloomInterval);
            autoBloomInterval = null;
        }
    }

    function generateRandomFlower() {
        pointer.x = HORIZONTAL_MARGIN + Math.random() * (1 - 2 * HORIZONTAL_MARGIN);
        pointer.y = Math.random() * (1 - TOP_MARGIN);
        pointer.clicked = true;
        container.classList.add('flowers-container--active');
    }

    function handleInteraction(event) {
        if (event.type === 'touchstart') {
            event.preventDefault();
        }

        const point = event.type === 'touchstart' ? event.touches[0] : event;
        const rect = container.getBoundingClientRect();

        const relativeX = (point.clientX - rect.left) / rect.width;
        const relativeY = (point.clientY - rect.top) / rect.height;

        const clampedX = Math.min(Math.max(relativeX, HORIZONTAL_MARGIN), 1 - HORIZONTAL_MARGIN);
        const clampedY = Math.min(Math.max(relativeY, 0), 1 - TOP_MARGIN);

        pointer.x = clampedX;
        pointer.y = clampedY;
        pointer.clicked = true;
        container.classList.add('flowers-container--active');
        startAutoBloom();
    }

    function render() {
        requestAnimationFrame(render);

        if (!isRendering) {
            clock.getDelta();
            return;
        }

        const delta = clock.getDelta();

        shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;
        shaderMaterial.uniforms.u_time.value = clock.getElapsedTime() + 0.9;

        if (pointer.clicked) {
            shaderMaterial.uniforms.u_point.value.set(pointer.x, 1 - pointer.y);
            shaderMaterial.uniforms.u_stop_randomizer.value.set(Math.random(), Math.random(), Math.random());

            if (isStart) {
                shaderMaterial.uniforms.u_stop_randomizer.value.set(0.5, 1, 1);
                isStart = false;
            }

            shaderMaterial.uniforms.u_stop_time.value = 0;
            pointer.clicked = false;
            container.classList.add('flowers-container--active');
        }

        shaderMaterial.uniforms.u_stop_time.value += delta;

        renderer.setRenderTarget(renderTargets[1]);
        renderer.render(shaderScene, camera);

        basicMaterial.map = renderTargets[1].texture;

        renderer.setRenderTarget(null);
        renderer.render(mainScene, camera);

        const temp = renderTargets[0];
        renderTargets[0] = renderTargets[1];
        renderTargets[1] = temp;
    }
}