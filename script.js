let eventList = [];

document.getElementById('eventForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const event = {
    id: Date.now(),
    name: document.getElementById('eventName').value,
    date: document.getElementById('eventDate').value,
    time: document.getElementById('eventTime').value,
    location: document.getElementById('eventLocation').value,
    description: document.getElementById('eventDescription').value
  };

  eventList.push(event);
  renderEvents();
  this.reset();
});

function renderEvents() {
  const container = document.getElementById('eventContainer');
  container.innerHTML = '';

  eventList.forEach(event => {
    const div = document.createElement('div');
    div.className = 'event';
    div.innerHTML = `
      <h3>${event.name}</h3>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Time:</strong> ${event.time}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p>${event.description}</p>
      <button class="edit-btn" onclick="editEvent(${event.id})">Edit</button>
      <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
      <button class="share-btn" onclick="shareEvent(${event.id})">Share</button>
    `;
    container.appendChild(div);
  });
}

function editEvent(id) {
  const event = eventList.find(ev => ev.id === id);
  if (!event) return;

  
  document.getElementById('eventName').value = event.name;
  document.getElementById('eventDate').value = event.date;
  document.getElementById('eventTime').value = event.time;
  document.getElementById('eventLocation').value = event.location;
  document.getElementById('eventDescription').value = event.description;

  
  eventList = eventList.filter(ev => ev.id !== id);
  renderEvents();
}

function deleteEvent(id) {
  eventList = eventList.filter(ev => ev.id !== id);
  renderEvents();
}

function shareEvent(id) {
  const event = eventList.find(ev => ev.id === id);
  if (!event) return;

  const eventText = 
    `Event: ${event.name}\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\nDescription: ${event.description}`;

  if (navigator.share) {
    // Mobile browser sharing
    navigator.share({
      title: event.name,
      text: eventText
    }).catch(err => alert("Share cancelled or failed."));
  } else {
    // Fallback for desktop: copy to clipboard
    navigator.clipboard.writeText(eventText).then(() => {
      alert("Event details copied to clipboard!");
    }).catch(() => {
      // Optional: Download if clipboard fails
      const blob = new Blob([eventText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event.name.replace(/\s+/g, '_')}_Event.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
