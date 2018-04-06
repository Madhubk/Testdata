(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingController", BookingController);

    BookingController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "BookingConfig", "toastr"];

    function BookingController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, BookingConfig, toastr) {
        /* jshint validthis: true */
        var BookingCtrl = this;

        function Init() {
            BookingCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": BookingConfig.Entities
            };

            // For list directive
            BookingCtrl.ePage.Masters.taskName = "Booking";
            BookingCtrl.ePage.Masters.dataentryName = "Booking";
            BookingCtrl.ePage.Masters.defaultFilter = {
                "IsBooking": true
            }
            BookingCtrl.ePage.Masters.taskHeader = "";
            BookingCtrl.ePage.Masters.config = BookingCtrl.ePage.Entities;

            BookingCtrl.ePage.Masters.BookingData = [];
            BookingCtrl.ePage.Masters.TabList = [];
            BookingCtrl.ePage.Masters.activeTabIndex = 0;
            BookingCtrl.ePage.Masters.IsTabClick = false;
            BookingCtrl.ePage.Masters.IsNewBookingClicked = false;

            // Functions
            BookingCtrl.ePage.Masters.CreateNewBooking = CreateNewBooking;
            BookingCtrl.ePage.Masters.AddTab = AddTab;
            BookingCtrl.ePage.Masters.RemoveTab = RemoveTab;
            BookingCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            BookingCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            // Save
            BookingCtrl.ePage.Masters.Save = Save;
            BookingCtrl.ePage.Masters.SaveButtonText = "Save";
            BookingCtrl.ePage.Masters.IsDisableSave = false;

            CheckUserBasedMenuVisibleType();
        }

        function CreateNewBooking() {
            BookingCtrl.ePage.Masters.IsNewBookingClicked = true;

            helperService.getFullObjectUsingGetById(BookingCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIShipmentHeader,
                        data: response.data.Response.Response
                    };

                    BookingCtrl.ePage.Masters.AddTab(_obj, true);
                    BookingCtrl.ePage.Masters.IsNewBookingClicked = false;
                } else {
                    console.log("Empty New Booking response");
                }
            });
        }

        function AddTab(currentBooking, isNew) {
            BookingCtrl.ePage.Masters.currentBooking = undefined;

            var _isExist = BookingCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentBooking.entity.ShipmentNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                BookingCtrl.ePage.Masters.IsTabClick = true;
                var _currentBooking = undefined;
                if (!isNew) {
                    _currentBooking = currentBooking.entity;
                } else {
                    _currentBooking = currentBooking;
                }

                BookingConfig.GetTabDetails(_currentBooking, isNew).then(function (response) {
                    BookingCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        BookingCtrl.ePage.Masters.activeTabIndex = BookingCtrl.ePage.Masters.TabList.length;
                        BookingCtrl.ePage.Masters.CurrentActiveTab(currentBooking.entity.ShipmentNo);
                        BookingCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info("Booking Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentBooking) {
            event.preventDefault();
            event.stopPropagation();
            var _currentBooking = currentBooking[currentBooking.label].ePage.Entities;

            // Close Current Booking
            apiService.get("eAxisAPI", BookingCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentBooking.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // BookingCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            BookingCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            BookingCtrl.ePage.Masters.currentBooking = currentTab;
            // Standard Menu Configuration and Data
            BookingCtrl.ePage.Masters.TabList.map(function (value, key) {
                if (value.label === BookingCtrl.ePage.Masters.currentBooking) {
                    BookingCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.Booking;
                    BookingCtrl.ePage.Masters.StandardMenuInput.obj = value;
                }
            });
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                BookingCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function CheckUserBasedMenuVisibleType() {
            var _filter = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                // "EntitySource": "USER",
                "AppCode": authService.getUserInfo().AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _value = JSON.parse(response.data.Response[0].Value);
                        BookingCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }

        function Save($item) {
            BookingCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            BookingCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            var _array = [];
            for (var i in _Data.Header.Data.UIAddressContactList) {
                if (i !== "CfxTypeList") {
                    _array.push(_Data.Header.Data.UIAddressContactList[i]);
                }
            }
            _Data.Header.Data.UIJobAddress = [];
            _array.map(function (value, key) {
                _Data.Header.Data.UIJobAddress.push(value);
            });
            console.log(_Data.Header.Data.UIJobAddress)
            var _isEmpty = angular.equals({}, _Data.Header.Data.UIAddressContactList);
            if (!_isEmpty) {
                _Data.Header.Data.UIShipmentHeader.ORG_PickupAgent_FK = _Data.Header.Data.UIAddressContactList.PAG.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.ORG_PickupAgent_Code = _Data.Header.Data.UIAddressContactList.PAG.ORG_Code;

                _Data.Header.Data.UIShipmentHeader.PickupFrom_FK = _Data.Header.Data.UIAddressContactList.CRG.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.PickupFromCode = _Data.Header.Data.UIAddressContactList.CRG.ORG_Code;
                _Data.Header.Data.UIShipmentHeader.PickupFromAddress_FK = _Data.Header.Data.UIAddressContactList.CRG.OAD_Address_FK;

                _Data.Header.Data.UIShipmentHeader.ORG_Shipper_FK = _Data.Header.Data.UIAddressContactList.CRD.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.ORG_Shipper_Code = _Data.Header.Data.UIAddressContactList.CRD.ORG_Code;

                _Data.Header.Data.UIShipmentHeader.ORG_Consignee_FK = _Data.Header.Data.UIAddressContactList.CED.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.ORG_Consignee_Code = _Data.Header.Data.UIAddressContactList.CED.ORG_Code;

                _Data.Header.Data.UIShipmentHeader.DeliveryTo_FK = _Data.Header.Data.UIAddressContactList.CEG.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.DeliveryToCode = _Data.Header.Data.UIAddressContactList.CEG.ORG_Code;
                _Data.Header.Data.UIShipmentHeader.DeliveryToAddress_FK = _Data.Header.Data.UIAddressContactList.CEG.OAD_Address_FK;
            }

            if ($item.isNew) {
                _input.UIShipmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Shipment').then(function (response) {
                if (response.Status === "success") {
                    var _index = BookingConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(BookingCtrl.ePage.Masters.currentShipment);

                    if (_index !== -1) {
                        BookingConfig.TabList[_index][BookingConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        BookingConfig.TabList[_index].isNew = false;
                        // appConfig.Entities.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

                BookingCtrl.ePage.Masters.SaveButtonText = "Save";
                BookingCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

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