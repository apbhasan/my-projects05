let heartCount = 0;
let coinCount = 100;
let copyCount = 0;

const heartDisplay = document.getElementById("heartCount");
const coinDisplay = document.getElementById("coinCount");
const copyDisplay = document.getElementById("copyCount");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearHistoryBtn");
const toastWrap = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
const cardGrid = document.getElementById("cardGrid");

// Services data with image icons and English name only
const services = [
  {icon:"styles/asset/emergency.png", name:"Emergency", en:"National Emergency Number", number:"999", category:"All"},
  {icon:"styles/asset/police.png", name:"Police", en:"Police Helpline Number", number:"999", category:"Police"},
  {icon:"styles/asset/fire-service.png", name:"Fire Service", en:"Fire Service Number", number:"999", category:"Fire"},
  {icon:"styles/asset/ambulance.png", name:"Ambulance", en:"Ambulance Service", number:"1994-999999", category:"Health"},
  {icon:"styles/asset/emergency.png", name:"Women & Child", en:"Women & Child Helpline", number:"109", category:"Help"},
  {icon:"styles/asset/emergency.png", name:"Anti-Corruption", en:"Anti-Corruption Helpline", number:"106", category:"Govt."},
  {icon:"styles/asset/emergency.png", name:"Electricity", en:"Electricity Helpline", number:"16216", category:"Electricity"},
  {icon:"styles/asset/brac.png", name:"Brac", en:"Brac Helpline", number:"16445", category:"NGO"},
  {icon:"styles/asset/emergency.png", name:"Railway", en:"Bangladesh Railway Helpline", number:"163", category:"Travel"}
];

// Toast
function showToast(msg) {
  toastMsg.textContent = msg;
  toastWrap.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastWrap.classList.add("hidden"), 1800);
}

// Update navbar counters
function updateCounters() {
  heartDisplay.textContent = heartCount;
  coinDisplay.textContent = coinCount;
  copyDisplay.textContent = copyCount;
}

// Add history item
function addHistoryItem(service, timeStr) {
  const item = document.createElement("div");
  item.className = "history-item";
  item.innerHTML = `
    <div>
      <div class="history-title">${service.en}</div>
      <div class="history-sub">${service.name}</div>
    </div>
    <div class="text-right">
      <div class="history-sub">${timeStr}</div>
    </div>
  `;
  historyList.prepend(item);
}

// Clipboard copy
function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    return true;
  } catch {
    return false;
  }
}

// Render cards
function renderCards() {
  cardGrid.innerHTML = services.map((s, i) => `
    <article class="card">
      <div class="flex justify-between items-start">
        <!-- Left: icon -->
        <img src="${s.icon}" alt="${s.en}" class="w-12 h-12 rounded-xl border border-gray-200 object-contain bg-gray-50">

        <!-- Right: heart button -->
        <button class="icon-btn" data-action="fav" data-index="${i}" title="Add to favourites">🤍</button>
      </div>

      <!-- Below: English name & category -->
      <div class="mt-3">
        <div class="font-semibold text-lg">${s.en}</div>
        <div class="text-sm text-gray-500">${s.name}</div>
      </div>

      <!-- Number -->
      <div class="mt-3 text-2xl font-bold">${s.number}</div>

      <!-- Badge -->
      <div class="mt-2">
        <span class="badge">${s.category}</span>
      </div>

      <!-- Buttons -->
      <div class="mt-4 flex items-center gap-3">
        <button class="flex-1 border border-gray-200 rounded-xl py-2.5 font-medium grid place-items-center gap-2" data-action="copy" data-index="${i}">📋 Copy</button>
        <button class="flex-1 btn-call rounded-xl py-2.5 font-medium grid place-items-center gap-2" data-action="call" data-index="${i}">📞 Call</button>
      </div>
    </article>
  `).join("");

  // Heart click
  cardGrid.querySelectorAll("[data-action='fav']").forEach(btn => {
    btn.addEventListener("click", () => {
      heartCount++;
      updateCounters();
    });
  });

  // Copy click
  cardGrid.querySelectorAll("[data-action='copy']").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const idx = Number(e.currentTarget.dataset.index);
      copyText(services[idx].number);
      copyCount++;
      updateCounters();
      showToast("Number copied");
    });
  });

  // Call click
  cardGrid.querySelectorAll("[data-action='call']").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.index);
      const svc = services[idx];
      if (coinCount < 20) {
        showToast("Not enough coins");
        return;
      }
      coinCount -= 20;
      updateCounters();
      showToast(`20 coins used. Calling ${svc.en}`);
      addHistoryItem(svc, new Date().toLocaleTimeString());
    });
  });
}

// Clear history
clearBtn.addEventListener("click", () => { historyList.innerHTML = ""; });

// Initialize
updateCounters();
renderCards();
