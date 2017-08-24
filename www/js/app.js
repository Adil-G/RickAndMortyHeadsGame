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
  var statusCallback = function (mediaStatus, error) {
  if (martinescu.Recorder.STATUS_ERROR == mediaStatus) {
    alert(error);
  }
}

// buffer callback
var bufferCallback = function (buffer) {
  console.log(buffer);
}

var rec2 = new Object;
rec2.stop = function() {
  $scope.recorderX.stop();
  $scope.upload($scope.recorderX.location());
}
rec2.record = function() {
  $scope.recorderX = new martinescu.Recorder(cordova.file.externalDataDirectory+"/recording"+scope.rec_count++, { sampleRate: 22050 }, statusCallback, bufferCallback);
  $scope.recorderX.record();
}
rec2.playback = function() {
}
$scope.rec = rec2;
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
            $scope.recorderX.release();
        }, function(err) {
            console.log("ERROR: " + JSON.stringify(err));
            $scope.recorderX.release();
        }, function (progress) {
            // constant progress updates
        });
    }

});
