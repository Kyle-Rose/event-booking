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
    window.location.href = "../main/index.html";                
  } else {
    alert("Login failed");
  }
}

async function loginAsAdmin() {
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
    alert("Admin login successful");
    window.location.href = "../admin/index.html";                
  } else {
    alert("Login failed");
  }
}
