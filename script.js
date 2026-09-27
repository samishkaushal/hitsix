// ============================================================
// HITSIX - FINAL SCRIPT
// Battle of Battles
// Individual ₹500
// Team ₹2600
// Team = EXACTLY 8 PLAYERS
// Backend field = registrationData
// ============================================================
const API_BASE = "https://puneturfcricket.onrender.com";

// const API_BASE = "http://localhost:5000";

const INDIVIDUAL_PAYMENT_LINK = "https://rzp.io/rzp/JKWbcGTn";
const TEAM_PAYMENT_LINK = "https://rzp.io/rzp/rrDJfd4L";

const INDIVIDUAL_AMOUNT = 500;
const TEAM_AMOUNT = 2600;
const TEAM_SIZE = 8;

// ============================================================
// HELPER
// ============================================================

const $ = (id) => document.getElementById(id);

// ============================================================
// ELEMENTS
// ============================================================

const mainContent = $("mainContent");
const formSection = $("formSection");

const eventSelect = $("eventSelect");
const regModeToggle = $("regModeToggle");

const individualModeBtn = $("individualModeBtn");
const teamModeBtn = $("teamModeBtn");

const individualPriceMessage = $("individualPriceMessage");
const teamPriceMessage = $("teamPriceMessage");

const regForm = $("regForm");
const teamRegForm = $("teamRegForm");

const payBtn = $("payBtn");
const teamPayBtn = $("teamPayBtn");

// ============================================================
// EVENT CHANGE
// ============================================================

if (eventSelect) {
  eventSelect.addEventListener("change", function () {

    const selectedEvent = this.value;

    if (selectedEvent === "battle_of_battles") {

      if (regModeToggle) {
        regModeToggle.classList.remove("hidden");
      }

      showIndividualMode();

    } else {

      if (regModeToggle) {
        regModeToggle.classList.add("hidden");
      }

      if (regForm) {
        regForm.classList.add("hidden");
      }

      if (teamRegForm) {
        teamRegForm.classList.add("hidden");
      }

    }

  });
}

// ============================================================
// PRICE MESSAGE
// ============================================================

function updatePriceMessage(mode) {

  if (individualPriceMessage) {
    individualPriceMessage.classList.add("hidden");
  }

  if (teamPriceMessage) {
    teamPriceMessage.classList.add("hidden");
  }

  if (mode === "individual") {

    if (individualPriceMessage) {
      individualPriceMessage.classList.remove("hidden");
    }

  }

  if (mode === "team") {

    if (teamPriceMessage) {
      teamPriceMessage.classList.remove("hidden");
    }

  }

}

// ============================================================
// INDIVIDUAL MODE
// ============================================================

function showIndividualMode() {

  if (individualModeBtn) {
    individualModeBtn.classList.add("active");
  }

  if (teamModeBtn) {
    teamModeBtn.classList.remove("active");
  }

  if (regForm) {
    regForm.classList.remove("hidden");
  }

  if (teamRegForm) {
    teamRegForm.classList.add("hidden");
  }

  updatePriceMessage("individual");

  if (payBtn) {
    payBtn.innerText = `Pay & Register (₹${INDIVIDUAL_AMOUNT})`;
  }

}

// ============================================================
// TEAM MODE
// ============================================================

function showTeamMode() {

  if (teamModeBtn) {
    teamModeBtn.classList.add("active");
  }

  if (individualModeBtn) {
    individualModeBtn.classList.remove("active");
  }

  if (regForm) {
    regForm.classList.add("hidden");
  }

  if (teamRegForm) {
    teamRegForm.classList.remove("hidden");
  }

  updatePriceMessage("team");

  if (teamPayBtn) {
    teamPayBtn.innerText =
      `Pay & Register Team (₹${TEAM_AMOUNT})`;
  }

}

// ============================================================
// MODE BUTTONS
// ============================================================

