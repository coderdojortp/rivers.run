//Name of cache to use
const cachename = "rivers.run"


//NOT YET IMPLEMENTED

//Caches that should not be cleared. Note that cachename is automatically added
const keepcaches = []

//Prefix that will be added to cachename.
//Caches without this prefix will not be modified
const prefix = ""

//Array of URL's that should be preloaded IF POSSIBLE (will continue if not preloaded)
const preloadurls = []

//END OF NOT YET IMPLEMENTED

//Milliseconds to wait for network response before using cache
const waitperiod = 1600




self.addEventListener("fetch", fetchevent)
self.addEventListener("activate", activateevent)

function fetchevent(event) {
    event.respondWith(
        (async function(){
            
            let fromnetwork = fetch(event.request)
            let cache = await caches.open(cachename)
            let fromcache = await caches.match(event.request, {
                ignoreSearch: true //Ignore query parameters
            })
            
            
            if (!fromcache) {
                //No cache. All we can do is return network response
                let response = await fromnetwork
                cache.put(event.request, response.clone())
                return response
            }
            else if (naviagtor.onLine === false) {
                //Looks like we are offline and should reply with cached data now
                console.log("Offline. Using cached data")
                return fromcache    
            }
            else {
                //Looks like we have an internet connection and cached data
                
                return new Promise(function(resolve, reject){
                    
                    //Fetch from network and update cache
                    fromnetwork.then(function(response){
                        cache.put(event.request, response.clone())
                        resolve(response)
                    })
                    
                    //If the network doesn't respond quickly enough, use cached data
                    setTimeout(function(){
                        resolve(fromcache)
                    }, waitperiod)
                    
                })
                
            }
            
        }())
    )
}


function activateevent() {
    
    

}

