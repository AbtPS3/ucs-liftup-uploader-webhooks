const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const GITHUB_SECRET = process.env.GITHUB_SECRET;
const verify_signature = (req) => {
  const signatureHeader = req.get("X-Hub-Signature-256");
  if (!signatureHeader) {
    console.error("Signature header is missing");
    return false; // Signature header is missing
  }

  const [algorithm, signature] = signatureHeader.split("=");
  if (algorithm !== "sha256") {
    console.error("Unsupported algorithm");
    return false; // Unsupported algorithm
  }

  const expectedSignature = crypto
    .createHmac("sha256", GITHUB_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  console.log("Expected Signature", expectedSignature);

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
};

/* GET root page. */
router.get("/", function (req, res, next) {
  res.status(200).json({
    success: true,
    request: req.path,
    payload: "Webhooks root path reached successfully!",
  });
});

// Route for logging text to file!
router.post("/", function (req, res) {
  const message = req.body.message || "No message";
  res.status(201).json({
    success: true,
    request: req.path,
    message: message,
  });
});

// Route to handle GitHub webhook push event for Lift Up Frontend
router.post("/api/v1/webhooks/liftup/frontend", (req, res) => {
  if (!verify_signature(req)) {
    res.status(401).send("Unauthorized");
    return;
  }
  const event = req.get("X-GitHub-Event");
  if (event === "push" && req.body.ref === "refs/heads/main") {
    const runBash = spawn("/bin/bash", ["deploy.sh"], {
      cwd: "../liftup-frontend",
      shell: true,
    });

    let stdoutData = "";
    let stderrData = "";

    runBash.stdout.on("data", (data) => {
      stdoutData += data;
    });

    runBash.stderr.on("data", (data) => {
      stderrData += data;
    });

    runBash.on("error", (err) => {
      console.error("Error during spawn:", err);
      res
        .status(500)
        .json({ success: false, route: req.path, message: "Error during script execution." });
    });

    runBash.on("close", (code) => {
      console.log(`Child process run and exited with code ${code}`);
      console.log("stdout:", stdoutData);
      console.error("stderr:", stderrData);

      res
        .status(200)
        .json({ success: true, route: req.path, message: "Frontend script run successfully." });
    });
  } else {
    res.status(200).json({ success: true, route: req.path, message: "Ignoring non-push event." });
  }
});

// Route to handle GitHub webhook push event for Lift Up Backend
router.post("/api/v1/webhooks/liftup/backend", (req, res) => {
  if (!verify_signature(req)) {
    res.status(401).send("Unauthorized");
    return;
  }
  const event = req.get("X-GitHub-Event");
  if (event === "push" && req.body.ref === "refs/heads/main") {
    const runBash = spawn("/bin/bash", ["deploy.sh"], {
      cwd: "../liftup-backend",
      shell: true,
    });

    let stdoutData = "";
    let stderrData = "";

    runBash.stdout.on("data", (data) => {
      stdoutData += data;
    });

    runBash.stderr.on("data", (data) => {
      stderrData += data;
    });

    runBash.on("error", (err) => {
      console.error("Error during spawn:", err);
      res
        .status(500)
        .json({ success: false, route: req.path, message: "Error during script execution." });
    });

    runBash.on("close", (code) => {
      console.log(`Child process run and exited with code ${code}`);
      console.log("stdout:", stdoutData);
      console.error("stderr:", stderrData);

      res
        .status(200)
        .json({ success: true, route: req.path, message: "Backend script run successfully." });
    });
  } else {
    res.status(200).json({ success: true, route: req.path, message: "Ignoring non-push event." });
  }
});

// Route to handle GitHub webhook push event for Lift Up Webhooks
router.post("/api/v1/webhooks/webhooks/backend", (req, res) => {
  if (!verify_signature(req)) {
    res.status(401).send("Unauthorized");
    return;
  }
  const event = req.get("X-GitHub-Event");
  if (event === "push" && req.body.ref === "refs/heads/main") {
    const runBash = spawn("/bin/bash", ["deploy.sh"], {
      cwd: "./",
      shell: true,
    });

    let stdoutData = "";
    let stderrData = "";

    runBash.stdout.on("data", (data) => {
      stdoutData += data;
    });

    runBash.stderr.on("data", (data) => {
      stderrData += data;
    });

    runBash.on("error", (err) => {
      console.error("Error during spawn:", err);
      res
        .status(500)
        .json({ success: false, route: req.path, message: "Error during script execution." });
    });

    runBash.on("close", (code) => {
      console.log(`Child process run and exited with code ${code}`);
      console.log("stdout:", stdoutData);
      console.error("stderr:", stderrData);

      res
        .status(200)
        .json({ success: true, route: req.path, message: "Webhooks script run successfully." });
    });
  } else {
    res.status(200).json({ success: true, route: req.path, message: "Ignoring non-push event." });
  }
});

module.exports = router;
