function generateTicketId(number) {
  return String(number).padStart(5, "0");
} //generate incrementing for id

//pull existing data from json to not repeat self
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let archiveTickets = JSON.parse(localStorage.getItem("archivedTickets")) || [];

let ticketCounter = [...tickets,...archiveTickets] //checks both normal and archive so no repetitions
  .map(t => parseInt(t.id || "0", 10))
  .reduce((max, id) => Math.max(max, id), 0);

tickets.forEach(t => {
  if (!t.id) {
    ticketCounter++;
    t.id = generateTicketId(ticketCounter);
  }
});

localStorage.setItem("tickets", JSON.stringify(tickets));
const tbody = document.getElementById("ticketBody");

//refreshes the ticket page every load
function renderTickets() { 
  tbody.innerHTML = "";

  tickets.forEach(t => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><a href="tsticketbody.html?id=${t.id}" class="ticket-link">${t.id}</a></td>
      <td>${t.requestor}</td>
      <td>${t.title}</td>
      <td class="desc">${t.description}</td>
      <td><span class="badge urgency ${t.urgency.toLowerCase()}">${t.urgency}</span></td>
      <td><span class="badge priority ${t.priority.toLowerCase()}">${t.priority}</span></td>
      <td><span class="badge status ${t.status.toLowerCase().replace(" ", "")}">${t.status}</span></td>
    `;

    tbody.appendChild(tr);
  });
}

renderTickets();