/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bookingDetailsController", bookingDetailsController);

    bookingDetailsController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "authService", "APP_CONSTANT"];

    function bookingDetailsController($scope, apiService, helperService, appConfig, myTaskActivityConfig, authService, APP_CONSTANT) {
        var bookingDetailsCtrl = this;

        function Init() {
            bookingDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            bookingDetailsCtrl.ePage.Masters.emptyText = "-";
            if (bookingDetailsCtrl.taskObj) {
                bookingDetailsCtrl.ePage.Masters.TaskObj = bookingDetailsCtrl.taskObj;
            } else {
                bookingDetailsCtrl.ePage.Masters.currentBooking = myTaskActivityConfig.Entities.Shipment;
                bookingDetailsCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
            }
            // DatePicker
            bookingDetailsCtrl.ePage.Masters.DatePicker = {};
            bookingDetailsCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            bookingDetailsCtrl.ePage.Masters.DatePicker.isOpen = [];
            bookingDetailsCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            GetMastersList();
            getServices();

            bookingDetailsCtrl.ePage.Masters.DropDownMasterList = {};

            bookingDetailsCtrl.ePage.Masters.ModeChange = ModeChange;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            bookingDetailsCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INCOTERM", "FREIGHTTERMS"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        bookingDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        bookingDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });

            bookingDetailsCtrl.ePage.Masters.cfxTypeList = {}
            var _inputObj = {
                "TypeCode": "CNTTYPE",
            };
            var _input = {
                "FilterID": appConfig.Entities.CfxTypes.API.FindAllWithParent.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAllWithParent.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    bookingDetailsCtrl.ePage.Masters.cfxTypeList.CNTTYPE = response.data.Response
                    var obj = _.filter(bookingDetailsCtrl.ePage.Masters.cfxTypeList.CNTTYPE, {
                        'Key': bookingDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    bookingDetailsCtrl.ePage.Masters.selectedMode = obj;
                }
            });


        }

        function ModeChange(obj) {
            if (obj) {
                bookingDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                bookingDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                bookingDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                bookingDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
        }

        function getServices() {
            bookingDetailsCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": bookingDetailsCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }

            apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                if (response.data.Response) {
                    bookingDetailsCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                    if (bookingDetailsCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                        for (var i in bookingDetailsCtrl.ePage.Masters.serviceTypes) {
                            var tempObj = _.filter(bookingDetailsCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                'ServiceCode': bookingDetailsCtrl.ePage.Masters.serviceTypes[i]
                            })[0];
                            if (tempObj == undefined) {
                                bookingDetailsCtrl.ePage.Masters.serviceTypes[i] = 'false'
                            } else {
                                bookingDetailsCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                            }
                        }
                    } else {
                        for (var i in bookingDetailsCtrl.ePage.Masters.serviceTypes) {
                            bookingDetailsCtrl.ePage.Masters.serviceTypes[i] = "false"
                        }
                    }
                }
            });

        }

        Init();
    }
})();