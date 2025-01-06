#JENKINS
    #Install HELM FIRST
    helm repo add jenkins https://jenkinsci.github.io/kubernetes-operator
    helm repo update
    helm install jenkins-operator jenkins/jenkins --namespace jenkins --create-namespace
    kubectl exec --namespace jenkins -it svc/jenkins-operator -c jenkins -- /bin/cat /run/secrets/additional/chart-admin-password && echo 
    kubectl port-forward svc/jenkins-operator 8080:8080 --namespace jenkins 

#IN JENKINSFILE

#Add this stage for init DB
stage('Initialize Cassandra') {
            steps {
             sh 'kubectl exec <cassandra-pod-name> -- cqlsh -e "CREATE KEYSPACE IF NOT EXISTS my_keyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};" '
             }
        }