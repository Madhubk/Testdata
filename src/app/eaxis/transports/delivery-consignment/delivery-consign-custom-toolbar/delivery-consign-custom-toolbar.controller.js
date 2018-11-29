(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryConsignmentToolBarController", DeliveryConsignmentToolBarController);

    DeliveryConsignmentToolBarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "deliveryConsignmentConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr", "$filter"];

    function DeliveryConsignmentToolBarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, deliveryConsignmentConfig, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr, $filter) {

        var DeliveryConsignToolBarCtrl = this;

        function Init() {


            DeliveryConsignToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "_Consignment_Custom_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }

            };

            DeliveryConsignToolBarCtrl.ePage.Masters.IsActiveMenu = DeliveryConsignToolBarCtrl.activeMenu;
            DeliveryConsignToolBarCtrl.ePage.Masters.Config = deliveryConsignmentConfig;

            DeliveryConsignToolBarCtrl.ePage.Masters.Input = DeliveryConsignToolBarCtrl.input;
            DeliveryConsignToolBarCtrl.ePage.Masters.DataEntryObject = DeliveryConsignToolBarCtrl.dataentryObject;

            DeliveryConsignToolBarCtrl.ePage.Masters.DeliveryBtnText = "Confirm Delivery";
            DeliveryConsignToolBarCtrl.ePage.Masters.ReviseBtnText = "Revise Delivery Date";
            DeliveryConsignToolBarCtrl.ePage.Masters.DocumentBtnText = "Document";
            DeliveryConsignToolBarCtrl.ePage.Masters.UpdateBtnText = "Save";
            DeliveryConsignToolBarCtrl.ePage.Masters.IsDisablePickBtn = false;

            // DatePicker
            DeliveryConsignToolBarCtrl.ePage.Masters.DatePicker = {};
            DeliveryConsignToolBarCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            DeliveryConsignToolBarCtrl.ePage.Masters.DatePicker.isOpen = [];
            DeliveryConsignToolBarCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            DeliveryConsignToolBarCtrl.ePage.Masters.DeliveryConsignment = DeliveryConsignment;
            DeliveryConsignToolBarCtrl.ePage.Masters.ReviseEstimatedDate = ReviseEstimatedDate;
            DeliveryConsignToolBarCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
            DeliveryConsignToolBarCtrl.ePage.Masters.Update = Update;
            DeliveryConsignToolBarCtrl.ePage.Masters.DocumentPrint = DocumentPrint;

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
                    DeliveryConsignToolBarCtrl.ePage.Masters.DocumentValues = response.data.Response;
                }
            });
        }

        function DocumentPrint(item) {
            DeliveryConsignToolBarCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            DeliveryConsignToolBarCtrl.ePage.Masters.DocumentBtnText = "Please Wait...";
            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + DeliveryConsignToolBarCtrl.ePage.Masters.Input[0].PK).then(function (response) {
                if (response.data.Response) {
                    DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                    var _SearchInputConfig = JSON.parse(item.OtherConfig)
                    var _output = helperService.getSearchInput(DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);

                    if (_output) {

                        _SearchInputConfig.DocumentSource = APP_CONSTANT.URL.eAxisAPI + _SearchInputConfig.DocumentSource;
                        _SearchInputConfig.DocumentInput = _output;
                        apiService.post("eAxisAPI", deliveryConsignmentConfig.Entities.Header.API.GenerateReport.Url, _SearchInputConfig).then(function SuccessCallback(response) {

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
                            DeliveryConsignToolBarCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                            DeliveryConsignToolBarCtrl.ePage.Masters.DocumentBtnText = "Document";

                        });
                    }
                }
            });
        }

        function Update() {
            DeliveryConsignToolBarCtrl.ePage.Masters.UpdateBtnText = "Please Wait...";
            DeliveryConsignToolBarCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data = filterObjectUpdate(DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data, "IsModified");
            apiService.post("eAxisAPI", 'TmsConsignmentList/Update', DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    // toastr.success("Consignment " + DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber + " is Picked");
                    CloseEditActivityModal();
                    helperService.refreshGrid();
                }
                DeliveryConsignToolBarCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                DeliveryConsignToolBarCtrl.ePage.Masters.UpdateBtnText = "Save";
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            DeliveryConsignToolBarCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function CloseEditActivityModal() {
            DeliveryConsignToolBarCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }

        function ReviseEstimatedDate() {
            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + DeliveryConsignToolBarCtrl.ePage.Masters.Input[0].PK).then(function (response) {
                if (response.data.Response) {
                    DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                    DeliveryConsignToolBarCtrl.ePage.Masters.Sender = DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode + ' - ' + DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName;
                    DeliveryConsignToolBarCtrl.ePage.Masters.Receiver = DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode + ' - ' + DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName;
                    DeliveryConsignToolBarCtrl.ePage.Masters.PickupCarrier = DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode + ' - ' + DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierName;

                    openModelForReviseDate().result.then(function (response) { }, function () {
                        console.log("Cancelled");
                    });
                }
            });
        }

        function openModel() {
            return DeliveryConsignToolBarCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "general-edit right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/transports/delivery-consignment/delivery-consign-custom-toolbar/delivery-consignment.html"
            });
        }

        function openModelForReviseDate() {
            return DeliveryConsignToolBarCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "general-edit right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/transports/delivery-consignment/delivery-consign-custom-toolbar/revise-delivery-date.html"
            });
        }

        function DeliveryConsignment() {
            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + DeliveryConsignToolBarCtrl.ePage.Masters.Input[0].PK).then(function (response) {
                if (response.data.Response) {
                    DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                    DeliveryConsignToolBarCtrl.ePage.Masters.Sender = DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode + ' - ' + DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName;
                    DeliveryConsignToolBarCtrl.ePage.Masters.Receiver = DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode + ' - ' + DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName;
                    DeliveryConsignToolBarCtrl.ePage.Masters.PickupCarrier = DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode + ' - ' + DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierName;
                    DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime = $filter('date')(DeliveryConsignToolBarCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime, "dd-MMM-yyyy")

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