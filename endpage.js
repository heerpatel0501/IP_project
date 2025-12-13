function addTask() {

    let start = document.getElementById("startTime").value;
    let end = document.getElementById("endTime").value;
    let number = document.getElementById("taskNumber").value;
    let task = document.getElementById("taskName").value;
    let goal = document.getElementById("goal").value;

    if (!start || !end || !number || !task ) {
        alert("Please fill all fields");
        return;
    }

    let table = document.getElementById("taskTable");
    let rows = table.rows;

    // 🔴 VALIDATION
    for (let i = 0; i < rows.length; i++) {

        let existingNumber = rows[i].cells[0].innerText;
        let existingStart = rows[i].cells[1].innerText;
        let existingEnd = rows[i].cells[2].innerText;

        // ❌ Same task number
        if (existingNumber == number) {
            alert("This task number already exists");
            return;
        }

        // ❌ Same start + end time together
        if (existingStart === start && existingEnd === end) {
            alert("The time you selected already exists");
            return;
        }
    }

    // 🟢 Create row
    let row = table.insertRow();

    row.insertCell(0).innerText = number;
    row.insertCell(1).innerText = start;
    row.insertCell(2).innerText = end;
    row.insertCell(3).innerText = task;

    // 🟡 Goal cell (Done / Incomplete)
    let goalCell = row.insertCell(4);
    goalCell.innerHTML = `
        <button class="doneBtn" onclick="markDone(this)">Done</button>
        <button class="inBtn" onclick="markIncomplete(this)">Incomplete</button>
    `;

    // ✏ Edit button
    let editCell = row.insertCell(5);
    editCell.innerHTML = `<button onclick="editRow(this)">Edit</button>`;

    clearInputs();
}

// ✅ DONE
function markDone(link) {
    let row = link.parentElement.parentElement;
    row.style.backgroundColor = "green";
    alert("Congratulations 🎉 You did one more step toward your dream!");
}

// ❌ INCOMPLETE
function markIncomplete(link) {
    let row = link.parentElement.parentElement;
    row.style.backgroundColor = "#f82e2eff";
    alert("Please do your work properly. All power within you 💪");
}

// ✏ EDIT
function editRow(button) {
    let row = button.parentElement.parentElement;

    document.getElementById("taskNumber").value = row.cells[0].innerText;
    document.getElementById("startTime").value = row.cells[1].innerText;
    document.getElementById("endTime").value = row.cells[2].innerText;
    document.getElementById("taskName").value = row.cells[3].innerText;

    row.remove();
}

// 🧹 Clear inputs
function clearInputs() {
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("taskNumber").value = "";
    document.getElementById("taskName").value = "";
    document.getElementById("goal").value = "";
}
