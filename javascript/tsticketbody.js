// ===== Load ticket from URL =====
const params = new URLSearchParams(window.location.search);
const ticketId = params.get("id");

if (!ticketId) {
  window.location.href = "tsmain.html";
}

// Load tickets from localStorage
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let ticket = tickets.find(t => t.id === ticketId);

if (!ticket) {
  window.location.href = "tsmain.html";
}

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

// ===== Save ticket =====
document.getElementById("update-ticket").addEventListener("click", () => {
  ticket.requestor = document.getElementById("ticket-requestor").value.trim();
  ticket.urgency = document.getElementById("ticket-urgency").value;
  ticket.priority = document.getElementById("ticket-priority").value;
  ticket.status = document.getElementById("ticket-status").value;
  ticket.description = document.getElementById("ticket-description").value.trim();

  localStorage.setItem("tickets", JSON.stringify(tickets));
  showInfo("Ticket updated successfully!");
});


// ===== Delete ticket =====
document.getElementById("delete-ticket").addEventListener("click", () => {
  showConfirm(`Are you sure you want to delete ticket ${ticket.id}?`, (confirmed) => {
    if (confirmed) {
      tickets = tickets.filter(t => t.id !== ticket.id);
      localStorage.setItem("tickets", JSON.stringify(tickets));
      showInfo(`Ticket ${ticket.id} deleted.`, () => {
        window.location.href = "tsmain.html";
      });
    }
  });
});
