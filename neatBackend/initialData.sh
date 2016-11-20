#!/bin/sh

SERVER="http://52.87.176.128/api"

#initialize student group
http POST $SERVER/startGroup/

#create users

users=( "user1@neat.com" "user2@neat.com" "user3@neat.com" )
for i in "${users[@]}"
do
	http POST $SERVER/user/ email=$i password=password123 first_name=John last_name=Smith groups:='[{"name":"student"}]' profile:='{"grade":"12","age":"23","gender":"male"}'
done

#login

TOKEN=$(http POST $SERVER/login/ username=user1@neat.com password=password123)
AUTH="'Authorization: Token ${TOKEN:10:40}'"

#create school

eval "http POST $SERVER/school/ name=FIU identifier=123 $AUTH"

#create classes & assignments

i="0"

while [ $i -lt 4 ]
do
    i=$[$i+1]
    
    eval "http POST $SERVER/class/ name='class$i' identifier=MAD3102 school='$SERVER/school/1/' $AUTH"

    j="0"
    while [ $j -lt 5 ]
    do
        j=$[$j+1]
        eval "http POST $SERVER/assignment/ name='HW$j' due=2016-11-29 classFK='$SERVER/class/$i/' $AUTH"
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
    eval "http POST $SERVER/task/ assignment='$SERVER/assignment/1/' name='task$i' isDone=$bool difficulty=$diff $AUTH"
done

#make class1 public
eval "http PATCH $SERVER/class/1/ isPublic=true $AUTH"