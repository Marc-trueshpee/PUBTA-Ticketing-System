// ===== Load ticket from URL =====
const params = new URLSearchParams(window.location.search);
const ticketId = params.get("id");

if (!ticketId){
  window.location.href = "tsmain.html";
}

// Load tickets from localStorage
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let ticket = tickets.find(t => t.id === ticketId);
let archivedTickets = JSON.parse(localStorage.getItem("archivedTickets")) || [];

if (!ticket) {
  window.location.href = "tsmain.html";
}

if (!ticket.history) ticket.history = [];

const historyList = document.getElementById("history-list");

// ===== Pre-fill all fields =====
document.getElementById("ticket-id").textContent = ticket.id;
document.getElementById("ticket-title").textContent = ticket.title;
document.getElementById("ticket-requestor").value = ticket.requestor;
document.getElementById("ticket-urgency").value = ticket.urgency;
document.getElementById("ticket-priority").value = ticket.priority;
document.getElementById("ticket-status").value = ticket.status;
document.getElementById("ticket-description").value = ticket.description;


// ===== Modal elements =====
const confirmModal = document.getElementById("confirm-modal");
const confirmMessage = document.getElementById("confirm-message");
const confirmYes = document.getElementById("confirm-yes");
const confirmNo = document.getElementById("confirm-no");

const infoModal = document.getElementById("info-modal");
const infoMessage = document.getElementById("info-message");
const infoOk = document.getElementById("info-ok");


// ===== Modal functions =====
function showConfirm(message, callback) {
  confirmMessage.textContent = message;
  confirmModal.style.display = "block";

  confirmYes.onclick = () => {
    confirmModal.style.display = "none";
    callback(true);
  };

  confirmNo.onclick = () => {
    confirmModal.style.display = "none";
    callback(false);
  };
}

function showInfo(message, callback) {
  infoMessage.textContent = message;
  infoModal.style.display = "block";

  infoOk.onclick = () => {
    infoModal.style.display = "none";
    if (callback) callback();
  };
}

// ==== Ticket History ====
function renderHistory() {
  historyList.innerHTML = "";

  if (ticket.history.length === 0) {
    historyList.innerHTML = "<p>No history yet.</p>";
    return;
  }

  ticket.history.slice().reverse().forEach(entry => {
    const div = document.createElement("div");
    div.className = "history-entry";

    div.innerHTML = `
      <div class="history-user">${entry.user} — ${entry.time}</div>
      ${entry.changes.map(c => `<div class="history-change">${c}</div>`).join("")}
      ${entry.descriptionChanged ? `<div class="history-description">Description updated</div>` : ""}
    `;

    historyList.appendChild(div);
  });
}

// ===== Save ticket =====
document.getElementById("update-ticket").addEventListener("click", () => {
  const changes = [];
  let descriptionChanged = false;

  const newRequestor = document.getElementById("ticket-requestor").value.trim();
  const newUrgency = document.getElementById("ticket-urgency").value;
  const newPriority = document.getElementById("ticket-priority").value;
  const newStatus = document.getElementById("ticket-status").value;
  const newDescription = document.getElementById("ticket-description").value.trim();

  // Compare and record changes
  if (ticket.requestor !== newRequestor) {
    changes.push(`Requestor: ${ticket.requestor} → ${newRequestor}`);
    ticket.requestor = newRequestor;
  }

  if (ticket.urgency !== newUrgency) {
    changes.push(`Urgency: ${ticket.urgency} → ${newUrgency}`);
    ticket.urgency = newUrgency;
  }

  if (ticket.priority !== newPriority) {
    changes.push(`Priority: ${ticket.priority} → ${newPriority}`);
    ticket.priority = newPriority;
  }

  if (ticket.status !== newStatus) {
    changes.push(`Status: ${ticket.status} → ${newStatus}`);
    ticket.status = newStatus;
  }

  if (ticket.description !== newDescription) {
    descriptionChanged = true;
    ticket.description = newDescription;
  }

  // If something changed, log history
  if (changes.length > 0 || descriptionChanged) {
    if (!ticket.history) ticket.history = [];

    ticket.history.push({
      user: "Marc",
      time: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }) + " PHT",
      changes: changes,
      descriptionChanged: descriptionChanged
    });

    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderHistory(); // refresh history section on screen

    showInfo("Ticket updated successfully!", () => {
      window.location.href = "tsmain.html";
    });
  } else {
    showInfo("No changes made.");
  }
});


// ===== Archive ticket =====
document.getElementById("delete-ticket").addEventListener("click", () => {
  showConfirm(`Are you sure you want to archive ticket ${ticket.id}?`, (confirmed) => {
    if (confirmed) {
      archivedTickets.push(ticket);
      tickets = tickets.filter(t => t.id !== ticket.id);
      localStorage.setItem("tickets", JSON.stringify(tickets));
      localStorage.setItem("archivedTickets", JSON.stringify(archivedTickets));
      showInfo(`Ticket ${ticket.id} archived.`, () => {
        window.location.href = "tsmain.html";
      });
    }
  });s
});

renderHistory();