if (individualModeBtn) {
  individualModeBtn.addEventListener(
    "click",
    showIndividualMode
  );
}

if (teamModeBtn) {
  teamModeBtn.addEventListener(
    "click",
    showTeamMode
  );
}

// ============================================================
// INDIVIDUAL CAPTAIN QUESTIONS
// ============================================================

const captainSelect = $("captainSelect");
const captainQuestionsIndividual =
  $("captainQuestionsIndividual");

if (captainSelect && captainQuestionsIndividual) {

  captainSelect.addEventListener("change", function () {

    if (this.value === "yes") {

      captainQuestionsIndividual.classList.remove("hidden");

    } else {

      captainQuestionsIndividual.classList.add("hidden");

    }

  });

}

// ============================================================
// INDIVIDUAL REGISTRATION
// ============================================================

if (regForm) {

  regForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    console.log("INDIVIDUAL FORM SUBMITTED");

    // --------------------------------------------------------
    // TERMS
    // --------------------------------------------------------

    const terms = $("sponsorTerms");

    if (!terms || !terms.checked) {

      alert("Please accept the Terms & Conditions.");

      return;
    }

    // --------------------------------------------------------
    // COLLECT DATA
    // --------------------------------------------------------

    const data = {

      event:
        eventSelect?.value ||
        "battle_of_battles",

      registrationType: "individual",

      name:
        $("fullName")?.value.trim() ||
        "",

      phone:
        $("mobile")?.value.trim() ||
        "",

      alternatePhone:
        $("alternate")?.value.trim() ||
        "",

      email:
        $("email")?.value.trim() ||
        "",

      age:
        Number($("age")?.value || 0),

      location:
        $("location")?.value.trim() ||
        "",

      profession:
        $("profession")?.value.trim() ||
        "",

      experience:
        $("experience")?.value ||
        "",

      captain:
        $("captainSelect")?.value ||
        "",

      captainDetails: {

        reason:
          $("captainReason")?.value.trim() ||
          "",

        previousExperience:
          $("captainExperience")?.value ||
          "",

        motivation:
          $("captainMotivation")?.value ||
          "",

        priority:
          $("captainPriority")?.value ||
          "",

        thoughts:
          $("captainThoughts")?.value.trim() ||
          ""

      },

      amount: INDIVIDUAL_AMOUNT,

      paymentStatus: "pending"

    };

    console.log(
      "INDIVIDUAL DATA:",
      data
    );

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
      !data.name ||
      !data.phone ||
      !data.email ||
      !data.age ||
      !data.location ||
      !data.experience
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }

    if (data.age < 12) {

      alert(
        "Minimum age is 12 years."
      );

      return;
    }

    // --------------------------------------------------------
    // BUTTON
    // --------------------------------------------------------

    if (payBtn) {

      payBtn.disabled = true;

      payBtn.innerText =
        "Saving Registration...";

    }

    // --------------------------------------------------------
    // API
    // --------------------------------------------------------

    try {

      const response = await fetch(
        `${API_BASE}/api/register`,
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(data)

        }
      );

      const result =
        await response.json();

      console.log(
        "INDIVIDUAL API RESPONSE:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.message ||
          "Registration failed"
        );

      }

      // ------------------------------------------------------
      // SAVE LOCAL
      // ------------------------------------------------------

      localStorage.setItem(
        "hitsixRegistration",
        JSON.stringify(data)
      );

      // ------------------------------------------------------
      // PAYMENT LINK
      // ------------------------------------------------------

      const paymentLink =
        result?.data?.paymentLink ||
        result?.paymentLink ||
        INDIVIDUAL_PAYMENT_LINK;

      if (!paymentLink) {

        alert(
          "Registration saved successfully! ✅\n\n" +
          "Payment link is not configured."
        );

        return;
      }

      // ------------------------------------------------------
      // REDIRECT
      // ------------------------------------------------------

      alert(
        "Registration saved successfully! ✅\n\n" +
        "Opening payment..."
      );

      window.location.href =
        paymentLink;

    } catch (error) {

      console.error(
        "INDIVIDUAL ERROR:",
        error
      );

      alert(
        "Registration failed ❌\n\n" +
        error.message
      );

    } finally {

      if (payBtn) {

        payBtn.disabled = false;

        payBtn.innerText =
          `Pay & Register (₹${INDIVIDUAL_AMOUNT})`;

      }

    }

  });

}

