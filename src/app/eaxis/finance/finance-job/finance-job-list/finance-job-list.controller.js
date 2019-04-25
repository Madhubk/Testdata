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
            //FinanceJobListCtrl.ePage.Masters.FinanceListEmpty = false;
            FinanceJobListCtrl.ePage.Masters.CurrentFinanceJob = [];

            /* Function */
            FinanceJobListCtrl.ePage.Masters.JobListClose = JobListClose;
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
                "FilterID": financeConfig.Entities.API.JobHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", financeConfig.Entities.API.JobHeader.API.FindAll.Url, _input).then(function (response) {
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

        function AddNewJob() {
            FinanceJobListCtrl.ePage.Masters.FinanceList = false;

            helperService.getFullObjectUsingGetById(financeConfig.Entities.API.JobHeaderList.API.GetById.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    if (CurrentFinanceJob) {
                        FinanceJobListCtrl.ePage.Masters.JobHeader = response.data.Response;
                        response.data.Response.UIJobHeader.AgentOrg_Code = CurrentFinanceJob.AgentOrg_Code;
                        response.data.Response.UIJobHeader.Agent_Org_FK = CurrentFinanceJob.Agent_Org_FK;
                        response.data.Response.UIJobHeader.LocalOrg_Code = CurrentFinanceJob.LocalOrg_Code;
                        response.data.Response.UIJobHeader.LocalOrg_FK = CurrentFinanceJob.LocalOrg_FK;
                        response.data.Response.UIJobHeader.JobNo = CurrentFinanceJob.JobNo;
                        response.data.Response.UIJobHeader.GB = CurrentFinanceJob.GB;
                        response.data.Response.UIJobHeader.BranchCode = CurrentFinanceJob.BranchCode;
                        response.data.Response.UIJobHeader.BranchName = CurrentFinanceJob.BranchName;
                        response.data.Response.UIJobHeader.GC = CurrentFinanceJob.GC;
                        response.data.Response.UIJobHeader.CompanyCode = CurrentFinanceJob.CompanyCode;
                        response.data.Response.UIJobHeader.CompanyName = CurrentFinanceJob.CompanyName;
                        response.data.Response.UIJobHeader.GE = CurrentFinanceJob.GE;
                        response.data.Response.UIJobHeader.DeptCode = CurrentFinanceJob.DeptCode;
                        response.data.Response.UIJobHeader.EntitySource = CurrentFinanceJob.EntitySource;
                        response.data.Response.UIJobHeader.EntityRefKey = CurrentFinanceJob.EntityRefKey;
                        response.data.Response.UIJobHeader.HeaderType = CurrentFinanceJob.HeaderType;
                    }

                    /* AddNew Get Company Local Currency */
                    if (CurrentFinanceJob.GC) {
                        var _filter = {
                            PK: CurrentFinanceJob.GC,
                        };

                        var _input = {
                            "searchInput": helperService.createToArrayOfObject(_filter),
                            "FilterID": financeConfig.Entities.API.CmpCompany.API.FindAll.FilterID
                        };

                        apiService.post("eAxisAPI", financeConfig.Entities.API.CmpCompany.API.FindAll.Url, _input).then(function (response) {
                            if (response.data.Status == "Success") {
                                FinanceJobListCtrl.ePage.Masters.JobHeader.UIJobHeader.CompanyLocalCurrency = response.data.Response[0].LocalCurrency;

                                var _obj = {
                                    entity: FinanceJobListCtrl.ePage.Masters.JobHeader.UIJobHeader,
                                    data: FinanceJobListCtrl.ePage.Masters.JobHeader,
                                    Validations: FinanceJobListCtrl.ePage.Masters.JobHeader.Validations
                                };
            
                                financeConfig.GetTabDetails(_obj, true).then(function (response) {
                                    if (response) {
                                        FinanceJobListCtrl.ePage.Masters.CurrentFinanceJob = response;
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }

        function JobListClose() {
            $uibModalInstance.dismiss('close');
        }

        function Close() {
            FinanceJobListCtrl.ePage.Masters.CurrentFinanceJob.splice(0, 1);
            FinanceJobListCtrl.ePage.Masters.FinanceList = true;
        }

        Init();
    }
})();