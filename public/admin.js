// === URLs to your API endpoints ===
const API_BASE = '/api';
const AVAILABILITY_URL = `${API_BASE}/availability`;
const BOOKINGS_URL = `${API_BASE}/bookings`;

// === DOM Elements ===
const availabilityForm = document.getElementById('availabilityForm');
const availDate = document.getElementById('availDate');
const availTime = document.getElementById('availTime');
const availabilityList = document.getElementById('availabilityList');
const bookingList = document.getElementById('bookingList');

// === Add Availability Slot ===
availabilityForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const date = availDate.value;
  const time = availTime.value;

  if (!date || !time) {
    alert("Please enter both date and time.");
    return;
  }

  const res = await fetch(AVAILABILITY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, time })
  });

  if (res.ok) {
    availDate.value = '';
    availTime.value = '';
    loadAvailability();
  }
});

// === Load Availability Slots ===
async function loadAvailability() {
  const res = await fetch(AVAILABILITY_URL);
  const slots = await res.json();

  availabilityList.innerHTML = '';
  slots.forEach(slot => {
    const li = document.createElement('li');
    li.textContent = `${slot.date} at ${slot.time}`;
    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.onclick = () => deleteAvailability(slot._id);
    li.appendChild(delBtn);
    availabilityList.appendChild(li);
  });
}

// === Delete Slot ===
async function deleteAvailability(id) {
  await fetch(`${AVAILABILITY_URL}/${id}`, { method: 'DELETE' });
  loadAvailability();
}

// === Load Bookings ===
async function loadBookings() {
  const res = await fetch(BOOKINGS_URL);
  const bookings = await res.json();

  bookingList.innerHTML = '';
  bookings.forEach(booking => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${booking.firstName} ${booking.lastName}</td>
      <td>${booking.phoneNumber}</td>
      <td>${booking.emailAddress}</td>
      <td>${booking.date}</td>
      <td>${booking.time}</td>
      <td>${booking.selectedPackage}</td>
      <td>
        <button onclick="editBooking('${booking._id}')">✏️ Edit</button>
        <button onclick="deleteBooking('${booking._id}')">❌ Delete</button>
      </td>
    `;
    bookingList.appendChild(row);
  });
}

// === Delete Booking ===
async function deleteBooking(id) {
  await fetch(`${BOOKINGS_URL}/${id}`, { method: 'DELETE' });
  loadBookings();
}

// === Edit Booking (simplified alert prompt) ===
async function editBooking(id) {
  const res = await fetch(`${BOOKINGS_URL}`);
  const bookings = await res.json();
  const booking = bookings.find(b => b._id === id);
  if (!booking) return;

  const updatedPhone = prompt('Edit Phone:', booking.phone);
  const updatedEmail = prompt('Edit Email:', booking.email);

  if (!updatedPhone || !updatedEmail) return;

  await fetch(`${BOOKINGS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...booking,
      phoneNumber: updatedPhone,
      emailAddress: updatedEmail
    })
  });

  loadBookings();
}

// === Initial Load ===
loadAvailability();
loadBookings();
