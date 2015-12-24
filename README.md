# http-master-issue

## Normal behaviour

Open 3 terms

### Test the minimal server I wrote

In the first term :  
```bash
docker run --rm -it --name test -v $PWD/subserver:/src -p 1337:1337 kallikrein/node-tools nodemon server.js
```  

In another term :  

```
curl --max-time 1 localhost:1337
```

*hello world from server*

On the first term, we can check that the request is received : 'LOG: 0 request received'


### Connect the proxy

localhost resolves to static/index.html, and test.localhost resolves to the server we just tested.

You need to add the following line to your /etc/hosts to route the 'test' subdomain to 127.0.0.1  
```sudo echo "127.0.0.1	test.localhost" >> /etc/hosts```  
127.0.0.1	test.localhost

```
docker run --rm -it --name proxy -v $PWD/conf:/conf -v $PWD/static:/static --link test:test -p 80:80 kallikrein/proxy
```
```
[1] Listening on port: port 80
[1] Start successful
All workers started in 303ms
```

Check that the proxy is working :

The static route

```
curl --max-time 1 localhost
```

*hello world from static*


The subdomain route

```
curl --max-time 1 test.localhost
```

*hello world from server*

On the first term : 'LOG: 1 request received'

## Issue

Now, save http-master.conf, it triggers a reload.
```json
"watchConfig": true
```

On the second term, http-master confirms the reload :
```
Reloading workers due to config change
[1] Reloading config
[1] Listening on port: port 80
[1] Start successful
All workers reloaded, downtime was 10ms
```

Now, let's send a request :

- static content
```
curl --max-time 1 localhost
```
```curl: (28) Operation timed out after 1000 milliseconds with 0 bytes received```

It's not working.

- server content
```
curl --max-time 1 test.localhost
```
```curl: (28) Operation timed out after 1000 milliseconds with 0 bytes received```

Check in the first term, the request is not received.

## Workaround

I can reload the proxy by reloading the docker
```docker restart proxy```