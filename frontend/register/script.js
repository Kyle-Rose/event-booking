const API = "http://localhost:3000";

async function register() {
  const name = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();

  console.log(data);

  if (res.ok) {
    alert("Registration successful! Please login.");
  } else {
    alert(data.message || "Registration failed");
  }
}