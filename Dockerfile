FROM nginx:1.25.3-alpine

EXPOSE 80

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./docker/setenv.sh /root
RUN chmod +x /root/setenv.sh

RUN mkdir -p /app/www/mdc

COPY ./dist /app/www/mdc

CMD ["/root/setenv.sh"]
