const API = "";

let editingEventId = null;

function init() {
  loadEvents();
  getBookings();
}

init();


// ---------------- LOAD EVENTS ----------------

async function loadEvents() {
  try {
    const res = await fetch(`${API}/events`);
    const data = await res.json();

    console.log("EVENTS RESPONSE:", data);

    const events = data.events || data;

    const eventsDiv = document.getElementById("events");
    eventsDiv.innerHTML = "";

    events.forEach(event => {
      if (!event || !event.id) {
        console.warn("Skipping invalid event:", event);
        return;
      }

      const div = document.createElement("div");
      div.className = "event-card";

      div.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Description:</strong> ${event.description || ""}</p>
      `;

      // DELETE BUTTON
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", () => {
        deleteEvent(event.id);
      });

      // EDIT BUTTON
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";

      editBtn.addEventListener("click", () => {
        // Fill form
        document.getElementById("title").value = event.title;
        document.getElementById("event_date").value = event.event_date.split("T")[0];
        document.getElementById("location").value = event.location;
        document.getElementById("max_capacity").value = event.max_capacity;
        document.getElementById("description").value = event.description || "";

        // Set edit mode
        editingEventId = event.id;

        // Update button text
        document.querySelector("#create-event button").textContent = "Update Event";

        // Show cancel button
        document.getElementById("cancelEditBtn").style.display = "block";
      });

      div.appendChild(deleteBtn);
      div.appendChild(editBtn);
      eventsDiv.appendChild(div);
    });

  } catch (err) {
    console.error("Failed to load events:", err);
  }
}

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

    console.log("EVENT BOOKINGS RESPONSE:", data);

    const bookingsDiv = document.getElementById("bookings");
    bookingsDiv.innerHTML = "";

    const bookings = data.bookings || [];

    if (bookings.length === 0) {
      bookingsDiv.textContent = "No bookings found for this event.";
      return;
    }

    bookings.forEach(b => {
      const div = document.createElement("div");
      div.className = "booking-card";

      div.innerHTML = `
        <p><strong>Booking ID:</strong> ${b.booking_id}</p>
        <p><strong>User ID:</strong> ${b.user_id}</p>
        <p><strong>Event ID:</strong> ${b.event_id}</p>
        <p><strong>User Name:</strong> ${b.user_name}</p>
        <p><strong>Event Name:</strong> ${b.event_name}</p>
      `;

      bookingsDiv.appendChild(div);
    });

  } catch (err) {
    console.error("Failed to load event bookings:", err);
  }
}


// ---------------- CREATE / UPDATE EVENT ----------------

async function createNewEvent() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  const title = document.getElementById("title").value;
  const event_date = document.getElementById("event_date").value;
  const location = document.getElementById("location").value;
  const max_capacity = document.getElementById("max_capacity").value;
  const description = document.getElementById("description").value;

  if (!title || !event_date || !location || !max_capacity) {
    alert("Please fill all required fields");
    return;
  }

  const isEditing = editingEventId !== null;

  const url = isEditing
    ? `${API}/events/${editingEventId}`
    : `${API}/events`;

  const method = isEditing ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
      alert(data.message || "Request failed");
      return;
    }

    alert(isEditing ? "Event updated!" : "Event created!");

    resetForm();
    loadEvents();

  } catch (err) {
    console.error("Request failed:", err);
  }
}


// ---------------- CANCEL EDIT ----------------

function cancelEdit() {
  resetForm();
}


// ---------------- RESET FORM ----------------

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


// ---------------- DELETE EVENT ----------------

async function deleteEvent(id) {
  if (!id) {
    alert("Invalid event ID");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  if (!confirm("Are you sure you want to delete this event?")) {
    return;
  }

  try {
    const res = await fetch(`${API}/events/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    let data;

    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      console.error("Non-JSON response:", text);
      alert("Server error");
      return;
    }

    if (!res.ok) {
      alert(data.message || "Failed to delete event");
      return;
    }

    alert("Event deleted successfully!");
    loadEvents();

  } catch (err) {
    console.error("Delete failed:", err);
  }
}