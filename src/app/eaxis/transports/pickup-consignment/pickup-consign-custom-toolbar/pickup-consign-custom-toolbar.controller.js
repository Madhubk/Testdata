(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupConsignmentToolBarController", PickupConsignmentToolBarController);

    PickupConsignmentToolBarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickupConsignmentConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr", "$filter"];

    function PickupConsignmentToolBarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickupConsignmentConfig, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr, $filter) {

        var PickupConsignToolBarCtrl = this;

        function Init() {


            PickupConsignToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Consignment_Custom_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }

            };

            PickupConsignToolBarCtrl.ePage.Masters.IsActiveMenu = PickupConsignToolBarCtrl.activeMenu;
            PickupConsignToolBarCtrl.ePage.Masters.Config = pickupConsignmentConfig;

            PickupConsignToolBarCtrl.ePage.Masters.Input = PickupConsignToolBarCtrl.input;
            PickupConsignToolBarCtrl.ePage.Masters.DataEntryObject = PickupConsignToolBarCtrl.dataentryObject;

            PickupConsignToolBarCtrl.ePage.Masters.PickBtnText = "Confirm Pickup";
            PickupConsignToolBarCtrl.ePage.Masters.ReviseBtnText = "Revise Pickup Date";
            PickupConsignToolBarCtrl.ePage.Masters.DocumentBtnText = "Document";
            PickupConsignToolBarCtrl.ePage.Masters.UpdateBtnText = "Save";
            PickupConsignToolBarCtrl.ePage.Masters.IsDisablePickBtn = false;

            // DatePicker
            PickupConsignToolBarCtrl.ePage.Masters.DatePicker = {};
            PickupConsignToolBarCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            PickupConsignToolBarCtrl.ePage.Masters.DatePicker.isOpen = [];
            PickupConsignToolBarCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            PickupConsignToolBarCtrl.ePage.Masters.PickConsignment = PickConsignment;
            PickupConsignToolBarCtrl.ePage.Masters.ReviseEstimatedDate = ReviseEstimatedDate;
            PickupConsignToolBarCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
            PickupConsignToolBarCtrl.ePage.Masters.Update = Update;
            PickupConsignToolBarCtrl.ePage.Masters.DocumentPrint = DocumentPrint;

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
                    PickupConsignToolBarCtrl.ePage.Masters.DocumentValues = response.data.Response;
                }
            });
        }

        function DocumentPrint(item) {
            PickupConsignToolBarCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            PickupConsignToolBarCtrl.ePage.Masters.DocumentBtnText = "Please Wait...";
            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + PickupConsignToolBarCtrl.ePage.Masters.Input[0].PK).then(function (response) {
                if (response.data.Response) {
                    PickupConsignToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                    var _SearchInputConfig = JSON.parse(item.OtherConfig)
                    var _output = helperService.getSearchInput(PickupConsignToolBarCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);

                    if (_output) {

                        _SearchInputConfig.DocumentSource = APP_CONSTANT.URL.eAxisAPI + _SearchInputConfig.DocumentSource;
                        _SearchInputConfig.DocumentInput = _output;
                        apiService.post("eAxisAPI", pickupConsignmentConfig.Entities.Header.API.GenerateReport.Url, _SearchInputConfig).then(function SuccessCallback(response) {

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
                            PickupConsignToolBarCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                            PickupConsignToolBarCtrl.ePage.Masters.DocumentBtnText = "Document";

                        });
                    }
                }
            });
        }

        function Update() {
            PickupConsignToolBarCtrl.ePage.Masters.UpdateBtnText = "Please Wait...";
            PickupConsignToolBarCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            PickupConsignToolBarCtrl.ePage.Entities.Header.Data = filterObjectUpdate(PickupConsignToolBarCtrl.ePage.Entities.Header.Data, "IsModified");
            apiService.post("eAxisAPI", 'TmsConsignmentList/Update', PickupConsignToolBarCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    // toastr.success("Consignment " + PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber + " is Picked");
                    CloseEditActivityModal();
                    helperService.refreshGrid();
                }
                PickupConsignToolBarCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                PickupConsignToolBarCtrl.ePage.Masters.UpdateBtnText = "Save";
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            PickupConsignToolBarCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function CloseEditActivityModal() {
            PickupConsignToolBarCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }

        function ReviseEstimatedDate() {
            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + PickupConsignToolBarCtrl.ePage.Masters.Input[0].PK).then(function (response) {
                if (response.data.Response) {
                    PickupConsignToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                    PickupConsignToolBarCtrl.ePage.Masters.Sender = PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode + ' - ' + PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName;
                    PickupConsignToolBarCtrl.ePage.Masters.Receiver = PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode + ' - ' + PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName;
                    PickupConsignToolBarCtrl.ePage.Masters.PickupCarrier = PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode + ' - ' + PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierName;
                    PickupConsignToolBarCtrl.ePage.Masters.CurrentPickupDate = angular.copy(PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime)
                    openModelForReviseDate().result.then(function (response) { }, function () {
                        console.log("Cancelled");
                    });
                }
            });
        }

        function openModel() {
            return PickupConsignToolBarCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "general-edit right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/transports/pickup-consignment/pickup-consign-custom-toolbar/open-consignment.html"
            });
        }

        function openModelForReviseDate() {
            return PickupConsignToolBarCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "general-edit right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/transports/pickup-consignment/pickup-consign-custom-toolbar/revise-estimated-date.html"
            });
        }

        function PickConsignment() {
            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + PickupConsignToolBarCtrl.ePage.Masters.Input[0].PK).then(function (response) {
                if (response.data.Response) {
                    PickupConsignToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                    PickupConsignToolBarCtrl.ePage.Masters.Sender = PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode + ' - ' + PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName;
                    PickupConsignToolBarCtrl.ePage.Masters.Receiver = PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode + ' - ' + PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName;
                    PickupConsignToolBarCtrl.ePage.Masters.PickupCarrier = PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode + ' - ' + PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierName;
                    PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime = $filter('date')(PickupConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime, "dd-MMM-yyyy")

                    openModel().result.then(function (response) { }, function () {
                        console.log("Cancelled");
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