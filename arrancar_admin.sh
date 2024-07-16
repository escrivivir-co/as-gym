
echo "Arrancha el servidor admin: -p 3009"
cd ws-server-ui/ui/dist

open http://localhost:3009
echo "Por url: http://localhost:3000, sin credenciales"

http-server -p 3009 

