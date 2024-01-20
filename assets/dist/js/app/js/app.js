var $ = require('jquery');

$(function() {
    
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, 1, 3000);
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize(WIDTH, HEIGHT);
    $(".hero-area-field").append(renderer.domElement);
    
    // camera
    camera.position.z = 500;

    // particle
    var count = 700,
        particles = new THREE.Geometry(),
        x, y, z;

    var textureLoader = new THREE.TextureLoader();
    var particleMaterial = new THREE.PointCloudMaterial({
        color: 0xffffff,
        map: THREE.ImageUtils.loadTexture("assets/dist/img/particle-2.png"),
        transparent: true,
        size: 20
    });

    for (var i = 0; i < count; i++) {
        
        x = Math.random() * 1000 - 500;
        y = Math.random() * 1000 - 500;
        z = Math.random() * 1000 - 500;

        particle = new THREE.Vector3(x, y, z);
        particle.velocity = new THREE.Vector3(0, -Math.random(), 0);

        particles.vertices.push(particle);

    }

    // create the Point
    var points = new THREE.PointCloud( particles, particleMaterial );
    points.sortParticles = true;

    scene.add(points);

    function particleRender() {

        requestAnimationFrame(particleRender);

        // points.rotation.x += 0.001;
        points.rotation.y += 0.001;
        points.rotation.z += 0.001;

        var _count = count;
        while (_count--) {

            var _particle = particles.vertices[_count];

            if (_particle.y < -400) {
                _particle.y = 400;
                _particle.velocity.y = -Math.random();

            }

            if (_particle.x > 400) {
                _particle.x = -400;
                _particle.velocity.x = Math.random();
            }


            _particle.velocity.y -= Math.random() * 0.001;
            _particle.velocity.x += Math.random() * 0.001;
            
            // if (Math.abs(_particle.x) > 1000) {
            //     _particle.velocity.x = Math.abs(_particle.velocity.x) + (Math.random() / 5 - 0.1);
            //     if (_particle.x > 1000) _particle.velocity.x *= -1;
            // }

            // if (Math.abs(_particle.y) > 1000) {
            //     _particle.velocity.y = Math.abs(_particle.velocity.y) + (Math.random() / 5 - 0.1);
            //     if (_particle.y > 1000) _particle.velocity.y *= -1;
            // }

            _particle.add(_particle.velocity);

        }

        points.geometry.__dirtyVertices = true;
        renderer.render(scene, camera);
        
    }
    particleRender();

});