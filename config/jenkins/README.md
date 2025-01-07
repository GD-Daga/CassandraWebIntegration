
#Created new jenkin config yamls. Need to deploy manually instead of helm
minikube start --memory=8192 --cpus=4 --disk-size=40g
kubectl apply -f config/jenkins/jenkins-sa.yaml
kubectl apply -f config/jenkins/jenkins-pvc.yaml
kubectl apply -f config/jenkins/jenkins.yaml
kubectl apply -f config/jenkins/jenkins-svc.yaml

  #AFTER APPLY -f YAML FILES
    kubectl exec --namespace jenkins -it svc/jenkins-svc -c jenkins -- /bin/cat //var/jenkins_home/secrets/initialAdminPassword && echo 
    screen #to put port forward in background process
      kubectl port-forward svc/jenkins-svc 8080:8080 --namespace jenkins 
      #To exit from SCREEN, press Ctrl+A then D
      #To reattach to screen: 
        screen -r

#NOTES
-PV in PVC currently written for minikube in mind
-IMG used is jenkins/jenkins:lts
-screen -wipe #remove dead screen sessions
-pkill screen # kill all screen processes

#REFERENCE
https://phoenixnap.com/kb/jenkins-kubernetes


#IN JENKINSFILE
#Add this stage for init DB
stage('Initialize Cassandra') {
            steps {
             sh 'kubectl exec <cassandra-pod-name> -- cqlsh -e "CREATE KEYSPACE IF NOT EXISTS my_keyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};" '
             }
        }