(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickGeneralController", PickGeneralController);

    PickGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "pickConfig", "helperService", "toastr", "$injector", "$window", "confirmation"];

    function PickGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, pickConfig, helperService, toastr, $injector, $window, confirmation) {

        var PickGeneralCtrl = this;
        var Config = $injector.get("outwardConfig");

        function Init() {

            var currentPick = PickGeneralCtrl.currentPick[PickGeneralCtrl.currentPick.label].ePage.Entities;

            PickGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Pick_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPick,
            };

            PickGeneralCtrl.ePage.Masters.SelectedLookupDataWarCode = SelectedLookupDataWarCode;
            PickGeneralCtrl.ePage.Masters.addnew = addnew;
            PickGeneralCtrl.ePage.Masters.attachOrders = attachOrders;
            PickGeneralCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
            PickGeneralCtrl.ePage.Masters.EditOrderDetails = EditOrderDetails;
            PickGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            PickGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            PickGeneralCtrl.ePage.Masters.GenerateReport = GenerateReport;

            PickGeneralCtrl.ePage.Masters.Config = pickConfig;

            PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.FinalisedDate = 'null';
            PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNumber = 'null';
            PickGeneralCtrl.ePage.Masters.DocumentText = [];

            PickGeneralCtrl.ePage.Masters.selectedRow = -1;
            PickGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            $rootScope.toCheckNew();

            // DatePicker
            PickGeneralCtrl.ePage.Masters.DatePicker = {};
            PickGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PickGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            PickGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            PickGeneralCtrl.ePage.Masters.CheckFutureDate = CheckFutureDate;

            getPickOrderList();
            generalOperations();
            GetDropDownList();
            GetDocuments();


        }


        function CheckFutureDate(fieldvalue,index) {
            var selectedDate = new Date(fieldvalue);
            var now = new Date();
            selectedDate.setHours(0,0,0,0);
            now.setHours(0,0,0,0);
            if (selectedDate > now) {
                OnChangeValues(null, 'E8012',true,index)
            } else {
                OnChangeValues('value','E8012',true,index)
            }
        }

        function GetDocuments() {
            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "WMS",
                "SubModuleCode": "WPK"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickGeneralCtrl.ePage.Masters.DocumentValues = response.data.Response;
                }
            });
        }

        function GenerateReport(item, index) {
            PickGeneralCtrl.ePage.Masters.DocumentText[index] = true;
            var _SearchInputConfig = JSON.parse(item.OtherConfig)
            var _output = helperService.getSearchInput(PickGeneralCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);

            if (_output) {

                _SearchInputConfig.DocumentSource = APP_CONSTANT.URL.eAxisAPI + _SearchInputConfig.DocumentSource;
                _SearchInputConfig.DocumentInput = _output;
                apiService.post("eAxisAPI", PickGeneralCtrl.ePage.Entities.Header.API.GenerateReport.Url, _SearchInputConfig).then(function SuccessCallback(response) {

                    function base64ToArrayBuffer(base64) {
                        var binaryString = window.atob(base64);
                        var binaryLen = binaryString.length;
                        var bytes = new Uint8Array(binaryLen);
                        for (var i = 0; i < binaryLen; i++) {
                            var ascii = binaryString.charCodeAt(i);
                            bytes[i] = ascii;
                        }
                        saveByteArray([bytes], item.Description + '.pdf');
                    }

                    var saveByteArray = (function () {
                        var a = document.createElement("a");
                        document.body.appendChild(a);
                        a.style = "display: none";
                        return function (data, name) {
                            var blob = new Blob(data, {
                                type: "octet/stream"
                            }),
                                url = window.URL.createObjectURL(blob);
                            a.href = url;
                            a.download = name;
                            a.click();
                            window.URL.revokeObjectURL(url);
                        };
                    } ());

                    base64ToArrayBuffer(response.data);
                    PickGeneralCtrl.ePage.Masters.DocumentText[index] = false;
                });
            }
        }

        $rootScope.toCheckNew = function () {
            if (PickGeneralCtrl.currentPick.isNew) {
                PickGeneralCtrl.ePage.Masters.Text = 'Please Save Your Pick To Attach Orders.';
                PickGeneralCtrl.ePage.Masters.IsDisabled = true;
            } else {
                PickGeneralCtrl.ePage.Masters.Text = 'No record found...';
                PickGeneralCtrl.ePage.Masters.IsDisabled = false;
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            PickGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["PickOption", "WMSYESNO"];
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
                        PickGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        PickGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function setSelectedRow(index) {
            PickGeneralCtrl.ePage.Masters.selectedRow = index;
        }
        function generalOperations() {
            if (PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode == null) {
                PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode = "";
            }
            if (PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName == null) {
                PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName = "";
            }

            PickGeneralCtrl.ePage.Masters.WarehouseCode = PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode + ' - ' + PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName;
            if (PickGeneralCtrl.ePage.Masters.WarehouseCode == ' - ')
                PickGeneralCtrl.ePage.Masters.WarehouseCode = "";
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            if (code == "E8011") {
                if (fieldvalue) {
                    PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickLineSummary[RowIndex].PickedQty = PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickLineSummary[RowIndex].Units;
                }
            }
            angular.forEach(PickGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                PickGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), PickGeneralCtrl.currentPick.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                PickGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), PickGeneralCtrl.currentPick.label, IsArray, RowIndex, value.ColIndex);
            }
        }
        // lookup warehouse
        function SelectedLookupDataWarCode(item) {
            if (item.entity) {
                PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName = item.entity.WarehouseName;
                PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode = item.entity.WarehouseCode;
                PickGeneralCtrl.ePage.Masters.WarehouseCode = PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode + ' - ' + PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName;
            } else {
                PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName = item.WarehouseName;
                PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode = item.WarehouseCode;
                PickGeneralCtrl.ePage.Masters.WarehouseCode = PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode + ' - ' + PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName;
            }

            OnChangeValues(PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode, 'E8003');
        }
        // get pick order list
        function getPickOrderList() {
            PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward = PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward;
        }
        // add new 
        function addnew() {
            var _queryString = {
                PK: null,
                WorkOrderID: null
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/pickorder/" + _queryString, "_blank");
        }
        // Edit Orders
        function EditOrderDetails(obj) {
            if (obj != undefined) {
                var _queryString = {
                    PK: obj.PK,
                    WorkOrderID: obj.WorkOrderID
                };
                _queryString = helperService.encryptData(_queryString);
                $window.open("#/EA/single-record-view/pickorder/" + _queryString, "_blank");
            } else {
                toastr.warning("Select the order for Edit");
            }
        }


        // attach orders
        function attachOrders($item) {
            angular.forEach($item, function (value, key) {
                apiService.get("eAxisAPI", 'WmsOutwardList/GetById/' + value.PK).then(function (response) {
                    if (response.data.Response.UIWmsWorkOrderLine.length > 0) {
                        if ($item.entity) {
                            var _isExist = PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.some(function (value, index) {
                                return value.PK === $item.entity.PK;
                            });
                            if (!_isExist) {
                                PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.push($item.entity);
                                AddMultipleOrders();
                            } else {
                                toastr.warning("Record Already Available...!");
                            }
                        } else {
                            $item.some(function (value, index) {
                                var _isExist = PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.some(function (value1, index1) {
                                    return value1.PK === value.PK;
                                });
                                if (!_isExist) {
                                    PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.push(value);
                                    AddMultipleOrders();
                                } else {
                                    toastr.warning(value.WorkOrderID + " Record Already Available...!");
                                }
                            });
                        }
                    } else {
                        toastr.warning("Order No:" + value.WorkOrderID + " having No Lines...!");
                    }
                });
            });
        }

        function AddMultipleOrders() {
            var item = filterObjectUpdate(PickGeneralCtrl.ePage.Entities.Header.Data, "IsModified");
            apiService.post("eAxisAPI", 'WmsPickList/Update', PickGeneralCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", 'WmsPickList/GetById/' + response.data.Response.PK).then(function (response) {
                        PickGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                        PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.FinalisedDate = 'null';
                        PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNumber = 'null';
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

        function DeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeletePickOrder($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeletePickOrder($item) {
            $item.IsDeleted = true;
            apiService.post("eAxisAPI", 'WmsPickList/Update', PickGeneralCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", 'WmsPickList/GetById/' + response.data.Response.PK).then(function (response) {
                        PickGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                        PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.FinalisedDate = 'null';
                        PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNumber = 'null';
                    });
                }
            });
        }

        Init();
    }

})();