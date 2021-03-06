(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneTwoBulkUploadController", oneTwoBulkUploadController);

    oneTwoBulkUploadController.$inject = ["$rootScope", "$timeout", "authService", "apiService", "helperService", "appConfig", "oneTwoBulkUploadConfig", "toastr", "errorWarningService", "$uibModalInstance", "confirmation"];

    function oneTwoBulkUploadController($rootScope, $timeout, authService, apiService, helperService, appConfig, oneTwoBulkUploadConfig, toastr, errorWarningService, $uibModalInstance, confirmation) {
        /* jshint validthis: true */
        var oneTwoBulkUploadCtrl = this;

        function Init() {
            oneTwoBulkUploadCtrl.ePage = {
                "Title": "",
                "Prefix": "BUP_Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": oneTwoBulkUploadConfig.Entities
            };
            // Save
            oneTwoBulkUploadCtrl.ePage.Masters.Save = Save;
            oneTwoBulkUploadCtrl.ePage.Masters.SaveButtonText = "Submit";
            oneTwoBulkUploadCtrl.ePage.Masters.IsDisableSave = false;
            oneTwoBulkUploadCtrl.ePage.Masters.modalClose = modalClose;
            CreateNewBooking();
        }

        function CreateNewBooking() {
            oneTwoBulkUploadCtrl.ePage.Masters.currentAsn = undefined;
            helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = "BUP";
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
                    oneTwoBulkUploadCtrl.ePage.Masters.currentAsn = _obj;
                    console.log(oneTwoBulkUploadCtrl.ePage.Masters.currentAsn);
                } else {
                    console.log("Empty New Order response");
                }
            });
        }

        function modalClose() {
            $uibModalInstance.dismiss('close');
        }
        

        function Save($item) {
            oneTwoBulkUploadCtrl.ePage.Masters.IsDisableSave = true;
            oneTwoBulkUploadCtrl.ePage.Masters.SaveButtonText = "Please wait..";
            helperService.SaveEntity($item, 'Batch').then(function (response) {
                if (response.Status === "success") {
                    console.log(response);
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        closeButtonVisible: false,
                        actionButtonText: 'Ok',
                        headerText: 'Bulk  Uploaded Successfully..',
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
                    oneTwoBulkUploadCtrl.ePage.Masters.IsDisableSave = false;
                    oneTwoBulkUploadCtrl.ePage.Masters.SaveButtonText = "Save";
                }
            });
            console.log(oneTwoBulkUploadCtrl.ePage.Masters.currentAsn);
            //Submit();
        }
      
        Init();
    }
})();