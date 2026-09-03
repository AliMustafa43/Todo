// First we get elements from HTML that we actually need
let task = document.querySelector('.TaskInput');
let importance = document.querySelector('.ImportanceInput');
let date = document.querySelector('.DateInput');
let time = document.querySelector('.TimeInput');
let place = document.querySelector('.PlaceInput');
const addButton = document.querySelector('.AddButton');
const notifyButton = document.querySelector('.NotifyButton');

const search = document.querySelector('.SearchInput');
const filterRow = document.querySelector('.FilterRow');

const container = document.querySelector('.CardContainer')

const confirmation = document.querySelector('.ModalOverlay');
const modalCancel = document.querySelector('.ModalCancelButton');
const modalDelete = document.querySelector('.ModalDeleteButton');

// The major purpose of these is to enable and disable features
let pendingDeleteId = null; // id of the todo waiting for delete confirmation
let editingId = null; // id of the todo being edited, null when adding a new one


//------------------------------------------------------------------------------------------------------------------


let storage = []; // We store information (can be objects) and this information makes the UI

function save(){
  try{
  localStorage.setItem("storage", JSON.stringify(storage))
  }
  catch (e){
    console.log("Failed to save")
  }
}

function load(){
  try{
    const data = localStorage.getItem("storage")
    return data ? JSON.parse(data) : []
  }
  catch (e){
    console.log("Failed to load")
    return []
  }
}

//loading data into array(storage) from local storage
 storage = load();

// Sort by earliest date and time (chronological order)
function sortByEarliest(arr) {
  return [...arr].sort((a, b) => {
    const timeA = `${a.dateval} ${a.timeval}`;
    const timeB = `${b.dateval} ${b.timeval}`;
    return timeA > timeB ? 1 : -1;
  });
}

//Render after every change or render saved todos
//in parameters we can add filtered arrays to render
function render(arr){
  container.innerHTML = '';
  const sorted = sortByEarliest(arr);
  sorted.forEach(todo => {
    createcard(todo);
  });
}

render(storage);


//------------------------------------------------------------------------------------------------------------------


function input(){// make object to use input 
    const taskval = task.value;
    const importanceval = importance.value;
    const dateval = date.value;
    const timeval = time.value;
    const placeval = place.value;
    const badge = "Pending"
    const notified = undefined

    if(!taskval||!importanceval||!dateval){
      alert("Fill these sections task, importance, date")
      return null // tell the caller validation failed
    }

    return{
    id: crypto.randomUUID(),
    taskval,
    importanceval,
    dateval,
    timeval,
    placeval,
    badge,
    notified
  }
}

//Add todo and Update todo
addButton.addEventListener("click", ()=>{
    const data = input(); // Get data from the form
    if(!data){return;}
    if (editingId){
      data.id = editingId; // Keep existing ID of the todo being edited instead of a new one
      const todo = storage.find(t => t.id === editingId);
      Object.assign(todo, data); //Shortest way to edit the existing todo
      save();
      render(storage);
      addButton.textContent = 'Add Todo'; // restore button label
      editingId = null;       // exit edit mode       
      task.value = null;     // clear form
      importance.value = null;
      date.value = null;
      time.value = null;
      place.value = null;
      return;
    }

    storage.push(data);
    save();
    createcard(data);
})

//Notification status
async function notificationRequest() {
  console.log('Current permission:', Notification.permission);

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();

    console.log('Permission:', permission);

    return permission === 'granted';
  }

  return Notification.permission === 'granted';
}

