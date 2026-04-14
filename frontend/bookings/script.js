const API = "";

function init() {
  const token = localStorage.getItem("token");
  if (token) {
    loadBookings();
  }
}

init();


// ---------------- BOOKINGS ----------------

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

    console.log("FULL BOOKINGS RESPONSE:", JSON.stringify(data, null, 2));
    console.log("RAW bookings array:", data.bookings);

    const bookingsDiv = document.getElementById("bookings");
    bookingsDiv.innerHTML = "";

    const bookings = data.bookings || [];

    bookings.forEach(b => {
      const div = document.createElement("div");
      div.className = "event-card";

      div.innerHTML = `
        <h3>${b.title}</h3>
        <p><strong>Date:</strong> ${new Date(b.event_date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${b.location}</p>
        <p><strong>Description:</strong> ${b.description || ""}</p>
      `;

      // ---------------- CANCEL BUTTON ----------------
      const btn = document.createElement("button");
      btn.textContent = "Cancel Booking";
      btn.style.background = "red";
      btn.style.color = "white";

      // IMPORTANT:
      // b.id = booking id (used for delete)
      btn.addEventListener("click", () => cancelBooking(b.booking_id, div));

      div.appendChild(btn);
      bookingsDiv.appendChild(div);
    });

  } catch (err) {
    console.error("Failed to load bookings:", err);
  }
}


// ---------------- CANCEL BOOKING ----------------

async function cancelBooking(bookingId, cardElement) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Not logged in");
    return;
  }

  if (!confirm("Cancel this booking?")) return;

  try {
    const res = await fetch(`${API}/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to cancel booking");
      return;
    }

    alert("Booking cancelled");

    // remove card instantly
    cardElement.remove();

  } catch (err) {
    console.error("Cancel error:", err);
  }
}