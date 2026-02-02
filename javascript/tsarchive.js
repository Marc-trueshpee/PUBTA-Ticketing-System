//basically just tsmain but using a different storage called archivedTickets
let archivedTickets = JSON.parse(localStorage.getItem("archivedTickets")) || [];

let ticketCounter = archivedTickets
  .map(t => parseInt(t.id || "0", 10))
  .reduce((max, id) => Math.max(max, id), 0);

localStorage.setItem("archivedTickets", JSON.stringify(archivedTickets));

const tbody = document.getElementById("archiveBody");

function renderTickets() {
  tbody.innerHTML = "";

  archivedTickets.forEach(t => {
    const tr = document.createElement("tr");
    t.status = "Closed"

    tr.innerHTML = `
      <td><a href="tsarchivebody.html?id=${t.id}" class="ticket-link">${t.id}</a></td>
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