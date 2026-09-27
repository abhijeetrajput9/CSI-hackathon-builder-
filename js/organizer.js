
// ==========================================
// GET ELEMENTS
// ==========================================
const form = document.getElementById("hackathonForm");
const container = document.getElementById("hackathonContainer");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");
const countText = document.getElementById("hackathonCount");


// ==========================================
// FORM INPUTS
// ==========================================

const nameInput = document.getElementById("name");
const dateInput = document.getElementById("date");
const themeInput = document.getElementById("theme");
const eligibilityInput = document.getElementById("eligibility");
const teamSizeInput = document.getElementById("teamSize");
const prizeInput = document.getElementById("prize");
const deadlineInput = document.getElementById("deadline");
const editIdInput = document.getElementById("editId");
const statusInput = document.getElementById("status");


// ==========================================
// LOAD DATA
// ==========================================

let hackathons =
    JSON.parse(localStorage.getItem("hackathons")) || [];


// ==========================================
// REMOVE INVALID OLD DATA
// ==========================================

// This removes the extra broken card that may
// already be saved in localStorage.

hackathons = hackathons.filter(function (hackathon) {

    return (
        hackathon.name &&
        hackathon.date &&
        hackathon.theme &&
        hackathon.eligibility &&
        hackathon.teamSize &&
        hackathon.prize &&
        hackathon.deadline
    );

});


// Add default status to old hackathons

hackathons = hackathons.map(function (hackathon) {

    return {
        ...hackathon,
        status: hackathon.status || "upcoming"
    };

});


saveHackathons();


// ==========================================
// SAVE DATA
// ==========================================

function saveHackathons() {

    localStorage.setItem(
        "hackathons",
        JSON.stringify(hackathons)
    );

}


// ==========================================
// DISPLAY HACKATHONS
// ==========================================

function displayHackathons() {

    container.innerHTML = "";

    countText.textContent =
        `${hackathons.length} hackathon${hackathons.length !== 1 ? "s" : ""}`;


    hackathons.forEach(function (hackathon) {

        const card = document.createElement("div");

        const status =
            hackathon.status || "upcoming";


        card.className = "hackathon-card";


        card.innerHTML = `

            <div class="card-top">

                <h3>
                    ${hackathon.name}
                </h3>

                <span class="status ${status}">
                    ${status.charAt(0).toUpperCase() + status.slice(1)}
                </span>

            </div>


            <p class="theme">
                ${hackathon.theme}
            </p>


            <div class="info">

                <div class="info-item">
                    Date
                    <strong>
                        ${formatDate(hackathon.date)}
                    </strong>
                </div>


                <div class="info-item">
                    Eligibility
                    <strong>
                        ${hackathon.eligibility}
                    </strong>
                </div>


                <div class="info-item">
                    Team Size
                    <strong>
                        ${hackathon.teamSize}
                    </strong>
                </div>


                <div class="info-item">
                    Prize Pool
                    <strong>
                        ${hackathon.prize}
                    </strong>
                </div>

            </div>


            <div class="countdown-box">

                <div class="countdown-title">
                    Registration Deadline
                </div>

                <div
                    class="countdown"
                    id="countdown-${hackathon.id}">
                    Loading...
                </div>

            </div>


            <div class="card-buttons">

                <button
                    class="register-btn"
                    onclick="registerHackathon(${hackathon.id})">

                    Register

                </button>


                <button
                    class="edit-btn"
                    onclick="editHackathon(${hackathon.id})">

                    Edit

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteHackathon(${hackathon.id})">

                    Delete

                </button>

            </div>

        `;


        container.appendChild(card);


        startCountdown(
            hackathon.id,
            hackathon.deadline
        );

    });

}


// ==========================================
// ADD / UPDATE HACKATHON
// ==========================================

