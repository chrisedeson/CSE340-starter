"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const classificationList = document.querySelector("#classificationList");
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  if (classificationList) {
    classificationList.addEventListener("change", function () {
      const classification_id = classificationList.value;
      const classIdURL = "/inv/getInventory/" + classification_id;

      fetch(classIdURL)
        .then((response) => {
          if (response.ok) return response.json();
          throw Error("Network response was not OK");
        })
        .then((data) => {
          inventoryDisplay.innerHTML = buildInventoryDisplay(data);
        })
        .catch((error) => console.log("There was a problem: ", error.message));
    });
  }

  const form = document.querySelector("#updateForm");
  if (form) {
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button");
      if (updateBtn) updateBtn.removeAttribute("disabled");
    });
  }

  function buildInventoryDisplay(data) {
  let table = `<table class="qwexz-table">
    <thead class="qwexz-header">
      <tr>
        <th class="qwexz-th">Vehicle</th>
        <th class="qwexz-th">Price</th>
        <th class="qwexz-th">Modify</th>
        <th class="qwexz-th">Status</th>
      </tr>
    </thead>
    <tbody class="qwexz-tbody">`;

  data.forEach(vehicle => {
    table += `<tr class="qwexz-row">
      <td class="qwexz-vehicle">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</td>
      <td class="qwexz-price">$${vehicle.inv_price}</td>
      <td class="qwexz-modify">
        <a href='/inv/edit/${vehicle.inv_id}' class="qwexz-link" title='Click to update'>Modify</a> | 
        <a href='/inv/delete/${vehicle.inv_id}' class="qwexz-link" title='Click to delete'>Delete</a>
      </td>
      <td class="qwexz-status-cell">
        <form action="/inv/status/${vehicle.inv_id}" method="post" class="qwexz-status-form">
          <input type="hidden" name="inv_status" value="${vehicle.inv_status === 'Available' ? 'Sold' : 'Available'}">
          <button type="submit" class="qwexz-toggle-btn ${
            vehicle.inv_status === 'Available' ? 'qwexz-available' : 'qwexz-sold'
          }">
            Mark as ${vehicle.inv_status === 'Available' ? 'Sold' : 'Available'}
          </button>
        </form>
        <span class="qwexz-badge ${
          vehicle.inv_status === 'Available' ? 'qwexz-available-badge' : 'qwexz-sold-badge'
        }">${vehicle.inv_status}</span>
      </td>
    </tr>`;
  });

  table += "</tbody></table>";
  return table;
}

});
