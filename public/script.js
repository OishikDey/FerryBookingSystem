document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const depart = document.getElementById("depart").value;
    const timeDepart = document.getElementById("timedepart").value;
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

    if(!depart) {
        alert("Please select a departure date.");
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
        departureDate: depart,
        time: timeDepart,
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
