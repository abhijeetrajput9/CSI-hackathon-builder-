// ==========================================
// GET ELEMENTS
// ==========================================

const container =
    document.getElementById("hackathonContainer");

const searchInput =
    document.getElementById("searchInput");

const themeFilter =
    document.getElementById("themeFilter");

const sortFilter =
    document.getElementById("sortFilter");

const resultCount =
    document.getElementById("resultCount");

const noResults =
    document.getElementById("noResults");

const filterButtons =
    document.querySelectorAll(".filter-btn");


// ==========================================
// GET HACKATHONS FROM LOCAL STORAGE
// ==========================================

let hackathons =
    JSON.parse(localStorage.getItem("hackathons")) || [];


// Current status filter

let currentStatus = "all";


// ==========================================
// GET STATUS
// ==========================================

function getStatus(hackathon) {

    const today = new Date();

    const hackathonDate =
        new Date(hackathon.date);

    const deadline =
        new Date(hackathon.deadline);


    if (today < hackathonDate) {

        return "upcoming";

    }

    else if (today <= deadline) {

        return "ongoing";

    }

    else {

        return "past";

    }

}


// ==========================================
// CREATE THEME FILTER OPTIONS
// ==========================================

function createThemeFilters() {

    const themes = [];

    hackathons.forEach(function(hackathon) {

        if (!themes.includes(hackathon.theme)) {

            themes.push(hackathon.theme);

        }

    });


    themes.forEach(function(theme) {

        const option =
            document.createElement("option");

        option.value = theme;

        option.textContent = theme;

        themeFilter.appendChild(option);

    });

}


// ==========================================
// DISPLAY HACKATHONS
// ==========================================

function displayHackathons() {

    container.innerHTML = "";


    let filteredHackathons =
        [...hackathons];


    // ================= SEARCH =================

    const searchText =
        searchInput.value.toLowerCase().trim();


    if (searchText !== "") {

        filteredHackathons =
            filteredHackathons.filter(function(hackathon) {

                return (

                    hackathon.name
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    hackathon.theme
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    hackathon.eligibility
                        .toLowerCase()
                        .includes(searchText)
                );
            });
    }


    // ================= STATUS =================

    if (currentStatus !== "all") {

        filteredHackathons =
            filteredHackathons.filter(function(hackathon) {

                return getStatus(hackathon)
                    === currentStatus;

            });

    }


    // ================= THEME =================

    if (themeFilter.value !== "all") {

        filteredHackathons =
            filteredHackathons.filter(function(hackathon) {

                return hackathon.theme
                    === themeFilter.value;

            });

    }


    // ================= SORT =================

    filteredHackathons.sort(function(a, b) {

        const dateA =
            new Date(a.date);

        const dateB =
            new Date(b.date);


        if (sortFilter.value === "newest") {

            return dateB - dateA;

        }

        return dateA - dateB;

    });


    // ================= COUNT =================

    resultCount.textContent =
        `${filteredHackathons.length} hackathon${
            filteredHackathons.length !== 1
                ? "s"
                : ""
        }`;


    // ================= NO RESULTS =================

    if (filteredHackathons.length === 0) {

        noResults.style.display = "block";

        return;

    }

    else {

        noResults.style.display = "none";

    }


    // ================= CREATE CARDS =================

    filteredHackathons.forEach(function(hackathon) {

        createCard(hackathon);

    });

}


// ==========================================
// CREATE CARD
// ==========================================

function createCard(hackathon) {

    const status =
        getStatus(hackathon);


    const card =
        document.createElement("div");

    card.className =
        "hackathon-card";


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
                id="countdown-${hackathon.id}"
            >
                Loading...
            </div>

        </div>


        <div class="card-buttons">

            <button
                class="register-btn"
                onclick="registerHackathon(${hackathon.id})"
            >
                Register
            </button>


            <button
                class="details-btn"
                onclick="viewDetails(${hackathon.id})"
            >
                View Details
            </button>

        </div>

    `;


    container.appendChild(card);


    startCountdown(
        hackathon.id,
        hackathon.deadline
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


    function updateCountdown() {

        const now =
            new Date().getTime();

        const target =
            new Date(deadline).getTime();

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

    setInterval(updateCountdown, 1000);

}


// ==========================================
// REGISTER
// ==========================================

function registerHackathon(id) {

    const hackathon =
        hackathons.find(
            h => h.id === id
        );


    if (!hackathon) return;


    const now =
        new Date().getTime();

    const deadline =
        new Date(
            hackathon.deadline
        ).getTime();


    if (now >= deadline) {

        alert("Registration is closed!");

        return;

    }


    alert(
        `Registration opened for ${hackathon.name}`
    );

    // Later:
    window.location.href ="registration.html";

}


// ==========================================
// VIEW DETAILS
// ==========================================

function viewDetails(id) {

    const hackathon =
        hackathons.find(
            h => h.id === id
        );


    if (!hackathon) return;


    alert(
        `Hackathon: ${hackathon.name}\n\n` +
        `Theme: ${hackathon.theme}\n` +
        `Eligibility: ${hackathon.eligibility}\n` +
        `Team Size: ${hackathon.teamSize}\n` +
        `Prize: ${hackathon.prize}`
    );

    // Later:
    // window.location.href =
    //     `hackathon-details.html?id=${id}`;

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    const d =
        new Date(date);


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
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    displayHackathons
);
// ==========================================
// THEME FILTER
// ==========================================

themeFilter.addEventListener(
    "change",
    displayHackathons
);


// ==========================================
// SORT
// ==========================================

sortFilter.addEventListener(
    "change",
    displayHackathons
);

// ==========================================
// STATUS FILTER
// ==========================================

filterButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            filterButtons.forEach(function(btn) {

                btn.classList.remove("active");

            });
            button.classList.add("active");
            currentStatus =
                button.dataset.status;
            displayHackathons();

        }
    );

});
// ==========================================
// INITIAL LOAD
// ==========================================

createThemeFilters();

displayHackathons();