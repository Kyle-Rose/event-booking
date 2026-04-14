const API = "";


// ---------------- NORMAL LOGIN ----------------
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

  console.log("LOGIN RESPONSE:", data);

  if (!res.ok || !data.token) {
    alert(data.message || "Login failed");
    return;
  }

  // store auth
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.user.role);
  localStorage.setItem("user", JSON.stringify(data.user));

  window.location.href = "../main/index.html";
}


// ---------------- ADMIN LOGIN ----------------
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

  console.log("ADMIN LOGIN RESPONSE:", data);

  if (!res.ok || !data.token) {
    alert(data.message || "Login failed");
    return;
  }

  if (data.user.role !== "admin") {
    alert("Access denied: Not an admin");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.user.role);
  localStorage.setItem("user", JSON.stringify(data.user));

  window.location.href = "../admin/index.html";
}


// ---------------- ADMIN ROUTE PROTECTION ----------------
function protectAdminRoute() {
  const role = localStorage.getItem("role");

  console.log("ROLE CHECK:", role);

  if (role !== "admin") {
    alert("Access denied: Not an admin");
    window.location.href = "../main/index.html";
  }
}


// ✅ ONLY RUN ON ADMIN PAGE
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("admin")) {
    protectAdminRoute();
  }
});


// ---------------- HELPERS ----------------
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function isAdmin() {
  return localStorage.getItem("role") === "admin";
}


// ---------------- LOGOUT ----------------
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  window.location.href = "../login/index.html";
}