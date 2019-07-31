var pendingRequest = [];
window.addEventListener('message', function (e) {
    var messageData = JSON.parse(e.data) || {};
    if (typeof messageData.response === 'string') {
        switch (messageData.response) {
            case "accessToken":
                for (let i = 0; i < pendingRequest.length; i++) {
                    pendingRequest[i].resolve(messageData.data);
                }
                pendingRequest = [];
        }
    }
});


export function getOAuthToken() {
    return new Promise((resolve, reject) => {
        pendingRequest[pendingRequest.length] = { resolve: resolve, reject: reject };
        window.parent.postMessage(JSON.stringify({ get: 'accessToken' }), '*');
    })
}
