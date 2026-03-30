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

  const created = document.createElement("div");
  created.className = "history-entry";
  created.innerHTML = `<div class="history-user">Created — ${ticket.createdAt || "Unknown"}</div>`;
  historyList.appendChild(created);

  if (!ticket.history || ticket.history.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No history.";
    historyList.appendChild(p);
    return;
  }

  ticket.history.slice().reverse().forEach(entry => {
    const div = document.createElement("div");
    div.className = "history-entry";

    div.innerHTML = `
      <div class="history-user">${entry.user || "Unknown"} — ${entry.time || ""}</div>
      ${(entry.changes || []).map(c => `<div class="history-change">${c}</div>`).join("")}
    `;

    historyList.appendChild(div);
  });
}

function parseTicketInfo(text) {
  const data = {
    business: "-",
    investigation: "-",
    status: "-",
    steps: "-"
  };

  if (!text) return data;

  const lines = text.split("\n");
  let current = "";

  lines.forEach(line => {
    line = line.trim();

    if (line.startsWith("Business Impact:")) {
      current = "business";
      data.business = line.replace("Business Impact:", "").trim();
    } else if (line.startsWith("Investigation:")) {
      current = "investigation";
      data.investigation = line.replace("Investigation:", "").trim();
    } else if (line.startsWith("Current Status:")) {
      current = "status";
      data.status = line.replace("Current Status:", "").trim();
    } else if (line.startsWith("Next Steps:")) {
      current = "steps";
      data.steps = line.replace("Next Steps:", "").trim();
    } else if (current) {
      data[current] += "\n" + line;
    }
  });

  return data;
}

const parsed = parseTicketInfo(ticket.ticket_information);

document.getElementById("ti-business").innerText =
  "Business Impact: " + parsed.business;

document.getElementById("ti-investigation").innerText =
  "Investigation: " + parsed.investigation;

document.getElementById("ti-status").innerText =
  "Current Status: " + parsed.status;

document.getElementById("ti-steps").innerText =
  "Next Steps: " + parsed.steps;

document.getElementById("ti-business").disabled = true;
document.getElementById("ti-investigation").disabled = true;
document.getElementById("ti-status").disabled = true;
document.getElementById("ti-steps").disabled = true;

document.getElementById("ticket-description").value = ticket.description || "-";

renderHistory();