const fragen = [
  "Was ist dein Lieblingsbuch?",
  "Wovor hast du Angst?",
  "Was war dein schönster Urlaub?",
  "Was würdest du tun, wenn du eine Million hättest?",
  "Welche Person inspiriert dich am meisten?"
];

const frageElement = document.getElementById("frage");
const nextBtn = document.getElementById("nextBtn");

const sessionId = new URLSearchParams(window.location.search).get("session") || "default";
const BIN_ID = "6824a5e58561e97a5013c614";  // z. B. 64ef92f123abc123
const API_KEY = "$2a$10$IvY76Y.XVJ7oDp12z1h7DuqStDpH1cTjwbXNAcsirbun5j7xWqLjm"; // z. B. $2b$10$...

// Daten abrufen
function ladeFrage() {
  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: {
      "X-Master-Key": API_KEY
    }
  })
    .then(res => res.json())
    .then(data => {
      const index = data.record.currentIndex;
      frageElement.textContent = fragen[index] || "Keine weiteren Fragen.";
    });
}

// Daten speichern
function speichereIndex(index) {
  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify({ currentIndex: index })
  });
}

// Button-Handler
nextBtn.addEventListener("click", () => {
  // Aktuelle Frage neu laden → Index erhöhen
  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { "X-Master-Key": API_KEY }
  })
    .then(res => res.json())
    .then(data => {
      let newIndex = data.record.currentIndex + 1;
      if (newIndex >= fragen.length) newIndex = 0;
      frageElement.textContent = fragen[newIndex];
      speichereIndex(newIndex);
    });
});

// Beim Start aktuelle Frage laden
ladeFrage();
