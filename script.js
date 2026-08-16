// Free Registration toggle
const freeRegLink=document.getElementById("freeRegLink");
const freeRegSection=document.getElementById("freeReg");
const mainContent=document.getElementById("mainContent");
freeRegLink.addEventListener("click",function(){
  mainContent.style.display="none";
  freeRegSection.classList.remove("hidden");
  freeRegSection.scrollIntoView({behavior:"smooth"});
});

// Home click
const homeLink=document.getElementById("homeLink");
homeLink.addEventListener("click",function(){
  freeRegSection.classList.add("hidden");
  mainContent.style.display="block";
  window.scrollTo({top:0, behavior:"smooth"});
});

// ===== Event selection: shows the Individual/Team mode toggle =====
const eventSelect=document.getElementById("eventSelect");
const regModeToggle=document.getElementById("regModeToggle");
const individualModeBtn=document.getElementById("individualModeBtn");
const teamModeBtn=document.getElementById("teamModeBtn");
const regForm=document.getElementById("regForm");
const teamRegForm=document.getElementById("teamRegForm");
const payBtn=document.getElementById("payBtn");
const teamPayBtn=document.getElementById("teamPayBtn");

eventSelect.addEventListener("change",function(){
  if(this.value==="battle_of_battles"){
    regModeToggle.classList.remove("hidden");
    showIndividualMode(); // default to individual view
  } else {
    regModeToggle.classList.add("hidden");
    regForm.classList.add("hidden");
    teamRegForm.classList.add("hidden");
    alert("Registration not open for this event currently.");
  }
});

function showIndividualMode(){
  individualModeBtn.classList.add("active");
  teamModeBtn.classList.remove("active");
  regForm.classList.remove("hidden");
  teamRegForm.classList.add("hidden");
}

function showTeamMode(){
  teamModeBtn.classList.add("active");
  individualModeBtn.classList.remove("active");
  teamRegForm.classList.remove("hidden");
  regForm.classList.add("hidden");
  updateTeamPayBtn();
}

individualModeBtn.addEventListener("click",showIndividualMode);
teamModeBtn.addEventListener("click",showTeamMode);

// ===== Individual registration: captain conditional questions =====
const captainSelect=document.getElementById("captainSelect");
const captainQuestionsIndividual=document.getElementById("captainQuestionsIndividual");
captainSelect.addEventListener("change",function(){
  if(this.value==="yes"){ captainQuestionsIndividual.classList.remove("hidden"); }
  else { captainQuestionsIndividual.classList.add("hidden"); }
});

// ===== Team registration: multi-player add/remove, dynamic price =====
const MAX_PLAYERS=5;
const PRICE_PER_PLAYER=200;
let teamPlayerCount=1;
const teamPlayersContainer=document.getElementById("teamPlayersContainer");
const addTeamPlayerBtn=document.getElementById("addTeamPlayerBtn");
const teamPlayerCountLabel=document.getElementById("teamPlayerCountLabel");
const teamCaptainSelect=document.getElementById("teamCaptainSelect");

function updateTeamPayBtn(){
  const total=teamPlayerCount*PRICE_PER_PLAYER;
  teamPayBtn.innerText="Pay & Register Team (₹"+total+")";
}

function teamPlayerBlockTemplate(n){
  const block=document.createElement("div");
  block.className="player-block";
  block.setAttribute("data-player",n);
  block.innerHTML=`
    <div class="player-block-head">
      <span class="player-num">Player ${n}</span>
      <button type="button" class="remove-player">Remove</button>
    </div>
    <label>Full Name</label>
    <input type="text" required>
    <label>Mobile Number</label>
    <input type="tel" required>
    <label>Age</label>
    <input type="number" min="12" required>
    <label>Experience (in cricket)</label>
    <select required>
      <option value="">Select Experience</option>
      <option value="beginner">Beginner (0-1 year)</option>
      <option value="intermediate">Intermediate (1-3 years)</option>
      <option value="advanced">Advanced (3-5 years)</option>
      <option value="semi_pro">Semi-Pro (5-7 years)</option>
      <option value="professional">Professional (7+ years)</option>
    </select>
    <label>Food Preference</label>
    <select>
      <option>Veg</option>
      <option>Non-Veg</option>
    </select>
    <label>Upload Aadhaar (PDF/JPEG/PNG)</label>
    <input type="file" accept=".pdf,.jpg,.jpeg,.png" required>
  `;
  return block;
}

