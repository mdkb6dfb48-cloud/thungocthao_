
import * as THREE from "three";

// ---------- DỮ LIỆU GAME ----------

const characters = [
  { id: "mimi", name: "Mimi 🐰", color: "#d9a9ef", ear: "long" },
  { id: "coco", name: "Coco ☁️", color: "#b9dff5", ear: "round" },
  { id: "mel", name: "Mel 🎀", color: "#f5b5d0", ear: "long" }
];

const outfits = [
  { id: "pink", name: "Váy hồng 🌸", color: "#f4a9d0" },
  { id: "lavender", name: "Váy tím 💜", color: "#c5a6ed" },
  { id: "blue", name: "Váy xanh 🩵", color: "#9bd7ed" },
  { id: "white", name: "Váy trắng 🤍", color: "#fff1f7" },
  { id: "yellow", name: "Váy vàng 🌼", color: "#f5d77d" },
  { id: "mint", name: "Váy mint 🍃", color: "#a8ddc4" }
];

const accessories = [
  { id: "bow", name: "Nơ xinh 🎀" },
  { id: "crown", name: "Vương miện 👑" },
  { id: "handbag", name: "Túi xách 👜" },
  { id: "flower", name: "Hoa nhỏ 🌷" },
  { id: "none", name: "Không phụ kiện" }
];

const orders = [
  {
    name: "Luna",
    request: "Mình muốn một nàng thỏ công chúa dịu dàng, có chiếc váy hồng và nơ xinh nhé!",
    outfit: "pink",
    accessory: "bow"
  },
  {
    name: "Mochi",
    request: "Mình thích phong cách hoàng gia. Hãy chọn váy tím và vương miện nhé!",
    outfit: "lavender",
    accessory: "crown"
  },
  {
    name: "Cloudy",
    request: "Mình muốn một nhân vật đáng yêu như đám mây, mặc váy xanh và mang túi xách!",
    outfit: "blue",
    accessory: "handbag"
  },
  {
    name: "Snow",
    request: "Hãy thiết kế cho mình một bộ đồ trắng tinh khôi cùng một bông hoa nhỏ!",
    outfit: "white",
    accessory: "flower"
  },
  {
    name: "Sunny",
    request: "Mình thích màu nắng ấm áp. Hãy chọn váy vàng và vương miện nhé!",
    outfit: "yellow",
    accessory: "crown"
  },
  {
    name: "Minty",
    request: "Mình muốn một bộ trang phục xanh mint tươi mát với chiếc nơ xinh!",
    outfit: "mint",
    accessory: "bow"
  }
];

// ---------- LƯU TIẾN TRÌNH ----------

let saved = {};

try {
  saved = JSON.parse(localStorage.getItem("dreamyFashionSave")) || {};
} catch (error) {
  saved = {};
}

let coins = saved.coins || 0;
let stars = saved.stars || 0;
let currentCharacter = saved.character || "mimi";
let currentOutfit = saved.outfit || "pink";
let currentAccessory = saved.accessory || "bow";
let completedOrders = saved.completedOrders || 0;

function saveProgress() {
  localStorage.setItem("dreamyFashionSave", JSON.stringify({
    coins,
    stars,
    character: currentCharacter,
    outfit: currentOutfit,
    accessory: currentAccessory,
    completedOrders
  }));

  updateWallet();
}

function updateWallet() {
  document.getElementById("coins").textContent = coins;
  document.getElementById("stars").textContent = stars;
}

// ---------- THẾ GIỚI 3D ----------

const container = document.getElementById("scene-container");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#eee0fa");

const camera = new THREE.PerspectiveCamera(
  35,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);

camera.position.set(0, 2.2, 7);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

container.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight("#ffffff", "#c4a1d9", 2));

const light = new THREE.DirectionalLight("#ffffff", 3);
light.position.set(4, 6, 5);
light.castShadow = true;
scene.add(light);

const fillLight = new THREE.PointLight("#ffc9e8", 40, 10);
fillLight.position.set(-3, 3, 3);
scene.add(fillLight);

