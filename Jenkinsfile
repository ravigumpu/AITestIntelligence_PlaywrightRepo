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

    stage("Run tests in Playwright Docker") {
      environment {
        CI = "true"
      }
      steps {
        sh """
          docker run --rm \
            --ipc=host \
            -e CI=true \
            -v "\$PWD:/work" \
            -w /work \
            mcr.microsoft.com/playwright:v1.59.1-noble \
            /bin/bash -lc "npm ci && npm test"
        """
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