form.addEventListener("submit", function (event) {

    event.preventDefault();


    const editId =
        editIdInput.value;


    // ======================================
    // CHECK FORM
    // ======================================

    if (
        !nameInput.value.trim() ||
        !dateInput.value ||
        !themeInput.value.trim() ||
        !eligibilityInput.value.trim() ||
        !teamSizeInput.value.trim() ||
        !prizeInput.value.trim() ||
        !deadlineInput.value
    ) {

        alert("Please fill all the fields.");

        return;

    }


    const hackathonData = {

        name: nameInput.value.trim(),

        date: dateInput.value,

        theme: themeInput.value.trim(),

        eligibility: eligibilityInput.value.trim(),

        teamSize: teamSizeInput.value.trim(),

        prize: prizeInput.value.trim(),

        deadline: deadlineInput.value,

        status: statusInput.value || "upcoming"

    };


    // ======================================
    // UPDATE EXISTING HACKATHON
    // ======================================

    if (editId !== "") {

        const index =
            hackathons.findIndex(function (hackathon) {

                return String(hackathon.id) ===
                    String(editId);

            });


        if (index !== -1) {

            hackathons[index] = {

                ...hackathons[index],

                ...hackathonData

            };


            alert("Hackathon updated successfully!");

        }

    }


    // ======================================
    // ADD NEW HACKATHON
    // ======================================

    else {

        hackathons.push({

            id: Date.now(),

            ...hackathonData

        });


        alert("Hackathon added successfully!");

    }


    // ======================================
    // SAVE
    // ======================================

    saveHackathons();

    displayHackathons();

    resetForm();

});


// ==========================================
// EDIT HACKATHON
// ==========================================

function editHackathon(id) {

    const hackathon =
        hackathons.find(function (hackathon) {

            return String(hackathon.id) ===
                String(id);

        });


    if (!hackathon) {

        alert("Hackathon not found!");

        return;

    }


    nameInput.value =
        hackathon.name || "";

    dateInput.value =
        hackathon.date || "";

    themeInput.value =
        hackathon.theme || "";

    eligibilityInput.value =
        hackathon.eligibility || "";

    teamSizeInput.value =
        hackathon.teamSize || "";

    prizeInput.value =
        hackathon.prize || "";

    deadlineInput.value =
        hackathon.deadline || "";

    statusInput.value =
        hackathon.status || "upcoming";


    editIdInput.value =
        hackathon.id;


    formTitle.textContent =
        "Edit Hackathon";

    submitButton.textContent =
        "Update Hackathon";

    cancelButton.style.display =
        "block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// DELETE HACKATHON
// ==========================================

function deleteHackathon(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this hackathon?"
        );


    if (!confirmDelete) {

        return;

    }


    hackathons =
        hackathons.filter(function (hackathon) {

            return String(hackathon.id) !==
                String(id);

        });


    saveHackathons();

    displayHackathons();

}


// ==========================================
// CANCEL EDIT
// ==========================================

cancelButton.addEventListener(
    "click",
    function () {

        resetForm();

    }
);


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    form.reset();


    editIdInput.value = "";


    formTitle.textContent =
        "Add New Hackathon";


    submitButton.textContent =
        "Add Hackathon";


    cancelButton.style.display =
        "none";


    statusInput.value =
        "upcoming";

}


// ==========================================
// REGISTER BUTTON
// ==========================================

function registerHackathon(id) {

    const hackathon =
        hackathons.find(function (hackathon) {

            return hackathon.id === id;

        });


    if (!hackathon) {

        return;

    }


    // Past hackathon

    if (hackathon.status === "past") {

        alert(
            "Registration is closed for this hackathon."
        );

        return;

    }


    // Check deadline

    const now =
        new Date().getTime();

    const deadline =
        new Date(hackathon.deadline).getTime();


    if (now >= deadline) {

        alert(
            "Registration is closed!"
        );

        return;

    }


    // Send selected hackathon ID
    // to registration page

    window.location.href =
        `registration.html?id=${hackathon.id}`;

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    const d =
        new Date(date);


    if (isNaN(d.getTime())) {

        return "Invalid Date";

    }


    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// COUNTDOWN
// ==========================================

function startCountdown(id, deadline) {

    const element =
        document.getElementById(
            `countdown-${id}`
        );


    if (!element) {

        return;

    }


    function updateCountdown() {

        const now =
            new Date().getTime();

        const target =
            new Date(deadline).getTime();


        // Prevent NaN

        if (isNaN(target)) {

            element.textContent =
                "Invalid Deadline";

            return;

        }


        const difference =
            target - now;


        if (difference <= 0) {

            element.textContent =
                "Registration Closed";

            return;

        }


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (difference /
                    (1000 * 60 * 60)) % 24
            );


        const minutes =
            Math.floor(
                (difference /
                    (1000 * 60)) % 60
            );


        const seconds =
            Math.floor(
                (difference / 1000) % 60
            );


        element.textContent =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

    }


    updateCountdown();


    setInterval(
        updateCountdown,
        1000
    );

}


// ==========================================
// INITIAL DISPLAY
// ==========================================

resetForm();

displayHackathons();