function alarmCheck (){
  setInterval(() => {
    if(Notification.permission !== 'granted')return;

    const now = new Date();
    // Format local date as YYYY-MM-DD so it matches input type="date" in any timezone
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // padStart pads string with '0' to ensure 2 digits
    const day = String(now.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    // HH:MM local time from time string
    const currentTime = now.toTimeString().slice(0, 5);


    storage.forEach(t => {
      if(t.badge === 'Pending' && t.dateval === currentDate && t.timeval === currentTime){
      // Only notify once per (date + time) combination
      const key = currentDate + currentTime;   
      if (t.notified !== key) {         
      t.notified = key;        
      save();
      showNotification(t);
    }
  }
})


  }, 30000);
}

async function NotifyStatus() {
  const updateButtonUI = (granted) => {
    if (granted) {
      notifyButton.classList.add('Granted');
      alarmCheck();
    } else {
      notifyButton.classList.remove('Granted');
    }
  };

  // Check initial permission
  updateButtonUI(Notification.permission === 'granted');

  // Request permission when user clicks the notification button
  notifyButton.addEventListener('click', async () => {
    const granted = await notificationRequest();
    updateButtonUI(granted);
  });

  notifyButton.addEventListener('mouseenter', () => {
    notifyButton.textContent = Notification.permission === 'granted' ? 'Enabled' : 'Disabled';
  });
  
  notifyButton.addEventListener('mouseleave', () => {
    notifyButton.textContent = 'Notification';
  });
}

NotifyStatus();

function importanceColor(importanceval){
  if(importanceval === "Medium"){
    return "ImportanceMedium";
  }
  else if(importanceval === "High"){
    return "ImportanceHigh";
  }
  else if(importanceval === "Low"){
    return "ImportanceLow";
  }
}

//Create card
function createcard(data){
  const card = document.createElement('div');
  card.className = "TodoCard";
  card.dataset.id = data.id;
  card.innerHTML = `<div class="TodoInfo">
            <div class="TodoTop">
              <h3 class="TodoName">${data.taskval}</h3>
              <span class="${importanceColor(data.importanceval)}">${data.importanceval}</span>
            </div>

            <div class="TodoDetails">
              <div class="TodoMeta">
                <h4>Date</h4>
                <p class="TodoValue">${data.dateval}</p>
              </div>
              <div class="TodoMeta">
                <h4>Time</h4>
                <p class="TodoValue">${data.timeval}</p>
              </div>
              <div class="TodoMeta">
                <h4>Place</h4>
                <p class="TodoValue">${data.placeval}</p>
              </div>
              <div class="TodoMeta">
                <h4>Status</h4>
                <span class="PendingBadge">${data.badge}</span>
              </div>
            </div>

            <div class="Buttons TodoButtons">
              <button class="Button CompleteButton" type="button">Complete</button>
              <button class="Button DeleteButton" type="button">Delete</button>
              <button class="Button EditButton" type="button">Edit</button>
              <button class="Button ShareButton" type="button">
                <span class="ShareIcon">
                  <img src="assets/WhatsappLogo.svg" alt="Share on WhatsApp" class="IconDefault">
                  <img src="assets/WhatsappBlackLogo.svg" alt="Share on WhatsApp" class="IconHover">
                </span>
              </button>

            </div>
          </div>`

  container.appendChild(card);
}


//------------------------------------------------------------------------------------------------------------------


// Confirmation to delete
confirmation.addEventListener("click", (e) => {
  if(e.target.closest('.ModalDeleteButton')){
    if (pendingDeleteId) {
      storage = storage.filter(t => t.id !== pendingDeleteId);
      confirmation.hidden = true;
      pendingDeleteId = null;
      save();
      render(storage);
    }
  } else if(e.target.closest('.ModalCancelButton') || e.target === confirmation){
    confirmation.hidden = true;
    pendingDeleteId = null;
  }
});


// Complete or Delete or Edit or share
container.addEventListener("click", (e)=>{
  const card = e.target.closest('.TodoCard')
  if(!card){
    console.log("No card")
    return
  }
// We also have to edit storage, not only UI (the real purpose of id is to connect UI with storage)
// With classList don't add dot in brackets of method  
  const id = card.dataset.id;
  const todo = storage.find(t => t.id === id);
  const badge = card.querySelector('.PendingBadge, .CompletedBadge');
  const btn = e.target.closest('.CompleteButton, .UndoButton, .DeleteButton, .EditButton, .ShareButton');
  if (btn.classList.contains('CompleteButton')) {
    todo.badge = 'Completed';
    badge.textContent = 'Completed';
    badge.className = 'CompletedBadge';
    btn.textContent = 'Undo';
    btn.className = 'Button UndoButton';
    save();
  } else if (btn.classList.contains('UndoButton')) {
    todo.badge = 'Pending';
    badge.textContent = 'Pending';
    badge.className = 'PendingBadge';
    btn.textContent = 'Complete';
    btn.className = 'Button CompleteButton';
    save();
  } else if (btn.classList.contains('DeleteButton')) {
    // show the custom modal instead of native confirm()
    pendingDeleteId = id;
    confirmation.hidden = false;//Enable overlay
    modalDelete.focus(); // focus the Delete button so Enter works
  }else if (btn.classList.contains('EditButton')){
    editingId = id;                // remember which todo we're now editing
    task.value = todo.taskval;     // fill the form with that todo's data
    importance.value = todo.importanceval;
    date.value = todo.dateval;
    time.value = todo.timeval;
    place.value = todo.placeval;
    addButton.textContent = 'Update Todo'; // show the user they're editing
    task.focus();                  // jump to the form
  } else if (btn.classList.contains('ShareButton')) {
      const message =
    `📌 ${todo.taskval}
    Importance: ${todo.importanceval}
    Date: ${todo.dateval}
    Time: ${todo.timeval}
    Place: ${todo.placeval}
    Status: ${todo.badge}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
});


//for search
search.addEventListener("input", ()=>{
  const searchval = search.value.toLowerCase().trim();
  const filtered = storage.filter(todo =>
    todo.taskval.toLowerCase().trim().includes(searchval)
  )
  render(filtered)
})


// Filter buttons
filterRow.addEventListener("click", (e)=>{
  const btn = e.target.closest('.FilterButton');
  if(!btn) return;

  filterRow.querySelectorAll('.FilterButton').forEach(b => b.classList.remove('Active'));
  btn.classList.add('Active');

  const all = e.target.closest('.All');
  const high = e.target.closest('.High');
  const medium = e.target.closest('.Medium');
  const low = e.target.closest('.Low');

  if(all){
    render(storage);
  } else if(high){
    const filtered = storage.filter(todo => todo.importanceval.includes("High"));
    render(filtered);
  } else if(medium){
    const filtered = storage.filter(todo => todo.importanceval.includes("Medium"));
    render(filtered);
  } else if(low){
    const filtered = storage.filter(todo => todo.importanceval.includes("Low"));
    render(filtered);
  }
});


//Getting card from id
function gettingCard(id){
  return container.querySelector(`.TodoCard[data-id ="${id}"]`)
}

//Show Notification
function showNotification (todo){
  if(Notification.permission !== 'granted') return;
  const stillExists = storage.find(t => t.id === todo.id);
  if (!stillExists) return; 
  const notification = new Notification('Todo Reminder', {
    body: `Time for: ${todo.taskval}`,
    icon: 'assets/Alert.png',
    tag: `Todo -${todo.id}`,
    requireInteraction: true,
    data:{
      todoid: todo.id,
      todoname: todo.taskval
    }
  } );

  notification.onclick = (e) => {
    e.preventDefault();//When you click a notification, the browser has a default behavior — bring the browser window to front and focus the tab. preventDefault() tells the browser: "don't do your default thing, I'll handle it myself."
    notification.close();
    //Bring the TaskChime tab/window to front
    window.focus();

    //Wait for the window to become active before trying to scroll
    const attemptHighlight = () => {
      if (document.hasFocus()) {
        const card = gettingCard(todo.id);
        if (!card) { return; }
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        card.style.borderColor = 'white';
        setTimeout(() => {
          card.style.borderColor = '';
        }, 3000);
      } else {
      // Tab not yet focused — retry shortly
      setTimeout(attemptHighlight, 300);
      }
    };

    attemptHighlight();
  };

  notification.onclose = ()=>{
    console.log('Notification dismissed');
  }

  return notification;
}




