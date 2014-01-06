# nginx-reload

[![NPM](https://nodei.co/npm/nginx-reload.png)](https://nodei.co/npm/nginx-reload/)

start, stop and reload nginx by monitoring it's PID file

useful for triggering reload of nginx configuration files

based on the monitoring bits of https://github.com/DamonOehlman/ngineer

### run the tests

there are integration tests available, given the following:

- your nginx listens on port 80
- your nginx is configured to store a `pid` file in '/var/run/nginx.pid'

```
npm install
sudo npm test
```
