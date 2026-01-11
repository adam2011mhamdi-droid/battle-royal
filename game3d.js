// --- Scène, caméra, rendu ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // ciel bleu

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 50);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Sol ---
const groundGeometry = new THREE.PlaneGeometry(200,200);
const groundMaterial = new THREE.MeshPhongMaterial({color:0x228B22});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// --- Lumière ---
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(50,100,50);
scene.add(light);

// --- Joueur ---
const playerGeometry = new THREE.BoxGeometry(2,4,2);
const playerMaterial = new THREE.MeshStandardMaterial({color:0x0000ff});
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 2;
scene.add(player);

// --- Bots ---
const botGeometry = new THREE.BoxGeometry(2,4,2);
const botMaterial = new THREE.MeshStandardMaterial({color:0xff0000});
let bots = [];
for(let i=0;i<20;i++){
    let bot = new THREE.Mesh(botGeometry, botMaterial);
    bot.position.set(Math.random()*100-50,2,Math.random()*100-50);
    scene.add(bot);
    bots.push(bot);
}

// --- Déplacements joueur ---
let keys = {};
document.addEventListener("keydown", e=>keys[e.key.toLowerCase()]=true);
document.addEventListener("keyup", e=>keys[e.key.toLowerCase()]=false);

function updatePlayer(){
    if(keys["z"]) player.position.z -=0.5;
    if(keys["s"]) player.position.z +=0.5;
    if(keys["q"]) player.position.x -=0.5;
    if(keys["d"]) player.position.x +=0.5;
}

// --- IA bots simple ---
function updateBots(){
    bots.forEach(bot=>{
        let dx = player.position.x - bot.position.x;
        let dz = player.position.z - bot.position.z;
        let dist = Math.hypot(dx,dz);
        if(dist>0){
            bot.position.x += dx/dist*0.2;
            bot.position.z += dz/dist*0.2;
        }
    });
}

// --- Boucle ---
function animate(){
    requestAnimationFrame(animate);
    updatePlayer();
    updateBots();
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 30;
    camera.position.y = 30;
    camera.lookAt(player.position.x,0,player.position.z);
    renderer.render(scene, camera);
}

animate();
