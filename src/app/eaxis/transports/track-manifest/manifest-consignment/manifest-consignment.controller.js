(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestConsignmentController", ManifestConsignmentController);

    ManifestConsignmentController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "manifestConfig", "helperService", "toastr", "$injector", "$window", "confirmation"];

    function ManifestConsignmentController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, manifestConfig, helperService, toastr, $injector, $window, confirmation) {

        var ManifestConsignCtrl = this;

        function Init() {

            var currentManifest = ManifestConsignCtrl.currentManifest[ManifestConsignCtrl.currentManifest.label].ePage.Entities;

            ManifestConsignCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            ManifestConsignCtrl.ePage.Masters.Config = manifestConfig;
            ManifestConsignCtrl.ePage.Masters.emptyText = "-";
            ManifestConsignCtrl.ePage.Masters.selectedRow = -1;

            ManifestConsignCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ManifestConsignCtrl.ePage.Masters.Edit = Edit;
            ManifestConsignCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ManifestConsignCtrl.ePage.Masters.Attach = Attach;
            ManifestConsignCtrl.ePage.Masters.AddNew = AddNew;

            // getConsignmentNumber();
        }

        function AddNew() {
            var _queryString = {
                PK: null,
                ConsignmentNumber: null
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/consignment/" + _queryString, "_blank");
        }

        function Attach($item) {
            angular.forEach($item, function (value, key) {
                apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + value.TMC_FK).then(function (response) {
                    if (response.data.Response.TmsConsignmentItem.length > 0) {
                        var _isExist = ManifestConsignCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.some(function (value1, index1) {
                            return value1.TMC_FK === value.TMC_FK;
                        });

                        if (!_isExist) {
                            var obj = {
                                "TMC_ConsignmentNumber": value.TMC_ConsignmentNumber,
                                "TMC_ExpectedDeliveryDateTime": value.TMC_ExpectedDeliveryDateTime,
                                "TMC_ExpectedPickupDateTime": value.TMC_ExpectedPickupDateTime,
                                "TMC_ReceiverCode": value.TMC_ReceiverCode,
                                "TMC_ReceiverName": value.TMC_ReceiverName,
                                "TMC_Receiver_ORG_FK": value.TMC_Receiver_ORG_FK,
                                "TMC_SenderCode": value.TMC_SenderCode,
                                "TMC_SenderName": value.TMC_SenderName,
                                "TMC_Sender_ORG_FK": value.TMC_Sender_ORG_FK,
                                "TMC_ServiceType": value.TMC_ServiceType,
                                "TMC_FK": value.TMC_FK,
                                "IsDeleted": value.IsDeleted,
                                "IsModified": value.IsModified,
                                "TMC_Status": value.Status,
                                "TMM_FK": ManifestConsignCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK
                            }
                            ManifestConsignCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.push(obj);
                            // getConsignmentNumber();
                            GetManifestItemDetails();
                        } else {
                            toastr.warning(value.TMC_ConsignmentNumber + " Already Available...!");
                        }
                    } else {
                        toastr.warning("Consignment Number:" + value.TMC_ConsignmentNumber + " having No Items...!");
                    }
                });
            });
            // $item.some(function (value, index) {

            // });
        }

        function GetManifestItemDetails() {
            var item = filterObjectUpdate(ManifestConsignCtrl.ePage.Entities.Header.Data, "IsModified");
            apiService.post("eAxisAPI", 'TmsManifestList/Update', ManifestConsignCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + response.data.Response.Response.PK).then(function (response) {
                        ManifestConsignCtrl.ePage.Entities.Header.Data = response.data.Response;
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

        // function getConsignmentNumber() {
        //     ManifestConsignCtrl.ePage.Masters.Config.TempConsignmentNumber = '';
        //     angular.forEach(ManifestConsignCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, function (value, key) {
        //         ManifestConsignCtrl.ePage.Masters.Config.TempConsignmentNumber = ManifestConsignCtrl.ePage.Masters.Config.TempConsignmentNumber + value.TMC_ConsignmentNumber + ",";
        //     });
        //     ManifestConsignCtrl.ePage.Masters.Config.TempConsignmentNumber = ManifestConsignCtrl.ePage.Masters.Config.TempConsignmentNumber.slice(0, -1);
        // }

        function setSelectedRow(index) {
            ManifestConsignCtrl.ePage.Masters.selectedRow = index;
        }

        function Edit(obj) {
            var _queryString = {
                PK: obj.TMC_FK,
                ConsignmentNumber: obj.TMC_ConsignmentNumber
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/consignment/" + _queryString, "_blank");
        }

        function RemoveRow($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    $item.IsDeleted = true;
                    ManifestConsignCtrl.ePage.Entities.Header.Data = filterObjectUpdate(ManifestConsignCtrl.ePage.Entities.Header.Data, "IsModified");
                    apiService.post("eAxisAPI", 'TmsManifestList/Update', ManifestConsignCtrl.ePage.Entities.Header.Data).then(function (response) {
                        if (response.data.Response) {
                            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + response.data.Response.Response.PK).then(function (response) {
                                ManifestConsignCtrl.ePage.Entities.Header.Data = response.data.Response;
                                toastr.success('Consignment Removed Successfully');
                            });
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        Init();
    }

})();