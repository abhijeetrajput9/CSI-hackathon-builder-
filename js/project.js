// ================= GET ELEMENTS =================

const projectForm=document.getElementById("projectForm");
const hackathonSelect=document.getElementById("hackathon");
const projectName=document.getElementById("projectName");
const category=document.getElementById("category");
const description=document.getElementById("description");
const techStack=document.getElementById("techStack");
const github=document.getElementById("github");
const demo=document.getElementById("demo");

const statusCard=document.getElementById("statusCard");
const submittedProject=document.getElementById("submittedProject");
const submittedTeam=document.getElementById("submittedTeam");
const submittedDate=document.getElementById("submittedDate");
const editProjectBtn=document.getElementById("editProjectBtn");

// ================= GET TEAM =================

const selectedTeam=JSON.parse(localStorage.getItem("selectedTeam")) || null;

// ================= HACKATHONS =================

const hackathons=JSON.parse(localStorage.getItem("hackathons")) || [];

if(hackathons.length===0){
    hackathonSelect.innerHTML+=`
        <option value="Hackathon">Hackathon</option>
    `;
}else{
    hackathons.forEach(function(hackathon){
        const option=document.createElement("option");
        option.value=hackathon.name;
        option.textContent=hackathon.name;
        hackathonSelect.appendChild(option);
    });
}

// ================= SHOW TEAM =================

if(selectedTeam){
    document.getElementById("selectedTeam").textContent=selectedTeam.teamName;
    document.getElementById("teamLeader").textContent=selectedTeam.teamLeader;

    if(selectedTeam.hackathon){
        hackathonSelect.value=selectedTeam.hackathon;
        document.getElementById("selectedHackathon").textContent=selectedTeam.hackathon;
    }
}else{
    document.getElementById("selectedTeam").textContent="No Team Selected";
}

// ================= HACKATHON CHANGE =================

hackathonSelect.addEventListener("change",function(){
    document.getElementById("selectedHackathon").textContent=
        hackathonSelect.value || "Select Hackathon";
});

// ================= SUBMIT PROJECT =================

projectForm.addEventListener("submit",function(event){
    event.preventDefault();

    if(!selectedTeam){
        alert("Please create or join a team first.");
        return;
    }

    const project={
        id:Date.now(),
        hackathon:hackathonSelect.value,
        teamName:selectedTeam.teamName,
        teamLeader:selectedTeam.teamLeader,
        members:selectedTeam.members,
        projectName:projectName.value,
        category:category.value,
        description:description.value,
        techStack:techStack.value,
        github:github.value,
        demo:demo.value,
        status:"Submitted",
        submittedAt:new Date().toLocaleString("en-IN")
    };

    localStorage.setItem("project",JSON.stringify(project));

    showSubmission(project);

    alert("Project submitted successfully!");
});

// ================= SHOW SUBMISSION =================

function showSubmission(project){
    statusCard.style.display="block";

    submittedProject.textContent=project.projectName;
    submittedTeam.textContent=project.teamName;
    submittedDate.textContent=project.submittedAt;

    projectForm.style.display="none";

    statusCard.scrollIntoView({
        behavior:"smooth"
    });
}

// ================= EDIT PROJECT =================

editProjectBtn.addEventListener("click",function(){
    const project=JSON.parse(localStorage.getItem("project"));

    if(!project)return;

    hackathonSelect.value=project.hackathon;
    projectName.value=project.projectName;
    category.value=project.category;
    description.value=project.description;
    techStack.value=project.techStack;
    github.value=project.github;
    demo.value=project.demo;

    document.getElementById("selectedHackathon").textContent=project.hackathon;

    statusCard.style.display="none";
    projectForm.style.display="block";

    projectForm.scrollIntoView({
        behavior:"smooth"
    });
});

// ================= LOAD EXISTING PROJECT =================

const existingProject=JSON.parse(localStorage.getItem("project"));

if(existingProject){
    showSubmission(existingProject);
}