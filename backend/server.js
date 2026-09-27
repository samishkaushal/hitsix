// ============================================================
// HITSIX BACKEND SERVER
// Individual + Team + Free Registration + Sponsor
// ============================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const path = require("path");
const fs = require("fs");
const multer = require("multer");

dotenv.config();

// ============================================================
// APP
// ============================================================
const INDIVIDUAL_PAYMENT_LINK = "https://rzp.io/rzp/JKWbcGTn";
const TEAM_PAYMENT_LINK = "https://rzp.io/rzp/rrDJfd4L";

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin: "*"
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// ============================================================
// UPLOAD DIRECTORIES
// ============================================================

const uploadDir = path.join(
  __dirname,
  "uploads",
  "aadhaar"
);

const sponsorLogoDir = path.join(
  __dirname,
  "uploads",
  "sponsors"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}

if (!fs.existsSync(sponsorLogoDir)) {
  fs.mkdirSync(sponsorLogoDir, {
    recursive: true
  });
}

// ============================================================
// STATIC FILES
// ============================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ============================================================
// AADHAAR STORAGE
// ============================================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ext;

    cb(null, uniqueName);
  }
});

// ============================================================
// AADHAAR UPLOAD
// ============================================================

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: function (req, file, cb) {
    const allowed = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png"
    ];

    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF, JPG, JPEG and PNG files are allowed."
        )
      );
    }
  }
});

// ============================================================
// SPONSOR STORAGE
// ============================================================

const sponsorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, sponsorLogoDir);
  },

  filename: function (req, file, cb) {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ext;

    cb(null, uniqueName);
  }
});

// ============================================================
// SPONSOR UPLOAD
// ============================================================

const sponsorUpload = multer({
  storage: sponsorStorage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: function (req, file, cb) {
    const allowed = [
      ".png",
      ".jpg",
      ".jpeg"
    ];

    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Company logo must be PNG, JPG or JPEG."
        )
      );
    }
  }
});

// ============================================================
// MONGODB
// ============================================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(function () {
    console.log(
      "MongoDB Connected Successfully ✅"
    );
  })
  .catch(function (error) {
    console.error(
      "MongoDB Connection Failed ❌"
    );

    console.error(error.message);
  });

// ============================================================
// INDIVIDUAL SCHEMA
// ============================================================

const registrationSchema =
  new mongoose.Schema(
    {
      event: {
        type: String,
        default: "battle_of_battles"
      },

      registrationType: {
        type: String,

        enum: [
          "individual",
          "team"
        ],

        default: "individual"
      },

      name: {
        type: String,
        required: true,
        trim: true
      },

      phone: {
        type: String,
        required: true,
        trim: true
      },

      alternatePhone: {
        type: String,
        default: "",
        trim: true
      },

      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
      },

      age: {
        type: Number,
        required: true,
        min: 12
      },

      location: {
        type: String,
        required: true,
        trim: true
      },

      profession: {
        type: String,
        default: ""
      },

      foodPreference: {
        type: String,

        enum: [
          "Veg",
          "Non-Veg"
        ],

        default: "Veg"
      },

      experience: {
        type: String,
        required: true
      },

      captain: {
        type: String,
        default: ""
      },

      captainDetails: {
        reason: {
          type: String,
          default: ""
        },

        previousExperience: {
          type: String,
          default: ""
        },

        motivation: {
          type: String,
          default: ""
        },

        priority: {
          type: String,
          default: ""
        },

        thoughts: {
          type: String,
          default: ""
        }
      },

      aadhaarFileName: {
        type: String,
        default: ""
      },

      aadhaarFileUrl: {
        type: String,
        default: ""
      },

      amount: {
        type: Number,
        default: 500
      },

      paymentStatus: {
        type: String,

        enum: [
          "pending",
          "paid",
          "failed"
        ],

        default: "pending"
      }
    },

    {
      timestamps: true
    }
  );

const Registration =
  mongoose.model(
    "Registration",
    registrationSchema
  );

// ============================================================
// TEAM SCHEMA
// EXACTLY 8 PLAYERS
// ============================================================

