# Notification API Learning Guide

## Overview
The **Notifications API** allows web pages to display system notifications to the user, even when the tab is in the background. Perfect for alarms, reminders, and real-time updates.

---

## 1. Browser Support Check

```javascript
// Always check support first
if (!('Notification' in window)) {
  console.log('Notifications not supported in this browser');
} else {
  console.log('Notifications supported!');
}
```

---

## 2. Permission States

| State | Meaning | Action |
|-------|---------|--------|
| `'default'` | User hasn't been asked yet | Call `requestPermission()` |
| `'granted'` | User allowed notifications | Can show notifications |
| `'denied'` | User blocked notifications | Cannot show (respect this) |

```javascript
// Check current permission
console.log(Notification.permission); // 'default' | 'granted' | 'denied'

// Request permission (MUST be called from user interaction - click, etc.)
async function requestNotificationPermission() {
  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    console.log('Permission:', permission);
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
}

// Best practice: Request on user action (button click)
document.getElementById('enable-notifications').addEventListener('click', async () => {
  const granted = await requestNotificationPermission();
  if (granted) {
    showTestNotification();
  }
});
```

---

## 3. Creating Notifications

### Basic Notification
```javascript
function showBasicNotification(title, body) {
  if (Notification.permission !== 'granted') return;
  
  const notification = new Notification(title, {
    body: body,
    // Optional properties:
    // icon: 'path/to/icon.png',        // 192x192 recommended
    // badge: 'path/to/badge.png',      // Android only, monochrome
    // tag: 'unique-id',                // Groups/replaces same tag
    // requireInteraction: false,       // Stays until user clicks
    // silent: false,                   // No sound/vibration
    // vibrate: [200, 100, 200],        // Vibration pattern (mobile)
    // timestamp: Date.now(),           // When event occurred
    // renotify: false,                 // Show again if same tag
    // actions: [                       // Action buttons
    //   { action: 'complete', title: 'Mark Complete' },
    //   { action: 'snooze', title: 'Snooze 5min' }
    // ],
    // data: { todoId: 'abc123' }       // Custom data for click handler
  });
  
  return notification;
}
```

### Notification with Actions (Advanced)
```javascript
function showActionNotification(task) {
  const notification = new Notification('⏰ Task Reminder', {
    body: `Time for: ${task.name}`,
    icon: '/icon-192.png',
    tag: `task-${task.id}`,
    requireInteraction: true, // Stays open until user interacts
    actions: [
      { action: 'complete', title: '✅ Complete' },
      { action: 'snooze', title: '😴 Snooze 5 min' },
      { action: 'view', title: '👁 View Task' }
    ],
    data: { 
      todoId: task.id,
      taskName: task.name 
    }
  });
  
  // Handle action clicks
  notification.onclick = (event) => {
    event.preventDefault(); // Prevent default focus behavior
    const action = event.target.action || 'view';
    handleNotificationAction(action, notification.data);
    notification.close();
  };
  
  // Handle notification close (user dismisses)
  notification.onclose = () => {
    console.log('Notification dismissed');
  };
  
  return notification;
}

function handleNotificationAction(action, data) {
  switch (action) {
    case 'complete':
      markTodoComplete(data.todoId);
      break;
    case 'snooze':
      snoozeTodo(data.todoId, 5); // 5 minutes
      break;
    case 'view':
      focusAppAndShowTodo(data.todoId);
      break;
  }
}
```

---

## 4. Integration with Your Todo App

### Time Comparison Logic
```javascript
// Convert todo date + time to comparable format
function getTodoDateTime(todo) {
  // todo.date = "2026-08-25", todo.time = "14:30"
  return new Date(`${todo.date}T${todo.time}`);
}

// Check if todo alarm should trigger NOW
function isAlarmDue(todo) {
  if (!todo.date || !todo.time) return false;
  if (todo.alarmTriggered) return false; // Already triggered
  
  const todoDateTime = getTodoDateTime(todo);
  const now = new Date();
  
  // Trigger within 30 seconds of target time
  const diffMs = todoDateTime - now;
  return diffMs >= 0 && diffMs <= 30000; // 0 to 30 seconds
}

// Check all todos for due alarms
function checkAndTriggerAlarms() {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
  
  storage.forEach(todo => {
    // Quick string comparison first (faster)
    if (todo.date === currentDate && todo.time === currentTime) {
      if (!todo.alarmTriggered) {
        triggerTodoAlarm(todo);
        todo.alarmTriggered = true;
        save(); // Persist the triggered state
      }
    }
  });
}
```

### Alarm Trigger Function
```javascript
function triggerTodoAlarm(todo) {
  // 1. Show notification
  const notification = new Notification('⏰ Task Reminder', {
    body: `${todo.taskval} ${todo.placeval ? `at ${todo.placeval}` : ''}`,
    icon: '/icon-192.png',
    tag: `alarm-${todo.id}`,
    requireInteraction: true,
    data: { todoId: todo.id }
  });
  
  // 2. Play sound (optional - Web Audio API)
  playAlarmSound();
  
  // 3. Handle click
  notification.onclick = () => {
    window.focus(); // Bring tab to front
    // Optionally scroll to/highlight the todo card
    highlightTodoCard(todo.id);
    notification.close();
  };
  
  // 4. Auto-close after 30 seconds if not interacted
  setTimeout(() => notification.close(), 30000);
}
```