// Sàn và bục trưng bày
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(5, 64),
  new THREE.MeshStandardMaterial({
    color: "#f9e9f5",
    roughness: 0.9
  })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.02;
floor.receiveShadow = true;
scene.add(floor);

const platform = new THREE.Mesh(
  new THREE.CylinderGeometry(1.15, 1.3, 0.22, 64),
  new THREE.MeshStandardMaterial({
    color: "#f5c6e4",
    roughness: 0.6
  })
);

platform.position.y = 0.1;
platform.castShadow = true;
platform.receiveShadow = true;
scene.add(platform);

// ---------- TẠO VẬT LIỆU THÚ BÔNG ----------

function plushMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.95
  });
}

function makeSphere(parent, name, color, position, scale) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 24),
    plushMaterial(color)
  );

  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);

  return mesh;
}

function makeBox(parent, name, color, position, scale) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...scale),
    plushMaterial(color)
  );

  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  parent.add(mesh);

  return mesh;
}

// ---------- NHÂN VẬT THÚ BÔNG ----------

const doll = new THREE.Group();
scene.add(doll);

function createCharacter(characterId) {
  while (doll.children.length) {
    doll.remove(doll.children[0]);
  }

  const character = characters.find(c => c.id === characterId);
  const fur = character.color;

  // Đầu và thân
  makeSphere(doll, "head", fur, [0, 2.05, 0], [0.78, 0.72, 0.58]);
  makeSphere(doll, "body", fur, [0, 1.12, 0], [0.55, 0.68, 0.42]);

  // Tai
  if (character.ear === "long") {
    makeSphere(doll, "left-ear", fur, [-0.42, 2.78, 0], [0.22, 0.57, 0.2]);
    makeSphere(doll, "right-ear", fur, [0.42, 2.78, 0], [0.22, 0.57, 0.2]);

    makeSphere(doll, "inner-ear-left", "#f4b9d7",
      [-0.42, 2.78, 0.17], [0.12, 0.42, 0.045]);

    makeSphere(doll, "inner-ear-right", "#f4b9d7",
      [0.42, 2.78, 0.17], [0.12, 0.42, 0.045]);
  } else {
    makeSphere(doll, "left-ear", fur, [-0.52, 2.63, 0], [0.3, 0.27, 0.23]);
    makeSphere(doll, "right-ear", fur, [0.52, 2.63, 0], [0.3, 0.27, 0.23]);
  }

  // Tay
  makeSphere(doll, "left-arm", fur, [-0.58, 1.25, 0], [0.22, 0.4, 0.22]);
  makeSphere(doll, "right-arm", fur, [0.58, 1.25, 0], [0.22, 0.4, 0.22]);

  // Chân
  makeSphere(doll, "left-leg", fur, [-0.25, 0.45, 0], [0.23, 0.42, 0.24]);
  makeSphere(doll, "right-leg", fur, [0.25, 0.45, 0], [0.23, 0.42, 0.24]);

  makeSphere(doll, "left-foot", "#fff0f5", [-0.25, 0.2, 0.12], [0.27, 0.16, 0.34]);
  makeSphere(doll, "right-foot", "#fff0f5", [0.25, 0.2, 0.12], [0.27, 0.16, 0.34]);

  // Mắt
  makeSphere(doll, "eye-left", "#382b42", [-0.25, 2.12, 0.52], [0.055, 0.09, 0.035]);
  makeSphere(doll, "eye-right", "#382b42", [0.25, 2.12, 0.52], [0.055, 0.09, 0.035]);

  // Ánh mắt
  makeSphere(doll, "eye-shine-left", "#ffffff",
    [-0.27, 2.16, 0.55], [0.018, 0.025, 0.012]);

  makeSphere(doll, "eye-shine-right", "#ffffff",
    [0.23, 2.16, 0.55], [0.018, 0.025, 0.012]);

  // Má hồng và mũi
  makeSphere(doll, "blush-left", "#f7a9c7",
    [-0.42, 1.93, 0.49], [0.13, 0.07, 0.025]);

  makeSphere(doll, "blush-right", "#f7a9c7",
    [0.42, 1.93, 0.49], [0.13, 0.07, 0.025]);

  makeSphere(doll, "nose", "#e78eae",
    [0, 1.98, 0.57], [0.055, 0.04, 0.025]);

  // Miệng nhỏ
  makeSphere(doll, "mouth-left", "#8c526e",
    [-0.035, 1.91, 0.56], [0.025, 0.018, 0.015]);

  makeSphere(doll, "mouth-right", "#8c526e",
    [0.035, 1.91, 0.56], [0.025, 0.018, 0.015]);

  createOutfit();
  createAccessory();
}

