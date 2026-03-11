document.getElementById("ticketForm").addEventListener("submit", e => {
  e.preventDefault(); 
  //create new ticket element when submit is pressed
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  // Create formatted creation date (Philippine time)
  const createdAt = new Date().toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }) + " PHT";

  const ticket = {
    requestor: document.getElementById("requestor").value.trim(),
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    urgency: document.getElementById("urgency").value,
    priority: document.getElementById("priority").value,
    status: document.getElementById("status").value,
    createdAt: createdAt
  };

  tickets.push(ticket);
  localStorage.setItem("tickets", JSON.stringify(tickets));

  window.location.href = "tsmain.html";
});