const teamRegistrationSchema =
  new mongoose.Schema(
    {
      event: {
        type: String,
        default: "battle_of_battles"
      },

      registrationType: {
        type: String,
        default: "team"
      },

      teamName: {
        type: String,
        required: true,
        trim: true
      },

      location: {
        type: String,
        required: true,
        trim: true
      },

      captain: {
        type: String,
        required: true,
        trim: true
      },

      captainPhone: {
        type: String,
        default: ""
      },

      alternatePhone: {
        type: String,
        default: ""
      },

      playerCount: {
        type: Number,

        required: true,

        // EXACTLY 8
        min: 8,
        max: 8
      },

      amount: {
        type: Number,

        required: true,

        default: 2600
      },

      paymentStatus: {
        type: String,

        enum: [
          "pending",
          "paid",
          "failed"
        ],

        default: "pending"
      },

      captainDetails: {
        leadershipExperience: {
          type: String,
          default: ""
        },

        captainPreference: {
          type: String,
          default: ""
        },

        captainApproach: {
          type: String,
          default: ""
        },

        captainThoughts: {
          type: String,
          default: ""
        }
      },

      players: [
        {
          playerNumber: Number,

          name: {
            type: String,
            required: true
          },

          phone: {
            type: String,
            default: ""
          },

          age: {
            type: Number,
            default: null
          },

          experience: {
            type: String,
            default: ""
          },

          foodPreference: {
            type: String,
            default: ""
          },

          aadhaarFileName: {
            type: String,
            default: ""
          },

          aadhaarFileUrl: {
            type: String,
            default: ""
          }
        }
      ]
    },

    {
      timestamps: true
    }
  );

const TeamRegistration =
  mongoose.model(
    "TeamRegistration",
    teamRegistrationSchema
  );

// ============================================================
// FREE REGISTRATION SCHEMA
// ============================================================

const freeRegistrationSchema =
  new mongoose.Schema(
    {
      registrationType: {
        type: String,
        default: "free"
      },

      name: {
        type: String,
        required: true,
        trim: true
      },

      phone: {
        type: String,
        required: true,
        trim: true
      },

      age: {
        type: Number,
        required: true,
        min: 12
      },

      experience: {
        type: String,
        required: true
      },

      profession: {
        type: String,
        default: "",
        trim: true
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      }
    },

    {
      timestamps: true
    }
  );

const FreeRegistration =
  mongoose.model(
    "FreeRegistration",
    freeRegistrationSchema
  );

// ============================================================
// SPONSOR SCHEMA
// ============================================================

const sponsorSchema =
  new mongoose.Schema(
    {
      registrationType: {
        type: String,
        default: "sponsor"
      },

      companyName: {
        type: String,
        required: true,
        trim: true
      },

      contactPerson: {
        type: String,
        required: true,
        trim: true
      },

      mobile: {
        type: String,
        required: true,
        trim: true
      },

      alternatePhone: {
        type: String,
        default: "",
        trim: true
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      },

      address: {
        type: String,
        required: true,
        trim: true
      },

      sponsorshipType: {
        type: String,
        required: true
      },

      sponsorshipPackage: {
        type: String,
        default: ""
      },

      logoFileName: {
        type: String,
        default: ""
      },

      logoFileUrl: {
        type: String,
        default: ""
      },

      message: {
        type: String,
        default: ""
      },

      status: {
        type: String,

        enum: [
          "new",
          "contacted",
          "closed"
        ],

        default: "new"
      }
    },

    {
      timestamps: true
    }
  );

const Sponsor =
  mongoose.model(
    "Sponsor",
    sponsorSchema
  );

// ============================================================
// HOME
// ============================================================

app.get(
  "/",
  function (req, res) {

    res.status(200).json({
      success: true,

      message:
        "HITSIX Backend is running 🚀"
    });

  }
);

// ============================================================
// INDIVIDUAL REGISTRATION
// ============================================================

