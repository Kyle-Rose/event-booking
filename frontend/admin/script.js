const API = "http://localhost:3000";

function init() {
  loadEvents();
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

      // ---------------- DELETE BUTTON (FIXED) ----------------
      const btn = document.createElement("button");
      btn.textContent = "Delete";

      btn.addEventListener("click", () => {
        console.log("DELETE CLICKED ID:", event.id);
        deleteEvent(event.id);
      });

      div.appendChild(btn);
      eventsDiv.appendChild(div);
    });

  } catch (err) {
    console.error("Failed to load events:", err);
  }
}


// ---------------- CREATE EVENT ----------------

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

  try {
    const res = await fetch(`${API}/events`, {
      method: "POST",
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
      alert(data.message || "Failed to create event");
      return;
    }

    alert("Event created successfully!");

    // clear form
    document.getElementById("title").value = "";
    document.getElementById("event_date").value = "";
    document.getElementById("location").value = "";
    document.getElementById("max_capacity").value = "";
    document.getElementById("description").value = "";

    loadEvents();

  } catch (err) {
    console.error("Create failed:", err);
  }
}


// ---------------- DELETE EVENT ----------------

async function deleteEvent(id) {
  console.log("DELETE FUNCTION CALLED WITH:", id);

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