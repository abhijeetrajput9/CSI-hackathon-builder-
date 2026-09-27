// ================= TEAM DATA =================

let teams = [
    {
        hackathon: "Prompt 2 Product MLH",
        teamName: "Code Warriors",
        teamSize: 3,
        teamLeader: "Rahul",
        members: ["Rahul", "Aman"],
        available: true
    },

    {
        hackathon: "Prompt 2 Product MLH",
        teamName: "Tech Titans",
        teamSize: 4,
        teamLeader: "Amit",
        members: ["Amit", "Rohan", "Kunal"],
        available: true
    },

    {
        hackathon: "Smart India Hackathon",
        teamName: "Innovators",
        teamSize: 3,
        teamLeader: "Priya",
        members: ["Priya"],
        available: true
    }
];


// ================= DISPLAY TEAMS =================

function displayTeams() {

    const teamList = document.getElementById("teamList");

    teamList.innerHTML = "";

    teams.forEach((team, index) => {

        const currentMembers = team.members.length;

        const availableSeats =
            team.teamSize - currentMembers;


        const teamDiv = document.createElement("div");

        teamDiv.classList.add("team");


        teamDiv.innerHTML = `
            <h3>${team.teamName}</h3>

            <p>
                <strong>Hackathon:</strong>
                ${team.hackathon}
            </p>

            <p>
                <strong>Team Leader:</strong>
                ${team.teamLeader}
            </p>

            <p>
                <strong>Team Size:</strong>
                ${team.teamSize}
            </p>

            <p>
                <strong>Members:</strong>
                ${currentMembers}/${team.teamSize}
            </p>

            <p>
                <strong>Available Seats:</strong>
                ${availableSeats}
            </p>

            ${
                availableSeats > 0
                ?
                `<button
                    class="join-btn"
                    onclick="selectTeam(${index})">
                    Join Team
                </button>`
                :
                `<button
                    class="join-btn"
                    disabled>
                    Team Full
                </button>`
            }
        `;


        teamList.appendChild(teamDiv);

    });
}


// ================= CREATE TEAM =================

document
    .getElementById("createTeamForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const hackathon =
            document.getElementById("hackathon").value;

        const teamName =
            document.getElementById("teamName").value;

        const teamSize =
            Number(document.getElementById("teamSize").value);

        const teamLeader =
            document.getElementById("teamLeader").value;

        const leaderEmail =
            document.getElementById("leaderEmail").value;


        const members = [teamLeader];


        const member1 =
            document.getElementById("member1").value;

        const member2 =
            document.getElementById("member2").value;

        const member3 =
            document.getElementById("member3").value;


        if (member1) members.push(member1);

        if (member2) members.push(member2);

        if (member3) members.push(member3);


        if (members.length > teamSize) {

            alert("You have added more members than the selected team size.");

            return;
        }


        const newTeam = {

            hackathon: hackathon,

            teamName: teamName,

            teamSize: teamSize,

            teamLeader: teamLeader,

            leaderEmail: leaderEmail,

            members: members,

            available: true
        };


        teams.push(newTeam);


        displayTeams();


        alert("Team created successfully!");


        document
            .getElementById("createTeamForm")
            .reset();

    });


// ================= SELECT TEAM =================

let selectedTeamIndex = null;


function selectTeam(index) {

    selectedTeamIndex = index;


    const team = teams[index];


    document.getElementById("joinTeamName").value =
        team.teamName;


    document
        .getElementById("joinMemberName")
        .focus();


    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
}


// ================= JOIN TEAM =================

document
    .getElementById("joinTeamForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        if (selectedTeamIndex === null) {

            alert("Please select a team first.");

            return;
        }


        const name =
            document.getElementById("joinMemberName").value;

        const email =
            document.getElementById("joinMemberEmail").value;


        const team =
            teams[selectedTeamIndex];


        // Check team capacity

        if (team.members.length >= team.teamSize) {

            alert("Sorry, this team is already full.");

            displayTeams();

            return;
        }


        // Add member

        team.members.push(name);


        alert(
            `${name} successfully joined ${team.teamName}!`
        );


        document
            .getElementById("joinTeamForm")
            .reset();


        selectedTeamIndex = null;


        displayTeams();

    });


// ================= INITIAL DISPLAY =================

displayTeams();