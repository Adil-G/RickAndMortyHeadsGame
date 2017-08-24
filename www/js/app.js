// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('AppCtrl', function($scope, $ionicPlatform, $cordovaCapture, $cordovaFileTransfer) {
  $scope.rec_count = 0;
  var captureError = function(e) {
    console.log('captureError' ,e);
  }

  var captureSuccess = function(e) {
      console.log('captureSuccess');console.dir(e);
      $scope.sound.file = e[0].localURL;
      $scope.sound.filePath = e[0].fullPath;
      $scope.play();
  }

  $scope.record = function() {
    if(navigator.device)
    {
      console.log(navigator);
      console.log(JSON.stringify(navigator));
      console.log(navigator.device);
      navigator.device.capture.captureAudio(
      captureSuccess,captureError,{duration:0.1});
    }
  }
  $scope.play = function() {
    if(!$scope.sound.file) {
        navigator.notification.alert("Record a sound first.", null, "Error");
        return;
    }
    var media = new Media($scope.sound.file, function(e) {
        media.release();
    }, function(err) {
        console.log("media err", err);
    });
    media.play();
}
var recorder = new Object;
recorder.stop = function() {
  window.plugins.audioRecorderAPI.stop(function(msg) {
    // success
    alert('ok: ' + msg);
  }, function(msg) {
    // failed
    alert('ko: ' + msg);
  });
}
recorder.record = function() {
  window.plugins.audioRecorderAPI.record(function(msg) {
    // complete
    alert('ok: ' + msg);
    if($scope.upload)
    {

      $scope.upload(msg);
    }
  }, function(msg) {
    // failed
    alert('ko: ' + msg);
  }, 30); // record 30 seconds
}
recorder.playback = function() {
  window.plugins.audioRecorderAPI.playback(function(msg) {
    // complete
    alert('ok: ' + msg);
  }, function(msg) {
    // failed
    alert('ko: ' + msg);
  });
}
$scope.rec = recorder;
$scope.upload = function(saved_data) {
        console.log("starting upload");
        console.log(saved_data);
        var basename = saved_data.replace(/\\/g,'/').replace(/.*\//, '');
        var options = {
            fileKey: "docfile",
            fileName: basename,
            chunkedMode: false,
            mimeType: "audio/wav"
        };
        $cordovaFileTransfer.upload("http://corpius4.pythonanywhere.com/myapp/list/", saved_data, options).then(function(result) {
            console.log("SUCCESS: " + JSON.stringify(result.response));
        }, function(err) {
            console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
            // constant progress updates
        });
    }

});
