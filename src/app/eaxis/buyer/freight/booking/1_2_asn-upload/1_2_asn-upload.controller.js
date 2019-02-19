(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneTwoAsnUploadController", oneTwoAsnUploadController);

    oneTwoAsnUploadController.$inject = ["$rootScope", "$timeout", "authService", "apiService", "helperService", "appConfig", "oneTwoAsnUploadConfig", "toastr", "errorWarningService", "$uibModalInstance", "confirmation","$injector","dynamicLookupConfig"];

    function oneTwoAsnUploadController($rootScope, $timeout, authService, apiService, helperService, appConfig, oneTwoAsnUploadConfig, toastr, errorWarningService, $uibModalInstance, confirmation,$injector,dynamicLookupConfig) {
        /* jshint validthis: true */
        var oneTwoAsnUploadCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            oneTwoAsnUploadCtrl.ePage = {
                "Title": "",
                "Prefix": "ASN_Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": oneTwoAsnUploadConfig.Entities
            };
            // Save
            oneTwoAsnUploadCtrl.ePage.Masters.Save = Save;
            oneTwoAsnUploadCtrl.ePage.Masters.SaveButtonText = "Submit";
            oneTwoAsnUploadCtrl.ePage.Masters.IsDisableSave = false;
            oneTwoAsnUploadCtrl.ePage.Masters.modalClose = modalClose;
            CreateNewBooking();
            GetRelatedLookupList();
        }

        function CreateNewBooking() {
            oneTwoAsnUploadCtrl.ePage.Masters.currentAsn = undefined;
            helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = "ASN";
                    response.data.Response.UIOrderBatchUpload_Buyer.Status = "CREATED";
                    response.data.Response.UIOrderBatchUpload_Buyer.Source = "SHP";
                    var _exports = {
                        "Entities": {
                            "Header": {
                                "Data": {},
                                "API": {
                                    "InsertBatch": {
                                        "IsAPI": "true",
                                        "HttpType": "POST",
                                        "Url": "orderbatchupload/buyer/insert"
                                    },
                                    "UpdateBatch": {
                                        "IsAPI": "true",
                                        "HttpType": "POST",
                                        "Url": "orderbatchupload/buyer/insert"
                                    }
                                },
                            }
                        }
                    };
                    _exports.Entities.Header.Data = response.data.Response;
                    var _obj = {
                        New: {
                            ePage: _exports
                        },
                        label: 'New',
                        code: response.data.Response.BatchUploadNo,
                        isNew: true
                    };
                    oneTwoAsnUploadCtrl.ePage.Masters.currentAsn = _obj;
                } else {
                    console.log("Empty New Order response");
                }
            });
        }

        function modalClose() {
            $uibModalInstance.dismiss('close');
        }

        function Save($item) {
            oneTwoAsnUploadCtrl.ePage.Masters.IsDisableSave = true;
            oneTwoAsnUploadCtrl.ePage.Masters.SaveButtonText = "Please wait..";
            helperService.SaveEntity($item, 'Batch').then(function (response) {
                if (response.Status === "success") {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        closeButtonVisible: false,
                        actionButtonText: 'Ok',
                        headerText: 'ASN Uploaded Successfully..',
                        bodyText: "Ref #: " + response.Data.BatchUploadNo
                    };

                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            modalClose();
                        }, function () {
                            console.log("Cancelled");
                        });
                } else if (response.Status === "failed") {
                    toastr.error("Save Failed...!");
                    oneTwoAsnUploadCtrl.ePage.Masters.IsDisableSave = false;
                    oneTwoAsnUploadCtrl.ePage.Masters.SaveButtonText = "Save";
                }
            });

        }
        function GetRelatedLookupList() {
            var _filter = {
                Key: "BP_PoBatchUploadOrg_13256",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        Init();
    }
})();