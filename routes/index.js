const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const crypto = require("crypto");

/* GET root page. */
router.get("/", function (req, res, next) {
  res.status(200).json({
    success: true,
    request: req.path,
    payload: "Webhooks root path reached successfully!",
  });
});

// Route for loging text to file!
router.post("/", function (req, res, next) {
  const message = req.body.message || "No message";
  const runBash = spawn("/bin/bash", ["deploy.sh", message], {
    cwd: "../ucs-liftup-uploader-frontend",
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

  runBash.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
    console.log("stdout:", stdoutData);
    console.error("stderr:", stderrData);

    res.status(201).json({
      success: true,
      request: req.path,
      payload: {
        stdout: stdoutData,
        stderr: stderrData,
      },
    });
  });

  runBash.on("error", (err) => {
    console.error("Error spawning child process:", err);
    res.status(500).json({
      success: false,
      request: req.path,
      error: err.message,
    });
  });
});

// Middleware to verify GitHub webhook secret
const verifyGitHubWebhook = (req, res, next) => {
  const githubSecret = process.env.GITHUB_SECRET;
  const signature = req.get("X-Hub-Signature-256");
  const payload = JSON.stringify(req.body);

  if (!githubSecret || !signature) {
    return res.status(403).json({ success: false, message: "Invalid secret or signature." });
  }

  const hmac = crypto.createHmac("sha256", githubSecret);
  const calculatedSignature = "sha256=" + hmac.update(payload).digest("hex");

  if (crypto.timingSafeEqual(Buffer.from(calculatedSignature), Buffer.from(signature))) {
    next(); // Signature is valid
  } else {
    res.status(403).json({ success: false, message: "Invalid signature." });
  }
};

// Route to handle GitHub webhook push event
router.post("/github-push", verifyGitHubWebhook, (req, res) => {
  const event = req.get("X-GitHub-Event");
  const payload = req.body;

  if (event === "push") {
    console.log("GitHub Push Event Payload:", payload);
    res.status(200).json({ success: true, message: "Payload logged successfully." });
  } else {
    res.status(200).json({ success: true, message: "Ignoring non-push event." });
  }
});

module.exports = router;
