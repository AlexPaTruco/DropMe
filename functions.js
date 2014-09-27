/*--------------------------- CAMERA FUNCTIONS -------------------------------*/

// Called when capture operation is finished
//
function captureSuccess(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile(mediaFiles[i]);
    }
}

// Called if something bad happens.
// 
function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Uh oh!');
}

// A button will call this function
//
function captureImage() {
    // Launch device camera application, 
    // allowing user to capture up to 2 images
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
}

// Upload files to server
function uploadFile(mediaFile) {
    var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = name;
    
    var email = getParameterByName("email");

    ft.upload(path,
            "http://dropme.projectace.net/upload.php",
            function(result) {
                if (isNaN(result.response)) {
                    alert(result.response);
                } else {
                    alert("Success!");
                    $.ajax({
                        type: 'POST',
                        url: 'http://dropme.projectace.net/upload.php', // Servlet URL           
                        data: {
							userid: "1",
                            description: "hello",
                            longitude: "1.0",
							latitude: "1.0"
							},
                        success: function(data) {
                        },
                        error: function(xhr, type) {
                            alert('server error occurred');
                        }
                    });
                }
                alert('Upload success: ' + result.responseCode);
                alert(result.bytesSent + ' bytes sent');


            },
            function(error) {
                alert('Error uploading file ' + path + ': ' + error.code);
            },
            options);
}
/*------------------------- END OF CAMERA FUNCTIONS --------------------------*/

/*------------------------------- GPS FUNCTIONS ------------------------------*/

// Wait for PhoneGap to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() {
    //var options = {timeout: 31000, enableHighAccuracy: true, maximumAge: 90000};
    //navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}

// onSuccess Geolocation
//
function onSuccess(position) {
    var element = document.getElementById('geolocation');
    element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
            'Longitude: ' + position.coords.longitude + '<br />' +
            'Altitude: ' + position.coords.altitude + '<br />' +
            'Accuracy: ' + position.coords.accuracy + '<br />' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
            'Heading: ' + position.coords.heading + '<br />' +
            'Speed: ' + position.coords.speed + '<br />' +
            'Timestamp: ' + new Date(position.timestamp) + '<br />';
}

// onError Callback receives a PositionError object
//
function onError(error) {
    if (error.code === 2) {
        alert('Please turn on your GPS!');
    } else {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }
}

/*---------------------------- END OF GPS FUNCTIONS --------------------------*/

function login() {
    $.support.cors = true;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    $("#loader").fadeIn();
    $("#login").hide();

    $.ajax({
        type: 'GET',
        url: 'http://dropme.tokenspot.com/login.php', // Servlet URL           
        data: {
            email: email,
            password: password
        },
        success: function(data) {
            if ("1" === data) {
                window.location = "home.html?email=" + email;
            } else {
                $("#errors").html(data);
                $("#loader").hide();
                $("#login").show();
            }
        },
        error: function(xhr, type) {
            alert('server error occurred');
        }
    });
}
function logout() {
    window.location = "index.html";
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getProfile() {
    $.support.cors = true;
    var email = getParameterByName("email");
    $("#loader").fadeIn();

    var profile;
    $.ajax({
        type: 'POST',
        url: 'http://dropme.tokenspot.com/profile.php', // Servlet URL           
        data: {
            email: email,
            token: "iefniefnoiefnoefbwofnwfow"
        },
        success: function(data) {
            if (data === "0") {
                window.location = "index.html";
            } else {
                profile = JSON.parse(data);
                $("#username").html("Welcome, " + profile['username'] + "!");
                $("#userphoto").html('<img class="circle" src="http://tokenspot.com/tkview.php?tk=' + profile['username'] + '" alt="' + profile['username'] + '_token"/>');
            }
            $("#loader").hide();
        },
        error: function(xhr, type) {
            alert('server error occurred');
        }
    });
}