pipeline {
  agent any

  options {
    timestamps()
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("Run tests") {
      environment {
        CI = "true"
      }
      steps {
        sh "npm ci"
        sh "npx playwright install"
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
