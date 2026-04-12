const API = "http://localhost:3000";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  console.log(data);

  if (data.token) {
    localStorage.setItem("token", data.token);
    loadEvents();
  } else {
    alert("Login failed");
  }
}

async function loadEvents() {
  const res = await fetch(`${API}/events`);
  const data = await res.json();

  const eventsDiv = document.getElementById("events");
  eventsDiv.innerHTML = "<h2>Events</h2>";

data.events.forEach(event => {
  const div = document.createElement("div");

  div.className = "event-card";

  div.innerHTML = `
    <h3>${event.title}</h3>
    <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</p>
    <p><strong>Location:</strong> ${event.location}</p>
    <p>${event.description || ""}</p>
    <button onclick="bookEvent(${event.id})">Book</button>
  `;

  eventsDiv.appendChild(div);
});
}

async function bookEvent(eventId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/events/${eventId}/book`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  alert(data.message);
}