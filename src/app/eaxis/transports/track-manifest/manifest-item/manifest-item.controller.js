(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestItemController", ManifestItemController);

    ManifestItemController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "manifestConfig", "helperService", "toastr", "$injector", "$window", "confirmation"];

    function ManifestItemController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, manifestConfig, helperService, toastr, $injector, $window, confirmation) {

        var ManifestItemCtrl = this;

        function Init() {

            var currentManifest = ManifestItemCtrl.currentManifest[ManifestItemCtrl.currentManifest.label].ePage.Entities;

            ManifestItemCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            ManifestItemCtrl.ePage.Masters.Config = manifestConfig;

            ManifestItemCtrl.ePage.Masters.emptyText = "-";
            ManifestItemCtrl.ePage.Masters.selectedRow = -1;

            ManifestItemCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            // ManifestItemCtrl.ePage.Masters.getConsignmentNumber = getConsignmentNumber;
            ManifestItemCtrl.ePage.Masters.Edit = Edit;
            ManifestItemCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ManifestItemCtrl.ePage.Masters.Attach = Attach;
            ManifestItemCtrl.ePage.Masters.ReceiveLines = ReceiveLines;
            ManifestItemCtrl.ePage.Masters.AddNew = AddNew;
        }

        // function getConsignmentNumber() {
        //     ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TempConsignmentNumber = ManifestItemCtrl.ePage.Masters.Config.TempConsignmentNumber;
        // }

        function ReceiveLines() {
            var _queryString = {
                PK: ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
                ManifestNumber: ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/receivelines/" + _queryString, "_blank");
        }

        function AddNew() {
            var _queryString = {
                PK: null,
                ItemCode: null
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/manifestitem/" + _queryString, "_blank");
        }

        function Attach($item) {
            $item.some(function (value, index) {
                var _isExist = ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestItem.some(function (value1, index1) {
                    return value1.TIT_FK === value.TIT_FK;
                });
                if (!_isExist) {
                    var obj = {
                        "TIT_ItemRef_ID": value.TIT_ItemRef_ID,
                        "TIT_ItemCode": value.TIT_ItemCode,
                        "TIT_ItemDesc": value.TIT_ItemDesc,
                        "TIT_ReceiverRef": value.TIT_ReceiverRef,
                        "TIT_SenderRef": value.TIT_SenderRef,
                        "TIT_Height": value.TIT_Height,
                        "TIT_Width": value.TIT_Width,
                        "TIT_Length": value.TIT_Length,
                        "TIT_Weight": value.TIT_Weight,
                        "TIT_Volumn": value.TIT_Volumn,
                        "TIT_FK": value.TIT_FK,
                        "TIT_Receiver_ORG_FK": value.TIT_Receiver_ORG_FK,
                        "TIT_Sender_ORG_FK": value.TIT_Sender_ORG_FK,
                        "TIT_ItemStatus": value.TIT_ItemStatus,
                        "TMC_ConsignmentNumber": value.TMC_ConsignmentNumber,
                        "TMC_FK": value.TMC_FK,
                        "IsDeleted": value.IsDeleted,
                        "IsModified": value.IsModified
                    }
                    ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestItem.push(obj);
                    GetManifestItemDetails();
                } else {
                    toastr.warning(value.TIT_ItemCode + " Already Available...!");
                }
            });
        }

        function GetManifestItemDetails() {
            var item = filterObjectUpdate(ManifestItemCtrl.ePage.Entities.Header.Data, "IsModified");
            apiService.post("eAxisAPI", 'TmsManifestList/Update', ManifestItemCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + response.data.Response.Response.PK).then(function (response) {
                        ManifestItemCtrl.ePage.Entities.Header.Data = response.data.Response;
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

        function setSelectedRow(index) {
            ManifestItemCtrl.ePage.Masters.selectedRow = index;
        }

        function Edit(obj) {
            var _queryString = {
                PK: obj.TIT_FK,
                ItemCode: obj.TIT_ItemCode
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/manifestitem/" + _queryString, "_blank");
        }

        function RemoveRow() {
            var item = ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestItem[ManifestItemCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    // if (item.PK) {
                    //     apiService.get("eAxisAPI", ManifestItemCtrl.ePage.Entities.Header.API.LineDelete.Url + item.PK).then(function(response) {
                    //     });
                    // }
                    ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestItem.splice(ManifestItemCtrl.ePage.Masters.selectedRow, 1);
                    toastr.success('Record Removed Successfully');
                    ManifestItemCtrl.ePage.Masters.selectedRow = ManifestItemCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        Init();
    }

})();