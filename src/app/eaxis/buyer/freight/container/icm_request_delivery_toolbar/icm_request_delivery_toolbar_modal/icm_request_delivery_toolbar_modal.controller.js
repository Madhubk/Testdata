(function () {
    "use strict";

    angular
        .module("Application")
        .controller("icmRequestDeliveryToolbarModalController", icmRequestDeliveryToolbarModalController);

    icmRequestDeliveryToolbarModalController.$inject = ["$q", "$window", "$timeout", "APP_CONSTANT", "helperService", "apiService", "appConfig", "$uibModalInstance", "authService", "confirmation", "toastr", "param"];

    function icmRequestDeliveryToolbarModalController($q, $window, $timeout, APP_CONSTANT, helperService, apiService, appConfig, $uibModalInstance, authService, confirmation, toastr, param) {
        var icmRequestDeliveryToolbarModalCtrl = this;

        function Init() {
            icmRequestDeliveryToolbarModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ICM_Request_Delivery_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.DatePicker = {};
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.DatePicker.OptionsDel = APP_CONSTANT.DatePicker;
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            // Save
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.Save = Save;
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.SaveButtonText = "Place Delivery Request";
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.IsDisableSave = false;
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.modalClose = modalClose;
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.ContainerList = param.input;
            CreateNewBatch();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function CreateNewBatch() {
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.currentAsn = undefined;
            helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = "CDE";
                    response.data.Response.UIOrderBatchUpload_Buyer.Status = "CREATED";
                    response.data.Response.UIOrderBatchUpload_Buyer.Source = "SHP";
                    response.data.Response.UIOrderBatchUpload_Buyer.Buyer = "MARPULNRT";
                    response.data.Response.UIOrderBatchUpload_Buyer.Consignee_FK = "d378d6e1-2d50-4326-82f6-1be00185e887";
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
                    icmRequestDeliveryToolbarModalCtrl.ePage.Masters.currentObj = _obj;
                } else {
                    console.log("Empty New Order response");
                }
            });
        }

        function modalClose() {
            $uibModalInstance.dismiss('close');
        }

        function Save($item) {

            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.IsDisableSave = true;
            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.SaveButtonText = "Please wait..";
            helperService.SaveEntity($item, 'Batch').then(function (response) {
                if (response.Status === "success") {
                    updateContainerList(response.Data);
                } else if (response.Status === "failed") {
                    toastr.error("Save Failed...!");
                    icmRequestDeliveryToolbarModalCtrl.ePage.Masters.IsDisableSave = false;
                    icmRequestDeliveryToolbarModalCtrl.ePage.Masters.SaveButtonText = "Place Delivery Request";
                }
            });

        }

        function updateContainerList(obj) {
            var _containerInput = [];
            var _jobCommentsInput = [];
            console.log(obj);

            icmRequestDeliveryToolbarModalCtrl.ePage.Masters.ContainerList.map(function (val, key) {
                var commentObj = {};
                commentObj.PK = "";
                commentObj.EntityRefKey = val.PK;
                commentObj.EntitySource = 'CNT';
                commentObj.EntityRefCode = val.ContainerNo;
                commentObj.ParentEntityRefKey = obj.PK;
                commentObj.ParentEntityRefCode = obj.BatchUploadNo;
                commentObj.ParentEntitySource = "POB";
                commentObj.Description = val.jobcomment;
                commentObj.CommentsType = "RQDLV";
                commentObj.PartyType_FK = authService.getUserInfo().PartyPK;
                commentObj.PartyType_Code = authService.getUserInfo().PartyCode;
                _jobCommentsInput.push(commentObj);

                var containerObj = {};
                containerObj.EntityRefPK = val.PK,
                    containerObj.Properties = [{
                        "PropertyName": "CNT_RequestedDelivery",
                        "PropertyNewValue": val.RequestedDelivery
                    }, {
                        "PropertyName": "CNT_Batch_FK",
                        "PropertyNewValue": obj.PK
                    }];
                _containerInput.push(containerObj);

            });

            apiService.post('eAxisAPI', appConfig.Entities.CntContainer.API.UpdateRecords.Url, _containerInput).then(function (response) {
                if (response.data.Response) {
                    jobcommentInsert(_jobCommentsInput);
                } else {
                    toastr.error("Save Failed...");
                    icmRequestDeliveryToolbarModalCtrl.ePage.Masters.IsDisableSave = false;
                    icmRequestDeliveryToolbarModalCtrl.ePage.Masters.SaveButtonText = "Place Delivery Request";
                }
            });


        }

        function jobcommentInsert(_jobCommentsInput) {
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, _jobCommentsInput).then(function (response) {
                if (response.data.Response) {
                    modalClose();
                    toastr.success("Selected Container(s) Requested for Delivery..");
                } else {
                    console.log("Empty comments Response");
                    icmRequestDeliveryToolbarModalCtrl.ePage.Masters.IsDisableSave = false;
                    icmRequestDeliveryToolbarModalCtrl.ePage.Masters.SaveButtonText = "Place Delivery Request";
                }
            });
        }



        Init();
    }
})();