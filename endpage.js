/* app.js
 - Keeps entries in localStorage under "scheduleEntries"
 - Each saved entry is one object per day: {id, start, end, task, day (0-6), status}
 - status: "pending" | "done" | "incomplete"
*/

const STORAGE_KEY = "scheduleEntries";

/* --- Helpers --- */
function nowClockString() {
  const d = new Date();
  return d.toLocaleTimeString();
}
function timeToMinutes(t) { // "HH:MM"
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}
function dayName(d) {
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d];
}
function uid(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

/* --- Live clock --- */
function startLiveClock(){
  const el = document.getElementById("liveClock");
  function tick(){ el.textContent = new Date().toLocaleTimeString(); }
  tick();
  setInterval(tick, 1000);
}

/* --- Storage --- */
function loadEntries(){ 
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch(e){ return [];}
}
function saveEntries(entries){ localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }

/* --- Render Table --- */
function renderTable(){
  const body = document.getElementById("tableBody");
  const entries = loadEntries();
  body.innerHTML = "";
  if(entries.length === 0){
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#666;padding:12px">No schedule yet</td></tr>`;
    return;
  }
  entries.sort((a,b) => (a.day - b.day) || timeToMinutes(a.start) - timeToMinutes(b.start));

  for(const e of entries){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.start}</td>
      <td>${e.end}</td>
      <td>${e.task}</td>
      <td>${dayName(e.day)}</td>
      <td>
        <span class="status-badge ${e.status === 'done' ? 'status-done' : (e.status === 'incomplete' ? 'status-incomplete' : '')}">
          ${e.status === 'pending' ? 'Pending' : (e.status === 'done' ? 'Done' : 'Incomplete')}
        </span>
      </td>
      <td>
        <button class="action-btn action-done" data-id="${e.id}">Mark Done</button>
        <button class="action-btn action-delete" data-id="${e.id}">Delete</button>
      </td>
    `;
    body.appendChild(tr);
  }

  // attach action handlers
  document.querySelectorAll(".action-done").forEach(btn => {
    btn.onclick = function(){
      const id = this.dataset.id;
      markDone(id);
    };
  });
  document.querySelectorAll(".action-delete").forEach(btn => {
    btn.onclick = function(){
      const id = this.dataset.id;
      deleteEntry(id);
    };
  });
}

/* --- Mark Done / Delete --- */
function markDone(id){
  const entries = loadEntries();
  const idx = entries.findIndex(x=>x.id===id);
  if(idx>=0){
    entries[idx].status = "done";
    saveEntries(entries);
    renderTable();
    alert("🎉 Congratulations — you completed the task!");
  }
}
function deleteEntry(id){
  let entries = loadEntries();
  entries = entries.filter(x=>x.id!==id);
  saveEntries(entries);
  renderTable();
}

/* --- Save new entry (splits by selected days) --- */
function addSchedule(){
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;
  const task = document.getElementById("taskInput").value.trim();
  const dayCheckboxes = Array.from(document.querySelectorAll(".dayChk"));
  const selectedDays = dayCheckboxes.filter(cb=>cb.checked).map(cb=>Number(cb.value));

  if(!start || !end || !task || selectedDays.length===0){
    alert("Please fill start, end, task and choose at least one day.");
    return;
  }
  if(timeToMinutes(end) <= timeToMinutes(start)){
    alert("End time must be after start time.");
    return;
  }
  // require task one word (no spaces)
  if(/\s/.test(task)){
    if(!confirm("Task contains spaces. You requested one-word tasks. Proceed with this task?")) {
      return;
    }
  }

  let entries = loadEntries();

  // duplicate check: for each selected day ensure no existing entry with same start & end
  for(const d of selectedDays){
    const dup = entries.find(e => e.day === d && e.start === start && e.end === end);
    if(dup){
      alert(`Duplicate found: ${dayName(d)} ${start}-${end} already exists.`);
      return;
    }
  }

  // create entries (one per day)
  for(const d of selectedDays){
    const entry = {
      id: uid(),
      start, end, task,
      day: d,
      status: "pending"
    };
    entries.push(entry);
  }

  saveEntries(entries);
  renderTable();
  // clear inputs (only text)
  document.getElementById("taskInput").value = "";
  document.querySelectorAll(".dayChk").forEach(cb=>cb.checked=false);
  alert("Saved successfully.");
}

/* --- Auto-check incomplete when end time passes --- */
function checkOverdue(){
  const entries = loadEntries();
  const now = new Date();
  const today = now.getDay();
  const currentMinutes = now.getHours()*60 + now.getMinutes();

  let changed = false;
  for(const e of entries){
    if(e.day !== today) continue;
    if(e.status === "pending"){
      // if current time strictly after end time -> mark incomplete
      if(currentMinutes > timeToMinutes(e.end)){
        e.status = "incomplete";
        changed = true;
        // alert user (small throttle - show once per entry)
        alert(`You missed task "${e.task}" scheduled ${e.start}-${e.end} today. Follow your schedule — hope next time you don't repeat this.`);
      }
    }
  }
  if(changed) saveEntries(entries);
  renderTable();
}

/* --- Calendar UI (month navigation) --- */
let calDate = new Date();
function renderCalendar(date){
  const monthYear = document.getElementById("monthYear");
  const body = document.getElementById("calendarBody");
  const year = date.getFullYear();
  const month = date.getMonth();

  monthYear.textContent = date.toLocaleString('default',{month:'long', year:'numeric'});
  body.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month+1, 0).getDate();

  let row = document.createElement('tr');
  // empty cells
  for(let i=0;i<firstDay;i++){
    const td = document.createElement('td');
    td.className='empty';
    row.appendChild(td);
  }
  for(let d=1; d<=totalDays; d++){
    if(row.children.length === 7){
      body.appendChild(row);
      row = document.createElement('tr');
    }
    const td = document.createElement('td');
    td.textContent = d;
    td.onclick = function(){
      // optional: show tasks for that day or create quick entry
      const dayIndex = new Date(year, month, d).getDay();
      alert(`Date: ${d} ${date.toLocaleString('default',{month:'short', year:'numeric'})} (Day: ${dayName(dayIndex)})`);
    };
    row.appendChild(td);
  }
  // finish row
  while(row.children.length < 7){
    const td = document.createElement('td');
    td.className = 'empty';
    row.appendChild(td);
  }
  body.appendChild(row);
}

/* --- setup UI events --- */
document.addEventListener('DOMContentLoaded', function(){
  startLiveClock();
  renderCalendar(calDate);
  renderTable();

  document.getElementById("saveBtn").addEventListener("click", addSchedule);
  document.getElementById("clearBtn").addEventListener("click", function(){
    if(confirm("Remove all saved schedules?")) {
      localStorage.removeItem(STORAGE_KEY);
      renderTable();
    }
  });

  document.getElementById("prevBtn").addEventListener("click", function(){
    calDate.setMonth(calDate.getMonth()-1);
    renderCalendar(calDate);
  });
  document.getElementById("nextBtn").addEventListener("click", function(){
    calDate.setMonth(calDate.getMonth()+1);
    renderCalendar(calDate);
  });

  // auto-check overdue every 60 seconds
  setInterval(checkOverdue, 60*1000);
  // initial check at load
  setTimeout(checkOverdue, 2000);
});
