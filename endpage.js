function addTask() {

    let start = document.getElementById("startTime").value;
    let end = document.getElementById("endTime").value;
    let number = document.getElementById("taskNumber").value;
    let task = document.getElementById("taskName").value;

    if (start === "" || end === "" || number === "" || task === "") {
        alert("Please fill all fields");
        return;
    }

    let table = document.getElementById("taskTable");
    let row = table.insertRow();

    // create cells
    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);
    let c4 = row.insertCell(3);
    let c5 = row.insertCell(4);

    // insert values
    c1.innerHTML = number;
    c2.innerHTML = start;
    c3.innerHTML = end;
    c4.innerHTML = task;

    // status buttons (DONE / INCOMPLETE)
    c5.innerHTML = `
        <button onclick="markDone(this)">Done</button>
        <button onclick="markIncomplete(this)">Incomplete</button>
    `;

    // clear inputs
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("taskNumber").value = "";
    document.getElementById("taskName").value = "";
}

function markDone(btn) {
    let row = btn.parentElement.parentElement;

    alert("🎉 Congratulations! You did one more step up to your dream.");

    row.style.backgroundColor = "lightgreen";
}

function markIncomplete(btn) {
    let row = btn.parentElement.parentElement;

    alert("⚠️ Please do your work properly. All power is within you. Hope next time you won't do like this.");

    row.style.backgroundColor = "lightcoral";
}
