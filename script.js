const frageEl = document.getElementById("frage");
const nextBtn = document.getElementById("nextBtn");
const sessionEl = document.getElementById("sessionId");

const sessionId = new URLSearchParams(window.location.search).get("session") || "default";
sessionEl.textContent = sessionId;

// JSONBin Setup
const BIN_ID = "6824b53b8561e97a5013d11f";
const API_KEY = "$2a$10$IvY76Y.XVJ7oDp12z1h7DuqStDpH1cTjwbXNAcsirbun5j7xWqLjm";
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest?${Date.now()}`;


let fragen = [];
let index = 0;

function ladeFragen() {
  frageEl.textContent = "⏳ Lädt Frage..."
  fetch(URL, {
    headers: {
      "X-Master-Key": API_KEY
    }
  })
  .then(res => res.json())
  .then(data => {
    fragen = data.record.fragen;
    index = data.record.currentIndex;
    frageEl.textContent = fragen[index] || "🎉 Keine weiteren Fragen!";
  });
}
function speichereIndex(i) {
  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify({
      currentIndex: i,
      fragen: fragen
    })
  });
}

nextBtn.addEventListener("click", () => {
  if (index + 1 < fragen.length) {
    index++;
    frageEl.textContent = fragen[index];
    speichereIndex(index);
  } else {
    frageEl.textContent = "🎉 Das war die letzte Frage!";
  }
});
document.getElementById("refreshBtn").addEventListener("click", () => {
  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?ts=${Date.now()}`, {
    headers: { "X-Master-Key": API_KEY }
  })
    .then(res => res.json())
    .then(data => {
      const neuerIndex = data.record.currentIndex;
      if (neuerIndex !== index) {
        index = neuerIndex;
        frageEl.textContent = fragen[index];
      }
    });
});
window.addEventListener("focus", () => {
  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?ts=${Date.now()}`, {
    headers: { "X-Master-Key": API_KEY }
  })
    .then(res => res.json())
    .then(data => {
      const neuerIndex = data.record.currentIndex;
      if (neuerIndex !== index) {
        index = neuerIndex;
        frageEl.textContent = fragen[index];
      }
    });
});

ladeFragen();