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

            ManifestMenuCtrl.ePage.Masters.IsActiveMenu = ManifestMenuCtrl.activeMenu;
            ManifestMenuCtrl.ePage.Masters.Config = manifestConfig;
            if (ManifestMenuCtrl.ePage.Entities.Header.Data.ProcessInfo != null && ManifestMenuCtrl.ePage.Entities.Header.Data.ProcessInfo.length > 0) {
                if (ManifestMenuCtrl.ePage.Entities.Header.Data.ProcessInfo[0].WSI_StepName == 'Confirm Manifest Arrival') {
                    ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Confirm Arrival";
                } else {
                    ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }
            } else {
                ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            }

            ManifestMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
            ManifestMenuCtrl.ePage.Masters.ShowMoreText = true;
            ManifestMenuCtrl.ePage.Masters.CompleteBtnText = "Complete";
            ManifestMenuCtrl.ePage.Masters.SaveReceiveItemButtonText = "Save";
            ManifestMenuCtrl.ePage.Masters.IsComplete = false;

            ManifestMenuCtrl.ePage.Masters.IsShowError = ManifestMenuCtrl.showError;

            // function
            ManifestMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            ManifestMenuCtrl.ePage.Masters.Validation = Validation;
            ManifestMenuCtrl.ePage.Masters.SaveReceiveItems = SaveReceiveItems;
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

        function SaveReceiveItems($item) {
            ManifestMenuCtrl.ePage.Masters.SaveReceiveItemButtonText = "Please Wait...";
            var count = 0;
            angular.forEach($item[$item.label].ePage.Entities.Header.Data.TmsManifestItem, function (value, key) {
                if (value.DeliveryDateTime) {
                    count = count + 1;
                }
            });
            if (count == ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestItem.length) {
                $item[$item.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDeliveryDate = new Date();
            }
            Save($item);

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
                    }());

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
            if (_input.TmsManifestItem.length == 0 && _input.TmsManifestConsignment.length == 0) {
                _input.TmsManifestHeader.IsCancel = true;
                Save($item);
            } else {
                toastr.warning("Before cancel the Manifest detach all the Consignment and Manifest Items in this manifest");
            }
        }

        function Complete($item) {
            ManifestMenuCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            ManifestMenuCtrl.ePage.Masters.IsComplete = true;
            var count = 0;
            angular.forEach($item[$item.label].ePage.Entities.Header.Data.TmsManifestItem, function (value, key) {
                if (value.DeliveryDateTime) {
                    count = count + 1;
                }
            });
            if (count == ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestItem.length) {
                $item[$item.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDeliveryDate = new Date();
                Save($item);
            } else {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Some items are not yet received. Do you want complete the task?'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        $item[$item.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDeliveryDate = new Date();
                        Save($item);
                    }, function () {
                        console.log("Cancelled");
                    });
            }
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
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if (_input.TmsManifestItem.length > 0 && _input.TmsManifestConsignment.length > 0) {
                _input.TmsManifestHeader.ActualDispatchDate = new Date();
                ManifestMenuCtrl.ePage.Masters.IsMore = true;
                Validation($item);
            } else {
                toastr.error("It can be dispatched only when the consignment and manifest item have values.")
            }
        }

        function UnDispatchedManifest($item) {
            ManifestMenuCtrl.ePage.Masters.IsMore = true;
            var modalOptions = {
                closeButtonText: 'No',
                actionButtonText: 'Yes',
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

            ManifestMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsManifestHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            if (ManifestMenuCtrl.ePage.Entities.Header.Data.ProcessInfo.length > 0) {
                if (ManifestMenuCtrl.ePage.Entities.Header.Data.ProcessInfo[0].WSI_StepName == 'Confirm Manifest Arrival') {
                    _input.TmsManifestHeader.ManifestStatus = "ARR";
                }
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
                                        if (_index == key) {
                                            if (value.New) {
                                                // if (value.code == ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                                value.label = ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber;
                                                value[ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber] = value.New;
                                                delete value.New;
                                                // }
                                            }
                                        }
                                    });
                                    if (ManifestMenuCtrl.ePage.Entities.Header.Data.ProcessInfo.length > 0) {
                                        if (ManifestMenuCtrl.ePage.Entities.Header.Data.ProcessInfo[0].WSI_StepName == 'Confirm Manifest Arrival') {
                                            ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Confirm Arrival";
                                        }
                                    }
                                    else {
                                        ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                                    }
                                }
                            });
                            ManifestMenuCtrl.ePage.Masters.SaveReceiveItemButtonText = "Save";
                            toastr.success("Saved Successfully");
                        } else {
                            toastr.success("Cancelled Successfully");
                            ManifestMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        }

                        if (ManifestMenuCtrl.ePage.Masters.SaveAndClose) {
                            ManifestMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            ManifestMenuCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        manifestConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/track-manifest") {
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

                    if (ManifestResponse.ProcessInfo.length > 0) {
                        if (ManifestResponse.ProcessInfo[0].Status == 'COMPLETED' && ManifestResponse.ProcessInfo[0].WSI_StepNo == '1') {
                            var data = [];
                            var obj = {
                                "PK": "7967ec60-15ad-4325-82a0-ebfe5c6cbaab",
                                "EntityRefKey": "14d2cc93-01eb-4496-8d8d-1764aa633ab1",
                                "EntitySource": "sample string 2",
                                "EntityRefCode": "sample string 3",
                                "ParentEntityRefKey": "317cab94-0995-49e3-b2c9-dad7b5f97be4",
                                "ParentEntitySource": "sample string 4",
                                "ParentEntityRefCode": "sample string 5",
                                "AdditionalEntityRefKey": "e55d1b1b-ba5e-423d-a49b-8c1d9e31ea89",
                                "AdditionalEntitySource": "sample string 6",
                                "AdditionalEntityRefCode": "sample string 7",
                                "FROM": "donotreply@20cube.com",
                                "TO": "srajasiva@20cube.com",
                                "CC": "mfelcia@20cube.com",
                                "BCC": "kkannan@20cube.com",
                                "Subject": ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber + "-" + "Manifest Dispatched",
                                "Body": "Hi Team , Manifest Dispatched",
                                "JOD_FK": "3f256d2a-5ffd-41dc-b42b-0c6c364c1737",
                                "CreatedDateTime": "2018-05-23T08:39:56.4467748+00:00",
                                "CreatedBy": "sample string 15",
                                "ModifiedDateTime": "2018-05-23T08:39:56.4467748+00:00",
                                "ModifiedBy": "sample string 16",
                                "Status": "sample string 17",
                                "IsModified": true,
                                "IsDeleted": true,
                                "TenantCode": "sample string 20",
                                "PartyType_FK": "b390f6f8-0d0d-4b18-9953-8d7713be91e7",
                                "PartyType_Code": "sample string 21",
                                "IsShared": true,
                                "IsResticted": true,
                                "TypeCode": "sample string 24",
                            }
                            data.push(obj)
                            apiService.post("eAxisAPI", "JobEmail/Insert", data).then(function SuccessCallback(response) {
                                var _input =
                                    {
                                        "FROM": "donotreply@20cube.com",
                                        "TO": ["srajasiva@20cube.com", "kkannan@20cube.com"],
                                        "CC": ["mfelcia@20cube.com", "jreginold@20cube.com"],
                                        "Subject": ManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber + "-" + "Manifest Dispatched",
                                        "Template": "temp1",
                                        "Body": "<div style=\"color: blue;\" class=\"ng-scope\">\n     Manifest Dispatched,\n </div>"
                                    }
                                apiService.post("alertAPI", appConfig.Entities.NotificationEmail.API.Send.Url, _input).then(function SuccessCallback(response) {

                                });
                            });
                        }
                    }

                    ManifestMenuCtrl.ePage.Masters.IsMore = false;
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("save failed");
                    ManifestMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ManifestMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ManifestMenuCtrl.currentManifest.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ManifestMenuCtrl.ePage.Entities.Header.Validations != null) {
                        ManifestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ManifestMenuCtrl.currentManifest);
                    }
                    ManifestMenuCtrl.ePage.Masters.IsMore = false;
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