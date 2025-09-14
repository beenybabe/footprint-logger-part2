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
const activityOptions = {
  "Driving (10km)": 2.3,
  "Bus Ride (10km)": 0.7,
  "Flight (1hr)": 90,
  "Meat-based Meal": 5.5,
  "Vegetarian Meal": 2.0,
  "Laundry (1 Load)": 1.2,
};
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
function addRow() {
  const tableBody = document.getElementById("tableBody");
  const newRow = document.createElement("tr");

  const activityCell = document.createElement("td");
  const select = document.createElement("select");

  Object.keys(activityOptions).forEach((activity) => {
    const option = document.createElement("option");
    option.value = activity;
    option.textContent = activity;
    select.appendChild(option);
  });

  activityCell.appendChild(select);
  newRow.appendChild(activityCell);

  const emissionCell = document.createElement("td");
  emissionCell.textContent = activityOptions[select.value];
  newRow.appendChild(emissionCell);

  select.addEventListener("change", function () {
    emissionCell.textContent = activityOptions[select.value];
    saveData();
  });

  tableBody.appendChild(newRow);
  saveData();
}

function calculateTotal() {
  const tableBody = document.getElementById("tableBody");
  let total = 0;

  for (let row of tableBody.rows) {
    const emission = parseFloat(row.cells[1].textContent);
    total += emission;
  }

  document.getElementById(
    "totalCO2"
  ).textContent = `Total CO2 Emission: ${total.toFixed(2)} kg`;
}
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
async function loadLeaderboard() {
  try {
    const res = await fetch("/activities/leaderboard");
    const data = await res.json();

    const leaderboardList = document.getElementById("leaderboard");
    leaderboardList.innerHTML = "";

    data.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = `${entry.username}: ${entry.totalEmissions} kg CO₂`;
      leaderboardList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load leaderboard:", err);
  }
}

// Load leaderboard when page starts
window.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();
});

// Save the data
function saveData() {
  const rows = [];
  const tableBody = document.getElementById("tableBody");

  for (let row of tableBody.rows) {
    rows.push(row.cells[0].firstChild.value);
  }

  localStorage.setItem("co2Activities", JSON.stringify(rows));
}