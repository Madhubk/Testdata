(function(){
    "use strict";

    angular.module("Application")
        .controller("BatchUploadDetailsController",BatchUploadDetailsController)

        BatchUploadDetailsController.$inject = ["helperService","apiService"];
        function BatchUploadDetailsController(helperService,apiService){
            var BatchUploadDetailsCtrl = this;

            function Init() {

                var currentBatchUploadDetail = BatchUploadDetailsCtrl.currentProcess[BatchUploadDetailsCtrl.currentProcess.label].ePage.Entities;
                
                BatchUploadDetailsCtrl.ePage = {
                    "Title": "",
                    "Prefix": "BatchUploadDetails",
                    "Masters": {},
                    "Meta": helperService.metaBase(),
                    "Entities": currentBatchUploadDetail,
                };

                BulkUploadDetails();
            }

            function BulkUploadDetails(){
                var _filter = {
                    "UploadReferenceNo":  BatchUploadDetailsCtrl.ePage.Entities.Header.Data.EntityRefCode
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": BatchUploadDetailsCtrl.ePage.Entities.Header.API.WmsBulkUploadLineItems.FilterID
                };

                apiService.post("eAxisAPI", BatchUploadDetailsCtrl.ePage.Entities.Header.API.WmsBulkUploadLineItems.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        BatchUploadDetailsCtrl.ePage.Masters.BatchUploadDetails = response.data.Response
                    }
                });
            }

            Init();
        }
})();