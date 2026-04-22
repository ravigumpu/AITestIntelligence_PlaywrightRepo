# Playwright Simple Demo

Basic Playwright test project with Jenkins CI support.

## Local setup

```bash
npm install
npx playwright install
npm test
```

## Jenkins integration

This repo includes a `Jenkinsfile` that runs:

1. `npm ci`
2. `npx playwright install`
3. `npm test` (with `CI=true`)

Playwright is configured to generate:

- Console output via the `list` reporter
- HTML report in `playwright-report/`
- JUnit XML in `test-results/junit.xml`

The Jenkins pipeline publishes:

- **Test results** from `test-results/junit.xml`
- **Artifacts** from `playwright-report/**` and `test-results/**`

## Running from local Dockerized Jenkins

The pipeline runs **`npm ci`**, **`npx playwright install`**, and **`npm test` on the Jenkins agent itself** (same filesystem as the Git checkout).

That avoids bind-mounting the workspace into a nested `docker run`, which often fails when Jenkins runs inside Docker but uses the host Docker socket: the daemon resolves volume paths on the host, so `/var/jenkins_home/workspace/...` may not map to your checkout and `package-lock.json` appears missing.

Use the sample agent image (Node + npm + Docker CLI on top of Jenkins):

```bash
docker build -f jenkins/Dockerfile -t playwright-jenkins .
```

Point your `docker-compose.yml` at **`playwright-jenkins`** instead of plain `jenkins/jenkins` (or replace your `build:` section so it builds `jenkins/Dockerfile`), then recreate the container:

```bash
docker compose up -d --force-recreate
```

Verify Node exists **inside** Jenkins before triggering the job:

```bash
docker compose exec jenkins bash -c 'node -v && npm -v'
```

If you see **`npm: not found`** in the job log but the verify command works, restart Jenkins once after the image change.

Then in Jenkins:

1. Create a **Pipeline** job.
2. Set **Pipeline script from SCM** (Git repo + branch).
3. Keep script path as `Jenkinsfile`.
4. Click **Build Now**.

## Notes for Jenkins agents

- The agent must have **Node.js**, **npm**, and network access for `npx playwright install`.
- If system libraries for browsers are missing on Linux, install Playwright OS deps or use a Playwright base image for the agent.
