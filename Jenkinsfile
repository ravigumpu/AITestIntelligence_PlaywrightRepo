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
            -v "${env.WORKSPACE}:/work" \
            -w /work \
            --entrypoint npm \
            mcr.microsoft.com/playwright:v1.59.1-noble \
            ci
          docker run --rm \
            --ipc=host \
            -e CI=true \
            -v "${env.WORKSPACE}:/work" \
            -w /work \
            --entrypoint npm \
            mcr.microsoft.com/playwright:v1.59.1-noble \
            test
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
