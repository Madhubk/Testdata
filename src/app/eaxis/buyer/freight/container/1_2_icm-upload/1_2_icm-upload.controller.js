(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneTwoIcmUploadController", oneTwoIcmUploadController);

    oneTwoIcmUploadController.$inject = ["$rootScope", "$timeout", "authService", "apiService", "helperService", "appConfig", "oneTwoIcmUploadConfig", "toastr", "errorWarningService", "$uibModalInstance", "confirmation","$injector","dynamicLookupConfig"];

    function oneTwoIcmUploadController($rootScope, $timeout, authService, apiService, helperService, appConfig, oneTwoIcmUploadConfig, toastr, errorWarningService, $uibModalInstance, confirmation,$injector,dynamicLookupConfig) {
        /* jshint validthis: true */
        var oneTwoIcmUploadCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");
        function Init() {
            oneTwoIcmUploadCtrl.ePage = {
                "Title": "",
                "Prefix": "ICM_Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": oneTwoIcmUploadConfig.Entities
            };
            // Save
            oneTwoIcmUploadCtrl.ePage.Masters.Save = Save;
            oneTwoIcmUploadCtrl.ePage.Masters.SaveButtonText = "Submit";
            oneTwoIcmUploadCtrl.ePage.Masters.IsDisableSave = false;
            oneTwoIcmUploadCtrl.ePage.Masters.modalClose = modalClose;
            CreateNewBooking();
            GetRelatedLookupList();
        }

        function CreateNewBooking() {
            oneTwoIcmUploadCtrl.ePage.Masters.currentAsn = undefined;
            helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = "ICM";
                    response.data.Response.UIOrderBatchUpload_Buyer.Status = "CREATED";
                    response.data.Response.UIOrderBatchUpload_Buyer.Source = "CNT";
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
                    oneTwoIcmUploadCtrl.ePage.Masters.currentAsn = _obj;
                    console.log(oneTwoIcmUploadCtrl.ePage.Masters.currentAsn);
                } else {
                    console.log("Empty New Order response");
                }
            });
        }

        function modalClose() {
            $uibModalInstance.dismiss('close');
        }
        

        function Save($item) {
            oneTwoIcmUploadCtrl.ePage.Masters.IsDisableSave = true;
            oneTwoIcmUploadCtrl.ePage.Masters.SaveButtonText = "Please wait..";
            helperService.SaveEntity($item, 'Batch').then(function (response) {
                if (response.Status === "success") {
                    console.log(response);
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        closeButtonVisible: false,
                        actionButtonText: 'Ok',
                        headerText: 'ICM  Uploaded Successfully..',
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
                    oneTwoIcmUploadCtrl.ePage.Masters.IsDisableSave = false;
                    oneTwoIcmUploadCtrl.ePage.Masters.SaveButtonText = "Save";
                }
            });
            console.log(oneTwoIcmUploadCtrl.ePage.Masters.currentAsn);
            //Submit();
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