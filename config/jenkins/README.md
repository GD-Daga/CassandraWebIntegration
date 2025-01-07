#IN JENKINSFILE
#Add this stage for init DB
stage('Initialize Cassandra') {
            steps {
             sh 'kubectl exec <cassandra-pod-name> -- cqlsh -e "CREATE KEYSPACE IF NOT EXISTS my_keyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};" '
             }
        }


START HERE
#Created new jenkin config yamls. Need to deploy manually instead of helm
minikube start --memory=8192 --cpus=4 --disk-size=40g
  #AFTER APPLY -f YAML FILES
    kubectl exec --namespace jenkins -it svc/jenkins-operator -c jenkins -- /bin/cat /run/secrets/additional/chart-admin-password && echo 
    screen #to put port forward in background process
      kubectl port-forward svc/jenkins-svc 8080:8080 --namespace jenkins 
      #To exit from SCREEN, press Ctrl+A then D
      #To reattach to screen: 
        screen -r

#REFERENCE
https://phoenixnap.com/kb/jenkins-kubernetes