app.post(
  "/api/register",

  // Aadhaar optional
  upload.single("aadhaarFile"),

  async function (req, res) {

    let uploadedFilePath = null;

    try {

      // --------------------------------------------------------
      // SUPPORT BOTH JSON AND registrationData
      // --------------------------------------------------------

      let data;

      if (req.body.registrationData) {

        try {

          data =
            JSON.parse(
              req.body.registrationData
            );

        } catch (error) {

          return res.status(400).json({

            success: false,

            message:
              "Invalid registration data."

          });

        }

      } else {

        // Normal JSON body
        data = req.body;

      }

      console.log(
        "INDIVIDUAL DATA:",
        data
      );

      // --------------------------------------------------------
      // REQUIRED FIELDS
      // --------------------------------------------------------

      if (
        !data.name ||
        !data.phone ||
        !data.email ||
        !data.age ||
        !data.location ||
        !data.experience
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please provide all required fields."

        });

      }

      // --------------------------------------------------------
      // AGE
      // --------------------------------------------------------

      if (Number(data.age) < 12) {

        return res.status(400).json({

          success: false,

          message:
            "Minimum age is 12 years."

        });

      }

      // --------------------------------------------------------
      // OPTIONAL AADHAAR
      // --------------------------------------------------------

      const aadhaarFile =
        req.file || null;

      if (aadhaarFile) {

        uploadedFilePath =
          aadhaarFile.path;

      }

      // --------------------------------------------------------
      // CREATE REGISTRATION
      // --------------------------------------------------------

      const registration =
        await Registration.create({

          event:
            data.event ||
            "battle_of_battles",

          registrationType:
            "individual",

          name:
            data.name,

          phone:
            data.phone,

          alternatePhone:
            data.alternatePhone ||
            "",

          email:
            String(data.email)
              .toLowerCase(),

          age:
            Number(data.age),

          location:
            data.location,

          profession:
            data.profession ||
            "",

          foodPreference:
            data.foodPreference ||
            "Veg",

          experience:
            data.experience,

          captain:
            data.captain ||
            "",

          captainDetails:
            data.captainDetails ||
            {},

          aadhaarFileName:
            aadhaarFile
              ? aadhaarFile.originalname
              : "",

          aadhaarFileUrl:
            aadhaarFile
              ? `/uploads/aadhaar/${aadhaarFile.filename}`
              : "",

          amount:
            500,

          paymentStatus:
            "pending"

        });

      // --------------------------------------------------------
      // RESPONSE
      // --------------------------------------------------------

    return res.status(201).json({
  success: true,
  message: "Registration saved successfully 🎉",
  paymentLink: INDIVIDUAL_PAYMENT_LINK,
  data: {
    id: registration._id,
    name: registration.name,
    email: registration.email,
    amount: 500,
    paymentStatus: registration.paymentStatus,
    paymentLink: INDIVIDUAL_PAYMENT_LINK
  }
});

    } catch (error) {

      console.error(
        "INDIVIDUAL ERROR:",
        error
      );

      // Remove uploaded file if DB failed
      if (
        uploadedFilePath &&
        fs.existsSync(uploadedFilePath)
      ) {

        try {

          fs.unlinkSync(
            uploadedFilePath
          );

        } catch (cleanupError) {

          console.error(
            cleanupError
          );

        }

      }

      if (error.code === 11000) {

        return res.status(400).json({

          success: false,

          message:
            "This email is already registered."

        });

      }

      return res.status(500).json({

        success: false,

        message:
          "Registration failed.",

        error:
          error.message

      });

    }

  }
);

// ============================================================
// TEAM REGISTRATION
// EXACTLY 8 PLAYERS
// Aadhaar NOT REQUIRED
// ============================================================

