document.getElementById("ticketForm").addEventListener("submit", e => {
  e.preventDefault();

  const ticket = {
    requestor: document.getElementById("requestor").value.trim(),
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    urgency: document.getElementById("urgency").value,
    priority: document.getElementById("priority").value,
    status: "Open" // default status
  };

  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  tickets.push(ticket);

  localStorage.setItem("tickets", JSON.stringify(tickets));

  window.location.href = "tsmain.html";
});