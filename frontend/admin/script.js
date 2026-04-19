const API = "";

let editingEventId = null;

function init() {
  loadEvents();
  getBookings();
}

init();


// ===================== EVENTS =====================

async function loadEvents() {
  try {
    const res = await fetch(`${API}/events`);
    const data = await res.json();

    const events = data.events || data;

    const eventsDiv = document.getElementById("events");
    eventsDiv.innerHTML = "";

    events.forEach(event => {
      if (!event || !event.id) return;

      const div = document.createElement("div");
      div.className = "event-card";

      div.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Description:</strong> ${event.description || ""}</p>
      `;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete Event";
      deleteBtn.onclick = () => deleteEvent(event.id);

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => {
        document.getElementById("title").value = event.title;
        document.getElementById("event_date").value = event.event_date.split("T")[0];
        document.getElementById("location").value = event.location;
        document.getElementById("max_capacity").value = event.max_capacity;
        document.getElementById("description").value = event.description || "";

        editingEventId = event.id;
        document.querySelector("#create-event button").textContent = "Update Event";
        document.getElementById("cancelEditBtn").style.display = "block";
      };

      div.appendChild(deleteBtn);
      div.appendChild(editBtn);

      eventsDiv.appendChild(div);
    });

  } catch (err) {
    console.error("Failed to load events:", err);
  }
}


// ===================== BOOKINGS =====================

async function getBookings() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${API}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    const bookingsDiv = document.getElementById("bookings");
    bookingsDiv.innerHTML = "";

    const bookings = data.bookings || [];

    if (bookings.length === 0) {
      bookingsDiv.textContent = "No bookings found.";
      return;
    }

    bookings.forEach(b => {
      const card = document.createElement("div");
      card.className = "booking-card";

      card.innerHTML = `
        <h3>${b.event_name}</h3>
        <p><strong>User:</strong> ${b.user_name}</p>
        <p><strong>Booking ID:</strong> ${b.booking_id}</p>
        <p><strong>User ID:</strong> ${b.user_id}</p>
        <p><strong>Event ID:</strong> ${b.event_id}</p>
      `;

      // ===================== SAFE DELETE BUTTON =====================
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete Booking";
      deleteBtn.style.background = "red";
      deleteBtn.style.color = "white";

      deleteBtn.onclick = () => {
        // 🔥 SAFETY CHECK (prevents your error)
        if (!b || !b.booking_id) {
          console.error("Invalid booking object:", b);
          alert("Cannot delete booking: missing ID");
          return;
        }

        deleteBooking(b.booking_id);
      };

      card.appendChild(deleteBtn);
      bookingsDiv.appendChild(card);
    });

  } catch (err) {
    console.error("Failed to load bookings:", err);
  }
}


// ===================== CREATE / UPDATE EVENT =====================

async function createNewEvent() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Please login first");

  const title = document.getElementById("title").value;
  const event_date = document.getElementById("event_date").value;
  const location = document.getElementById("location").value;
  const max_capacity = document.getElementById("max_capacity").value;
  const description = document.getElementById("description").value;

  const url = editingEventId
    ? `${API}/events/${editingEventId}`
    : `${API}/events`;

  const method = editingEventId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        event_date,
        location,
        max_capacity,
        description
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.message || "Error");
    }

    alert(editingEventId ? "Event updated!" : "Event created!");

    resetForm();
    loadEvents();

  } catch (err) {
    console.error(err);
  }
}


// ===================== DELETE EVENT =====================

async function deleteEvent(id) {
  const token = localStorage.getItem("token");

  if (!confirm("Delete this event?")) return;

  try {
    await fetch(`${API}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    loadEvents();

  } catch (err) {
    console.error(err);
  }
}


// ===================== DELETE BOOKING =====================

async function deleteBooking(id) {
  const token = localStorage.getItem("token");

  if (!id) {
    console.error("deleteBooking called with invalid id:", id);
    alert("Invalid booking ID");
    return;
  }

  if (!confirm("Delete this booking?")) return;

  try {
    const res = await fetch(`${API}/bookings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.message || "Failed to delete booking");
    }

    alert("Booking deleted");
    getBookings();

  } catch (err) {
    console.error("Delete booking error:", err);
  }
}


// ===================== FORM HELPERS =====================

function cancelEdit() {
  resetForm();
}

function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("event_date").value = "";
  document.getElementById("location").value = "";
  document.getElementById("max_capacity").value = "";
  document.getElementById("description").value = "";

  editingEventId = null;

  document.querySelector("#create-event button").textContent = "Create Event";
  document.getElementById("cancelEditBtn").style.display = "none";
}