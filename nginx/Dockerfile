FROM nginx

ENV GITLAB_HOST git
ENV GITLAB_PORT 80

COPY run_nginx.sh /etc/nginx/run_nginx.sh
RUN chmod +x /etc/nginx/run_nginx.sh

COPY nginx.conf.template /etc/nginx/nginx.conf.template

CMD ./etc/nginx/run_nginx.sh