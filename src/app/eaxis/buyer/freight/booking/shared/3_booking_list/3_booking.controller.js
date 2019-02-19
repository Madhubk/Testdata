(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_BookingController", three_BookingController);

    three_BookingController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "three_BookingConfig", "toastr", "errorWarningService", "confirmation", "$uibModal"];

    function three_BookingController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, three_BookingConfig, toastr, errorWarningService, confirmation, $uibModal) {
        /* jshint validthis: true */
        var three_BookingCtrl = this;

        function Init() {
            three_BookingCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": three_BookingConfig.Entities
            };
            three_BookingCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            three_BookingCtrl.ePage.Masters.RoleCode = authService.getUserInfo().RoleCode;
            three_BookingCtrl.ePage.Masters.AccessCode = authService.getUserInfo().AccessCode;
            // For list directive
            three_BookingCtrl.ePage.Masters.taskName = "BPBooking" ;
            three_BookingCtrl.ePage.Masters.dataentryName = "BPBooking";
            three_BookingCtrl.ePage.Masters.defaultFilter = {
                "IsBooking": "true"
            }
            three_BookingCtrl.ePage.Masters.taskHeader = "";
            three_BookingCtrl.ePage.Masters.config = three_BookingConfig;

            // Remove all Tabs while load booking
            three_BookingConfig.TabList = [];

            three_BookingCtrl.ePage.Masters.BookingData = [];
            three_BookingCtrl.ePage.Masters.TabList = [];
            three_BookingCtrl.ePage.Masters.activeTabIndex = 0;
            three_BookingCtrl.ePage.Masters.IsTabClick = false;
            three_BookingCtrl.ePage.Masters.IsNewBookingClicked = false;

            // Functions
            three_BookingCtrl.ePage.Masters.CreateNewBooking = CreateNewBooking;
            three_BookingCtrl.ePage.Masters.AddTab = AddTab;
            three_BookingCtrl.ePage.Masters.RemoveTab = RemoveTab;
            three_BookingCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            three_BookingCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

        }

        function CreateNewBooking() {

            var _isExist = three_BookingCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                three_BookingCtrl.ePage.Masters.IsNewBookingClicked = true;

                helperService.getFullObjectUsingGetById(three_BookingCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response
                        };

                        three_BookingCtrl.ePage.Masters.AddTab(_obj, true);
                        three_BookingCtrl.ePage.Masters.IsNewBookingClicked = false;
                    } else {
                        console.log("Empty New Booking response");
                    }
                });
            } else {
                toastr.info("Record Already Opened...!");
            }

        }

        function AddTab(currentBooking, isNew) {
            three_BookingCtrl.ePage.Masters.currentBooking = undefined;

            var _isExist = three_BookingCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentBooking.entity.ShipmentNo)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                three_BookingCtrl.ePage.Masters.IsTabClick = true;
                var _currentBooking = undefined;
                if (!isNew) {
                    _currentBooking = currentBooking.entity;
                } else {
                    _currentBooking = currentBooking;
                }

                three_BookingConfig.GetTabDetails(_currentBooking, isNew).then(function (response) {
                    var _entity = {};
                    three_BookingCtrl.ePage.Masters.TabList = response;

                    if (three_BookingCtrl.ePage.Masters.TabList.length > 0) {
                        three_BookingCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentBooking.entity.ShipmentNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        three_BookingCtrl.ePage.Masters.activeTabIndex = three_BookingCtrl.ePage.Masters.TabList.length;
                        three_BookingCtrl.ePage.Masters.CurrentActiveTab(currentBooking.entity.ShipmentNo, _entity);
                        three_BookingCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentBooking) {
            event.preventDefault();
            event.stopPropagation();
            var _currentBooking = currentBooking[currentBooking.label].ePage.Entities;

            // Close Current Booking
            apiService.get("eAxisAPI", three_BookingCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentBooking.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // three_BookingCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            three_BookingCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            three_BookingCtrl.ePage.Masters.currentBooking = currentTab;
            // var _obj = {
            //     ModuleName: ["Booking"],
            //     Code: [currentTab],
            //     API: "Validation", // Validation/Group
            //     FilterInput: {
            //         ModuleCode: "SHP",
            //         SubModuleCode: "SHP",
            //         // Code: "E0013"
            //     },
            //     GroupCode: "TC_Test",
            //     RelatedBasicDetails: [{
            //         "UIField": "TEST",
            //         "DbField": "TEST",
            //         "Value": "TEST"
            //     }],
            //     EntityObject: entity,
            //     // ErrorCode: ["E0013"]
            // };

            // errorWarningService.GetErrorCodeList(_obj);

        }

        function SelectedGridRow($item) {
            console.log($item)
            if ($item.action === "link" || $item.action === "dblClick") {
                three_BookingCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }


        Init();
    }
})();