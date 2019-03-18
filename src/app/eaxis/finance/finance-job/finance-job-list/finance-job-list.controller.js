(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceJobListController", FinanceJobListController);

    FinanceJobListController.$inject = ["$uibModalInstance", "helperService", "apiService", "financeConfig", "CurrentFinanceJob"];

    function FinanceJobListController($uibModalInstance, helperService, apiService, financeConfig, CurrentFinanceJob) {
        var FinanceJobListCtrl = this;

        function Init() {
            FinanceJobListCtrl.ePage = {
                "Title": "",
                "Prefix": "Finance_Job_List",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": financeConfig.Entities
            };

            FinanceJobListCtrl.ePage.Masters.CurrentFinanceList = true;
            FinanceJobListCtrl.ePage.Masters.JobList = [];

            /* Function */
            FinanceJobListCtrl.ePage.Masters.Close = Close;
            FinanceJobListCtrl.ePage.Masters.AddNewJob = AddNewJob;
            FinanceJobListCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            financeConfig.ValidationFindall();
            InitBilling();
        }

        function InitBilling() {
            console.log("InitBilling", CurrentFinanceJob);

            var _filter = {
                EntityRefKey: CurrentFinanceJob.EntityRefKey,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": financeConfig.API.JobHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", financeConfig.API.JobHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    FinanceJobListCtrl.ePage.Masters.CurrentFinanceJob = response.data.Response;
                }
                else{
                    console.log("GetById Failed");
                }
            });
        }

        function SelectedGridRow($item) {
            if ($item) {
                financeConfig.GetTabDetails($item, false).then(function (response) {
                    if (response) {
                        FinanceJobListCtrl.ePage.Masters.CurrentFinanceList = false;
                        FinanceJobListCtrl.ePage.Masters.JobList = response;
                    }
                });
            }
        }

        function Close() {
            FinanceJobListCtrl.ePage.Masters.JobList.splice(0, 1);
            $uibModalInstance.dismiss('close');
        }

        function AddNewJob($item) {
            console.log("AddNewJob");

        }

        Init();
    }
})();