---

## 5. Background Checking with setInterval

```javascript
let alarmCheckInterval = null;

function startAlarmChecker() {
  // Check every 30 seconds
  alarmCheckInterval = setInterval(checkAndTriggerAlarms, 30000);
  
  // Also check immediately on start
  checkAndTriggerAlarms();
  
  console.log('Alarm checker started');
}

function stopAlarmChecker() {
  if (alarmCheckInterval) {
    clearInterval(alarmCheckInterval);
    alarmCheckInterval = null;
  }
}

// Start when page loads (after permission granted)
document.addEventListener('DOMContentLoaded', async () => {
  const granted = await requestNotificationPermission();
  if (granted) {
    startAlarmChecker();
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', stopAlarmChecker);
```

---

## 6. Persisting Alarm State

Add `alarmTriggered` to your todo objects:

```javascript
// When creating new todo
function createTodoObject(formData) {
  return {
    id: crypto.randomUUID(),
    taskval: formData.task,
    importanceval: formData.importance,
    dateval: formData.date,
    timeval: formData.time,
    placeval: formData.place,
    badge: 'Pending',
    alarmTriggered: false  // NEW: Track if alarm fired
  };
}

// When saving/updating, alarmTriggered persists automatically
// via your existing save() function
```

---

## 7. Complete Integration Example

```javascript
// ===== NOTIFICATION MODULE =====
const NotificationManager = {
  // Initialize - call once on app start
  async init() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }
    
    const granted = await this.requestPermission();
    if (granted) {
      this.startChecking();
    }
    return granted;
  },
  
  // Request permission
  async requestPermission() {
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },
  
  // Show notification for a todo
  show(todo) {
    if (Notification.permission !== 'granted') return null;
    
    const notification = new Notification('⏰ Task Reminder', {
      body: `${todo.taskval}${todo.placeval ? ` @ ${todo.placeval}` : ''}`,
      icon: '/icon-192.png',
      tag: `todo-${todo.id}`,
      requireInteraction: true,
      data: { todoId: todo.id }
    });
    
    notification.onclick = () => {
      window.focus();
      this.highlightTodo(todo.id);
      notification.close();
    };
    
    // Auto-close after 30s
    setTimeout(() => notification.close(), 30000);
    
    return notification;
  },
  
  // Check all todos for due alarms
  checkAlarms() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    storage.forEach(todo => {
      if (todo.date === currentDate && 
          todo.time === currentTime && 
          !todo.alarmTriggered) {
        this.show(todo);
        todo.alarmTriggered = true;
        save(); // Your existing save function
      }
    });
  },
  
  // Start background checking
  startChecking() {
    if (this.interval) return; // Already running
    this.interval = setInterval(() => this.checkAlarms(), 30000);
    this.checkAlarms(); // Immediate check
  },
  
  stopChecking() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },
  
  // Visual feedback in UI
  highlightTodo(todoId) {
    const card = document.querySelector(`.TodoCard[data-id="${todoId}"]`);
    if (card) {
      card.style.outline = '3px solid #ffd700';
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => card.style.outline = '', 3000);
    }
  }
};

// ===== INITIALIZATION =====
// Add to your existing DOMContentLoaded or init function
document.addEventListener('DOMContentLoaded', () => {
  NotificationManager.init();
});
```

---

## 8. Testing Checklist

- [ ] Open page → Click "Enable Notifications" button
- [ ] Browser prompts for permission → Click "Allow"
- [ ] Create a todo with time = **1 minute from now**
- [ ] Wait → Notification should appear
- [ ] Click notification → Tab focuses, todo highlights
- [ ] Refresh page → Alarm state persists (no duplicate)
- [ ] Close tab → Create todo for future → Reopen → Alarm works

---

## 9. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Permission denied | User must manually enable in browser settings |
| Notifications don't show in background | Use `requireInteraction: true` + Service Worker for true background |
| Duplicate alarms | Track `alarmTriggered` in todo object + persist to localStorage |
| Timezone issues | Store/compare in local time (your current approach works) |
| Mobile doesn't vibrate | Add `vibrate: [200, 100, 200]` to notification options |

---

## 10. Next Steps for You

1. **Study this guide** - Understand each section
2. **Create a test page** - Minimal HTML + JS to experiment
3. **Add to your todo app** - Integrate `NotificationManager` into `rebuilt.js`
4. **Test thoroughly** - Edge cases: midnight, DST, page refresh
5. **Enhance later** - Add sound, snooze, Service Worker for true background

---

## Resources

- **MDN Notifications API**: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
- **Notification.permission**: https://developer.mozilla.org/en-US/docs/Web/API/Notification/permission
- **Notification constructor**: https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
- **Service Workers (background)**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- **Web Audio API (sounds)**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

---

## Practice Exercise

Create a file `notification-test.html`:

```html
<!DOCTYPE html>
<html>
<head><title>Notification Test</title></head>
<body>
  <button id="reqPerm">Request Permission</button>
  <button id="testNotif">Test Notification</button>
  <button id="testAction">Test with Actions</button>
  <script>
    // Copy functions from this guide and experiment!
  </script>
</body>
</html>
```

Open in browser, test each button, check console, try in incognito, try on mobile.