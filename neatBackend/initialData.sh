#!/bin/sh

#initialize student group
http POST http://127.0.0.1:8000/api/startGroup/

#create users

users=( "user1@neat.com" "user2@neat.com" "user3@neat.com" )
for i in "${users[@]}"
do
	http POST http://127.0.0.1:8000/api/user/ email=$i password=password123 first_name=John last_name=Smith groups:='[{"name":"student"}]' profile:='{"grade":"12","age":"23","gender":"male"}'
done

#login

TOKEN=$(http POST http://127.0.0.1:8000/api/login/ username=user1@neat.com password=password123)
AUTH="'Authorization: Token ${TOKEN:10:40}'"

#create school, class, & assignment

eval "http POST http://127.0.0.1:8000/api/school/ schoolName=FIU schoolID=123 $AUTH"
eval "http POST http://127.0.0.1:8000/api/class/ className='Discrete Math' classID=MAD3102 school='http://localhost:8000/api/school/1/' $AUTH"
eval "http POST http://127.0.0.1:8000/api/assignment/ assignmentName='HW1' due=2016-11-29 classFK='http://localhost:8000/api/class/1/' $AUTH"

i="0"

#Create a few tasks
while [ $i -lt 7 ]
do
    if ! (($i % 2)); then
        diff="low"
        bool="true"
    else
        diff="high"
        bool="false"
    fi
    eval "http POST http://127.0.0.1:8000/api/task/ assignment='http://localhost:8000/api/assignment/1/' taskName='task$i' isDone=$bool difficulty=$diff $AUTH"
    i=$[$i+1]
done