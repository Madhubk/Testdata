(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingSupplierController", BookingSupplierController);

    BookingSupplierController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "BookingSupplierConfig", "toastr", "errorWarningService", "confirmation"];

    function BookingSupplierController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, BookingSupplierConfig, toastr, errorWarningService, confirmation) {
        /* jshint validthis: true */
        var BookingSupplierCtrl = this;

        function Init() {
            BookingSupplierCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": BookingSupplierConfig.Entities
            };
            BookingSupplierCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // For list directive
            BookingSupplierCtrl.ePage.Masters.taskName = "Booking";
            BookingSupplierCtrl.ePage.Masters.dataentryName = "Booking";
            BookingSupplierCtrl.ePage.Masters.defaultFilter = {
                "IsBooking": "true"
            }
            BookingSupplierCtrl.ePage.Masters.taskHeader = "";
            BookingSupplierCtrl.ePage.Masters.config = BookingSupplierConfig;
            console.log(authService.getUserInfo())

            // Remove all Tabs while load booking
            BookingSupplierConfig.TabList = [];

            BookingSupplierCtrl.ePage.Masters.BookingData = [];
            BookingSupplierCtrl.ePage.Masters.TabList = [];
            BookingSupplierCtrl.ePage.Masters.activeTabIndex = 0;
            BookingSupplierCtrl.ePage.Masters.IsTabClick = false;
            BookingSupplierCtrl.ePage.Masters.IsNewBookingClicked = false;

            // Functions
            BookingSupplierCtrl.ePage.Masters.CreateNewBooking = CreateNewBooking;
            BookingSupplierCtrl.ePage.Masters.AddTab = AddTab;
            BookingSupplierCtrl.ePage.Masters.RemoveTab = RemoveTab;
            BookingSupplierCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            BookingSupplierCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            // Save
            BookingSupplierCtrl.ePage.Masters.Save = Save;
            BookingSupplierCtrl.ePage.Masters.IsDisableSave = false;

            CheckUserBasedMenuVisibleType();
        }

        function CreateNewBooking() {

            var _isExist = BookingSupplierCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                BookingSupplierCtrl.ePage.Masters.IsNewBookingClicked = true;

                helperService.getFullObjectUsingGetById(BookingSupplierCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response.UIShipmentHeader.BookingType = "CB"
                        response.data.Response.Response.UIShipmentHeader.IsBooking = true
                        response.data.Response.Response.DocumentDetails = []
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response
                        };
                        BookingSupplierCtrl.ePage.Masters.AddTab(_obj, true);
                        BookingSupplierCtrl.ePage.Masters.IsNewBookingClicked = false;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            } else {
                toastr.info("Record Already Opened...!");
            }

        }

        function AddTab(currentBooking, isNew) {
            BookingSupplierCtrl.ePage.Masters.currentBooking = undefined;

            var _isExist = BookingSupplierCtrl.ePage.Masters.TabList.some(function (value) {
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
                BookingSupplierCtrl.ePage.Masters.IsTabClick = true;
                var _currentBooking = undefined;
                if (!isNew) {
                    BookingSupplierCtrl.ePage.Masters.SaveButtonText = "Save";
                    _currentBooking = currentBooking.entity;
                } else {
                    BookingSupplierCtrl.ePage.Masters.SaveButtonText = "Submit Booking";
                    _currentBooking = currentBooking;
                }

                BookingSupplierConfig.GetTabDetails(_currentBooking, isNew).then(function (response) {
                    var _entity = {};
                    BookingSupplierCtrl.ePage.Masters.TabList = response;
                    if (BookingSupplierCtrl.ePage.Masters.TabList.length > 0) {
                        BookingSupplierCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentBooking.entity.ShipmentNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        BookingSupplierCtrl.ePage.Masters.activeTabIndex = BookingSupplierCtrl.ePage.Masters.TabList.length;
                        BookingSupplierCtrl.ePage.Masters.CurrentActiveTab(currentBooking.entity.ShipmentNo, _entity);
                        BookingSupplierCtrl.ePage.Masters.IsTabClick = false;
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
            apiService.get("eAxisAPI", BookingSupplierCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentBooking.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // BookingSupplierCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            BookingSupplierCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            BookingSupplierCtrl.ePage.Masters.currentBooking = currentTab;
            
            var _obj = {
                ModuleName: ["BookingSupplier"],
                Code: [currentTab],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    // Code: "E0013"
                },
                GroupCode: "TC_TEST",
                RelatedBasicDetails: [{
                    "UIField": "TEST",
                    "DbField": "TEST",
                    "Value": "TEST"
                }],
                EntityObject: entity,
                ErrorCode: []
            };
            errorWarningService.GetErrorCodeList(_obj);
            // errorWarningService.AddModuleToList("BookingSupplier", currentTab);
            // errorWarningService.AddModuleToList("BookingSupplier", currentTab + 'Container');
            // errorWarningService.AddModuleToList("BookingSupplier", currentTab + 'Package');
            // errorWarningService.AddModuleToList("BookingSupplier", currentTab + 'Sailing');
            // var _ValidationFilterObj = {
            //     ModuleCode: "SHP",
            //     SubModuleCode: "SHP"
            // };
            // errorWarningService.GetErrorCodeList("BookingSupplier", _ValidationFilterObj).then(function (response) {});

        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                BookingSupplierCtrl.ePage.Masters.AddTab($item.data, false);
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
                        BookingSupplierCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }

        function Save($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            helperService.scrollElement('top');
            var _obj = {
                ModuleName: ["BookingSupplier"],
                Code: [$item.code],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    // Code: "E0013"
                },
                GroupCode: "TC_TEST",
                EntityObject: $item[$item.label].ePage.Entities.Header.Data,
                 ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.BookingSupplier.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    BookingSupplierCtrl.ePage.Masters.config.ShowErrorWarningModal($item);
                } else {

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

                    if ($item.isNew) {
                        _input.UIShipmentHeader.PK = _input.PK;
                        _input.UIShipmentHeader.IsBooking = true
                        _input.UIShpExtendedInfo["Is" + _input.UIShipmentHeader.BookingType + "ApprovalRequired"] = false
                    } else {
                        $item = filterObjectUpdate($item, "IsModified");
                    }


                    helperService.SaveEntity($item, 'Booking').then(function (response) {
                        if (response.Status === "success") {
                            BookingSupplierConfig.TabList.map(function (value, key) {
                                if (value.New) {
                                    if (value.code == BookingSupplierCtrl.ePage.Masters.currentBooking) {
                                        value.label = BookingSupplierCtrl.ePage.Masters.currentBooking;
                                        value[BookingSupplierCtrl.ePage.Masters.currentBooking] = value.New;

                                        delete value.New;
                                    }
                                }
                            });

                            var _index = BookingSupplierConfig.TabList.map(function (value, key) {
                                return value.label;
                            }).indexOf(BookingSupplierCtrl.ePage.Masters.currentBooking);

                            if (_index !== -1) {
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UICustomEntity = response.Data.UICustomEntity;
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPickupAndDelivery = response.Data.UIJobPickupAndDelivery;
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShipmentHeader = response.Data.UIShipmentHeader;
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShpExtendedInfo = response.Data.UIShpExtendedInfo;
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UIPorOrderItem = response.Data.UIPorOrderItem;
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UIOrderHeaders = response.Data.UIOrderHeaders;
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobServices = response.Data.UIJobServices;
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UICntContainer = response.Data.UICntContainer;
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPackLines = response.Data.UIJobPackLines;
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UISailingList = response.Data.UISailingList;
                                BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobDocuments = response.Data.UIJobDocuments;
                                response.Data.UIJobAddress.map(function (val, key) {
                                    BookingSupplierConfig.TabList[_index][BookingSupplierConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                                });
                                // BookingSupplierConfig.TabList[_index].isNew = false;

                            }
                            var modalOptions = {
                                closeButtonText: 'Cancel',
                                closeButtonVisible: false,
                                actionButtonText: 'Ok',
                                headerText: 'Booking Created Successfully..',
                                bodyText: BookingSupplierCtrl.ePage.Masters.currentBooking
                            };

                            confirmation.showModal({}, modalOptions)
                                .then(function  (result) {
                                    BookingSupplierConfig.TabList.splice(_index, 1)
                                    helperService.refreshGrid();
                                }, function () {
                                    console.log("Cancelled");
                                });

                        } else if (response.Status === "failed") {
                            console.log("Failed");
                        }

                        BookingSupplierCtrl.ePage.Masters.SaveButtonText = "Save";
                        BookingSupplierCtrl.ePage.Masters.IsDisableSave = false;
                    });
                }
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