const fetch = require('node-fetch'); //fetches the server and get a response
const data = require("./data.json") // list of objects with url and priority
var onlineServers = [] // stores the list of online servers
var offlineServers = [] // stores the list of offline servers

// this function pings a server and check for response and store in list accordingly.
async function callServer(obj) {
    try {
        await fetch(obj.url, {
            method: 'GET',
            timeout: 5000
        }).then((response) => {
            if (!response.ok) {
                offlineServers.push(obj)
                console.log("server not available or offline -", obj.url)
            }
            else {
                onlineServers.push(obj)
                console.log("server online -", obj.url)
            }
        });
    }
    catch (error) {
        offlineServers.push({ "url": obj.url, "priority": obj.priority })
        console.log("server not available or offline -", obj.url)
    }
}

// this function mocks all the servers available
async function mockingAll() {
    try {
        await Promise.all(data.map(async (ele) => {
            await callServer(ele)
        }))
        return "all servers mocked"
    }
    catch (error) {
        console.log(error)
    }
}

// this function sorts and return the server with lowest priority
function sortAndSelect(onlineServersList) {
    try {
        return onlineServersList.sort((a, b) => a.priority < b.priority)[0].url
    }
    catch (error) {
        console.log(error)
    }
}

// this is the primary promise with calls for all required functions
const findServer = new Promise((resolve, reject) => {
    mockingAll().then((data) => {
        console.log(data)
        if (onlineServers.length == 0) {
            reject("No server is online")
        }
        else {
            resolve(sortAndSelect(onlineServers))
        }
    })
});

// the function which will be exported and will return just a url
function callingFunction() {
    findServer.then(data => {
        console.log("The online server with lowest priority is ", data)
        return data
    }).catch(data => {
        console.log(data)
    })
}

exports = callingFunction();