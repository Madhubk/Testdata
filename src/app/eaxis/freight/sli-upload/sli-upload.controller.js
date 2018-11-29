(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SLIUploadController", SLIUploadController);

    SLIUploadController.$inject = ["$timeout", "authService", "apiService", "helperService", "appConfig", "SLIUploadConfig", "toastr", "errorWarningService"];

    function SLIUploadController($timeout, authService, apiService, helperService, appConfig, SLIUploadConfig, toastr, errorWarningService) {
        /* jshint validthis: true */
        var SLIUploadCtrl = this;

        function Init() {
            SLIUploadCtrl.ePage = {
                "Title": "",
                "Prefix": "SLI_Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": SLIUploadConfig.Entities
            };
            SLIUploadCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // For list directive
            SLIUploadCtrl.ePage.Masters.taskName = "Booking";
            SLIUploadCtrl.ePage.Masters.dataentryName = "Booking";
            SLIUploadCtrl.ePage.Masters.defaultFilter = {
                "IsBooking": "true"
            }
            SLIUploadCtrl.ePage.Masters.taskHeader = "";
            SLIUploadCtrl.ePage.Masters.config = SLIUploadConfig;

            // Remove all Tabs while load booking
            SLIUploadConfig.TabList = [];

            SLIUploadCtrl.ePage.Masters.BookingData = [];
            SLIUploadCtrl.ePage.Masters.TabList = [];
            SLIUploadCtrl.ePage.Masters.activeTabIndex = 0;
            SLIUploadCtrl.ePage.Masters.IsTabClick = false;
            SLIUploadCtrl.ePage.Masters.IsNewBookingClicked = false;

            // Functions
            SLIUploadCtrl.ePage.Masters.CreateNewBooking = CreateNewBooking;
            SLIUploadCtrl.ePage.Masters.AddTab = AddTab;
            SLIUploadCtrl.ePage.Masters.RemoveTab = RemoveTab;
            SLIUploadCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            SLIUploadCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            // Save
            SLIUploadCtrl.ePage.Masters.Save = Save;
            SLIUploadCtrl.ePage.Masters.SaveButtonText = "Submit";
            SLIUploadCtrl.ePage.Masters.IsDisableSave = false;
            CheckUserBasedMenuVisibleType();
        }

        function CreateNewBooking() {
            var _isExist = SLIUploadCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                SLIUploadCtrl.ePage.Masters.IsNewBookingClicked = true;

                helperService.getFullObjectUsingGetById(SLIUploadCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response
                        };

                        SLIUploadCtrl.ePage.Masters.AddTab(_obj, true);
                        SLIUploadCtrl.ePage.Masters.IsNewBookingClicked = false;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab(currentSLI, isNew) {
            SLIUploadCtrl.ePage.Masters.currentSLI = undefined;

            var _isExist = SLIUploadCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentSLI.entity.ShipmentNo)
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
                SLIUploadCtrl.ePage.Masters.IsTabClick = true;
                var _currentSLI = undefined;
                if (!isNew) {
                    _currentSLI = currentSLI.entity;
                } else {
                    _currentSLI = currentSLI;
                }

                SLIUploadConfig.GetTabDetails(_currentSLI, isNew).then(function (response) {
                    SLIUploadCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        SLIUploadCtrl.ePage.Masters.activeTabIndex = SLIUploadCtrl.ePage.Masters.TabList.length;
                        SLIUploadCtrl.ePage.Masters.CurrentActiveTab(currentSLI.entity.ShipmentNo);
                        SLIUploadCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentSLI) {
            event.preventDefault();
            event.stopPropagation();
            var _currentSLI = currentSLI[currentSLI.label].ePage.Entities;

            // Close Current Booking
            apiService.get("eAxisAPI", SLIUploadCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentSLI.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // SLIUploadCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            SLIUploadCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            SLIUploadCtrl.ePage.Masters.currentSLI = currentTab;
            errorWarningService.AddModuleToList("SLIUpload", currentTab);
            var _ValidationFilterObj = {
                ModuleCode: "SHP",
                SubModuleCode: "SHP"
            };
            errorWarningService.GetErrorCodeList("SLIUpload", _ValidationFilterObj).then(function (response) {});
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                SLIUploadCtrl.ePage.Masters.AddTab($item.data, false);
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
                        SLIUploadCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }

        function Save($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            helperService.scrollElement('top');
            SLIUploadConfig.GeneralValidation($item).then(function (response) {
                var _errorcount = errorWarningService.Modules.SLIUpload.Entity[$item.code].GlobalErrorWarningList;
                SLIUploadCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.SLIUpload.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    SLIUploadCtrl.ePage.Masters.IsDisableSave = true;
                    SLIUploadCtrl.ePage.Masters.SaveButtonText = "Please wait";
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
                        _input.UIShipmentHeader.IsBooking = true;
                    } else {
                        $item = filterObjectUpdate($item, "IsModified");
                    }

                    helperService.SaveEntity($item, 'Booking').then(function (response) {
                        if (response.Status === "success") {
                            SLIUploadConfig.TabList.map(function (value, key) {
                                if (value.New) {
                                    if (value.code == SLIUploadCtrl.ePage.Masters.currentSLI) {
                                        value.label = SLIUploadCtrl.ePage.Masters.currentSLI;
                                        value[SLIUploadCtrl.ePage.Masters.currentSLI] = value.New;

                                        delete value.New;
                                    }
                                    InitiateSLIProcess($item);
                                }
                            });

                            var _index = SLIUploadConfig.TabList.map(function (value, key) {
                                return value.label;
                            }).indexOf(SLIUploadCtrl.ePage.Masters.currentSLI);

                            if (_index !== -1) {
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UICustomEntity = response.Data.UICustomEntity;
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPickupAndDelivery = response.Data.UIJobPickupAndDelivery;
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShipmentHeader = response.Data.UIShipmentHeader;
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShpExtendedInfo = response.Data.UIShpExtendedInfo;
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UIPorOrderItem = response.Data.UIPorOrderItem;
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UIOrderHeaders = response.Data.UIOrderHeaders;
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobServices = response.Data.UIJobServices;
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UICntContainer = response.Data.UICntContainer;
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPackLines = response.Data.UIJobPackLines;
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UISailingList = response.Data.UISailingList;
                                SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobDocuments = response.Data.UIJobDocuments;
                                response.Data.UIJobAddress.map(function (val, key) {
                                    SLIUploadConfig.TabList[_index][SLIUploadConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                                });
                                if (SLIUploadConfig.TabList[_index].isNew) {
                                    SLIUploadCtrl.ePage.Masters.IsDisableSave = false;
                                    SLIUploadCtrl.ePage.Masters.SaveButtonText = "Save";
                                } else {
                                    SLIUploadCtrl.ePage.Masters.SaveButtonText = "Save";
                                    SLIUploadCtrl.ePage.Masters.IsDisableSave = false;
                                }
                                SLIUploadConfig.TabList[_index].isNew = false;
                                helperService.refreshGrid();
                            }

                        } else if (response.Status === "failed") {
                            SLIUploadCtrl.ePage.Masters.IsDisableSave = false;
                            SLIUploadCtrl.ePage.Masters.SaveButtonText = "Save";
                        }
                    });
                } else {
                    SLIUploadCtrl.ePage.Masters.config.ShowErrorWarningModal($item);
                }
            });
        }

        function InitiateSLIProcess($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            var _inputData = {
                EntityRefCode : _input.UIShipmentHeader.ShipmentNo,
                EntityRefKey : _input.PK
            }
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.InitiateUploadSLI.Url, _inputData).then(function (response) {
                if(response.data.Response){
                    console.log("Successfully initiated...");
                } else {
                    toastr.error("Task Initiation Failed...");
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