// ============================================================
// TEAM REGISTRATION
// EXACTLY 8 PLAYERS
// Captain + 7 Other Players
// ============================================================

if (teamRegForm) {

  teamRegForm.addEventListener(
    "submit",
    async function (e) {

      e.preventDefault();

      console.log(
        "TEAM FORM SUBMITTED"
      );

      // ------------------------------------------------------
      // TERMS
      // ------------------------------------------------------

      const teamTerms =
        $("teamTermsCheck");

      if (
        !teamTerms ||
        !teamTerms.checked
      ) {

        alert(
          "Please accept the Terms & Conditions."
        );

        return;
      }

      // ------------------------------------------------------
      // TEAM DETAILS
      // ------------------------------------------------------

      const teamName =
        $("teamName")?.value.trim() ||
        "";

      const location =
        $("teamLocation")?.value.trim() ||
        "";

      const captainName =
        $("teamCaptainName")?.value.trim() ||
        "";

      const captainPhone =
        $("teamCaptainPhone")?.value.trim() ||
        "";

      const alternatePhone =
        $("teamAlternatePhone")?.value.trim() ||
        "";

      const captainAge =
        Number(
          $("teamCaptainAge")?.value || 0
        );

      const captainExperience =
        $("teamCaptainExperience")?.value ||
        "";

      // ------------------------------------------------------
      // TEAM DETAILS VALIDATION
      // ------------------------------------------------------

      if (
        !teamName ||
        !location ||
        !captainName ||
        !captainPhone ||
        !captainAge ||
        !captainExperience
      ) {

        alert(
          "Please fill all Captain / Team details."
        );

        return;
      }

      if (captainAge < 12) {

        alert(
          "Captain must be at least 12 years old."
        );

        return;
      }

      // ------------------------------------------------------
      // OTHER 7 PLAYERS
      // ------------------------------------------------------

      const playersText =
        $("otherTeamPlayers")?.value.trim() ||
        "";

      const otherPlayers =
        playersText
          .split(/\r?\n/)
          .map(
            name => name.trim()
          )
          .filter(Boolean);

      console.log(
        "OTHER PLAYERS:",
        otherPlayers
      );

      // ------------------------------------------------------
      // EXACTLY 7 OTHER PLAYERS
      // ------------------------------------------------------

      if (otherPlayers.length !== 7) {

        alert(
          "Team registration requires EXACTLY 8 players.\n\n" +

          "Player 1 = Captain\n" +

          "Player 2 to Player 8 = 7 other players\n\n" +

          "Please enter exactly 7 other player names.\n\n" +

          "Currently entered: " +
          otherPlayers.length
        );

        return;
      }

      // ------------------------------------------------------
      // CAPTAIN QUESTIONS
      // ------------------------------------------------------

      const captainDetails = {

        leadershipExperience:
          $("teamLeadershipExperience")?.value ||
          "",

        captainPreference:
          $("teamCaptainPreference")?.value ||
          "",

        captainApproach:
          $("teamCaptainApproach")?.value ||
          "",

        captainThoughts:
          $("teamCaptainThoughts")?.value.trim() ||
          ""

      };

      // ------------------------------------------------------
      // CAPTAIN QUESTIONS VALIDATION
      // ------------------------------------------------------

      if (
        !captainDetails.leadershipExperience ||
        !captainDetails.captainPreference ||
        !captainDetails.captainApproach ||
        !captainDetails.captainThoughts
      ) {

        alert(
          "Please answer all Captain questions."
        );

        return;
      }

      // ------------------------------------------------------
      // TEAM LOGO
      // ------------------------------------------------------

      const logoInput =
        $("teamLogo");

      const logoFile =
        logoInput?.files?.[0] ||
        null;

      // ------------------------------------------------------
      // PLAYERS ARRAY
      // ------------------------------------------------------

      const players = [

        {
          playerNumber: 1,

          name: captainName,

          phone: captainPhone,

          age: captainAge,

          experience:
            captainExperience,

          foodPreference: "Veg"
        }

      ];

      // Add 7 players
      otherPlayers.forEach(
        function (name, index) {

          players.push({

            playerNumber:
              index + 2,

            name: name,

            phone: "",

            age: null,

            experience: "",

            foodPreference: ""

          });

        }
      );

      console.log(
        "TOTAL PLAYERS:",
        players.length
      );

      // ------------------------------------------------------
      // FINAL PLAYER COUNT CHECK
      // ------------------------------------------------------

      if (players.length !== TEAM_SIZE) {

        alert(
          "Team must contain exactly 8 players."
        );

        return;
      }

      // ------------------------------------------------------
      // TEAM DATA
      // ------------------------------------------------------

      const teamData = {

        event:
          eventSelect?.value ||
          "battle_of_battles",

        registrationType:
          "team",

        teamName:
          teamName,

        location:
          location,

        captain:
          captainName,

        captainPhone:
          captainPhone,

        alternatePhone:
          alternatePhone,

        playerCount:
          TEAM_SIZE,

        amount:
          TEAM_AMOUNT,

        paymentStatus:
          "pending",

        captainDetails:
          captainDetails,

        players:
          players

      };

      console.log(
        "FINAL TEAM DATA:",
        teamData
      );

      // ------------------------------------------------------
      // FORM DATA
      // IMPORTANT:
      // BACKEND EXPECTS registrationData
      // ------------------------------------------------------

      const formData =
        new FormData();

     formData.append(
  "teamData",
  JSON.stringify(teamData)
      );

      // ------------------------------------------------------
      // LOGO OPTIONAL
      // ------------------------------------------------------

      if (logoFile) {

        /*
          Agar backend teamLogo accept karta hai
          tab ye uncomment kar sakte ho:

          formData.append(
            "teamLogo",
            logoFile
          );
        */

      }

      // ------------------------------------------------------
      // BUTTON
      // ------------------------------------------------------

      if (teamPayBtn) {

        teamPayBtn.disabled = true;

        teamPayBtn.innerText =
          "Saving Team...";

      }

      // ------------------------------------------------------
      // TEAM API
      // ------------------------------------------------------

      try {

        const response =
          await fetch(
            `${API_BASE}/api/team-register`,
            {

              method: "POST",

              body: formData

            }
          );

        console.log(
          "TEAM HTTP STATUS:",
          response.status
        );

        const result =
          await response.json();

        console.log(
          "TEAM API RESPONSE:",
          result
        );

        // ----------------------------------------------------
        // ERROR
        // ----------------------------------------------------

        if (
          !response.ok ||
          !result.success
        ) {

          throw new Error(
            result.message ||
            "Team registration failed"
          );

        }

        // ----------------------------------------------------
        // SAVE LOCAL
        // ----------------------------------------------------

        localStorage.setItem(
          "hitsixTeamRegistration",
          JSON.stringify(teamData)
        );

        // ----------------------------------------------------
        // PAYMENT LINK
        // ----------------------------------------------------

        const paymentLink =
          result?.data?.paymentLink ||
          result?.paymentLink ||
          TEAM_PAYMENT_LINK;

        console.log(
          "TEAM PAYMENT LINK:",
          paymentLink
        );

        if (!paymentLink) {

          alert(
            "Team registration saved successfully! ✅\n\n" +
            "But team payment link is not configured."
          );

          return;
        }

        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        alert(
          "Team registration saved successfully! ✅\n\n" +

          "Players: 8\n" +

          "Amount: ₹2600\n\n" +

          "Opening payment..."
        );

        // ----------------------------------------------------
        // PAYMENT REDIRECT
        // ----------------------------------------------------

        window.location.href =
          paymentLink;

      } catch (error) {

        console.error(
          "TEAM ERROR:",
          error
        );

        alert(
          "Team registration failed ❌\n\n" +
          error.message
        );

      } finally {

        if (teamPayBtn) {

          teamPayBtn.disabled = false;

          teamPayBtn.innerText =
            `Pay & Register Team (₹${TEAM_AMOUNT})`;

        }

      }

    }
  );

}

