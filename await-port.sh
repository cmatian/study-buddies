while ! nc -zv 172.17.0.1 3306
do
  echo sleeping
  sleep 1
done
echo Connected!
