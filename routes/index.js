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
  res.status(201).json({
    success: true,
    request: req.path,
    message: message,
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
    res.status(403).json({ success: false, request: req.path, message: "Invalid signature." });
  }
};

// Route to handle GitHub webhook push event
router.post("/github-push", verifyGitHubWebhook, (req, res) => {
  const event = req.get("X-GitHub-Event");
  const payload = req.body;

  if (event === "push") {
    const runBash = spawn("/bin/bash", ["deploy.sh"], {
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
      console.log(`Child process run and exited with code ${code}`);
      console.log("stdout:", stdoutData);
      console.error("stderr:", stderrData);
    });
    res.status(200).json({ success: true, route: req.path, message: "Script run successfully." });
  } else {
    res.status(200).json({ success: true, route: req.path, message: "Ignoring non-push event." });
  }
});

module.exports = router;