// ============================================================
// FREE REGISTRATION
// ============================================================

const freeRegLink =
  $("freeRegLink");

const freeRegSection =
  $("freeReg");

const freeForm =
  $("freeForm");

const homeLink =
  $("homeLink");

if (
  freeRegLink &&
  freeRegSection
) {

  freeRegLink.addEventListener(
    "click",
    function () {

      if (mainContent) {
        mainContent.style.display =
          "none";
      }

      if (formSection) {
        formSection.style.display =
          "none";
      }

      freeRegSection.classList.remove(
        "hidden"
      );

      freeRegSection.scrollIntoView({
        behavior: "smooth"
      });

    }
  );

}

// ============================================================
// FREE FORM
// ============================================================

if (freeForm) {

  freeForm.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();

      alert(
        "You have successfully registered for updates! ✅"
      );

    }
  );

}

// ============================================================
// SPONSOR
// ============================================================

const sponsorLink =
  $("sponsorLink");

const sponsorSection =
  $("sponsorReg");

const sponsorForm =
  $("sponsorForm");

if (
  sponsorLink &&
  sponsorSection
) {

  sponsorLink.addEventListener(
    "click",
    function () {

      if (mainContent) {
        mainContent.style.display =
          "none";
      }

      if (formSection) {
        formSection.style.display =
          "none";
      }

      if (freeRegSection) {
        freeRegSection.classList.add(
          "hidden"
        );
      }

      sponsorSection.classList.remove(
        "hidden"
      );

      sponsorSection.scrollIntoView({
        behavior: "smooth"
      });

    }
  );

}

