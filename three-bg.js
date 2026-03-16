// three-bg.js - Particle and Molecular background

class ParticleNetwork {
    constructor(canvasContainerId) {
        this.container = document.getElementById(canvasContainerId);
        if(!this.container) return;

        this.scene = new THREE.Scene();
        
        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 30;

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Parameters
        this.particleCount = 200; // Atoms
        this.connectionDistance = 8; // Molecule bonds connecting distance
        this.particles = [];
        
        this.init();
        this.animate();

        // Handle Resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Mouse interaction
        this.mouseX = 0;
        this.mouseY = 0;
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    }

    init() {
        // Create Particles (Atoms)
        const geometry = new THREE.SphereGeometry(0.2, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0x14B8A6 }); // Teal color for atoms

        const group = new THREE.Group();
        this.scene.add(group);
        this.particleGroup = group;

        for (let i = 0; i < this.particleCount; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position in a sphere-like area
            mesh.position.x = (Math.random() - 0.5) * 80;
            mesh.position.y = (Math.random() - 0.5) * 80;
            mesh.position.z = (Math.random() - 0.5) * 60;
            
            // Random velocity
            mesh.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            );

            group.add(mesh);
            this.particles.push(mesh);
        }

        // Create Lines (Bonds)
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x1E3A8A, // Deep Academic Blue for bonds
            transparent: true,
            opacity: 0.15
        });

        // Pre-allocate geometry for lines to avoid re-creating every frame
        this.lineGeometry = new THREE.BufferGeometry();
        // Max possible lines = N*(N-1)/2, but we only show close ones. Allocate a safe buffer.
        const maxLines = 10000; 
        const positions = new Float32Array(maxLines * 6); // 2 vertices per line, 3 coords per vertex
        this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // We handle line opacity via geometry or we just use one material for all and manage draw range
        this.linesMesh = new THREE.LineSegments(this.lineGeometry, lineMaterial);
        this.scene.add(this.linesMesh);
        
        // Also add some vague background ambient glowing spheres to look more "sciencey"
        this.addBackgroundGlows();
    }

    addBackgroundGlows() {
        const glowGeometry = new THREE.SphereGeometry(15, 32, 32);
        
        const glowMaterial1 = new THREE.MeshBasicMaterial({ 
            color: 0x1E3A8A, transparent: true, opacity: 0.03 
        });
        const glow1 = new THREE.Mesh(glowGeometry, glowMaterial1);
        glow1.position.set(-20, 10, -10);
        this.scene.add(glow1);

        const glowMaterial2 = new THREE.MeshBasicMaterial({ 
            color: 0x14B8A6, transparent: true, opacity: 0.03 
        });
        const glow2 = new THREE.Mesh(glowGeometry, glowMaterial2);
        glow2.position.set(20, -10, -15);
        this.scene.add(glow2);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onDocumentMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update particle positions
        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.particles[i];
            particle.position.add(particle.userData.velocity);

            // Bounce off boundaries
            if (particle.position.x > 40 || particle.position.x < -40) particle.userData.velocity.x *= -1;
            if (particle.position.y > 40 || particle.position.y < -40) particle.userData.velocity.y *= -1;
            if (particle.position.z > 30 || particle.position.z < -30) particle.userData.velocity.z *= -1;
        }

        // Update lines (Molecular bonds)
        let vertexIndex = 0;
        let numConnected = 0;
        const positions = this.lineGeometry.attributes.position.array;

        for (let i = 0; i < this.particleCount; i++) {
            for (let j = i + 1; j < this.particleCount; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const distance = p1.position.distanceTo(p2.position);

                if (distance < this.connectionDistance && numConnected < 10000) {
                    positions[vertexIndex++] = p1.position.x;
                    positions[vertexIndex++] = p1.position.y;
                    positions[vertexIndex++] = p1.position.z;

                    positions[vertexIndex++] = p2.position.x;
                    positions[vertexIndex++] = p2.position.y;
                    positions[vertexIndex++] = p2.position.z;
                    
                    numConnected++;
                }
            }
        }
        
        this.lineGeometry.setDrawRange(0, numConnected * 2);
        this.lineGeometry.attributes.position.needsUpdate = true;

        // Subtle camera movement based on mouse to give parallax depth
        this.camera.position.x += (this.mouseX * 5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouseY * 5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        // Slowly rotate whole group for ambient molecular feel
        this.particleGroup.rotation.y += 0.001;
        this.particleGroup.rotation.x += 0.0005;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only init if we are on a desktop/tablet to save performance, or reduce count on mobile
    if(window.innerWidth > 768) {
        new ParticleNetwork('canvas-container');
    } else {
        // Slower/simpler background on mobile
        const mobileContainer = document.getElementById('canvas-container');
        if(mobileContainer) {
             const style = document.createElement('style');
             style.innerHTML = `
                @keyframes pulseBG {
                    0% { background: radial-gradient(circle at top left, #F8FAFC, #E0F2FE); }
                    50% { background: radial-gradient(circle at top left, #E0F2FE, #F0FDF4); }
                    100% { background: radial-gradient(circle at top left, #F8FAFC, #E0F2FE); }
                }
                #canvas-container { animation: pulseBG 10s infinite alternate; }
             `;
             document.head.appendChild(style);
        }
    }
});
