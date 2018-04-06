(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReleaseDetailsController", ReleaseDetailsController);

    ReleaseDetailsController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "releaseConfig", "helperService", "appConfig", "authService", "$state", "$document", "$uibModal"];

    function ReleaseDetailsController($scope, $timeout, APP_CONSTANT, apiService, releaseConfig, helperService, appConfig, authService, $state, $document, $uibModal) {

        var ReleaseDetailsCtrl = this;

        function Init() {

            var currentRelease = ReleaseDetailsCtrl.currentRelease[ReleaseDetailsCtrl.currentRelease.label].ePage.Entities;

            ReleaseDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Release_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentRelease

            };

            ReleaseDetailsCtrl.ePage.Masters.SelectedLookupDataWarCode = SelectedLookupDataWarCode;
            ReleaseDetailsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ReleaseDetailsCtrl.ePage.Masters.Edit = Edit;
            ReleaseDetailsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ReleaseDetailsCtrl.ePage.Masters.FinaliseOrder = FinaliseOrder;
            ReleaseDetailsCtrl.ePage.Masters.GenerateReport = GenerateReport;

            ReleaseDetailsCtrl.ePage.Masters.Config = releaseConfig;

            ReleaseDetailsCtrl.ePage.Masters.selectedRow = -1;
            ReleaseDetailsCtrl.ePage.Masters.DropDownMasterList = {};

            if (ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatusDesc == 'Finalized') {
                ReleaseDetailsCtrl.ePage.Entities.Header.CheckPoints.IsDisableFeild = true;
            } else {
                ReleaseDetailsCtrl.ePage.Entities.Header.CheckPoints.IsDisableFeild = false;
            }

            ReleaseDetailsCtrl.ePage.Masters.DocumentText = [];
            // DatePicker
            ReleaseDetailsCtrl.ePage.Masters.DatePicker = {};
            ReleaseDetailsCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ReleaseDetailsCtrl.ePage.Masters.DatePicker.isOpen = [];
            ReleaseDetailsCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            
            generalOperation();
            GetDropDownList();
            GetDocuments();
        };

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ReleaseDetailsCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                    ReleaseDetailsCtrl.ePage.Masters.DocumentValues = response.data.Response;
                }
            });
        }

        function GenerateReport(item, index) {
            ReleaseDetailsCtrl.ePage.Masters.DocumentText[index] = true;
            var _SearchInputConfig = JSON.parse(item.OtherConfig)
            var _output = helperService.getSearchInput(ReleaseDetailsCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);

            if (_output) {

                _SearchInputConfig.DocumentSource = APP_CONSTANT.URL.eAxisAPI + _SearchInputConfig.DocumentSource;
                _SearchInputConfig.DocumentInput = _output;
                apiService.post("eAxisAPI", ReleaseDetailsCtrl.ePage.Entities.Header.API.GenerateReport.Url, _SearchInputConfig).then(function SuccessCallback(response) {

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
                    ReleaseDetailsCtrl.ePage.Masters.DocumentText[index] = false;
                });
            }
        }

        function FinaliseOrder(value) {
            value.FinalisedDate = new Date();
            value.WorkOrderStatus = 'FIN';
            value.WorkOrderStatusDesc = 'Finalised';
            ReleaseDetailsCtrl.ePage.Masters.IsLoading = true;
            var _Data = ReleaseDetailsCtrl.currentRelease[ReleaseDetailsCtrl.currentRelease.label].ePage.Entities,
                _input = _Data.Header.Data;

            ReleaseDetailsCtrl.currentRelease = filterObjectUpdate(ReleaseDetailsCtrl.currentRelease, "IsModified");

            helperService.SaveEntity(ReleaseDetailsCtrl.currentRelease, 'Pick').then(function (response) {
                ReleaseDetailsCtrl.ePage.Masters.SaveButtonText = "Save";
                ReleaseDetailsCtrl.ePage.Masters.IsLoading = false;
                // ReleaseDetailsCtrl.ePage.Masters.IsDisableSave = false;
                ReleaseDetailsCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (response.Status === "success") {
                    var _index = releaseConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ReleaseDetailsCtrl.currentRelease[ReleaseDetailsCtrl.currentRelease.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            releaseConfig.TabList[_index][releaseConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            releaseConfig.TabList[_index][releaseConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        releaseConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/releases") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    ReleaseDetailsCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ReleaseDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ReleaseDetailsCtrl.currentRelease.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ReleaseDetailsCtrl.ePage.Entities.Header.Validations != null) {
                        ReleaseDetailsCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleaseDetailsCtrl.currentRelease);
                    }
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
        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["PickOption"];
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
                        ReleaseDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ReleaseDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ReleaseDetailsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ReleaseDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ReleaseDetailsCtrl.currentRelease.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ReleaseDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), ReleaseDetailsCtrl.currentRelease.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function setSelectedRow(index) {
            ReleaseDetailsCtrl.ePage.Masters.selectedRow = index;
        }

        function Edit(item, action) {

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "general-edit right",
                scope: $scope,
                templateUrl: "app/eaxis/warehouse/wh-releases/wh-releases-details/wh-releases-order-details.html",
                controller: 'ReleaseOrderModalController as ReleaseOrderModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Data": item,
                            "Action": action,
                            "List": ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsOutward,
                            "currentRelease": ReleaseDetailsCtrl.ePage.Entities
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) { }
                );
        };

        function generalOperation() {
            if (ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode == null)
                ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode = "";
            if (ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName == null)
                ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName = "";

            ReleaseDetailsCtrl.ePage.Masters.WarehouseCode = ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode + ' - ' + ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName;

            if (ReleaseDetailsCtrl.ePage.Masters.WarehouseCode == ' - ') {
                ReleaseDetailsCtrl.ePage.Masters.WarehouseCode = "";
            }
        }

        // lookup warehouse
        function SelectedLookupDataWarCode(item) {
            if (item.entity) {
                ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName = item.entity.WarehouseName;
                ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode = item.entity.WarehouseCode;
                ReleaseDetailsCtrl.ePage.Masters.WarehouseCode = ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode + ' - ' + ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName;
            } else {
                ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName = item.WarehouseName;
                ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode = item.WarehouseCode;
                ReleaseDetailsCtrl.ePage.Masters.WarehouseCode = ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode + ' - ' + ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName;
            }
            OnChangeValues(ReleaseDetailsCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode, 'E8003');
        }

        Init();
    }
})();