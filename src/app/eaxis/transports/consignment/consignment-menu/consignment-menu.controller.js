(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AdminConsignmentMenuController", AdminConsignmentMenuController);

    AdminConsignmentMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "adminConsignmentConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "toastr"];

    function AdminConsignmentMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, adminConsignmentConfig, helperService, appConfig, authService, $state, confirmation, toastr) {

        var AdminConsignmentMenuCtrl = this;

        function Init() {

            var currentConsignment = AdminConsignmentMenuCtrl.currentConsignment[AdminConsignmentMenuCtrl.currentConsignment.label].ePage.Entities;

            AdminConsignmentMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment

            };

            // function
            AdminConsignmentMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            AdminConsignmentMenuCtrl.ePage.Masters.Validation = Validation;

            AdminConsignmentMenuCtrl.ePage.Masters.Config = adminConsignmentConfig;
            AdminConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            AdminConsignmentMenuCtrl.ePage.Masters.SubmitButtonText = "Submit";
            AdminConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
            AdminConsignmentMenuCtrl.ePage.Masters.ShowMoreText = true;

            AdminConsignmentMenuCtrl.ePage.Masters.Print = Print;
            AdminConsignmentMenuCtrl.ePage.Masters.Cancel = Cancel;
            AdminConsignmentMenuCtrl.ePage.Masters.Submit = Submit;

            AdminConsignmentMenuCtrl.ePage.Masters.ConsignmentMenu = {};
            AdminConsignmentMenuCtrl.ePage.Masters.DropDownMasterList = {};

            AdminConsignmentMenuCtrl.ePage.Masters.IsMore = false;
            // Menu list from configuration
            AdminConsignmentMenuCtrl.ePage.Masters.ConsignmentMenu.ListSource = AdminConsignmentMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            GetDocuments()
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(AdminConsignmentMenuCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                AdminConsignmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), AdminConsignmentMenuCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                AdminConsignmentMenuCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), AdminConsignmentMenuCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function Submit($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data

            if (_input.TmsConsignmentItem.length > 0) {
                AdminConsignmentMenuCtrl.ePage.Masters.IsSubmitted = true;
                AdminConsignmentMenuCtrl.ePage.Masters.SubmitButtonText = "Please Wait..";
                var _Data = $item[$item.label].ePage.Entities,
                    _input = _Data.Header.Data;

                _input.TmsConsignmentHeader.IsSubmitted = true;
                Validation($item);
            } else {
                toastr.error("It can be submitted when the consignment item is available");
            }
        }

        function Cancel($item) {
            AdminConsignmentMenuCtrl.ePage.Masters.IsMore = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if (_input.TmsConsignmentItem.length == 0) {
                _input.TmsConsignmentHeader.IsCancel = true;
                Save($item);
            } else {
                toastr.warning("Before cancel the Consignment detach all the Consignment Items in this Consignment");
            }
        }

        function Print(item) {
            AdminConsignmentMenuCtrl.ePage.Masters.ShowMoreText = false;
            var _SearchInputConfig = JSON.parse(item.OtherConfig)
            var _output = helperService.getSearchInput(AdminConsignmentMenuCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);

            if (_output) {

                _SearchInputConfig.DocumentSource = APP_CONSTANT.URL.eAxisAPI + _SearchInputConfig.DocumentSource;
                _SearchInputConfig.DocumentInput = _output;
                apiService.post("eAxisAPI", AdminConsignmentMenuCtrl.ePage.Entities.Header.API.GenerateReport.Url, _SearchInputConfig).then(function SuccessCallback(response) {

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
                    }());

                    base64ToArrayBuffer(response.data);
                    AdminConsignmentMenuCtrl.ePage.Masters.ShowMoreText = true;
                });
            }
        }

        function GetDocuments() {
            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "TMS",
                "SubModuleCode": "CON"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AdminConsignmentMenuCtrl.ePage.Masters.DocumentValues = response.data.Response;
                }
            });
        }

        function SaveClose($item) {
            AdminConsignmentMenuCtrl.ePage.Masters.SaveAndClose = true;
            Validation($item);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            if (_input.TmsConsignmentItem.length > 0) {
                var ReturnValue = RemoveAllLineErrors();
            }

            if (_input.Consignmentorders.length > 0) {
                var ReturnValue = RemoveAllOrdersErrors();
            }

            //Validation Call
            AdminConsignmentMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (AdminConsignmentMenuCtrl.ePage.Entities.Header.Validations) {
                AdminConsignmentMenuCtrl.ePage.Masters.Config.RemoveApiErrors(AdminConsignmentMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                _input.TmsConsignmentHeader.IsSubmitted = false;
                AdminConsignmentMenuCtrl.ePage.Masters.SubmitButtonText = "Submit";
                AdminConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdminConsignmentMenuCtrl.currentConsignment);
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < AdminConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length; i++) {
                OnChangeValues('value', "E5547", true, i);
                OnChangeValues('value', "E5548", true, i);
            }
            return true;
        }

        function RemoveAllOrdersErrors() {
            for (var i = 0; i < AdminConsignmentMenuCtrl.ePage.Entities.Header.Data.Consignmentorders.length; i++) {
                OnChangeValues('value', "E5551", true, i);
                OnChangeValues('value', "E5552", true, i);
                OnChangeValues('value', "E5553", true, i);
            }
            return true;
        }

        function Save($item) {
            if (AdminConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                AdminConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else if (AdminConsignmentMenuCtrl.ePage.Masters.IsMore) {
                AdminConsignmentMenuCtrl.ePage.Masters.ShowMoreText = false;
            } else if (AdminConsignmentMenuCtrl.ePage.Masters.IsSubmitted) {
                AdminConsignmentMenuCtrl.ePage.Masters.SubmitButtonText = "Please Wait...";
            } else {
                AdminConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            AdminConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsConsignmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            _input.TmsConsignmentItem.map(function (value, key) {
                value.TMC_FK = _input.TmsConsignmentHeader.PK;
            });

            helperService.SaveEntity($item, 'Consignment').then(function (response) {
                AdminConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (AdminConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                    AdminConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else if (AdminConsignmentMenuCtrl.ePage.Masters.IsMore) {
                    AdminConsignmentMenuCtrl.ePage.Masters.ShowMoreText = true;
                } else if (AdminConsignmentMenuCtrl.ePage.Masters.IsSubmitted) {
                    AdminConsignmentMenuCtrl.ePage.Masters.SubmitButtonText = "Submit";
                } else {
                    AdminConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }
                AdminConsignmentMenuCtrl.ePage.Masters.IsSubmitted = false;
                if (response.Status === "success") {

                    var _index = adminConsignmentConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(AdminConsignmentMenuCtrl.currentConsignment[AdminConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (AdminConsignmentMenuCtrl.currentConsignment[AdminConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsCancel != true) {
                            // apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + AdminConsignmentMenuCtrl.currentConsignment[AdminConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK).then(function (response) {
                            if (response.Data.Response) {
                                adminConsignmentConfig.TabList[_index][adminConsignmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                            } else {
                                adminConsignmentConfig.TabList[_index][adminConsignmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            }
                            adminConsignmentConfig.TabList.map(function (value, key) {
                                if (_index == key) {
                                    if (value.New) {
                                        value.label = response.Data.TmsConsignmentHeader.ConsignmentNumber;
                                        value[AdminConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber] = value.New;

                                        delete value.New;
                                    }
                                }
                            });
                            if (AdminConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.IsSubmitted == true) {
                                AdminConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
                            }
                            // }
                            // });
                            toastr.success("Saved Successfully");
                        } else {
                            toastr.success("Cancelled Successfully");
                            AdminConsignmentMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        }

                        if (AdminConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                            AdminConsignmentMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            AdminConsignmentMenuCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        adminConsignmentConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/consignment") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    AdminConsignmentMenuCtrl.ePage.Masters.IsMore = false;
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("save failed");
                    AdminConsignmentMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        AdminConsignmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), AdminConsignmentMenuCtrl.currentConsignment.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (AdminConsignmentMenuCtrl.ePage.Entities.Header.Validations != null) {
                        AdminConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdminConsignmentMenuCtrl.currentConsignment);
                    }
                    AdminConsignmentMenuCtrl.ePage.Masters.IsMore = false;
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