// ---------- THAY TRANG PHỤC ----------

let outfitGroup = new THREE.Group();
doll.add(outfitGroup);

function createOutfit() {
  doll.remove(outfitGroup);
  outfitGroup = new THREE.Group();
  doll.add(outfitGroup);

  const outfit = outfits.find(o => o.id === currentOutfit);
  const color = outfit.color;

  // Áo
  makeSphere(outfitGroup, "dress-top", color,
    [0, 1.3, 0.02], [0.58, 0.48, 0.44]);

  // Cổ áo
  makeSphere(outfitGroup, "collar", "#fff4fa",
    [0, 1.67, 0.03], [0.25, 0.09, 0.39]);

  // Chân váy xòe
  const skirt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.69, 0.55, 48),
    plushMaterial(color)
  );

  skirt.position.set(0, 0.94, 0);
  skirt.castShadow = true;
  outfitGroup.add(skirt);

  // Viền váy
  const trim = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.035, 10, 48),
    plushMaterial("#fff5fb")
  );

  trim.rotation.x = Math.PI / 2;
  trim.position.y = 0.67;
  outfitGroup.add(trim);

  // Nút áo
  makeSphere(outfitGroup, "button", "#fff4fa",
    [0, 1.32, 0.44], [0.045, 0.045, 0.025]);
}

// ---------- THAY PHỤ KIỆN ----------

let accessoryGroup = new THREE.Group();
doll.add(accessoryGroup);

function createAccessory() {
  doll.remove(accessoryGroup);
  accessoryGroup = new THREE.Group();
  doll.add(accessoryGroup);

  if (currentAccessory === "bow") {
    makeSphere(accessoryGroup, "bow-left", "#ff80b8",
      [-0.25, 2.66, 0.12], [0.23, 0.15, 0.09]);

    makeSphere(accessoryGroup, "bow-right", "#ff80b8",
      [0.02, 2.66, 0.12], [0.23, 0.15, 0.09]);

    makeSphere(accessoryGroup, "bow-center", "#ffb3d5",
      [-0.11, 2.66, 0.2], [0.09, 0.1, 0.07]);
  }

  if (currentAccessory === "crown") {
    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.4, 5),
      plushMaterial("#f5d36e")
    );

    crown.position.set(0, 2.78, 0);
    crown.castShadow = true;
    accessoryGroup.add(crown);

    makeSphere(accessoryGroup, "crown-gem", "#ff83bd",
      [0, 2.88, 0.18], [0.08, 0.08, 0.06]);
  }

  if (currentAccessory === "handbag") {
    makeBox(accessoryGroup, "handbag",
      "#e9a4d1", [0.72, 1.02, 0.28], [0.38, 0.4, 0.18]);

    makeSphere(accessoryGroup, "bag-decoration",
      "#fff3fa", [0.72, 1.05, 0.39], [0.09, 0.09, 0.03]);
  }

  if (currentAccessory === "flower") {
    makeSphere(accessoryGroup, "flower-center",
      "#ffd65e", [0.48, 2.55, 0.2], [0.09, 0.09, 0.07]);

    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5;

      makeSphere(accessoryGroup, "flower-petal",
        "#ff9fc8",
        [
          0.48 + Math.cos(angle) * 0.14,
          2.55 + Math.sin(angle) * 0.14,
          0.2
        ],
        [0.1, 0.1, 0.06]
      );
    }
  }
}

// ---------- TẠO NÚT CHỌN ----------

