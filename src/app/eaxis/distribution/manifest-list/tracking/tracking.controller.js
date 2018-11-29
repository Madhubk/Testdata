(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackingController", TrackingController);

    TrackingController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "toastr", "$filter", "uiGmapGoogleMapApi", "$window", "uiGmapIsReady"];

    function TrackingController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, toastr, $filter, uiGmapGoogleMapApi, $window, uiGmapIsReady) {

        var TrackingCtrl = this;

        function Init() {

            var currentManifest = TrackingCtrl.currentManifest[TrackingCtrl.currentManifest.label].ePage.Entities;

            TrackingCtrl.ePage = {
                "Title": "",
                "Prefix": "Route_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            }
            var MY_MAPTYPE_ID = 'custom_style';
            getGeoJson();
            TrackingCtrl.ePage.Masters.PickupDelivery = [];

            angular.forEach(TrackingCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                if (value.AddressType == "PIC" || value.AddressType == "DEL") {
                    var obj = {
                        "Latitude": value.Latitude,
                        "Longitude": value.Longtitude
                    }
                    TrackingCtrl.ePage.Masters.PickupDelivery.push(obj);
                }
            });
        }

        function getGeoJson() {
            var _filter = {
                Manifest_FK: TrackingCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": TrackingCtrl.ePage.Entities.Header.API.TmsGeoRoute.FilterID
            };

            apiService.post("eAxisAPI", TrackingCtrl.ePage.Entities.Header.API.TmsGeoRoute.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TrackingCtrl.ePage.Masters.MapPoints = response.data.Response[0].GeoJSON;
                        initialize();
                    }
                    else {
                        if (TrackingCtrl.ePage.Entities.Header.Data.JobAddress.length > 2) {
                            TrackingCtrl.ePage.Masters.MapPoints = "[{\"Latitude\":\"" + TrackingCtrl.ePage.Entities.Header.Data.JobAddress[2].Latitude + "\",\"Longitude\":\"" + TrackingCtrl.ePage.Entities.Header.Data.JobAddress[2].Longtitude + "\" }]";
                            initialize();
                        }
                    }
                }
            });
        }

        function initialize() {
            if (jQuery('#map'+ TrackingCtrl.currentManifest.label).length > 0) {
             if (TrackingCtrl.ePage.Masters.MapPoints == "") {
                    TrackingCtrl.ePage.Masters.MapPoints = "[{\"Latitude\":\"" + TrackingCtrl.ePage.Entities.Header.Data.JobAddress[2].Latitude + "\",\"Longitude\":\"" + TrackingCtrl.ePage.Entities.Header.Data.JobAddress[2].Longtitude + "\" }]";
                }
                var locations = JSON.parse(TrackingCtrl.ePage.Masters.MapPoints);
                // window.map = new google.maps.Map(document.getElementById('map'), {
            //     mapTypeId: google.maps.MapTypeId.ROADMAP,
                //     scrollwheel: false,
                //     zoom: 20
                // });

                var mapOptions = {
                    center: new google.maps.LatLng(locations[0].Latitude, locations[0].Longitude),
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("map"+ TrackingCtrl.currentManifest.label), mapOptions);
                // var infoWindow = new google.maps.InfoWindow();
                // var lat_lng = new Array();
                // var latlngbounds = new google.maps.LatLngBounds();

                // for (i = 0; i < locations.length; i++) {
                //     var data = locations[i]
                //     var myLatlng = new google.maps.LatLng(data.Latitude, data.Longitude);
                //     lat_lng.push(myLatlng);
                //     var marker = new google.maps.Marker({
                //         position: myLatlng,
                //         map: map,
                //         map: null,
                //         /* title: data.title*/

                //     });
                //     latlngbounds.extend(marker.position);

                //     (function (marker, data) {
                //         google.maps.event.addListener(marker, "click", function (e) {
                //             infoWindow.setContent(data.description);
                //             infoWindow.open(map, marker);
                //         });
                //     })(marker, data);
                // }
                // map.setCenter(latlngbounds.getCenter());
                // map.fitBounds(latlngbounds);



                // //***********ROUTING****************//

                // //Initialize the Path Array
                // var path = new google.maps.MVCArray();

                // //Initialize the Direction Service
                // var service = new google.maps.DirectionsService();

                // //Set the Path Stroke Color
                // var poly = new google.maps.Polyline({ map: map, strokeColor: '#e70931' });

                // //Loop and Draw Path Route between the Points on MAP
                // for (var i = 0; i < lat_lng.length; i++) {
                //     if ((i + 1) < lat_lng.length) {
                //         var src = lat_lng[i];
                //         var des = lat_lng[i + 1];
                //         // path.push(src);
                //         poly.setPath(path);
                //         service.route({
                //             origin: src,
                //             destination: des,
                //             travelMode: google.maps.DirectionsTravelMode.DRIVING
                //         }, function (result, status) {
                //             if (status == google.maps.DirectionsStatus.OK) {
                //                 for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                //                     path.push(result.routes[0].overview_path[i]);
                //                 }

                //             }

                //         });

                //     }
                // }

                // var infowindow = new google.maps.InfoWindow();
                // var flightPlanCoordinates = [];
                // var flightPlan = [];
                // var bounds = new google.maps.LatLngBounds();

                // for (var i = 0; i < locations.length; i++) {

                //     var icon = {
                //         url: "/assets/img/truck.png",
                //         scaledSize: new google.maps.Size(50, 30)
                //     }
                //     var marker = new google.maps.Marker({
                //         position: new google.maps.LatLng(locations[i].Latitude, locations[i].Longitude),
                //         map: map,
                //         icon: icon
                //     });
                //     flightPlanCoordinates.push(marker.getPosition());
                //     bounds.extend(marker.position);

                //     if (i == locations.length - 1) {

                //     } else {
                //         marker.setMap(null);
                //     }
                // }

                // map.fitBounds(bounds);

                // var flightPath = new google.maps.Polyline({
                //     map: map,
                //     path: flightPlanCoordinates,
                //     strokeColor: "#FF0000",
                //     strokeOpacity: 1.0,
                //     strokeWeight: 2
                // });

                TrackingCtrl.ePage.Masters.directionsDisplay = new google.maps.DirectionsRenderer();
                TrackingCtrl.ePage.Masters.directionsService = new google.maps.DirectionsService();
                var waypts = [];
                angular.forEach(TrackingCtrl.ePage.Masters.PickupDelivery, function (value, key) {
                    if (value.Latitude && value.Longitude) {
                        waypts.push({
                            location: value.Latitude + ',' + value.Longitude,
                            stopover: true
                        });
                    }
                });
                if (waypts.length > 0) {
                    waypts.splice(0, 1);
                }
                if (waypts.length > 0) {
                    waypts.splice(-1, 1);
                }
                              
                   TrackingCtrl.ePage.Masters.directionsService.route({
                    origin: TrackingCtrl.ePage.Masters.PickupDelivery[0].Latitude + ',' + TrackingCtrl.ePage.Masters.PickupDelivery[0].Longitude,
                    destination: TrackingCtrl.ePage.Masters.PickupDelivery[TrackingCtrl.ePage.Masters.PickupDelivery.length - 1].Latitude + ',' + TrackingCtrl.ePage.Masters.PickupDelivery[TrackingCtrl.ePage.Masters.PickupDelivery.length - 1].Longitude,
                    waypoints: waypts,
                    provideRouteAlternatives: true,
                    //optimizeWaypoints: true,
                    travelMode: 'DRIVING'
                }, function (response, status) {
                    if (status === 'OK') {
                        TrackingCtrl.ePage.Masters.directionsDisplay.setDirections(response);
                        TrackingCtrl.ePage.Masters.directionsDisplay.setMap(map);
                    }
                });
            }

            if (jQuery('#dvMapone' + TrackingCtrl.currentManifest.label).length > 0) {
                if (TrackingCtrl.ePage.Masters.MapPoints == "") {
                    TrackingCtrl.ePage.Masters.MapPoints = "[{\"Latitude\":\"" + TrackingCtrl.ePage.Entities.Header.Data.JobAddress[2].Latitude + "\",\"Longitude\":\"" + TrackingCtrl.ePage.Entities.Header.Data.JobAddress[2].Longtitude + "\" }]";
                }
                var locations = JSON.parse(TrackingCtrl.ePage.Masters.MapPoints);
                var mapOptions = {
                    center: new google.maps.LatLng(locations[0].Latitude, locations[0].Longitude),
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var dvMapone = new google.maps.Map(document.getElementById("dvMapone" + TrackingCtrl.currentManifest.label), mapOptions);
                var directionsDisplay1 = new google.maps.DirectionsRenderer({ suppressMarkers: true });
                var directionsService1 = new google.maps.DirectionsService();
                // var waypts = [];
                var icon = {
                    url: "/assets/img/truck.png",
                    scaledSize: new google.maps.Size(50, 30)
                }
                angular.forEach(locations, function (value, key) {
                    // if (value.Latitude && value.Longitude) {
                    //     waypts.push({
                    //         location: value.Latitude + ',' + value.Longitude,
                    //         stopover: true
                    //     });
                    // }
                    if (key == 0) {
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[key].Latitude, locations[key].Longitude),
                            map: dvMapone,

                        })
                    }
                    if (key == locations.length - 1) {
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[key].Latitude, locations[key].Longitude),
                            map: dvMapone,
                            icon: icon
                        })
                    }
                });
                // if (waypts.length > 0) {
                //     waypts.splice(0, 1);
                // }
                // if (waypts.length > 0) {
                //     waypts.splice(-1, 1);
                // }

                // TrackingCtrl.ePage.Masters.directionsService1.route({
                //     origin: locations[0].Latitude + ',' + locations[0].Longitude,
                //     destination: locations[locations.length - 1].Latitude + ',' + locations[locations.length - 1].Longitude,
                //     waypoints: waypts,
                //     provideRouteAlternatives: true,
                //     //optimizeWaypoints: true,
                //     travelMode: 'Walking'
                //   }, function (response, status) {
                //     if (status === 'OK') {
                //         TrackingCtrl.ePage.Masters.directionsDisplay1.setDirections(response);
                //         TrackingCtrl.ePage.Masters.directionsDisplay1.setMap(dvMapone);
                //     }
                // });
                var _locations = angular.copy(locations);
                // Tour_startUp(_locations);
                // window.tour.loadMap(dvMapone, TrackingCtrl.ePage.Masters.directionsDisplay1);
                if (_locations.length > 1) {
                    LoadMap(dvMapone, directionsDisplay1, _locations);
                    fitBounds(dvMapone, _locations);
                    calcRoute(directionsService1, directionsDisplay1, _locations);
                }
            }
        }

        function LoadMap(dvMapone, directionsDisplay1, _locations) {
            var stops = angular.copy(_locations);
            var myOptions = {
                zoom: 13,
                center: new google.maps.LatLng(stops[0].Latitude, stops[0].Longitude),
                mapTypeId: window.google.maps.MapTypeId.ROADMAP
            };
            dvMapone.setOptions(myOptions);
            directionsDisplay1.setMap(dvMapone);
        }

        function fitBounds(dvMapone, _locations) {
            var stops = angular.copy(_locations);
            var bounds = new window.google.maps.LatLngBounds();

            // extend bounds for each record
            jQuery.each(stops, function (key, val) {
                var myLatlng = new window.google.maps.LatLng(val.Latitude, val.Longitude);
                bounds.extend(myLatlng);
            });
            dvMapone.fitBounds(bounds);
        }

        function calcRoute(directionsService1, directionsDisplay1, _locations) {
            var stops = angular.copy(_locations);
            var batches = [];
            var itemsPerBatch = 10; // google API max = 10 - 1 start, 1 stop, and 8 waypoints
            var itemsCounter = 0;
            var wayptsExist = stops.length > 0;

            while (wayptsExist) {
                var subBatch = [];
                var subitemsCounter = 0;

                for (var j = itemsCounter; j < stops.length; j++) {
                    subitemsCounter++;
                    subBatch.push({
                        location: new window.google.maps.LatLng(stops[j].Latitude, stops[j].Longitude),
                        stopover: true
                    });
                    if (subitemsCounter == itemsPerBatch)
                        break;
                }

                itemsCounter += subitemsCounter;
                batches.push(subBatch);
                wayptsExist = itemsCounter < stops.length;
                // If it runs again there are still points. Minus 1 before continuing to 
                // start up with end of previous tour leg
                itemsCounter--;
            }

            // now we should have a 2 dimensional array with a list of a list of waypoints
            var combinedResults;
            var unsortedResults = [{}]; // to hold the counter and the results themselves as they come back, to later sort
            var directionsResultsReturned = 0;

            for (var k = 0; k < batches.length; k++) {
                var lastIndex = batches[k].length - 1;
                var start = batches[k][0].location;
                var end = batches[k][lastIndex].location;

                // trim first and last entry from array
                var waypts = [];
                waypts = batches[k];
                waypts.splice(0, 1);
                waypts.splice(waypts.length - 1, 1);

                var request = {
                    origin: start,
                    destination: end,
                    waypoints: waypts,
                    travelMode: window.google.maps.TravelMode.WALKING
                };
                (function (kk) {
                    directionsService1.route(request, function (result, status) {
                        if (status == window.google.maps.DirectionsStatus.OK) {

                            var unsortedResult = { order: kk, result: result };
                            unsortedResults.push(unsortedResult);

                            directionsResultsReturned++;

                            if (directionsResultsReturned == batches.length) // we've received all the results. put to map
                            {
                                // sort the returned values into their correct order
                                unsortedResults.sort(function (a, b) { return parseFloat(a.order) - parseFloat(b.order); });
                                var count = 0;
                                for (var key in unsortedResults) {
                                    if (unsortedResults[key].result != null) {
                                        if (unsortedResults.hasOwnProperty(key)) {
                                            if (count == 0) // first results. new up the combinedResults object
                                                combinedResults = unsortedResults[key].result;
                                            else {
                                                // only building up legs, overview_path, and bounds in my consolidated object. This is not a complete 
                                                // directionResults object, but enough to draw a path on the map, which is all I need
                                                combinedResults.routes[0].legs = combinedResults.routes[0].legs.concat(unsortedResults[key].result.routes[0].legs);
                                                combinedResults.routes[0].overview_path = combinedResults.routes[0].overview_path.concat(unsortedResults[key].result.routes[0].overview_path);

                                                combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getNorthEast());
                                                combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getSouthWest());
                                            }
                                            count++;
                                        }
                                    }
                                }
                                directionsDisplay1.setDirections(combinedResults);
                            }
                        }
                    });
                })(k);
            }
        }

        Init();
    }

})();