const API = "http://localhost:4000";

// ====== Authentication ======
const token = localStorage.getItem("token");
const authDiv = document.getElementById("auth");
const dashDiv = document.getElementById("dashboard");

if (token) {
  authDiv.style.display = "none";
  dashDiv.style.display = "block";
  loadActivities();
  loadCommunity();
}

document.getElementById("register").onclick = async () => {
  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  alert(data.message || data.error);
};

document.getElementById("login").onclick = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    authDiv.style.display = "none";
    dashDiv.style.display = "block";
    loadActivities();
    loadCommunity();
  } else {
    alert(data.error);
  }
};

document.getElementById("logout").onclick = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

// ====== Activities ======
async function loadActivities() {
  const res = await fetch(`${API}/activities`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
  const activities = await res.json();

  const table = document.getElementById("activities");
  table.innerHTML =
    "<tr><th>Description</th><th>Category</th><th>CO₂</th><th>Date</th></tr>";

  let total = 0;
  activities.forEach((a) => {
    total += a.co2;
    const row = table.insertRow();
    row.insertCell(0).innerText = a.description;
    row.insertCell(1).innerText = a.category;
    row.insertCell(2).innerText = a.co2;
    row.insertCell(3).innerText = new Date(a.date).toLocaleString();
  });

  document.getElementById("total-co2").innerText = total;
}

document.getElementById("add-activity").onclick = async () => {
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const co2 = parseFloat(document.getElementById("co2").value);

  const res = await fetch(`${API}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ description, category, co2 }),
  });

  const data = await res.json();
  if (res.ok) {
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
    document.getElementById("co2").value = "";
    loadActivities();
    loadCommunity();
  } else {
    alert(data.error);
  }
};

// ====== Community ======
async function loadCommunity() {
  // Average
  const avgRes = await fetch(`${API}/activities/community/average`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
  const avgData = await avgRes.json();
  document.getElementById("community-average").innerText =
    avgData.average.toFixed(2);

  // Leaderboard
  const lbRes = await fetch(`${API}/activities/community/leaderboard`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
  const lbData = await lbRes.json();
  const lbTable = document.getElementById("leaderboard");
  lbTable.innerHTML = "<tr><th>User</th><th>Total CO₂</th></tr>";
  lbData.forEach((u) => {
    const row = lbTable.insertRow();
    row.insertCell(0).innerText = u.username;
    row.insertCell(1).innerText = u.totalEmissions;
  });
}
