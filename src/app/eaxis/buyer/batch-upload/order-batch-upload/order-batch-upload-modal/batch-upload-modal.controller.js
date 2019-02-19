(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PoModalController", PoModalController);

    PoModalController.$inject = ["$injector", "$uibModalInstance", "authService", "apiService", "appConfig", "helperService", "param", "toastr", "confirmation", "one_poBatchUploadConfig"];

    function PoModalController($injector, $uibModalInstance, authService, apiService, appConfig, helperService, param, toastr, confirmation, one_poBatchUploadConfig) {
        var PoModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            PoModalCtrl.ePage = {
                "Title": "",
                "Prefix": "PO_Upload_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": one_poBatchUploadConfig.Entities
            };

            InitPOUploadModal();
        }

        function InitPOUploadModal() {
            PoModalCtrl.ePage.Masters.Param = param;
            PoModalCtrl.ePage.Masters.Cancel = Cancel;
            PoModalCtrl.ePage.Masters.Close = Close;

            GetById(param.Type);
            GetRelatedLookupList();
        }

        function GetById(docType) {
            helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.UIOrderBatchUpload_Buyer.Source = "POB";
                    (docType) ? response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = docType: response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = one_poBatchUploadConfig.GlobalVar.DocType;
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
                    PoModalCtrl.ePage.Masters.currentObj = _obj;
                } else {
                    toastr.error("Empty New Order response");
                }
            });
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function Close(item) {
            (item) ? Confirmation(item.item): false;
        }

        function Confirmation(item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                closeButtonVisible: false,
                actionButtonText: 'Ok',
                headerText: 'Document Uploaded Successfully..',
                bodyText: "Ref #: " + item.BatchUploadNo
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    Cancel();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "BP_PoBatchUploadOrg_13244",
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