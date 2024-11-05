// Function to fetch and display existing data on page load
function fetchAndDisplayData() {
  fetch("/data")
    .then(response => response.json())
    .then(data => {
      const displayContainer = document.getElementById("displayContainer");
      displayContainer.innerHTML = ""; // Clear previous content

      if (data.length === 0) {
        displayContainer.innerHTML = "No data submitted yet.";
      } else {
        // Store data in a global variable to enable searching
        window.allData = data;
        data.forEach(entry => addDataToDisplay(entry, displayContainer));
      }
    })
    .catch(error => console.error("Error loading data:", error));
}

// Function to add an entry to the display container
function addDataToDisplay(entry, container) {
  const dataItem = document.createElement("div");
  dataItem.classList.add("data-item");

  dataItem.innerHTML = `
    <h3>${entry.item} (${entry.status})</h3>
    <p><strong>Submitted by:</strong> ${entry.name}</p>
    <p><strong>Description:</strong> ${entry.description}</p>
  `;
  container.prepend(dataItem); // Add new entry to the top
}

// Search function
function searchItems() {
  const searchQuery = document.getElementById("searchBar").value.toLowerCase();
  const displayContainer = document.getElementById("displayContainer");
  displayContainer.innerHTML = ""; // Clear previous content

  // Filter and display matching entries
  const filteredData = window.allData.filter(entry =>
    entry.item.toLowerCase().includes(searchQuery) ||
    entry.description.toLowerCase().includes(searchQuery) ||
    entry.name.toLowerCase().includes(searchQuery) ||
    entry.status.toLowerCase().includes(searchQuery)
  );

  if (filteredData.length === 0) {
    displayContainer.innerHTML = "No items match your search.";
  } else {
    filteredData.forEach(entry => addDataToDisplay(entry, displayContainer));
  }
}

// Fetch data on page load
window.addEventListener("DOMContentLoaded", fetchAndDisplayData);

// Handle form submission
document.getElementById("itemForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Collect form data
  const formData = {
    name: document.getElementById("name").value,
    item: document.getElementById("item").value,
    description: document.getElementById("description").value,
    status: document.getElementById("status").value
  };

  // Send form data to the server using AJAX
  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      const displayContainer = document.getElementById("displayContainer");

      if (displayContainer.innerHTML === "No data submitted yet.") {
        displayContainer.innerHTML = ""; // Clear "No data" message
      }

      // Update global data and display new data
      window.allData.unshift(formData);
      addDataToDisplay(formData, displayContainer);
    })
    .catch(error => console.error("Error submitting form:", error));
});