function renumberTeamPlayers(){
  const blocks=teamPlayersContainer.querySelectorAll(".player-block");
  blocks.forEach((block,i)=>{
    const n=i+1;
    block.setAttribute("data-player",n);
    block.querySelector(".player-num").innerText="Player "+n;
    const removeBtn=block.querySelector(".remove-player");
    if(removeBtn){ removeBtn.style.display = blocks.length>1 ? "inline-block" : "none"; }
  });
  teamPlayerCount=blocks.length;
  teamPlayerCountLabel.innerText="("+teamPlayerCount+"/"+MAX_PLAYERS+")";
  addTeamPlayerBtn.disabled = teamPlayerCount>=MAX_PLAYERS;
  addTeamPlayerBtn.style.opacity = teamPlayerCount>=MAX_PLAYERS ? "0.5" : "1";

  // Rebuild captain dropdown to match current player count
  const prevValue=teamCaptainSelect.value;
  teamCaptainSelect.innerHTML="";
  for(let i=1;i<=teamPlayerCount;i++){
    const opt=document.createElement("option");
    opt.value=i;
    opt.innerText="Player "+i;
    teamCaptainSelect.appendChild(opt);
  }
  if(prevValue && Number(prevValue)<=teamPlayerCount){ teamCaptainSelect.value=prevValue; }

  updateTeamPayBtn();
}

addTeamPlayerBtn.addEventListener("click",function(){
  if(teamPlayerCount>=MAX_PLAYERS) return;
  const newBlock=teamPlayerBlockTemplate(teamPlayerCount+1);
  teamPlayersContainer.appendChild(newBlock);
  renumberTeamPlayers();
});

teamPlayersContainer.addEventListener("click",function(e){
  if(e.target.classList.contains("remove-player")){
    const block=e.target.closest(".player-block");
    if(teamPlayersContainer.querySelectorAll(".player-block").length>1){
      block.remove();
      renumberTeamPlayers();
    }
  }
});

// Initialize team player state on load
renumberTeamPlayers();

// ===== Terms modal (shared by both forms) =====
const termsLink=document.getElementById("termsLink");
const teamTermsLink=document.getElementById("teamTermsLink");
const termsModal=document.getElementById("termsModal");
const closeBtn=document.querySelector(".close");
function openTermsModal(e){ e.preventDefault(); termsModal.style.display="block"; }
termsLink.onclick=openTermsModal;
teamTermsLink.onclick=openTermsModal;
closeBtn.onclick=function(){ termsModal.style.display="none"; }
window.onclick=function(e){ if(e.target==termsModal){ termsModal.style.display="none"; } }

// ===== Terms validation on submit (both forms) =====
regForm.addEventListener("submit",function(e){
  const termsCheck=document.getElementById("termsCheck");
  if(!termsCheck.checked){
    e.preventDefault();
    alert("Please accept the Terms & Conditions to register.");
  }
});

teamRegForm.addEventListener("submit",function(e){
  const teamTermsCheck=document.getElementById("teamTermsCheck");
  if(!teamTermsCheck.checked){
    e.preventDefault();
    alert("Please accept the Terms & Conditions to register your team.");
  }
});

// ===== Free Registration form submit =====
const freeForm=document.getElementById("freeForm");
freeForm.addEventListener("submit",function(e){
  e.preventDefault();
  alert("You have successfully registered for updates!");
});
// ===== Sponsor Registration toggle =====
const sponsorLink=document.getElementById("sponsorLink");
const sponsorSection=document.getElementById("sponsorReg");

sponsorLink.addEventListener("click",function(){
  mainContent.style.display="none";
  freeRegSection.classList.add("hidden");
  sponsorSection.classList.remove("hidden");
  sponsorSection.scrollIntoView({behavior:"smooth"});
});

// Update Home click to also hide sponsor section
homeLink.addEventListener("click",function(){
  sponsorSection.classList.add("hidden");
});

// Dynamic price update on submit button based on package selected
const sponsorPackage=document.getElementById("sponsorPackage");
const sponsorSubmitBtn=document.getElementById("sponsorSubmitBtn");
sponsorPackage.addEventListener("change",function(){
  if(this.value==="custom"){
    sponsorSubmitBtn.innerText="Submit Sponsorship Request";
  } else if(this.value){
    sponsorSubmitBtn.innerText="Submit Request (₹"+Number(this.value).toLocaleString("en-IN")+")";
  } else {
    sponsorSubmitBtn.innerText="Submit Sponsorship Request";
  }
});

// ===== Sponsor form submit =====
const sponsorForm=document.getElementById("sponsorForm");
sponsorForm.addEventListener("submit",function(e){
  e.preventDefault();
  const sponsorTerms=document.getElementById("sponsorTerms");
  if(!sponsorTerms.checked){
    alert("Please agree to be contacted to submit your sponsorship request.");
    return;
  }
  alert("Thank you! Your sponsorship request has been submitted. Our team will contact you shortly.");
});