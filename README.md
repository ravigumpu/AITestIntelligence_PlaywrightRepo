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

The `Jenkinsfile` is configured to run inside:

- `mcr.microsoft.com/playwright:v1.59.1-noble`

So your Jenkins instance needs:

- Docker Pipeline plugin
- Access to a Docker daemon (commonly by mounting `/var/run/docker.sock` into the Jenkins container)

Then in Jenkins:

1. Create a **Pipeline** job.
2. Set **Pipeline script from SCM** (Git repo + branch).
3. Keep script path as `Jenkinsfile`.
4. Click **Build Now**.

## Notes for Jenkins agents

- Jenkins agent must have Node.js available.
- If your Jenkins nodes do not have the required system libraries for browsers, either:
  - preinstall browser dependencies on the node, or
  - run the pipeline in a Playwright Docker image.
