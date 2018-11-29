(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RoutePlanningController", RoutePlanningController);

    RoutePlanningController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "toastr", "$filter", "uiGmapGoogleMapApi", "$window", "uiGmapIsReady"];

    function RoutePlanningController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, toastr, $filter, uiGmapGoogleMapApi, $window, uiGmapIsReady) {

        var RoutePlanningCtrl = this;

        function Init() {

            var currentManifest = RoutePlanningCtrl.currentManifest[RoutePlanningCtrl.currentManifest.label].ePage.Entities;

            RoutePlanningCtrl.ePage = {
                "Title": "",
                "Prefix": "Route_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            var center = new google.maps.LatLng(13.069092, 80.268143);
            RoutePlanningCtrl.ePage.Masters.directionsDisplay = new google.maps.DirectionsRenderer;
            RoutePlanningCtrl.ePage.Masters.directionsService = new google.maps.DirectionsService;

            RoutePlanningCtrl.ePage.Masters.map = {
                center: { latitude: 13.069092, longitude: 80.268143 },
                draggable: true,
                control: {},
                zoom: 10
            };
            // RoutePlanningCtrl.ePage.Masters.hidelink = true;
            RoutePlanningCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;
            RoutePlanningCtrl.ePage.Masters.refreshMap = refreshMap;
            RoutePlanningCtrl.ePage.Masters.alphabet = alphabet;

            RoutePlanningCtrl.ePage.Masters.getConsignmentList = getConsignmentList;
            RoutePlanningCtrl.ePage.Masters.SelectedOrg = SelectedOrg;
            RoutePlanningCtrl.ePage.Masters.getMap = getMap;
            RoutePlanningCtrl.ePage.Masters.getSearch = getSearch;

            RoutePlanningCtrl.ePage.Masters.IsShowError = [];

            google.maps.event.addDomListener(window, 'load', getSearch);
        }

        function alphabet(index) {
            if (index < 26) {
                return String.fromCharCode(65 + index);
            }
        }

        function getSearch() {
            var map = new google.maps.Map(document.getElementById('RoutePlanningCtrl.ePage.Masters.showMap' + RoutePlanningCtrl.currentManifest.label));

            map = {
                center: { latitude: 13.069092, longitude: 80.268143 },
                draggable: true,
                controls: {},
                zoom: 10
            };
            var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
            // map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('pac-input'));
            google.maps.event.addListener(searchBox, 'places_changed', function () {
                searchBox.set('map', null);


                var places = searchBox.getPlaces();

                var bounds = new google.maps.LatLngBounds();
                var i, place;
                for (i = 0; place = places[i]; i++) {
                    (function (place) {
                        var marker = new google.maps.Marker({

                            position: place.geometry.location
                        });
                        marker.bindTo('map', searchBox, 'map');
                        google.maps.event.addListener(marker, 'map_changed', function () {
                            if (!this.getMap()) {
                                this.unbindAll();
                            }
                        });
                        bounds.extend(place.geometry.location);
                    }(place));

                    var Latitude = place.geometry.location.lat();
                    var Longtitude = place.geometry.location.lng();
                    RoutePlanningCtrl.ePage.Masters.showMap = true;
                    RoutePlanningCtrl.ePage.Masters.myLatlng = new google.maps.LatLng(Latitude, Longtitude);
                    RoutePlanningCtrl.ePage.Masters.showSearchBox = true;
                    getMap(RoutePlanningCtrl.ePage.Masters.item, Latitude, Longtitude, place.address_components);
                }
            });
        }

        function getConsignmentList() {
            RoutePlanningCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = false;

            RoutePlanningCtrl.ePage.Entities.Header.CheckPoints.IsPickupDeliveryList = true;
            RoutePlanningCtrl.ePage.Masters.showdirection = true;
            RoutePlanningCtrl.ePage.Masters.showMap = false;
            refreshMap();
        }

        function SelectedOrg() {
            // RoutePlanningCtrl.ePage.Masters.item = index;
            var count = 0;
            angular.forEach(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                if (value.AddressType == 'PIC' || value.AddressType == 'DEL') {
                    if (value.Latitude && value.Longtitude) {
                        count = count + 1;
                    }
                }
            });
            if (count == RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress.length - 2) {
                RoutePlanningCtrl.ePage.Masters.showdirection = true;
                RoutePlanningCtrl.ePage.Masters.showMap = false;
                refreshMap();
                Validation();
            } else {
                RoutePlanningCtrl.ePage.Masters.showMap = true;
                RoutePlanningCtrl.ePage.Masters.myLatlng = new google.maps.LatLng(13.069092, 80.268143);
                getMap(0);
            }
        }

        function getMap(value, Latitude, Longtitude, address) {
            var index;
            angular.forEach(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress, function (value1, key1) {
                if (RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].PK == value1.PK) {
                    index = key1;
                }
            });
            if (!RoutePlanningCtrl.ePage.Masters.showSearchBox) {
                if (RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Latitude && RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Longtitude) {
                    RoutePlanningCtrl.ePage.Masters.IsShowError[index] = false;
                    RoutePlanningCtrl.ePage.Masters.showMap = true;
                    RoutePlanningCtrl.ePage.Masters.myLatlng = new google.maps.LatLng(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Latitude, RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Longtitude);
                } else {
                    RoutePlanningCtrl.ePage.Masters.showMap = true;
                    RoutePlanningCtrl.ePage.Masters.IsShowError[index] = true;
                }
            } else {
                if (Latitude && Longtitude && address) {
                    RoutePlanningCtrl.ePage.Masters.IsShowError[index] = false;
                    RoutePlanningCtrl.ePage.Masters.showMap = true;
                    RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Latitude = Latitude;
                    RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Longtitude = Longtitude;
                    RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Address1 = "";
                    RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Address2 = "";
                    RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].City = "";
                    RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].State = "";
                    RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Postcode = "";
                    for (var i = 0; i < address.length; i++) {
                        var addressType = address[i].types[0];
                        if (addressType) {
                            var val = address[i].long_name;
                            if (addressType == "route") {
                                RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Address1 = val;
                            } if (addressType == "sublocality_level_3") {
                                RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Address2 = val;
                            } if (addressType == "sublocality_level_1") {
                                RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].City = val;
                            } if (addressType == "administrative_area_level_2" || addressType == "locality") {
                                RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].State = val;
                            } if (addressType == "postal_code") {
                                RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Postcode = val;
                            }
                        }
                    }

                    RoutePlanningCtrl.ePage.Masters.myLatlng = new google.maps.LatLng(Latitude, Longtitude);
                }
            }
            RoutePlanningCtrl.ePage.Masters.showSearchBox = false;
            RoutePlanningCtrl.ePage.Masters.item = index;
            var myOptions = {
                zoom: 8,
                center: RoutePlanningCtrl.ePage.Masters.myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("RoutePlanningCtrl.ePage.Masters.showMap" + RoutePlanningCtrl.currentManifest.label), myOptions);

            var marker = new google.maps.Marker({
                draggable: true,
                position: RoutePlanningCtrl.ePage.Masters.myLatlng,
                map: map,
                title: "Your location"
            });

            google.maps.event.addListener(marker, 'dragend', function (event) {
                RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Latitude = event.latLng.lat();
                RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Longtitude = event.latLng.lng();
                // infoWindow.open(map, marker);
                RoutePlanningCtrl.ePage.Masters.IsShowError[index] = false;
                var myLatlng = new google.maps.LatLng(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Latitude, RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Longtitude);
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': myLatlng },
                    function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Address1 = "";
                            if (results[0]) {
                                for (var i = 0; i < results[0].address_components.length; i++) {
                                    var addr = results[0].address_components[i];
                                    // check if this entry in address_components has a type of country
                                    if (addr.types[0] == 'street_address') // address 1
                                        RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Address1 = addr.long_name;
                                    if (addr.types[0] == 'establishment')
                                        RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Address1 = addr.long_name;
                                    if (addr.types[0] == 'route')  // address 2
                                        RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Address2 = addr.long_name;
                                    if (addr.types[0] == 'postal_code')       // Zip
                                        RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].Postcode = addr.short_name;
                                    if (addr.types[0] == ['administrative_area_level_1'])       // State
                                        RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].State = addr.long_name;
                                    if (addr.types[0] == "administrative_area_level_2" || addr.types[0] == "locality")
                                        RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[value].City = addr.long_name;
                                }
                            }
                        }
                    });
            });
        }

        function refreshMap() {
            RoutePlanningCtrl.ePage.Masters.directionsDisplay.setMap(null);
            RoutePlanningCtrl.ePage.Masters.show = true;
            RoutePlanningCtrl.ePage.Masters.hidelink = false;
            $timeout(OnCompanySelect(), 1000);
        }

        function OnCompanySelect() {
            uiGmapIsReady.promise(dmsManifestConfig.activeTabIndex).then(function () {
                RoutePlanningCtrl.ePage.Masters.directionsDisplay = new google.maps.DirectionsRenderer;
                RoutePlanningCtrl.ePage.Masters.directionsService = new google.maps.DirectionsService;
                google.maps.event.trigger(RoutePlanningCtrl.ePage.Masters.map, 'resize');

                var displayedMap = RoutePlanningCtrl.ePage.Masters.map.control.getGMap();
                RoutePlanningCtrl.ePage.Masters.directionsDisplay.setPanel(document.getElementById('RoutePlanningCtrl.ePage.Masters.showdirection' + RoutePlanningCtrl.currentManifest.label));
                RoutePlanningCtrl.ePage.Masters.directionsDisplay.setMap(displayedMap);

                RoutePlanningCtrl.ePage.Masters.count = 0;
                angular.forEach(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == 'PIC' || value.AddressType == 'DEL') {
                        if (!value.Latitude || !value.Longtitude) {
                            if (value.Address1 && value.Address2 && value.City) {
                                RoutePlanningCtrl.ePage.Masters.IsShowError[key] = false;
                                var address = value.Address1 + ',' + value.Address2 + ',' + value.City;
                                var geocoder = new google.maps.Geocoder();
                                if (geocoder) {
                                    geocoder.geocode({
                                        'address': address
                                    }, function (results, status) {
                                        if (status == google.maps.GeocoderStatus.OK) {
                                            value.Latitude = results[0].geometry.location.lat();
                                            value.Longtitude = results[0].geometry.location.lng();
                                            RoutePlanningCtrl.ePage.Masters.count = RoutePlanningCtrl.ePage.Masters.count + 1;

                                            if (RoutePlanningCtrl.ePage.Masters.count == RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress.length - 2) {

                                                var waypts = [];
                                                angular.forEach(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                                                    if (value.AddressType == 'PIC' || value.AddressType == 'DEL') {
                                                        if (value.Latitude && value.Longtitude) {
                                                            waypts.push({
                                                                location: value.Latitude + ',' + value.Longtitude,
                                                                stopover: true
                                                            });
                                                        }
                                                    }
                                                });
                                                if (waypts.length > 0) {
                                                    waypts.splice(0, 1);
                                                }
                                                if (waypts.length > 0) {
                                                    waypts.splice(-1, 1);
                                                }

                                                RoutePlanningCtrl.ePage.Masters.directionsService.route({
                                                    origin: RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[2].Latitude + ',' + RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[2].Longtitude,
                                                    destination: RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress.length - 1].Latitude + ',' + RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress.length - 1].Longtitude,
                                                    waypoints: waypts,
                                                    provideRouteAlternatives: true,
                                                    //optimizeWaypoints: true,
                                                    travelMode: 'DRIVING'
                                                }, function (response, status) {
                                                    if (status === 'OK') {
                                                        RoutePlanningCtrl.ePage.Masters.directionsDisplay.setDirections(response);
                                                        RoutePlanningCtrl.ePage.Masters.directionsDisplay.setMap(RoutePlanningCtrl.ePage.Masters.map);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            } else {
                                RoutePlanningCtrl.ePage.Masters.showMap = true;
                                RoutePlanningCtrl.ePage.Masters.myLatlng = new google.maps.LatLng(13.069092, 80.268143);
                                getMap(key);
                            }
                        } else {
                            var count = 0;
                            angular.forEach(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                                if (value.AddressType == 'PIC' || value.AddressType == 'DEL') {
                                    if (value.Latitude && value.Longtitude) {
                                        count = count + 1;
                                    }
                                }
                            });
                            if (count == RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress.length - 2) {
                                getDistance(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[2], RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress.length - 1]);
                                var waypts = [];
                                angular.forEach(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                                    if (value.AddressType == 'PIC' || value.AddressType == 'DEL') {
                                        if (value.Latitude && value.Longtitude) {
                                            waypts.push({
                                                location: value.Latitude + ',' + value.Longtitude,
                                                stopover: true
                                            });
                                        }
                                    }
                                });
                                if (waypts.length > 0) {
                                    waypts.splice(0, 1);
                                }
                                if (waypts.length > 0) {
                                    waypts.splice(-1, 1);
                                }

                                RoutePlanningCtrl.ePage.Masters.directionsService.route({
                                    origin: RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[2].Latitude + ',' + RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[2].Longtitude,
                                    destination: RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress.length - 1].Latitude + ',' + RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress.length - 1].Longtitude,
                                    waypoints: waypts,
                                    provideRouteAlternatives: true,
                                    //optimizeWaypoints: true,
                                    travelMode: 'DRIVING'
                                }, function (response, status) {
                                    if (status === 'OK') {
                                        RoutePlanningCtrl.ePage.Masters.directionsDisplay.setDirections(response);
                                        RoutePlanningCtrl.ePage.Masters.directionsDisplay.setMap(RoutePlanningCtrl.ePage.Masters.map);
                                    }
                                });
                            }
                        }
                    }
                });
            });
            RoutePlanningCtrl.ePage.Entities.Header.CheckPoints.IsPickupDeliveryList = true;

        }

        function Validation() {
            getDistance(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[2], RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress[RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress.length - 1]);
            angular.forEach(RoutePlanningCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                value.AddressSequence = key;
                if (value.AddressType == "PIC" || value.AddressType == "DEL") {
                    var value1 = angular.copy(value);
                    value1.IsModified = true;
                    value1.PK = value.OAD_Address_FK;
                    value1.Longitude = value.Longtitude;
                    apiService.post("eAxisAPI", dmsManifestConfig.Entities.Header.API.UpdateOrgAddress.Url, value1).then(function (response) {
                        if (response.data.Response) {
                            RoutePlanningCtrl.ePage.Masters.AddressData = response.data.Response;
                        }
                    });
                }
            });
            var item = filterObjectUpdate(RoutePlanningCtrl.ePage.Entities.Header.Data, "IsModified");
            apiService.post("eAxisAPI", RoutePlanningCtrl.ePage.Entities.Header.API.UpdateManifest.Url, RoutePlanningCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                        RoutePlanningCtrl.ePage.Entities.Header.Data = response.data.Response;
                        toastr.success("Saved Successfully");
                    });
                }
            });

        }

        function rad(x) {
            return x * Math.PI / 180;
        };

        function getDistance(p1, p2) {
            var a1 = new google.maps.LatLng(p1.Latitude, p1.Longtitude);
            var a2 = new google.maps.LatLng(p2.Latitude, p2.Longtitude);
            RoutePlanningCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Distance = (google.maps.geometry.spherical.computeDistanceBetween(a1, a2) / 1000).toFixed(2);
        };

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        Init();
    }

})();