function createChoiceButtons(elementId, items, selectedId, onSelect) {
  const area = document.getElementById(elementId);
  area.innerHTML = "";

  items.forEach(item => {
    const button = document.createElement("button");
    button.className = "choice-button" +
      (item.id === selectedId ? " selected" : "");
    button.textContent = item.name;

    button.addEventListener("click", () => {
      onSelect(item.id);
      createChoiceButtons(elementId, items, item.id, onSelect);
    });

    area.appendChild(button);
  });
}

function refreshWardrobe() {
  createChoiceButtons(
    "character-buttons",
    characters,
    currentCharacter,
    id => {
      currentCharacter = id;
      createCharacter(id);
      saveProgress();
      refreshWardrobe();
    }
  );

  createChoiceButtons(
    "outfit-buttons",
    outfits,
    currentOutfit,
    id => {
      currentOutfit = id;
      createOutfit();
      saveProgress();
      refreshWardrobe();
    }
  );

  createChoiceButtons(
    "accessory-buttons",
    accessories,
    currentAccessory,
    id => {
      currentAccessory = id;
      createAccessory();
      saveProgress();
      refreshWardrobe();
    }
  );
}

// ---------- ĐƠN HÀNG KHÁCH HÀNG ----------

let orderIndex = completedOrders % orders.length;
let currentOrder = orders[orderIndex];

function showOrder() {
  currentOrder = orders[orderIndex];

  document.getElementById("customer-name").textContent =
    currentOrder.name;

  document.getElementById("customer-request").textContent =
    currentOrder.request;

  document.getElementById("required-outfit").textContent =
    outfits.find(o => o.id === currentOrder.outfit).name;

  document.getElementById("required-accessory").textContent =
    accessories.find(a => a.id === currentOrder.accessory).name;

  document.getElementById("order-status").textContent =
    "Hãy phối đồ theo yêu cầu nhé!";
}

document.getElementById("complete-order").addEventListener("click", () => {
  const correctOutfit = currentOutfit === currentOrder.outfit;
  const correctAccessory = currentAccessory === currentOrder.accessory;

  const status = document.getElementById("order-status");

  if (correctOutfit && correctAccessory) {
    coins += 50;
    stars += 3;
    completedOrders += 1;

    saveProgress();

    status.textContent =
      "🎉 Tuyệt vời! Bạn đã hoàn thành đơn hàng! +50 xu và +3 sao!";

    document.getElementById("complete-order").textContent =
      "Nhận đơn hàng tiếp theo 💌";

    document.getElementById("complete-order").onclick = () => {
      orderIndex = completedOrders % orders.length;
      document.getElementById("complete-order").textContent =
        "Hoàn thành đơn hàng 💗";
      document.getElementById("complete-order").onclick = null;
      showOrder();
    };
  } else {
    status.textContent =
      "💗 Chưa đúng yêu cầu rồi! Hãy kiểm tra lại trang phục và phụ kiện nhé.";
  }
});

// ---------- LƯU ẢNH TẠO HÌNH ----------

document.getElementById("save-look").addEventListener("click", () => {
  renderer.render(scene, camera);

  const link = document.createElement("a");
  link.download = "dreamy-fashion-look.png";
  link.href = renderer.domElement.toDataURL("image/png");
  link.click();
});

// ---------- XOAY NHÂN VẬT ----------

let dragging = false;
let lastX = 0;

renderer.domElement.addEventListener("pointerdown", event => {
  dragging = true;
  lastX = event.clientX;
});

window.addEventListener("pointerup", () => {
  dragging = false;
});

window.addEventListener("pointermove", event => {
  if (!dragging) return;

  const difference = event.clientX - lastX;
  doll.rotation.y += difference * 0.01;
  lastX = event.clientX;
});

// ---------- KÍCH THƯỚC MÀN HÌNH ----------

function resizeScene() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener("resize", resizeScene);

// ---------- CHẠY GAME ----------

createCharacter(currentCharacter);
refreshWardrobe();
showOrder();
updateWallet();

document.getElementById("loading").style.display = "none";

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
