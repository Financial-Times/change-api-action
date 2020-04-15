"use strict";

const fs = require("fs");
const https = require("https");
const core = require("@actions/core");

async function main() {
  try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.parse(
      fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf-8")
    );

    const systemCode = core.getInput("system-code", { required: true });
    const changeApiKey = core.getInput("change-api-key", { required: true });
    const environment = core.getInput("environment", { required: true });
    const slackChannels = core.getInput("slack-channels");
    const extraProperties = core.getInput("extra-properties");

    const data = {
      user: {
        githubName: payload.sender.login
      },
      systemCode,
      environment,
      gitRepositoryName: payload.repository.full_name,
      changeMadeBySystem: "github",
      commit: payload.head || payload.release.tag_name,
    };

    if (extraProperties) {
      data.extraProperties = extraProperties;
    }

    if (process.env.GITHUB_REF) {
      data.gitReleaseTag = payload.release.tag_name;
    }

    if (slackChannels) {
      data.notifications = {};
      data.notifications.slackChannels = slackChannels.split(',');
    }

    const changeApiPayload = JSON.stringify(data);
    const options = {
      hostname: "api.ft.com",
      port: 443,
      path: "/change-log/v1/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": changeApiPayload.length,
        "x-api-key": changeApiKey
      },
    };

    const req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);

      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    req.on("error", (error) => {
      console.error(error);
      core.setFailed(`Action failed with error ${error}`);
    });

    req.write(changeApiPayload);
    req.end();
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`);
  }
}

main();