app.post(
  "/api/team-register",

  // Aadhaar upload is optional.
  // Max 8 files if ever used.
  upload.array(
    "aadhaarFiles",
    8
  ),

  async function (req, res) {

    try {

      console.log(
        "TEAM BODY:",
        req.body
      );

      // --------------------------------------------------------
      // TEAM DATA
      // --------------------------------------------------------

      if (!req.body.teamData) {

        return res.status(400).json({

          success: false,

          message:
            "Team data is missing."

        });

      }

      let teamData;

      try {

        teamData =
          JSON.parse(
            req.body.teamData
          );

      } catch (error) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid team data."

        });

      }

      console.log(
        "TEAM DATA PARSED:",
        teamData
      );

      // --------------------------------------------------------
      // PLAYERS ARRAY
      // --------------------------------------------------------

      if (
        !Array.isArray(
          teamData.players
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Player details are missing."

        });

      }

      // --------------------------------------------------------
      // EXACTLY 8 PLAYERS
      // --------------------------------------------------------

      if (
        teamData.players.length !== 8
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Team must have exactly 8 players."

        });

      }

      // --------------------------------------------------------
      // TEAM DETAILS
      // --------------------------------------------------------

      if (
        !teamData.teamName ||
        !teamData.location ||
        !teamData.captain
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Team name, location and captain are required."

        });

      }

      // --------------------------------------------------------
      // PLAYER DATA
      // --------------------------------------------------------

      const players =
        teamData.players.map(
          function (player, index) {

            return {

              playerNumber:
                index + 1,

              name:
                String(
                  player.name || ""
                ).trim(),

              phone:
                player.phone || "",

              age:
                player.age
                  ? Number(player.age)
                  : null,

              experience:
                player.experience ||
                "",

              foodPreference:
                player.foodPreference ||
                "",

              // Aadhaar optional
              aadhaarFileName:
                "",

              aadhaarFileUrl:
                ""

            };

          }
        );

      // --------------------------------------------------------
      // CHECK EVERY PLAYER NAME
      // --------------------------------------------------------

      for (
        let i = 0;
        i < players.length;
        i++
      ) {

        if (!players[i].name) {

          return res.status(400).json({

            success: false,

            message:
              `Player ${i + 1} name is required.`

          });

        }

      }

      // --------------------------------------------------------
      // PLAYER COUNT
      // --------------------------------------------------------

      const playerCount =
        Number(
          teamData.playerCount ||
          players.length
        );

      if (playerCount !== 8) {

        return res.status(400).json({

          success: false,

          message:
            "Team must contain exactly 8 players."

        });

      }

      if (
        players.length !== 8
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Team must contain exactly 8 players."

        });

      }

      // --------------------------------------------------------
      // FIXED TEAM AMOUNT
      // --------------------------------------------------------

      const amount = 2600;

      // --------------------------------------------------------
      // CREATE TEAM
      // --------------------------------------------------------

      const team =
        await TeamRegistration.create({

          event:
            teamData.event ||
            "battle_of_battles",

          registrationType:
            "team",

          teamName:
            teamData.teamName,

          location:
            teamData.location,

          captain:
            teamData.captain,

          captainPhone:
            teamData.captainPhone ||
            "",

          alternatePhone:
            teamData.alternatePhone ||
            "",

          playerCount:
            8,

          amount:
            amount,

          paymentStatus:
            "pending",

          captainDetails:
            teamData.captainDetails ||
            {},

          players:
            players

        });

      // --------------------------------------------------------
      // RESPONSE
      // --------------------------------------------------------

      return res.status(201).json({

        success: true,

        message:
          "Team registration saved successfully 🎉",

        data: {

          id:
            team._id,

          teamName:
            team.teamName,

          playerCount:
            team.playerCount,

          amount:
            team.amount,

          paymentStatus:
            team.paymentStatus,

          players:
            team.players

        }

      });

    } catch (error) {

      console.error(
        "TEAM ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Team registration failed.",

        error:
          error.message

      });

    }

  }
);

// ============================================================
// FREE REGISTRATION
// ============================================================

app.post(
  "/api/free-register",

  async function (req, res) {

    try {

      const {
        name,
        phone,
        age,
        experience,
        profession,
        email
      } = req.body;

      if (
        !name ||
        !phone ||
        !age ||
        !experience ||
        !email
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all required fields."

        });

      }

      const existing =
        await FreeRegistration.findOne({
          email:
            String(email).toLowerCase()
        });

      if (existing) {

        return res.status(400).json({

          success: false,

          message:
            "This email is already registered for free registration."

        });

      }

      const registration =
        await FreeRegistration.create({

          registrationType:
            "free",

          name:
            name,

          phone:
            phone,

          age:
            Number(age),

          experience:
            experience,

          profession:
            profession || "",

          email:
            String(email).toLowerCase()

        });

      return res.status(201).json({

        success: true,

        message:
          "Free registration saved successfully 🎉",

        data: {

          id:
            registration._id,

          name:
            registration.name,

          email:
            registration.email,

          registrationType:
            "free"

        }

      });

    } catch (error) {

      console.error(
        "FREE REGISTRATION ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Free registration failed.",

        error:
          error.message

      });

    }

  }
);

// ============================================================
// SPONSOR REGISTRATION
// ============================================================

app.post(
  "/api/sponsor-register",

  sponsorUpload.single(
    "companyLogo"
  ),

  async function (req, res) {

    let uploadedLogo = null;

    try {

      const {
        companyName,
        contactPerson,
        mobile,
        alternatePhone,
        email,
        address,
        sponsorshipType,
        sponsorshipPackage,
        message
      } = req.body;

      if (
        !companyName ||
        !contactPerson ||
        !mobile ||
        !email ||
        !address ||
        !sponsorshipType
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all required sponsorship fields."

        });

      }

      if (req.file) {

        uploadedLogo =
          req.file.path;

      }

      const sponsor =
        await Sponsor.create({

          registrationType:
            "sponsor",

          companyName:
            companyName,

          contactPerson:
            contactPerson,

          mobile:
            mobile,

          alternatePhone:
            alternatePhone || "",

          email:
            String(email).toLowerCase(),

          address:
            address,

          sponsorshipType:
            sponsorshipType,

          sponsorshipPackage:
            sponsorshipPackage || "",

          logoFileName:
            req.file
              ? req.file.originalname
              : "",

          logoFileUrl:
            req.file
              ? `/uploads/sponsors/${req.file.filename}`
              : "",

          message:
            message || "",

          status:
            "new"

        });

      return res.status(201).json({

        success: true,

        message:
          "Sponsorship request saved successfully 🎉",

        data: {

          id:
            sponsor._id,

          companyName:
            sponsor.companyName,

          email:
            sponsor.email,

          registrationType:
            "sponsor",

          status:
            sponsor.status

        }

      });

    } catch (error) {

      console.error(
        "SPONSOR ERROR:",
        error
      );

      if (
        uploadedLogo &&
        fs.existsSync(uploadedLogo)
      ) {

        try {

          fs.unlinkSync(
            uploadedLogo
          );

        } catch (cleanupError) {

          console.error(
            cleanupError
          );

        }

      }

      return res.status(500).json({

        success: false,

        message:
          "Sponsorship request failed.",

        error:
          error.message

      });

    }

  }
);

