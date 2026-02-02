// load tickets using url
const params = new URLSearchParams(window.location.search);
const ticketId = params.get("id");

// Load tickets from localStorage
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let archivedTickets = JSON.parse(localStorage.getItem("archivedTickets")) || [];
let ticket = archivedTickets.find(t => t.id === ticketId);

// history part below description
const historyList = document.getElementById("history-list");
if (!ticket.history) ticket.history = [];

// prefill fields so they load when page opens
document.getElementById("ticket-id").textContent = ticket.id;
document.getElementById("ticket-title").textContent = ticket.title;
document.getElementById("ticket-requestor").value = ticket.requestor;
document.getElementById("ticket-urgency").value = ticket.urgency;
document.getElementById("ticket-priority").value = ticket.priority;
document.getElementById("ticket-status").value = "Closed";
document.getElementById("ticket-description").value = ticket.description;
//turn off fields so it can't be edited
document.getElementById("ticket-requestor").disabled = true;
document.getElementById("ticket-urgency").disabled = true;
document.getElementById("ticket-priority").disabled = true;
document.getElementById("ticket-status").disabled = true;
document.getElementById("ticket-description").readOnly = true;

//elements for confirm/archive message
const confirmModal = document.getElementById("confirm-modal");
const confirmMessage = document.getElementById("confirm-message");
const confirmYes = document.getElementById("confirm-yes");
const confirmNo = document.getElementById("confirm-no");

const infoModal = document.getElementById("info-modal");
const infoMessage = document.getElementById("info-message");
const infoOk = document.getElementById("info-ok");

// confirm message function
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

// ticket history loading
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

renderHistory();
