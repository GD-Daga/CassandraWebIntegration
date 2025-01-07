pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
               // git branch: 'dev', url: 'https://github.com/bfelican0/CassandraWebIntegration.git'
               dir('/Users/academy/Desktop/CassandraWebIntegration') {
                    sh 'cp -r . ${WORKSPACE}'
                }
            }
        }
        stage('Build Cassandra') {
            steps {
                sh '''
                cd packages/backend
                docker build -t cassandra-backend:v1 .
                '''
            }
        }
        stage('Build Frontend') {
            steps {
                sh '''
                cd packages/frontend
                docker build -t webapp-frontend:v1 .
                '''
            }
        }
        stage('Push Images to Minikube Docker') {
            steps {
                sh '''
                eval $(minikube docker-env)
                docker push cassandra-backend:v1
                docker push webapp-frontend:v1
                '''
            }
        }
        stage('Deploy Cassandra') {
            steps {
                sh 'kubectl apply -f config/kubernetes/cassandra-deployment.yaml'
            }
        }
        stage('Deploy Frontend') {
            steps {
                sh 'kubectl apply -f k8s-config/web-app-deployment.yaml'
            }
        }
        

    }
}
