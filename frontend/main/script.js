const API = "http://localhost:3000";

let bookedEventIds = new Set();

function init() {
  loadBookings().then(() => {
    loadEvents();
  });
}

init();


// ---------------- LOAD BOOKINGS ----------------

async function loadBookings() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${API}/me/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log("BOOKINGS RAW:", data);

    const bookings = data.bookings || [];

    // ✅ IMPORTANT: using event_id (correct backend structure)
    bookedEventIds = new Set(
      bookings.map(b => Number(b.event_id))
    );

    console.log("BOOKED EVENT IDS:", Array.from(bookedEventIds));

  } catch (err) {
    console.error("Error loading bookings:", err);
  }
}


// ---------------- LOAD EVENTS ----------------

async function loadEvents() {
  try {
    const res = await fetch(`${API}/events`);
    const data = await res.json();

    console.log("EVENTS RAW:", data);

    const events = data.events || data;
    const eventsDiv = document.getElementById("events");

    eventsDiv.innerHTML = "";

    events.forEach(event => {
      if (!event || !event.id) return;

      const isBooked = bookedEventIds.has(Number(event.id));

      console.log(`Event ID ${event.id} booked:`, isBooked);

      const div = document.createElement("div");
      div.className = "event-card";

      div.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Description:</strong> ${event.description || ""}</p>
      `;

      const btn = document.createElement("button");

      if (isBooked) {
        btn.textContent = "Already Booked";
        btn.disabled = true;
        btn.style.opacity = "0.6";
      } else {
        btn.textContent = "Book";
        btn.addEventListener("click", () => bookEvent(event.id, btn));
      }

      div.appendChild(btn);
      eventsDiv.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading events:", err);
  }
}


// ---------------- BOOK EVENT ----------------

async function bookEvent(eventId, btn) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    const res = await fetch(`${API}/events/${eventId}/book`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      // update state instantly
      bookedEventIds.add(Number(eventId));

      // update UI instantly
      btn.textContent = "Already Booked";
      btn.disabled = true;
      btn.style.opacity = "0.6";
    }

  } catch (err) {
    console.error("Booking failed:", err);
  }
}