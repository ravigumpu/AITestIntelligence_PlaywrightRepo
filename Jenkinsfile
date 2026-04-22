pipeline {
  agent {
    docker {
      image "mcr.microsoft.com/playwright:v1.59.1-noble"
      args "--ipc=host --user root"
      reuseNode true
    }
  }

  options {
    timestamps()
    ansiColor("xterm")
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("Install dependencies") {
      steps {
        sh "npm ci"
      }
    }

    stage("Run tests") {
      environment {
        CI = "true"
      }
      steps {
        sh "npm test"
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: "test-results/junit.xml"
      archiveArtifacts allowEmptyArchive: true, artifacts: "playwright-report/**,test-results/**"
    }
  }
}
