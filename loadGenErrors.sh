while true
do
  curl -s "http://localhost?statusCode=500"
  echo "-----------------"
  sleep 5s
done
