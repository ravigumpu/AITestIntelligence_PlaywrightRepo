# Jenkins controller/agent image for this project: Node + npm + Docker CLI + browsers via Playwright install.
# Build from repo root: docker build -f jenkins/Dockerfile -t my-jenkins .

FROM jenkins/jenkins:lts-jdk17

ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

USER root

RUN apt-get update \
  && apt-get install -y --no-install-recommends docker-cli nodejs npm \
  && rm -rf /var/lib/apt/lists/*

USER jenkins
