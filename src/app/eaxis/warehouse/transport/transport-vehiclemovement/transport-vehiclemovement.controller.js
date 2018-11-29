(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransportVehicleMovementController", TransportVehicleMovementController);

    TransportVehicleMovementController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "transportConfig", "helperService", "toastr", "$filter" ,"uiGmapGoogleMapApi", "$window", "uiGmapIsReady"];

    function TransportVehicleMovementController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, transportConfig, helperService, toastr, $filter, uiGmapGoogleMapApi, $window, uiGmapIsReady) {

        var TransVehiclemoveCtrl = this;

        function Init() {

            var currentTransport = TransVehiclemoveCtrl.currentTransport[TransVehiclemoveCtrl.currentTransport.label].ePage.Entities;
            
            TransVehiclemoveCtrl.ePage = {
                "Title": "",    
                "Prefix": "Transport_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTransport,
            };
                var center = new google.maps.LatLng(13.069092, 80.268143);
                TransVehiclemoveCtrl.ePage.Masters.directionsDisplay = new google.maps.DirectionsRenderer;
                TransVehiclemoveCtrl.ePage.Masters.directionsService = new google.maps.DirectionsService;

                TransVehiclemoveCtrl.ePage.Masters.map = { 
                    center: { latitude: 13.069092, longitude: 80.268143 }, 
                    control : {},
                    zoom: 10
                };    
                
                TransVehiclemoveCtrl.ePage.Masters.hidelink = true;
                TransVehiclemoveCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;
                TransVehiclemoveCtrl.ePage.Masters.refreshMap   = refreshMap;
                refreshMap() 
        }

            function refreshMap() 
            {
                TransVehiclemoveCtrl.ePage.Masters.show = true;
                TransVehiclemoveCtrl.ePage.Masters.hidelink = false;
                $timeout(OnCompanySelect(), 1000);       
            }

        function OnCompanySelect(){
            
            uiGmapIsReady.promise().then(function(){

                TransVehiclemoveCtrl.ePage.Masters.directionsDisplay = new google.maps.DirectionsRenderer;
                TransVehiclemoveCtrl.ePage.Masters.directionsService = new google.maps.DirectionsService;
                  // TransVehiclemoveCtrl.ePage.Masters.map = new google.maps.Map(document.getElementById('TransVehiclemoveCtrl.ePage.Masters.maps'), TransVehiclemoveCtrl.ePage.Masters.map);
                  google.maps.event.trigger(TransVehiclemoveCtrl.ePage.Masters.map, 'resize');
                  
                  var displayedMap = TransVehiclemoveCtrl.ePage.Masters.map.control.getGMap();
                  TransVehiclemoveCtrl.ePage.Masters.directionsDisplay.setPanel(document.getElementById('TransVehiclemoveCtrl.ePage.Masters.showdirection'));
                  TransVehiclemoveCtrl.ePage.Masters.directionsDisplay.setMap(displayedMap);
                  var waypts = [];
                  waypts.push({
                    location : "13.269188,80.2637192",
                    stopover : true
              });
                  waypts.push({
                    location : "13.4069483,80.1102998",
                    stopover : true
              });
                waypts.push({
                    location : "13.1444426,79.8940078",
                    stopover : true
              });
              waypts.push({
                    location : "13.1197998,80.0307173",
                    stopover : true
              }); 

            TransVehiclemoveCtrl.ePage.Masters.directionsService.route({
                      origin: "13.0690518,80.2683302",
                      destination: "13.0865752,80.1623948",
                      
                      provideRouteAlternatives : true,
                      //optimizeWaypoints: true,
                      travelMode: 'DRIVING'
                    }, function(response, status) {
                      if (status === 'OK') {
                      TransVehiclemoveCtrl.ePage.Masters.directionsDisplay.setDirections(response);
                      TransVehiclemoveCtrl.ePage.Masters.directionsDisplay.setMap(TransVehiclemoveCtrl.ePage.Masters.map);                                
                      } else {
                        window.alert('Directions request failed due to ' + status);
                      }
                    });
                });
        }
        Init();
    }

})();