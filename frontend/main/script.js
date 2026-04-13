const API = "http://localhost:3000";

function init() {
  loadEvents();

  const token = localStorage.getItem("token");
  if (token) {
    loadBookings();
  }
}

init();


// ---------------- EVENTS ----------------

async function loadEvents() {
  const res = await fetch(`${API}/events`);
  const data = await res.json();

  const eventsDiv = document.getElementById("events");
  eventsDiv.innerHTML = "";

  data.events.forEach(event => {
    const div = document.createElement("div");
    div.className = "event-card";

    div.innerHTML = `
      <h3>${event.title}</h3>
      <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Description:</strong> ${event.description || ""}</p>
      <button onclick="bookEvent(${event.id})">Book</button>
    `;

    eventsDiv.appendChild(div);
  });
}


// ---------------- BOOK EVENT ----------------

async function bookEvent(eventId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  const res = await fetch(`${API}/events/${eventId}/book`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();

  alert(data.message);

  loadBookings();
}


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
}