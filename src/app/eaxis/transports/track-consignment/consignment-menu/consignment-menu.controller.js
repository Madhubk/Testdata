(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentMenuController", ConsignmentMenuController);

    ConsignmentMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "consignmentConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "toastr"];

    function ConsignmentMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, consignmentConfig, helperService, appConfig, authService, $state, confirmation, toastr) {

        var ConsignmentMenuCtrl = this;

        function Init() {

            var currentConsignment = ConsignmentMenuCtrl.currentConsignment[ConsignmentMenuCtrl.currentConsignment.label].ePage.Entities;

            ConsignmentMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment

            };

            // function
            ConsignmentMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            ConsignmentMenuCtrl.ePage.Masters.Validation = Validation;
            ConsignmentMenuCtrl.ePage.Masters.Cancel = Cancel;
            ConsignmentMenuCtrl.ePage.Masters.Print = Print;
            ConsignmentMenuCtrl.ePage.Masters.Submit = Submit;

            ConsignmentMenuCtrl.ePage.Masters.Config = consignmentConfig;
            ConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ConsignmentMenuCtrl.ePage.Masters.SubmitButtonText = "Submit";
            ConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
            ConsignmentMenuCtrl.ePage.Masters.ShowMoreText = true;

            ConsignmentMenuCtrl.ePage.Masters.IsShowError = ConsignmentMenuCtrl.showError;

            ConsignmentMenuCtrl.ePage.Masters.ConsignmentMenu = {};
            ConsignmentMenuCtrl.ePage.Masters.DropDownMasterList = {};
            ConsignmentMenuCtrl.ePage.Masters.IsActiveMenu = ConsignmentMenuCtrl.activeMenu;

            ConsignmentMenuCtrl.ePage.Masters.IsMore = false;

            // Menu list from configuration
            ConsignmentMenuCtrl.ePage.Masters.ConsignmentMenu.ListSource = ConsignmentMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            GetDocuments();
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ConsignmentMenuCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ConsignmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ConsignmentMenuCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ConsignmentMenuCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), ConsignmentMenuCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function Submit($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data

            if (_input.TmsConsignmentItem.length > 0) {
                ConsignmentMenuCtrl.ePage.Masters.IsSubmitted = true;
                ConsignmentMenuCtrl.ePage.Masters.SubmitButtonText = "Please Wait..";
                var _Data = $item[$item.label].ePage.Entities,
                    _input = _Data.Header.Data;

                _input.TmsConsignmentHeader.IsSubmitted = true;
                Validation($item);
            } else {
                toastr.error("It can be submitted when the consignment item is available");
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
                    ConsignmentMenuCtrl.ePage.Masters.DocumentValues = response.data.Response;
                }
            });
        }

        function Print(item) {
            ConsignmentMenuCtrl.ePage.Masters.ShowMoreText = false;
            var _SearchInputConfig = JSON.parse(item.OtherConfig)
            var _output = helperService.getSearchInput(ConsignmentMenuCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);

            if (_output) {

                _SearchInputConfig.DocumentSource = APP_CONSTANT.URL.eAxisAPI + _SearchInputConfig.DocumentSource;
                _SearchInputConfig.DocumentInput = _output;
                apiService.post("eAxisAPI", ConsignmentMenuCtrl.ePage.Entities.Header.API.GenerateReport.Url, _SearchInputConfig).then(function SuccessCallback(response) {

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
                    ConsignmentMenuCtrl.ePage.Masters.ShowMoreText = true;
                });
            }
        }

        function Cancel($item) {
            ConsignmentMenuCtrl.ePage.Masters.IsMore = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if (_input.TmsConsignmentItem.length == 0) {
                _input.TmsConsignmentHeader.IsCancel = true;
                Save($item);
            } else {
                toastr.warning("Before cancel the Consignment detach all the Consignment Items in this Consignment");
            }
        }

        function SaveClose($item) {
            ConsignmentMenuCtrl.ePage.Masters.SaveAndClose = true;
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
            ConsignmentMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ConsignmentMenuCtrl.ePage.Entities.Header.Validations) {
                ConsignmentMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ConsignmentMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                _input.TmsConsignmentHeader.IsSubmitted = false;
                ConsignmentMenuCtrl.ePage.Masters.SubmitButtonText = "Submit";
                ConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConsignmentMenuCtrl.currentConsignment);
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < ConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length; i++) {
                OnChangeValues('value', "E5547", true, i);
                OnChangeValues('value', "E5548", true, i);
            }
            return true;
        }

        function RemoveAllOrdersErrors() {
            for (var i = 0; i < ConsignmentMenuCtrl.ePage.Entities.Header.Data.Consignmentorders.length; i++) {
                OnChangeValues('value', "E5551", true, i);
                OnChangeValues('value', "E5552", true, i);
                OnChangeValues('value', "E5553", true, i);
            }
            return true;
        }

        function Save($item) {
            if (ConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                ConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else if (ConsignmentMenuCtrl.ePage.Masters.IsMore) {
                ConsignmentMenuCtrl.ePage.Masters.ShowMoreText = false;
            } else if (ConsignmentMenuCtrl.ePage.Masters.IsSubmitted) {
                ConsignmentMenuCtrl.ePage.Masters.SubmitButtonText = "Please Wait...";
            } else {
                ConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            ConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

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
                ConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (ConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                    ConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else if (ConsignmentMenuCtrl.ePage.Masters.IsMore) {
                    ConsignmentMenuCtrl.ePage.Masters.ShowMoreText = true;
                } else if (ConsignmentMenuCtrl.ePage.Masters.IsSubmitted) {
                    ConsignmentMenuCtrl.ePage.Masters.SubmitButtonText = "Submit";
                } else {
                    ConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }
                ConsignmentMenuCtrl.ePage.Masters.IsSubmitted = false;
                if (response.Status === "success") {
                    if(response.Data.Status == "success"){
                        var _index = consignmentConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                        }).indexOf(ConsignmentMenuCtrl.currentConsignment[ConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            if (ConsignmentMenuCtrl.currentConsignment[ConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsCancel != true) {
                                // apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + ConsignmentMenuCtrl.currentConsignment[ConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                //     if (response.data.Response) {
                                if (response.Data.Response) {
                                    consignmentConfig.TabList[_index][consignmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                                } else {
                                    consignmentConfig.TabList[_index][consignmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                                }
                                consignmentConfig.TabList.map(function (value, key) {
                                    if (_index == key) {
                                        if (value.New) {
                                            value.label = response.Data.TmsConsignmentHeader.ConsignmentNumber;
                                            value[ConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber] = value.New;
                                            delete value.New;
                                        }
                                    }
                                });
                                if (ConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.IsSubmitted == true) {
                                    ConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
                                }
                                //     }
                                // });
                                toastr.success("Saved Successfully");
                            } else {
                                toastr.success("Cancelled Successfully");
                                ConsignmentMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            }

                            if (ConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                                ConsignmentMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                                ConsignmentMenuCtrl.ePage.Masters.SaveAndClose = false;
                            }
                            consignmentConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/track-consignment") {
                                helperService.refreshGrid();
                            }
                        }
                        ConsignmentMenuCtrl.ePage.Masters.IsMore = false;
                        console.log("Success");    
                    }else if(response.Data.Status == "ValidationFailed"){
                        if(response.Data.Validations[0].Code == "E5571"){
                             toastr.error(response.data.Validations[0].Message); 
                        }
                    }
                } else if (response.Status === "failed") {
                    toastr.error("save failed");
                    ConsignmentMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ConsignmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ConsignmentMenuCtrl.currentConsignment.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ConsignmentMenuCtrl.ePage.Entities.Header.Validations != null) {
                        ConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConsignmentMenuCtrl.currentConsignment);
                    }
                    ConsignmentMenuCtrl.ePage.Masters.IsMore = false;
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