(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingBranchController", BookingBranchController);

    BookingBranchController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "BookingBranchConfig", "toastr", "errorWarningService", "confirmation"];

    function BookingBranchController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, BookingBranchConfig, toastr, errorWarningService, confirmation) {
        /* jshint validthis: true */
        var BookingBranchCtrl = this;

        function Init() {
            BookingBranchCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": BookingBranchConfig.Entities
            };
            BookingBranchCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // For list directive
            BookingBranchCtrl.ePage.Masters.taskName = "Booking";
            BookingBranchCtrl.ePage.Masters.dataentryName = "Booking";
            BookingBranchCtrl.ePage.Masters.defaultFilter = {
                "IsBooking": "true"
            }
            BookingBranchCtrl.ePage.Masters.taskHeader = "";
            BookingBranchCtrl.ePage.Masters.config = BookingBranchConfig;
            console.log(authService.getUserInfo())
            // Remove all Tabs while load booking
            BookingBranchConfig.TabList = [];

            BookingBranchCtrl.ePage.Masters.BookingData = [];
            BookingBranchCtrl.ePage.Masters.TabList = [];
            BookingBranchCtrl.ePage.Masters.activeTabIndex = 0;
            BookingBranchCtrl.ePage.Masters.IsTabClick = false;
            BookingBranchCtrl.ePage.Masters.IsNewBookingClicked = false;

            // Functions
            BookingBranchCtrl.ePage.Masters.CreateNewBooking = CreateNewBooking;
            BookingBranchCtrl.ePage.Masters.AddTab = AddTab;
            BookingBranchCtrl.ePage.Masters.RemoveTab = RemoveTab;
            BookingBranchCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            BookingBranchCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            // Save
            BookingBranchCtrl.ePage.Masters.Save = Save;
            BookingBranchCtrl.ePage.Masters.SaveButtonText = "Save";
            BookingBranchCtrl.ePage.Masters.IsDisableSave = false;
            BookingBranchCtrl.ePage.Masters.SaveBookingApproval = "Send For Booking Approval";
            BookingBranchCtrl.ePage.Masters.SaveBookingVerified = "Submit Booking";
            BookingBranchCtrl.ePage.Masters.SaveBookingApprovalDisabled = false;
            BookingBranchCtrl.ePage.Masters.SaveBookingVerifiedDisabled = false;
            BookingBranchCtrl.ePage.Masters.SaveBothButtonDisabled = false

            CheckUserBasedMenuVisibleType();
        }

        function CreateNewBooking() {

            var _isExist = BookingBranchCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                BookingBranchCtrl.ePage.Masters.IsNewBookingClicked = true;

                helperService.getFullObjectUsingGetById(BookingBranchCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response.UIShipmentHeader.BookingType = "CB"
                        response.data.Response.Response.UIShipmentHeader.IsBooking = true
                        response.data.Response.Response.DocumentDetails = []
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response
                        };

                        BookingBranchCtrl.ePage.Masters.AddTab(_obj, true);
                        BookingBranchCtrl.ePage.Masters.IsNewBookingClicked = false;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            } else {
                toastr.info("Record Already Opened...!");
            }

        }

        function AddTab(currentBooking, isNew) {
            BookingBranchCtrl.ePage.Masters.currentBooking = undefined;

            var _isExist = BookingBranchCtrl.ePage.Masters.TabList.some(function (value) {
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
                BookingBranchCtrl.ePage.Masters.IsTabClick = true;
                var _currentBooking = undefined;
                if (!isNew) {
                    _currentBooking = currentBooking.entity;
                } else {
                    _currentBooking = currentBooking;
                }

                BookingBranchConfig.GetTabDetails(_currentBooking, isNew).then(function (response) {
                    var _entity = {};
                    BookingBranchCtrl.ePage.Masters.TabList = response;

                    if (BookingBranchCtrl.ePage.Masters.TabList.length > 0) {
                        BookingBranchCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentBooking.entity.ShipmentNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        BookingBranchCtrl.ePage.Masters.activeTabIndex = BookingBranchCtrl.ePage.Masters.TabList.length;
                        BookingBranchCtrl.ePage.Masters.CurrentActiveTab(currentBooking.entity.ShipmentNo, _entity);
                        BookingBranchCtrl.ePage.Masters.IsTabClick = false;
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
            apiService.get("eAxisAPI", BookingBranchCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentBooking.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // BookingBranchCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            BookingBranchCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            BookingBranchCtrl.ePage.Masters.currentBooking = currentTab;
            var _obj = {
                ModuleName: ["BookingBranch"],
                Code: [currentTab],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    // Code: "E0013"
                },
                GroupCode: "TC_Test",
                RelatedBasicDetails: [{
                    "UIField": "TEST",
                    "DbField": "TEST",
                    "Value": "TEST"
                }],
                EntityObject: entity,
                // ErrorCode: ["E0013"]
            };

            errorWarningService.GetErrorCodeList(_obj);
            // errorWarningService.AddModuleToList("BookingBranch", currentTab);
            // errorWarningService.AddModuleToList("BookingBranch", currentTab + 'Container');
            // errorWarningService.AddModuleToList("BookingBranch", currentTab + 'Package');
            // errorWarningService.AddModuleToList("BookingBranch", currentTab + 'Sailing');
            // var _ValidationFilterObj = {
            //     ModuleCode: "SHP",
            //     SubModuleCode: "SHP"
            // };
            // errorWarningService.GetErrorCodeList("BookingBranch", _ValidationFilterObj).then(function (response) {});
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                BookingBranchCtrl.ePage.Masters.AddTab($item.data, false);
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
                        BookingBranchCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }

        function Save($item, type, flag) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            helperService.scrollElement('top')
            var _obj = {
                ModuleName: ["BookingBranch"],
                Code: [$item.code],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    // Code: "E0013"
                },
                GroupCode: "TC_Test",
                RelatedBasicDetails: [{
                    "UIField": "TEST",
                    "DbField": "TEST",
                    "Value": "TEST"
                }],
                EntityObject: $item[$item.label].ePage.Entities.Header.Data,
                // ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.BookingBranch.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    BookingBranchCtrl.ePage.Masters.config.ShowErrorWarningModal($item);
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
                        BookingBranchCtrl.ePage.Masters["SaveBooking" + type + "Disabled"] = true;
                        BookingBranchCtrl.ePage.Masters.SaveBothButtonDisabled = true
                        BookingBranchCtrl.ePage.Masters["SaveBooking" + type] = "Please wait";
                        _input.UIShipmentHeader.PK = _input.PK;
                        if (type == 'Approval') {
                            _input.UIShpExtendedInfo["Is" + _input.UIShipmentHeader.BookingType + flag] = true
                        } else {
                            _input.UIShpExtendedInfo["Is" + _input.UIShipmentHeader.BookingType + flag] = false
                        }

                    } else {
                        BookingBranchCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                        BookingBranchCtrl.ePage.Masters.IsDisableSave = true;
                        $item = filterObjectUpdate($item, "IsModified");
                    }


                    helperService.SaveEntity($item, 'Booking').then(function (response) {
                        if (response.Status === "success") {
                            BookingBranchConfig.TabList.map(function (value, key) {
                                if (value.New) {
                                    if (value.code == BookingBranchCtrl.ePage.Masters.currentBooking) {
                                        value.label = BookingBranchCtrl.ePage.Masters.currentBooking;
                                        value[BookingBranchCtrl.ePage.Masters.currentBooking] = value.New;

                                        delete value.New;
                                    }
                                }
                            });

                            var _index = BookingBranchConfig.TabList.map(function (value, key) {
                                return value.label;
                            }).indexOf(BookingBranchCtrl.ePage.Masters.currentBooking);

                            if (_index !== -1) {
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UICustomEntity = response.Data.UICustomEntity;
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPickupAndDelivery = response.Data.UIJobPickupAndDelivery;
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShipmentHeader = response.Data.UIShipmentHeader;
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShpExtendedInfo = response.Data.UIShpExtendedInfo;
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UIPorOrderItem = response.Data.UIPorOrderItem;
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UIOrderHeaders = response.Data.UIOrderHeaders;
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobServices = response.Data.UIJobServices;
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UICntContainer = response.Data.UICntContainer;
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPackLines = response.Data.UIJobPackLines;
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UISailingList = response.Data.UISailingList;
                                BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobDocuments = response.Data.UIJobDocuments;
                                response.Data.UIJobAddress.map(function (val, key) {
                                    BookingBranchConfig.TabList[_index][BookingBranchConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                                });
                                if (BookingBranchConfig.TabList[_index].isNew) {
                                    BookingBranchCtrl.ePage.Masters["SaveBooking" + type + "Disabled"] = false;
                                    BookingBranchCtrl.ePage.Masters.SaveBothButtonDisabled = false
                                    if (type == 'Approval') {
                                        BookingBranchCtrl.ePage.Masters["SaveBooking" + type] = 'Send For Booking Approval'
                                    } else {
                                        BookingBranchCtrl.ePage.Masters["SaveBooking" + type] = 'Confirm Booking'
                                    }
                                } else {
                                    BookingBranchCtrl.ePage.Masters.SaveButtonText = "Save";
                                    BookingBranchCtrl.ePage.Masters.IsDisableSave = false;
                                }
                                // BookingBranchConfig.TabList[_index].isNew = false;
                            }
                            var modalOptions = {
                                closeButtonText: 'Cancel',
                                closeButtonVisible: false,
                                actionButtonText: 'Ok',
                                headerText: 'Booking Created Successfully..',
                                bodyText: BookingBranchCtrl.ePage.Masters.currentBooking
                            };

                            confirmation.showModal({}, modalOptions)
                                .then(function (result) {
                                    BookingBranchConfig.TabList.splice(_index, 1)
                                    helperService.refreshGrid();
                                }, function () {
                                    console.log("Cancelled");
                                });

                        } else if (response.Status === "failed") {
                            console.log("Failed");
                        }

                    });
                }
            });

        }

        function JobInsertInput(type, _input, obj) {
            var _jobInput = {
                "PK": "",
                "EntityRefKey": obj.PK,
                "EntitySource": "SHP",
                "CommentsType": type,
                "Comments": obj[_input + "Comments"]
            }
            obj.UIJobComments.push(_jobInput);
            obj[_input + "Comments"] = ''
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