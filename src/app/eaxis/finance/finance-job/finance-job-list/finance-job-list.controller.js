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

            FinanceJobListCtrl.ePage.Masters.FinanceList = true;
            FinanceJobListCtrl.ePage.Masters.CurrentFinanceJob = [];

            /* Function */
            FinanceJobListCtrl.ePage.Masters.Close = Close;
            FinanceJobListCtrl.ePage.Masters.AddNewJob = AddNewJob;
            FinanceJobListCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            financeConfig.ValidationFindall();
            InitBilling();
        }

        function InitBilling() {
            var _filter = {
                EntityRefKey: CurrentFinanceJob.EntityRefKey,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": financeConfig.API.JobHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", financeConfig.API.JobHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    FinanceJobListCtrl.ePage.Masters.CurrentFinanceJobList = response.data.Response;
                }
                else {
                    console.log("GetById Failed");
                }
            });
        }

        function SelectedGridRow($item) {
            if ($item) {
                financeConfig.GetTabDetails($item, false).then(function (response) {
                    if (response) {
                        FinanceJobListCtrl.ePage.Masters.FinanceList = false;
                        FinanceJobListCtrl.ePage.Masters.CurrentFinanceJob = response;
                    }
                });
            }
        }

        function Close() {
            FinanceJobListCtrl.ePage.Masters.CurrentFinanceJob.splice(0, 1);
            $uibModalInstance.dismiss('close');
        }

        function AddNewJob() {
            FinanceJobListCtrl.ePage.Masters.FinanceList = false;

            helperService.getFullObjectUsingGetById(financeConfig.API.JobHeaderList.API.GetById.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.Response.UIJobHeader.AgentOrg_Code = CurrentFinanceJob.AgentOrg_Code;
                    response.data.Response.Response.UIJobHeader.Agent_Org_FK = CurrentFinanceJob.Agent_Org_FK;
                    response.data.Response.Response.UIJobHeader.LocalOrg_Code = CurrentFinanceJob.LocalOrg_Code;
                    response.data.Response.Response.UIJobHeader.LocalOrg_FK = CurrentFinanceJob.LocalOrg_FK;
                    response.data.Response.Response.UIJobHeader.JobNo = CurrentFinanceJob.JobNo;
                    response.data.Response.Response.UIJobHeader.GB = CurrentFinanceJob.GB;
                    response.data.Response.Response.UIJobHeader.BranchCode = CurrentFinanceJob.BranchCode;
                    response.data.Response.Response.UIJobHeader.BranchName = CurrentFinanceJob.BranchName;
                    response.data.Response.Response.UIJobHeader.GC = CurrentFinanceJob.GC;
                    response.data.Response.Response.UIJobHeader.CompanyCode = CurrentFinanceJob.CompanyCode;
                    response.data.Response.Response.UIJobHeader.CompanyName = CurrentFinanceJob.CompanyName;
                    response.data.Response.Response.UIJobHeader.GE = CurrentFinanceJob.GE;
                    response.data.Response.Response.UIJobHeader.DeptCode = CurrentFinanceJob.DeptCode;
                    response.data.Response.Response.UIJobHeader.EntitySource = CurrentFinanceJob.EntitySource;
                    response.data.Response.Response.UIJobHeader.EntityRefKey = CurrentFinanceJob.EntityRefKey;
                    response.data.Response.Response.UIJobHeader.HeaderType = CurrentFinanceJob.HeaderType;
                }

                var _obj = {
                    entity: response.data.Response.Response.UIJobHeader,
                    data: response.data.Response.Response,
                    Validations: response.data.Response.Validations
                };

                financeConfig.GetTabDetails(_obj, true).then(function (response) {
                    if (response) {
                        FinanceJobListCtrl.ePage.Masters.FinanceList = false;
                        FinanceJobListCtrl.ePage.Masters.CurrentFinanceJob = response;
                    }
                });
            });
        }

        Init();
    }
})();