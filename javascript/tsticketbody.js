// ===== Load ticket from URL =====
const params = new URLSearchParams(window.location.search);
const ticketId = params.get("id");

if (!ticketId){
  window.location.href = "index.html";
}

// Load tickets from localStorage
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let ticket = tickets.find(t => t.id === ticketId);
let archivedTickets = JSON.parse(localStorage.getItem("archivedTickets")) || [];

if (!ticket) {
  window.location.href = "index.html";
}

if (!ticket.history) ticket.history = [];
if (!ticket.createdAt) {
  ticket.createdAt = "Unknown";
}

const historyList = document.getElementById("history-list");

// ===== Pre-fill all fields =====
document.getElementById("ticket-id").textContent = ticket.id;
document.getElementById("ticket-title").textContent = ticket.title;
document.getElementById("ticket-requestor").value = ticket.requestor;
document.getElementById("ticket-urgency").value = ticket.urgency;
document.getElementById("ticket-priority").value = ticket.priority;
document.getElementById("ticket-status").value = ticket.status;
document.getElementById("ticket-description").value = ticket.description;
const parsed = parseTicketInfo(ticket.ticket_information);

document.getElementById("ti-business").innerText = business;
document.getElementById("ti-investigation").innerText = investigation;
document.getElementById("ti-status").innerText = status;
document.getElementById("ti-steps").innerText = steps;

/*
document.getElementById("ticket-business-impact").value = ticket.business_impact;
document.getElementById("ticket-investigation").value = ticket.investigation;
document.getElementById("ticket-current-status").value = ticket.current_status;
document.getElementById("ticket-next-steps").value = ticket.next_steps;
*/


document.getElementById("ticket-requestor").disabled = true;


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

function getFormattedDate() {
  return new Date().toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }) + " PHT";
}

function clean(text) {
  return text ? text.trim() : "-";
}

function formatFullDescription(data) {
  return `Business Impact:
${clean(data.business_impact)}

Investigation:
${clean(data.investigation)}

Current Status:
${clean(data.current_status)}

Next Steps:
${clean(data.next_steps)}

Description:
${clean(data.description)}`;
}

// ==== Ticket History ====
function renderHistory() {
  historyList.innerHTML = `
  <div class="history-entry">
    <div class="history-user">Created — ${ticket.createdAt}</div>
  </div>
  `;

  if (ticket.history.length === 0) {
    historyList.innerHTML += "<p>No history yet.</p>";
    return;
  }

  ticket.history.slice().reverse().forEach(entry => {
    const div = document.createElement("div");
    div.className = "history-entry";

    div.innerHTML = `
      <div class="history-user">${entry.user} — ${entry.time}</div>
      ${entry.changes.map(c => `<div class="history-change">${c}</div>`).join("")}
      ${entry.descriptionChanged ? `
        <div class="history-description">
          Description changed
          <div class="history-old">From: \n${entry.oldDescription}</div>
          <div class="history-new">To: \n${entry.newDescription}</div>
        </div>
      ` : ""}
    `;

    historyList.appendChild(div);
  });
}

// ===== Save ticket =====
function parseTicketInfo(text) {
  const data = {
    business: "",
    investigation: "",
    status: "",
    steps: ""
  };

  const lines = text.split("\n");

  let currentKey = "";

  lines.forEach(line => {
    if (line.startsWith("Business Impact:")) {
      currentKey = "business";
      data.business = line.replace("Business Impact:", "").trim();
    } else if (line.startsWith("Investigation:")) {
      currentKey = "investigation";
      data.investigation = line.replace("Investigation:", "").trim();
    } else if (line.startsWith("Current Status:")) {
      currentKey = "status";
      data.status = line.replace("Current Status:", "").trim();
    } else if (line.startsWith("Next Steps:")) {
      currentKey = "steps";
      data.steps = line.replace("Next Steps:", "").trim();
    } else if (currentKey) {
      data[currentKey] += "\n" + line.trim();
    }
  });

  return data;
}


document.getElementById("update-ticket").addEventListener("click", () => {
  const changes = [];
  let descriptionChanged = false;

  /*const newRequestor = */document.getElementById("ticket-requestor").value.trim();
  const newUrgency = document.getElementById("ticket-urgency").value;
  const newPriority = document.getElementById("ticket-priority").value;
  const newStatus = document.getElementById("ticket-status").value;
  const newDescription = document.getElementById("ticket-description").value.trim();
  const newTicketInformation = `
    Business Impact: ${document.getElementById("ti-business").innerText.trim()}
    Investigation: ${document.getElementById("ti-investigation").innerText.trim()}
    Current Status: ${document.getElementById("ti-status").innerText.trim()}
    Next Steps: ${document.getElementById("ti-steps").innerText.trim()}
    `.trim();

  /*
  const newBusinessImpact = document.getElementById("ticket-business-impact").value.trim();
  const newInvestigation = document.getElementById("ticket-investigation").value.trim();
  const newCurrentStatus = document.getElementById("ticket-current-status").value.trim();
  const newNextSteps = document.getElementById("ticket-next-steps").value.trim();
  

  const newFormatted = formatFullDescription({
    business_impact: newBusinessImpact,
    investigation: newInvestigation,
    current_status: newCurrentStatus,
    next_steps: newNextSteps,
    description: newDescription
  });
  
  */

  // Compare and record changes
  //if (ticket.requestor !== newRequestor) {
  //  changes.push(`Requestor: ${ticket.requestor} → ${newRequestor}`);
  //  ticket.requestor = newRequestor;
  //}

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
    changes.push(`Description: ${ticket.description} → ${newDescription}`);
    ticket.description = newDescription;
  }

if (ticket.ticket_information !== newTicketInformation) {
    changes.push(`Ticket Info: ${ticket.ticket_information} → ${newTicketInformation}`);
    ticket.ticket_information = newTicketInformation;
  }

  /*
  let oldDescription = null;

  const oldFormatted = formatFullDescription({
    business_impact: ticket.business_impact,
    investigation: ticket.investigation,
    current_status: ticket.current_status,
    next_steps: ticket.next_steps,
    description: ticket.description
  });

  if (oldFormatted !== newFormatted) {
    descriptionChanged = true;
    oldDescription = oldFormatted;
  }

  if (descriptionChanged) {
    ticket.business_impact = newBusinessImpact;
    ticket.investigation = newInvestigation;
    ticket.current_status = newCurrentStatus;
    ticket.next_steps = newNextSteps;
    ticket.description = newDescription;
  }

  */

  // If something changed, log history
  if (changes.length > 0) {
    if (!ticket.history) ticket.history = [];

    ticket.history.push({
      user: "Marc",
      time: getFormattedDate(),
      changes: changes,
    });

    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderHistory(); // refresh history section on screen

    showInfo("Ticket updated successfully!", () => {
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
        window.location.href = "index.html";
      });
    }
  });
});

renderHistory();