// ============================================================
// SPONSOR FORM
// ============================================================

if (sponsorForm) {

  sponsorForm.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();

      const terms =
        $("termsCheck");

      if (
        !terms ||
        !terms.checked
      ) {

        alert(
          "Please agree to be contacted by HITSIX."
        );

        return;
      }

      alert(
        "Thank you! Your sponsorship request has been submitted. Our team will contact you shortly. ✅"
      );

    }
  );

}

// ============================================================
// HOME BUTTON
// ============================================================

if (homeLink) {

  homeLink.addEventListener(
    "click",
    function () {

      if (mainContent) {
        mainContent.style.display =
          "block";
      }

      if (formSection) {
        formSection.style.display =
          "block";
      }

      if (freeRegSection) {
        freeRegSection.classList.add(
          "hidden"
        );
      }

      if (sponsorSection) {
        sponsorSection.classList.add(
          "hidden"
        );
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );

}

// ============================================================
// BATTLE OF BATTLES CARD
// ============================================================

const battleCard =
  $("battleOfBattlesCard");

if (battleCard) {

  battleCard.style.cursor =
    "pointer";

  battleCard.addEventListener(
    "click",
    function () {

      if (eventSelect) {

        eventSelect.value =
          "battle_of_battles";

        eventSelect.dispatchEvent(
          new Event(
            "change",
            {
              bubbles: true
            }
          )
        );

      }

      if (formSection) {

        formSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }
  );

}

// ============================================================
// TERMS MODAL
// ============================================================

const termsModal =
  $("termsModal");

const termsLink =
  $("termsLink");

const teamTermsLink =
  $("teamTermsLink");

const closeTerms =
  document.querySelector(".close");

function openTerms(e) {

  if (e) {
    e.preventDefault();
  }

  if (termsModal) {
    termsModal.style.display =
      "block";
  }

}

if (termsLink) {

  termsLink.addEventListener(
    "click",
    openTerms
  );

}

if (teamTermsLink) {

  teamTermsLink.addEventListener(
    "click",
    openTerms
  );

}

if (closeTerms) {

  closeTerms.addEventListener(
    "click",
    function () {

      if (termsModal) {

        termsModal.style.display =
          "none";

      }

    }
  );

}

window.addEventListener(
  "click",
  function (e) {

    if (
      termsModal &&
      e.target === termsModal
    ) {

      termsModal.style.display =
        "none";

    }

  }
);

// ============================================================
// HERO SLIDER
// ============================================================

(function () {

  const slides =
    document.querySelectorAll(
      ".hero-slide"
    );

  const dotsWrap =
    $("heroDots");

  if (
    !slides.length ||
    !dotsWrap
  ) {
    return;
  }

  let current = 0;

  let interval = null;

  // ----------------------------------------------------------
  // CREATE DOTS
  // ----------------------------------------------------------

  slides.forEach(
    function (_, index) {

      const dot =
        document.createElement(
          "button"
        );

      dot.type =
        "button";

      dot.className =
        "hero-dot" +
        (
          index === 0
            ? " active"
            : ""
        );

      dot.addEventListener(
        "click",
        function () {

          goToSlide(index);

        }
      );

      dotsWrap.appendChild(
        dot
      );

    }
  );

  const dots =
    dotsWrap.querySelectorAll(
      ".hero-dot"
    );

  // ----------------------------------------------------------
  // GO TO SLIDE
  // ----------------------------------------------------------

  function goToSlide(index) {

    if (slides[current]) {

      slides[current]
        .classList
        .remove("active");

    }

    if (dots[current]) {

      dots[current]
        .classList
        .remove("active");

    }

    current = index;

    if (slides[current]) {

      slides[current]
        .classList
        .add("active");

    }

    if (dots[current]) {

      dots[current]
        .classList
        .add("active");

    }

  }

  // ----------------------------------------------------------
  // NEXT SLIDE
  // ----------------------------------------------------------

  function nextSlide() {

    const next =
      (current + 1) %
      slides.length;

    goToSlide(next);

  }

  // ----------------------------------------------------------
  // AUTO SLIDE
  // ----------------------------------------------------------

  function startAutoSlide() {

    clearInterval(interval);

    interval =
      setInterval(
        nextSlide,
        4000
      );

  }

  startAutoSlide();

  // ----------------------------------------------------------
  // PAUSE ON HOVER
  // ----------------------------------------------------------

  const hero =
    $("heroSlider");

  if (hero) {

    hero.addEventListener(
      "mouseenter",
      function () {

        clearInterval(
          interval
        );

      }
    );

    hero.addEventListener(
      "mouseleave",
      function () {

        startAutoSlide();

      }
    );

  }

})();

// ============================================================
// INITIAL STATE
// ============================================================

if (regForm) {
  regForm.classList.add("hidden");
}

if (teamRegForm) {
  teamRegForm.classList.add("hidden");
}

if (regModeToggle) {
  regModeToggle.classList.add("hidden");
}

if (individualPriceMessage) {
  individualPriceMessage.classList.add("hidden");
}

if (teamPriceMessage) {
  teamPriceMessage.classList.add("hidden");
}

// ============================================================
// SCRIPT LOADED
// ============================================================

console.log(
  "🔥 HITSIX FINAL SCRIPT LOADED"
);

console.log(
  "💰 Individual:",
  INDIVIDUAL_PAYMENT_LINK
);

console.log(
  "💰 Team:",
  TEAM_PAYMENT_LINK
);

console.log(
  "👥 Team size:",
  TEAM_SIZE
);