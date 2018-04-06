(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestMenuController", ManifestMenuController);

    ManifestMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "manifestConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr"];

    function ManifestMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, manifestConfig, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr) {

        var ManifestMenuCtrl = this;

        function Init() {

            var currentManifest = ManifestMenuCtrl.currentManifest[ManifestMenuCtrl.currentManifest.label].ePage.Entities;

            ManifestMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest

            };

            // Standard Menu Configuration and Data
            ManifestMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.TransportsManifest;
            ManifestMenuCtrl.ePage.Masters.StandardMenuInput.obj = ManifestMenuCtrl.currentManifest;

            ManifestMenuCtrl.ePage.Masters.IsActiveMenu = ManifestMenuCtrl.activeMenu;
            ManifestMenuCtrl.ePage.Masters.Config = manifestConfig;
            ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ManifestMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
            // ManifestMenuCtrl.ePage.Masters.DispatchButtonText = "Dispatch Manifest";
            // ManifestMenuCtrl.ePage.Masters.UnDispatchButtonText = "UnDispatch Manifest"
            ManifestMenuCtrl.ePage.Masters.ShowMoreText = true;
            ManifestMenuCtrl.ePage.Masters.CompleteBtnText = "Complete";
            ManifestMenuCtrl.ePage.Masters.IsComplete = false;

            // function
            ManifestMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            ManifestMenuCtrl.ePage.Masters.Validation = Validation;
            ManifestMenuCtrl.ePage.Masters.DispatchedManifest = DispatchedManifest;
            ManifestMenuCtrl.ePage.Masters.UnDispatchedManifest = UnDispatchedManifest;
            ManifestMenuCtrl.ePage.Masters.ReceiveItemConfirm = ReceiveItemConfirm;
            ManifestMenuCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
            ManifestMenuCtrl.ePage.Masters.Complete = Complete;
            ManifestMenuCtrl.ePage.Masters.Cancel = Cancel;
            ManifestMenuCtrl.ePage.Masters.Print = Print;

            ManifestMenuCtrl.ePage.Masters.ManifestMenu = {};
            ManifestMenuCtrl.ePage.Masters.DropDownMasterList = {};
            ManifestMenuCtrl.ePage.Masters.IsMore = false;

            GetDocuments();

            // Menu list from configuration
            ManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource = ManifestMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        function Print(item) {
            ManifestMenuCtrl.ePage.Masters.ShowMoreText = false;
            var _SearchInputConfig = JSON.parse(item.OtherConfig)
            var _output = helperService.getSearchInput(ManifestMenuCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);

            if (_output) {

                _SearchInputConfig.DocumentSource = APP_CONSTANT.URL.eAxisAPI + _SearchInputConfig.DocumentSource;
                _SearchInputConfig.DocumentInput = _output;
                apiService.post("eAxisAPI", ManifestMenuCtrl.ePage.Entities.Header.API.GenerateReport.Url, _SearchInputConfig).then(function SuccessCallback(response) {

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
                    ManifestMenuCtrl.ePage.Masters.ShowMoreText = true;
                });
            }
        }

        function GetDocuments() {
            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "TMS",
                "SubModuleCode": "MAN"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ManifestMenuCtrl.ePage.Masters.DocumentValues = response.data.Response;
                }
            });
        }

        function Cancel($item) {
            ManifestMenuCtrl.ePage.Masters.IsMore = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            if (_input.TmsManifestItem.length == 0) {
                _input.TmsManifestHeader.IsCancel = true;
                Save($item);
            } else {
                toastr.warning("Before cancel the Manifest detach all the ManifestItems");
            }
        }

        function Complete($item) {
            ManifestMenuCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            ManifestMenuCtrl.ePage.Masters.IsComplete = true;
            // var count = 0;
            // angular.forEach($item[$item.label].ePage.Entities.Header.Data.TmsManifestItem, function (value, key) {
            //     if (value.DeliveryDateTime) {
            //         count = count + 1;
            //     }
            // });
            // if (count == ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestItem.length) {
            //     $item[$item.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDeliveryDate = new Date();
            // }
            Save($item);
        }

        function CloseEditActivityModal() {
            ManifestMenuCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }

        function ReceiveItemConfirm($item) {
            openModel().result.then(function (response) { }, function () {
                console.log("Cancelled");
            });
        }

        function openModel() {
            return ManifestMenuCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "right",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/transports/track-manifest/manifest-menu/open-receive-item.html"
            });
        }

        function DispatchedManifest($item) {
            ManifestMenuCtrl.ePage.Masters.IsMore = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            _input.TmsManifestHeader.ActualDispatchDate = new Date();
            ManifestMenuCtrl.ePage.Masters.DispatchManifest = true;
            Validation($item);
        }

        function UnDispatchedManifest($item) {
            ManifestMenuCtrl.ePage.Masters.IsMore = true;
            var modalOptions = {
                closeButtonText: 'No',
                actionButtonText: 'YES',
                headerText: 'Change Dispatched to UnDispatch..',
                bodyText: 'Do You Want To Change?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    $item[$item.label].ePage.Entities.Header.Data.TmsManifestHeader.ManifestStatus = "DRF";
                    $item[$item.label].ePage.Entities.Header.Data.TmsManifestHeader.ManifestStatusDesc = "Draft";
                    $item[$item.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDispatchDate = "";
                    Validation($item);
                    ManifestMenuCtrl.ePage.Masters.Config.GetTabDetails($item[$item.label].ePage.Entities.Header.Data.TmsManifestHeader, false).then(function (response) {
                        ManifestMenuCtrl.ePage.Masters.Config.UnDispatchClose = true;
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function SaveClose($item) {
            ManifestMenuCtrl.ePage.Masters.SaveAndClose = true;
            Validation($item);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            ManifestMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ManifestMenuCtrl.ePage.Entities.Header.Validations) {
                ManifestMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ManifestMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                ManifestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ManifestMenuCtrl.currentManifest);
            }
        }

        function Save($item) {
            if (ManifestMenuCtrl.ePage.Masters.SaveAndClose) {
                ManifestMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else if (ManifestMenuCtrl.ePage.Masters.IsComplete) {
                ManifestMenuCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            } else if (ManifestMenuCtrl.ePage.Masters.IsMore) {
                ManifestMenuCtrl.ePage.Masters.ShowMoreText = false;
            } else {
                ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }

            // ManifestMenuCtrl.ePage.Masters.ShowMoreText = false;
            ManifestMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsManifestHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            if (ManifestMenuCtrl.ePage.Entities.Header.Data.ProcessInfo[0].WSI_StepName == 'Confirm Manifest Arrival') {
                _input.TmsManifestHeader.ManifestStatus = "ARR";
            }
            _input.TmsManifestConsignment.map(function (value, key) {
                value.TMM_FK = _input.TmsManifestHeader.PK;
            })

            helperService.SaveEntity($item, 'Manifest').then(function (response) {
                ManifestMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (ManifestMenuCtrl.ePage.Masters.SaveAndClose) {
                    ManifestMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else if (ManifestMenuCtrl.ePage.Masters.IsComplete) {
                    ManifestMenuCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    ManifestMenuCtrl.ePage.Masters.modalInstance.dismiss('cancel');
                } else if (ManifestMenuCtrl.ePage.Masters.IsMore) {
                    ManifestMenuCtrl.ePage.Masters.ShowMoreText = true;
                } else {
                    ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }

                if (response.Status === "success") {
                    var _index = manifestConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ManifestMenuCtrl.currentManifest[ManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (ManifestMenuCtrl.currentManifest[ManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.TmsManifestHeader.IsCancel != true) {
                            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + ManifestMenuCtrl.currentManifest[ManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                if (response.data.Response) {
                                    manifestConfig.TabList[_index][manifestConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    manifestConfig.TabList.map(function (value, key) {
                                        if (value.New) {
                                            // if (value.code == ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                            value.label = ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber;
                                            value[ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber] = value.New;
                                            delete value.New;
                                            // }
                                        }
                                    });
                                }
                            });
                        } else {
                            ManifestMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        }


                        if (ManifestMenuCtrl.ePage.Masters.SaveAndClose) {
                            ManifestMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            ManifestMenuCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        manifestConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/manifest") {
                            helperService.refreshGrid();
                        }
                    }

                    // Sending Mail
                    var ManifestResponse;
                    if (response.Data.Response) {
                        ManifestResponse = response.Data.Response;
                    } else {
                        ManifestResponse = response.Data;
                    }
                    if (ManifestResponse.ProcessInfo[0].Status == 'COMPLETED' && response.Data.Response.ProcessInfo[0].WSI_StepNo == '1') {
                        var data = {
                            "From": "donotreply@20cube.com",
                            "To": [
                                "srajasiva@20cube.com",
                                "mfelcia@20cube.com",
                                "kkannan@20cube.com",
                            ],
                            "Cc": [
                                "jreginold@20cube.com"
                            ],
                            "Bcc": [],
                            "Body": response.Data.Response.TmsManifestHeader.ManifestNumber + "-" + "Manifest Dispatched",
                            "Subject": "Manifest Number:" + response.Data.Response.TmsManifestHeader.ManifestNumber + " is Dispatched",
                            "TemplateName": "Agent_Reply",
                            "Attachments": [],
                            "EmailType": "Agent_Reply",
                            "ReplacementValues": {
                                "body": "M00100355-Manifest Dispatched"
                            },
                            "FromName": "TMS Manifest"
                        }
                        $http.post("http://api.20cube.com/mhb/Mail/Send", data).success(function (data, status) {
                            console.log(status)
                        });
                    }

                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    ManifestMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ManifestMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ManifestMenuCtrl.currentManifest.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ManifestMenuCtrl.ePage.Entities.Header.Validations != null) {
                        ManifestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ManifestMenuCtrl.currentManifest);
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

        Init();
    }
})();