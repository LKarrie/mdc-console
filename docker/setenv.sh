#! /bin/sh -e

echo "setting environment config"

cat >> /etc/nginx/conf.d/mdc-console.conf <<EOF
 
  map \$http_upgrade \$connection_upgrade{
    default upgrade;
    '' close;
  }

  server {
    listen      80;
    #server_name   \$SERVER_NAME;
    gzip on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    gzip_comp_level 2;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary off;
    gzip_disable "MSIE [1-6]\.";

    proxy_force_ranges on;    
    proxy_set_header Range \$http_range;    
    proxy_set_header If-Range \$http_if_range;    
    proxy_redirect off;    
    proxy_set_header Host \$host;    
    proxy_set_header X-Real-IP \$remote_addr;    
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;    
    proxy_set_header REMOTE-HOST \$remote_addr;   
    proxy_set_header Upgrade \$http_upgrade;    
    proxy_set_header Connection \$connection_upgrade;    
    proxy_http_version 1.1;    
    proxy_read_timeout 600;

    #add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

    #client_max_body_size  \$MAX_FILE_SIZE;
    client_max_body_size  0;

    location = / {
        rewrite ^ \$scheme://\$http_host/mdc/ permanent;
    }

    location /mdc/ {
        root /app/www/;
        index index.html;
    }
    location /mdc/api/ {
        proxy_pass http://api:8080;  
        proxy_connect_timeout 10s;
        proxy_read_timeout  3600s;
        proxy_send_timeout 3600s;    
        send_timeout  3600s;
        proxy_buffering off;    
        client_max_body_size 0;    
        proxy_request_buffering off;    
        proxy_socket_keepalive on;
    }
 }

EOF

echo "starting web server"

nginx -g 'daemon off;'