// ============================================================
// GET ALL REGISTRATIONS
// ============================================================

app.get(
  "/api/registrations",

  async function (req, res) {

    try {

      const individual =
        await Registration
          .find()
          .sort({
            createdAt: -1
          })
          .lean();

      const teams =
        await TeamRegistration
          .find()
          .sort({
            createdAt: -1
          })
          .lean();

      const free =
        await FreeRegistration
          .find()
          .sort({
            createdAt: -1
          })
          .lean();

      const sponsors =
        await Sponsor
          .find()
          .sort({
            createdAt: -1
          })
          .lean();

      // --------------------------------------------------------
      // INDIVIDUAL
      // --------------------------------------------------------

      const individualData =
        individual.map(
          function (item) {

            return {

              ...item,

              registrationType:
                "individual",

              displayName:
                item.name,

              name:
                item.name,

              amount:
                500,

              paymentStatus:
                item.paymentStatus ||
                "pending"

            };

          }
        );

      // --------------------------------------------------------
      // TEAM
      // --------------------------------------------------------

      const teamData =
        teams.map(
          function (item) {

            return {

              ...item,

              registrationType:
                "team",

              displayName:
                item.teamName,

              name:
                item.teamName,

              amount:
                2600,

              paymentStatus:
                item.paymentStatus ||
                "pending"

            };

          }
        );

      // --------------------------------------------------------
      // FREE
      // --------------------------------------------------------

      const freeData =
        free.map(
          function (item) {

            return {

              ...item,

              registrationType:
                "free",

              displayName:
                item.name,

              name:
                item.name,

              amount:
                0,

              paymentStatus:
                "free"

            };

          }
        );

      // --------------------------------------------------------
      // SPONSOR
      // --------------------------------------------------------

      const sponsorData =
        sponsors.map(
          function (item) {

            return {

              ...item,

              registrationType:
                "sponsor",

              displayName:
                item.companyName,

              name:
                item.companyName,

              amount:
                item.sponsorshipPackage,

              paymentStatus:
                item.status

            };

          }
        );

      // --------------------------------------------------------
      // COMBINE
      // --------------------------------------------------------

      const allRegistrations = [

        ...individualData,

        ...teamData,

        ...freeData,

        ...sponsorData

      ];

      // --------------------------------------------------------
      // NEWEST FIRST
      // --------------------------------------------------------

      allRegistrations.sort(
        function (a, b) {

          return (
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
          );

        }
      );

      return res.json({

        success: true,

        count:
          allRegistrations.length,

        data:
          allRegistrations

      });

    } catch (error) {

      console.error(
        "FETCH REGISTRATIONS ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to fetch registrations",

        error:
          error.message

      });

    }

  }
);

// ============================================================
// ERROR HANDLER
// ============================================================

app.use(
  function (
    error,
    req,
    res,
    next
  ) {

    console.error(
      "SERVER ERROR ❌",
      error
    );

    if (
      error instanceof
      multer.MulterError
    ) {

      return res.status(400).json({

        success: false,

        message:
          "File upload error: " +
          error.message

      });

    }

    if (
      error?.message?.includes(
        "Only PDF, JPG, JPEG and PNG"
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          error.message

      });

    }

    if (
      error?.message?.includes(
        "Company logo must be"
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          error.message

      });

    }

    if (
      error?.code ===
      "LIMIT_FILE_SIZE"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "File size must be less than 5 MB."

      });

    }

    return res.status(500).json({

      success: false,

      message:
        error?.message ||
        "Internal server error"

    });

  }
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  "0.0.0.0",
  function () {

    console.log(
      `HITSIX Backend running on port ${PORT}`
    );

  }
);