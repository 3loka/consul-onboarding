# Description

In this repo, we will learn how to use Consul for Service disovery and use it as a catalog of Services.

## Structure
WE have 3 services UI, Backend and Thirdparty

UI ->Backend->thirdparty

For each service, we have a corresponding json under `consul.d` folder . The name of the folder could be anything.
The service definition json has the service name and the port in which its running


## Steps to execute

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

### Step 3 - Integrate the Consul DNS with host DNS
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






