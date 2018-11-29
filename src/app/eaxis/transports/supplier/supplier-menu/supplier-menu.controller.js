(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SupplierMenuController", SupplierMenuController);

    SupplierMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "supplierConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "toastr"];

    function SupplierMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, supplierConfig, helperService, appConfig, authService, $state, confirmation, toastr) {

        var SupplierMenuCtrl = this;

        function Init() {

            var currentSupplier = SupplierMenuCtrl.currentSupplier[SupplierMenuCtrl.currentSupplier.label].ePage.Entities;

            SupplierMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentSupplier

            };

            // function
            SupplierMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            SupplierMenuCtrl.ePage.Masters.Validation = Validation;
            SupplierMenuCtrl.ePage.Masters.Cancel = Cancel;
            SupplierMenuCtrl.ePage.Masters.Print = Print;

            SupplierMenuCtrl.ePage.Masters.Config = supplierConfig;
            SupplierMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            SupplierMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
            SupplierMenuCtrl.ePage.Masters.ShowMoreText = true;

            SupplierMenuCtrl.ePage.Masters.SupplierMenu = {};
            SupplierMenuCtrl.ePage.Masters.DropDownMasterList = {};

            SupplierMenuCtrl.ePage.Masters.IsMore = false;
            // Menu list from configuration
            SupplierMenuCtrl.ePage.Masters.SupplierMenu.ListSource = SupplierMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            GetDocuments();
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
                    SupplierMenuCtrl.ePage.Masters.DocumentValues = response.data.Response;
                }
            });
        }

        function Print(item) {
            SupplierMenuCtrl.ePage.Masters.ShowMoreText = false;
            var _SearchInputConfig = JSON.parse(item.OtherConfig)
            var _output = helperService.getSearchInput(SupplierMenuCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);

            if (_output) {

                _SearchInputConfig.DocumentSource = APP_CONSTANT.URL.eAxisAPI + _SearchInputConfig.DocumentSource;
                _SearchInputConfig.DocumentInput = _output;
                apiService.post("eAxisAPI", SupplierMenuCtrl.ePage.Entities.Header.API.GenerateReport.Url, _SearchInputConfig).then(function SuccessCallback(response) {

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
                    SupplierMenuCtrl.ePage.Masters.ShowMoreText = true;
                });
            }
        }

        function Cancel($item) {
            SupplierMenuCtrl.ePage.Masters.IsMore = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if (_input.TmsConsignmentItem.length == 0) {
                _input.TmsConsignmentHeader.IsCancel = true;
                Save($item);
            } else {
                toastr.warning("Before cancel the Supplier detach all the Supplier Items in this Supplier");
            }
        }

        function SaveClose($item) {
            SupplierMenuCtrl.ePage.Masters.SaveAndClose = true;
            Validation($item);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            SupplierMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (SupplierMenuCtrl.ePage.Entities.Header.Validations) {
                SupplierMenuCtrl.ePage.Masters.Config.RemoveApiErrors(SupplierMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                SupplierMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(SupplierMenuCtrl.currentSupplier);
            }
        }

        function Save($item) {
            if (SupplierMenuCtrl.ePage.Masters.SaveAndClose) {
                SupplierMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else if (SupplierMenuCtrl.ePage.Masters.IsMore) {
                SupplierMenuCtrl.ePage.Masters.ShowMoreText = false;
            } else {
                SupplierMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            SupplierMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

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

            helperService.SaveEntity($item, 'Supplier').then(function (response) {
                SupplierMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (SupplierMenuCtrl.ePage.Masters.SaveAndClose) {
                    SupplierMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else if (SupplierMenuCtrl.ePage.Masters.IsMore) {
                    SupplierMenuCtrl.ePage.Masters.ShowMoreText = true;
                } else {
                    SupplierMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }

                if (response.Status === "success") {

                    var _index = supplierConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(SupplierMenuCtrl.currentSupplier[SupplierMenuCtrl.currentSupplier.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (SupplierMenuCtrl.currentSupplier[SupplierMenuCtrl.currentSupplier.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsCancel != true) {
                            apiService.get("eAxisAPI", 'TmsSupplierList/GetById/' + SupplierMenuCtrl.currentSupplier[SupplierMenuCtrl.currentSupplier.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                if (response.data.Response) {
                                    supplierConfig.TabList[_index][supplierConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;
                                    supplierConfig.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                value.label = SupplierMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SupplierNumber;
                                                value[SupplierMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SupplierNumber] = value.New;
                                                delete value.New;
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            SupplierMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        }

                        if (SupplierMenuCtrl.ePage.Masters.SaveAndClose) {
                            SupplierMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            SupplierMenuCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        supplierConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/supplier") {
                            helperService.refreshGrid();
                        }
                    }
                    SupplierMenuCtrl.ePage.Masters.IsMore = false;
                    console.log("Success");
                    toastr.success("Saved Successfully");
                } else if (response.Status === "failed") {
                    toastr.error("save failed");
                    console.log("Failed");
                    SupplierMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        SupplierMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), SupplierMenuCtrl.currentSupplier.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (SupplierMenuCtrl.ePage.Entities.Header.Validations != null) {
                        SupplierMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(SupplierMenuCtrl.currentSupplier);
                    }
                    SupplierMenuCtrl.ePage.Masters.IsMore = false;
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