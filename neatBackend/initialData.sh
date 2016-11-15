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

#create school

eval "http POST http://127.0.0.1:8000/api/school/ schoolName=FIU schoolID=123 $AUTH"

#create classes & assignments

i="0"

while [ $i -lt 4 ]
do
    i=$[$i+1]
    
    eval "http POST http://127.0.0.1:8000/api/class/ className='class$i' classID=MAD3102 school='http://localhost:8000/api/school/1/' $AUTH"

    j="0"
    while [ $j -lt 5 ]
    do
        j=$[$j+1]
        eval "http POST http://127.0.0.1:8000/api/assignment/ assignmentName='HW$j' due=2016-11-29 classFK='http://localhost:8000/api/class/$i/' $AUTH"
    done

done

i="0"

#Create a few tasks for assig1
while [ $i -lt 7 ]
do
    if ! (($i % 2)); then
        diff="low"
        bool="true"
    else
        diff="high"
        bool="false"
    fi
    i=$[$i+1]
    eval "http POST http://127.0.0.1:8000/api/task/ assignment='http://localhost:8000/api/assignment/1/' taskName='task$i' isDone=$bool difficulty=$diff $AUTH"
done

#make class1 public
eval "http PATCH http://localhost:8000/api/class/1/ isPublic=true $AUTH"