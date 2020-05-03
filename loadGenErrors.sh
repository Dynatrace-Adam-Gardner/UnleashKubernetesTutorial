while true
do
  curl -s "$1?statusCode=500"
  sleep 5s
done
