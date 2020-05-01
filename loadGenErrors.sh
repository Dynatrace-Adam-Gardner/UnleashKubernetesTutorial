while true
do
  curl -s "http://localhost?statusCode=500" > /dev/null
  sleep 5s
done
