// 3D Animation for Hero Section
const hero = document.getElementById('hero');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
hero.appendChild(renderer.domElement);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);
camera.position.z = 30;

function animate() {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

// 3D Skills Cube Visualization
const skillsCubeContainer = document.getElementById('skills-tree');
const cubeScene = new THREE.Scene();
const cubeCamera = new THREE.PerspectiveCamera(75, skillsCubeContainer.offsetWidth / skillsCubeContainer.offsetHeight, 0.1, 1000);
const cubeRenderer = new THREE.WebGLRenderer();

cubeRenderer.setSize(skillsCubeContainer.offsetWidth, skillsCubeContainer.offsetHeight);
skillsCubeContainer.appendChild(cubeRenderer.domElement);

// Create a cube with different skills on each face
const cubeGeometry = new THREE.BoxGeometry();
const skillMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: false, map: createTextTexture('JavaScript') }),
    new THREE.MeshBasicMaterial({ color: 0xff7700, wireframe: false, map: createTextTexture('Python') }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false, map: createTextTexture('React') }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false, map: createTextTexture('Django') }),
    new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false, map: createTextTexture('Node.js') }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: false, map: createTextTexture('SQL') }),
];
const skillsCube = new THREE.Mesh(cubeGeometry, skillMaterials);

cubeScene.add(skillsCube);
cubeCamera.position.z = 3;

// Scale the cube to make it larger
skillsCube.scale.set(2, 2, 2);

// Function to create a texture with text
function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = '#333';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#fff';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
}

// Animate the cube
function animateSkillsCube() {
    requestAnimationFrame(animateSkillsCube);
    skillsCube.rotation.x += 0.01;
    skillsCube.rotation.y += 0.01;
    cubeRenderer.render(cubeScene, cubeCamera);
}
animateSkillsCube();

// Line Graph for Skill Ratings
const skillsGraphContainer = document.createElement('canvas');
skillsGraphContainer.id = 'skills-graph';
skillsCubeContainer.appendChild(skillsGraphContainer);

// Skill data for the graph
const skillData = {
    labels: ['JavaScript', 'Python', 'React', 'Django', 'Node.js', 'SQL'],
    datasets: [{
        label: 'Skill Ratings',
        data: [90, 80, 85, 70, 75, 65], // Ratings out of 100
        borderColor: '#0077ff',
        backgroundColor: 'rgba(0, 119, 255, 0.2)',
        fill: true,
        tension: 0.4,
    }]
};

// Create the chart
const ctx = document.getElementById('skills-graph').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: skillData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Rating (%)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Skills',
                },
            },
        },
    },
});

// Typing Effect for Education Section
const educationText = document.getElementById('typing-effect');
educationText.style.width = '100%'; // Ensure the container has enough width to display the full text
const educationDetails = [
    "Kibabii University (2023 - 2026): Diploma in Computer Science",
    "Kamagut High School (2019 - 2022): Kenya Certificate of Secondary Education",
    "Moi Barracks Primary School (2017 - 2018)"
];
let currentTextIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEducation() {
    const currentText = educationDetails[currentTextIndex];
    if (isDeleting) {
        charIndex--;
        educationText.textContent = currentText.substring(0, charIndex);
    } else {
        charIndex++;
        educationText.textContent = currentText.substring(0, charIndex);
    }

    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => (isDeleting = true), 2000); // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % educationDetails.length; // Move to the next text
    }

    setTimeout(typeEducation, isDeleting ? 50 : 100); // Typing speed
}

typeEducation();

// 3D Laptop Screen for Contact Section
const contactScreen = document.getElementById('contact-screen');
const contactScene = new THREE.Scene();
const contactCamera = new THREE.PerspectiveCamera(75, contactScreen.offsetWidth / contactScreen.offsetHeight, 0.1, 1000);
const contactRenderer = new THREE.WebGLRenderer({ antialias: true });

contactRenderer.setSize(contactScreen.offsetWidth, contactScreen.offsetHeight);
contactScreen.appendChild(contactRenderer.domElement);

// Create a laptop-like screen
const laptopBaseGeometry = new THREE.BoxGeometry(4, 0.2, 3);
const laptopBaseMaterial = new THREE.MeshBasicMaterial({ color: 0x0077ff });
const laptopBase = new THREE.Mesh(laptopBaseGeometry, laptopBaseMaterial);
contactScene.add(laptopBase);

const laptopScreenGeometry = new THREE.BoxGeometry(4, 2.5, 0.1);
const laptopScreenMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
const laptopScreen = new THREE.Mesh(laptopScreenGeometry, laptopScreenMaterial);
laptopScreen.position.y = 1.5;
laptopScreen.rotation.x = -Math.PI / 6;
laptopBase.add(laptopScreen);

// Add "Type Here" text to the screen
const screenTexture = new THREE.TextureLoader().load('https://via.placeholder.com/400x250?text=Type+Here');
const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture });
const screenPlaneGeometry = new THREE.PlaneGeometry(3.8, 2.3);
const screenPlane = new THREE.Mesh(screenPlaneGeometry, screenMaterial);
screenPlane.position.z = 0.06;
laptopScreen.add(screenPlane);

contactCamera.position.z = 6;

function animateContactScreen() {
    requestAnimationFrame(animateContactScreen);
    laptopBase.rotation.y += 0.01; // Rotate the laptop for effect
    contactRenderer.render(contactScene, contactCamera);
}
animateContactScreen();

// Ensure the CV link is not being hidden or modified
document.addEventListener("DOMContentLoaded", () => {
    const cvLink = document.getElementById("cv-link");
    if (!cvLink) {
        console.error("CV link not found in the DOM.");
    } else {
        console.log("CV link is present and visible.");
    }
});
