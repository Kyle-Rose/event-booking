const API = "http://localhost:3000";

function init() {

  const token = localStorage.getItem("token");
  if (token) {
    loadBookings();
  }
}

init();

// ---------------- BOOK EVENT ----------------


// ---------------- BOOKINGS ----------------

async function loadBookings() {
  const token = localStorage.getItem("token");

  if (!token) return;

  const res = await fetch(`${API}/me/bookings`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  

  const bookingsDiv = document.getElementById("bookings");
  bookingsDiv.innerHTML = "";

  data.bookings.forEach(b => {
    const div = document.createElement("div");
    div.className = "event-card";

    div.innerHTML = `
      <h3>${b.title}</h3>
      <p><strong>Date:</strong> ${new Date(b.event_date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> ${b.location}</p>
      <p><strong>Description:</strong> ${b.description || ""}</p>
    `;

    bookingsDiv.appendChild(div);
  });
    console.log("RAW BOOKINGS RESPONSE:", data);
}