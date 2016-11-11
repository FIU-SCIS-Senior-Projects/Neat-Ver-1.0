#!/bin/sh

#http POST http://127.0.0.1:8000/api/startGroup/

#create users

#users=( "user1@neat.com" "user2@neat.com" "user3@neat.com" )
#for i in "${users[@]}"
#do
#	http POST http://127.0.0.1:8000/api/user/ email=$i password=password123 first_name=John last_name=Smith groups:='[{"name":"student"}]' profile:='{"grade":"12","age":"23","gender":"male"}'
#
#    TOKEN=$(http POST http://127.0.0.1:8000/api/login/ username=$i password=password123)
#
#    echo "${TOKEN:10:40}"
#done

#create school, class, & assignment

AUTH="Authorization: Token "
TOKEN=$(http POST http://127.0.0.1:8000/api/login/ username=user1@neat.com password=password123)
AUTH+=${TOKEN:10:40}

echo $AUTH

http POST http://127.0.0.1:8000/api/school/ schoolName=FIU schoolID=123 \'$AUTH\'



#CMD="http POST http://127.0.0.1:8000/api/class/ schoolName=LOOOL schoolID=123 "
#CMD+="'Authorization: Token "
#TOKEN=$(http POST http://127.0.0.1:8000/api/login/ username=user1@neat.com password=password123)
#CMD+=${TOKEN:10:40}
#CMD+="'"

#eval $CMD