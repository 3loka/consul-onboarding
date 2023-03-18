# Description

In this repo, we will learn how to use Consul for Service disovery and use it as a catalog of Services.

## Structure
WE have 3 services UI, Backend and Thirdparty

UI ->Backend->thirdparty

For each service, we have a corresponding json under `consul.d` folder . The name of the folder could be anything.
The service definition json has the service name and the port in which its running


## Steps to execute (New steps start from 4)

## Prerequisite 
- Install consul, npm
- Read a little about node.js. It will be better to understand the service code. 

### Step 1 - Build the application and start it
`npm install axios`
`node ui.js &;node backend.js&;node thirdparty.js&;`
**Check** if the UI is running by doing `curl http://127.0.0.1:3000/ui`

### Step 2 - Run Consul Agent and register the services (by passing the folder containing all ) 
`consul agent -dev -ui -datacenter dc1 -node host1 -config-dir ./consul.d/`
**Check** the consul UI, you should see all the services - URL - http://127.0.0.1:8500/ui

### Step 3 - Integrate the Consul DNS with host DNS (Do this only once)
sudo mkdir /etc/resolver
sudo touch /etc/resolver/consul
Put these values into that `/etc/resolver/consul`
```
domain consul
nameserver localhost
nameserver 127.0.0.1
port 8600
```
**Check** if the DNS resolution is happening by doing `curl http://ui.service.consul:3000`

## Step 4 - Configure Side car proxy
Added connect side car configuration in service definition jsons with the right downstreams
Now start the service proxies and deploy a side car for each of the services
```
consul connect proxy -sidecar-for ui &
consul connect proxy -sidecar-for backend &
consul connect proxy -sidecar-for thirdparty &
```

You should see something like this for each command
```
➜  02-service-mesh consul connect proxy -sidecar-for ui &
[5] 20736
➜  02-service-mesh ==> Consul Connect proxy starting...
    Configuration mode: Agent API
        Sidecar for ID: ui
              Proxy ID: ui-sidecar-proxy

==> Log data will now stream in as it occurs:

    2023-03-18T15:21:46.543+0530 [INFO]  proxy: Starting listener: listener=127.0.0.1:4001->service:default/backend bind_addr=127.0.0.1:4001
    2023-03-18T15:21:46.570+0530 [INFO]  proxy: Proxy loaded config and ready to serve
    2023-03-18T15:21:46.571+0530 [INFO]  proxy: Parsed TLS identity: uri=spiffe://0a8368d6-2d5c-12d7-0d97-33942136db53.consul/ns/default/dc/dc1/svc/ui roots=[pri-jjlym0o.consul.ca.0a8368d6.consul]
    2023-03-18T15:21:46.571+0530 [INFO]  proxy: Starting listener: listener="public listener" bind_addr=0.0.0.0:21002
```
**Check** Go to Consul UI and now you can see the sidecar proxies along with the services (Agains the service, you will see this `in service mesh with proxy`)

## Step 5 - Route the traffic through proxies
`killall node`
Changed the ports to corresponding proxy port and start the nodejs services again
**Check** `curl http://ui.service.consul:3000`

## Step 6 - Play with Intentions
Execute the below commands to check if ui to backend is allowed and backend to thirdparty is "Allowed"
```
consul intention check ui backend
consul intention check backend thirdparty
```



### Cleanup
Shut down the node.js services 
`killall node`

Exit consul agent. `CTLRL+C` on the terminal running the consul agent

## Good Utility commands

Check how consul resolves the endpoint (this is for UI can be repeated for other services)
`dig @127.0.0.1 -p 8600 ui.service.consul SRV`
**Check** the ANSWER section to see the resolved host name

Check out the catalog (this is for UI, can be repeated for other services)
`curl http://localhost:8500/v1/catalog/service/ui`

If you want to restart all the node services, execute this 
`killall node`





