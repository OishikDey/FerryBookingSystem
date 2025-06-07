const dateSelect = document.getElementById("availDate");
const timeSelect = document.getElementById("availTime");

async function loadAvailability() {
    const res = await fetch("/api/availability");
    const slots = await res.json();

    const grouped = {};
    slots.forEach(slot => {
        if (!grouped[slot.date]) grouped[slot.date] = [];
        grouped[slot.date].push(slot.time);
    });

    // Populate date dropdown
    dateSelect.innerHTML = '<option value="">Choose a date</option>';
    Object.keys(grouped).forEach(date => {
        const opt = document.createElement("option");
        opt.value = date;
        opt.textContent = date;
        dateSelect.appendChild(opt);
    });

    // When a date is selected, show time options
    dateSelect.addEventListener("change", () => {
        const selectedDate = dateSelect.value;
        timeSelect.innerHTML = '<option value="">Choose a time</option>';
        if (grouped[selectedDate]) {
            grouped[selectedDate].forEach(time => {
                const opt = document.createElement("option");
                opt.value = time;
                opt.textContent = time;
                timeSelect.appendChild(opt);
            });
        }
    });
}

loadAvailability();

document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const depart = dateSelect.value;
    const time = timeSelect.value;
    const packageOption = document.querySelector("input[name='package']:checked");


    
    if (!fname || !lname){
        alert("Please enter both your first and last name.");
        return;
    }

    if (!/^\d+$/.test(phone)){
        alert("Please enter valid phone number.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        alert("Please enter valid email address. ");
        return;
    }

    if(!depart || !time) {
        alert("Please select both date and time.");
        return;
    }

    if(!packageOption){
        alert("Please select a package.");
        return;
    }

    const bookingData = {
        firstName: fname,
        lastName: lname,
        phoneNumber: phone,
        emailAddress: email,
        date: depart,
        time: time,
        selectedPackage: packageOption.value
    };

    try {
    const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
    });

    if (res.ok) {
        alert("Booking successfully submitted!");
        document.querySelector("form").reset();
    } else {
        alert("Failed to submit booking.");
    }
    } catch (err) {
        console.error("Error:", err);
        alert("An error occurred while submitting the booking.");
    }
});

loadAvailability();
