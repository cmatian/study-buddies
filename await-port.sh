i=0
while ! nc -zv localhost 3306
do
  echo sleeping
  sleep 1
  i=$((i+1))
  if [ "$i" -ge "10" ]
  then
    echo "Didn't connect after 10 seconds."
    exit 1
  fi
done
echo Connected!
