(function () {
    "use strict";

    angular
        .module("Application")
        .controller("FreightReportController", FreightReportController);

    FreightReportController.$inject = ["$filter", "$timeout", "$window", "$location", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig", "dynamicLookupConfig"];

    function FreightReportController($filter, $timeout, $window, $location, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig, dynamicLookupConfig) {
        var FreightReportCtrl = this;

        function Init() {
            FreightReportCtrl.ePage = {
                "Title": "",
                "Prefix": "Report",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitReport();
        }

        function InitReport() {
            // variable declaration
            FreightReportCtrl.ePage.Masters.taskName = "OrderReports";
            FreightReportCtrl.ePage.Masters.dataentryName = "OrderReports";
            FreightReportCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            FreightReportCtrl.ePage.Masters.defaultFilter = FreightReportCtrl.defaultFilter;
            FreightReportCtrl.ePage.Masters.selectedRow = -1;
            // function call from UI
            FreightReportCtrl.ePage.Masters.GetConfigDetails = GetConfigDetails;
            FreightReportCtrl.ePage.Masters.GenerateReports = GenerateReports;
            FreightReportCtrl.ePage.Masters.CloseFilter = CloseFilter;
            FreightReportCtrl.ePage.Masters.DownloadReport = DownloadReport;

            GetDynamicLookupMasterList();
            GetReportList();
        }

        // get config details
        function GetConfigDetails(item, index) {
            FreightReportCtrl.ePage.Masters.selectedRow = index;
            if (item.Value.DataEntryName) {
                if (FreightReportCtrl.ePage.Masters.DynamicControl) {
                    $('#filterSideBar' + FreightReportCtrl.ePage.Masters.DynamicControl.DataEntryName).removeClass('open');
                }
                FreightReportCtrl.ePage.Masters.IsLoading = true;
                // Get Dynamic filter controls
                var _filter = {
                    DataEntryName: item.Value.DataEntryName
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                    var _isEmpty = angular.equals({}, response.data.Response);
                    if (response.data.Response == null || !response.data.Response || _isEmpty) {
                        console.log("Dynamic control config Empty Response");
                    } else {
                        FreightReportCtrl.ePage.Masters.DynamicControl = response.data.Response;
                        $timeout(function () {
                            $('#filterSideBar' + FreightReportCtrl.ePage.Masters.DynamicControl.DataEntryName).toggleClass('open');
                        });

                        if (FreightReportCtrl.ePage.Masters.defaultFilter !== undefined) {
                            FreightReportCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                                value.Data = FreightReportCtrl.ePage.Masters.defaultFilter;
                            });
                        }
                        FreightReportCtrl.ePage.Masters.IsLoading = false;
                        FreightReportCtrl.ePage.Masters.ViewType = 2;
                    }
                });

            } else {
                toastr.warning("Cannot load the filters");
            }
        }
        // lookup master list
        function GetDynamicLookupMasterList() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader,OrgCarrierList,SailingDetails";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    FreightReportCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }
        // CfxMenus
        function GetReportList() {
            FreightReportCtrl.ePage.Masters.ChildMenuList = [];
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": authService.getUserInfo().AppPK,
                "SourceEntityRefKey": "Reports",
                "EntitySource": "EXCELCONFIG",
                "ModuleCode": "SHP",
                "USR_UserName": authService.getUserInfo().UserId,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + _filter.SAP_FK, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    FreightReportCtrl.ePage.Masters.OtherConfigList = [];
                    FreightReportCtrl.ePage.Masters.ChildMenuList = response.data.Response;

                    if (FreightReportCtrl.ePage.Masters.ChildMenuList.length > 0) {
                        FreightReportCtrl.ePage.Masters.ChildMenuList.map(function (value, key) {
                            value.Value = JSON.parse(value.Value);
                            FreightReportCtrl.ePage.Masters.OtherConfigList.push(value.Value);
                        });
                    }
                }
            });
        }

        function GenerateReports() {
            FreightReportCtrl.ePage.Masters.DynamicControl.Entities[0].ConfigData.map(function (value, key) {
                if (!value.Include) {
                    delete(FreightReportCtrl.ePage.Masters.DynamicControl.Entities[0].Data[value.PropertyName]);
                }
            });
            $timeout(function () {
                var tempArray = [];
                FreightReportCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                    var x = helperService.createToArrayOfObject(value.Data);
                    x.map(function (v, k) {
                        tempArray.push(v);
                    });
                    FreightReportCtrl.ePage.Masters.DynamicControl.Filter = tempArray;
                });
                getSearchReports();
                CloseFilter();
            }, 500);
        }

        function CloseFilter() {
            $('#filterSideBar' + FreightReportCtrl.ePage.Masters.DynamicControl.DataEntryName).removeClass('open');
        }

        function getSearchReports() {
            var obj = angular.copy(FreightReportCtrl.ePage.Masters.OtherConfigList[FreightReportCtrl.ePage.Masters.selectedRow].TemplateJson);
            FreightReportCtrl.ePage.Masters.ChildMenuList[FreightReportCtrl.ePage.Masters.selectedRow].IsDownloading = true;
            FreightReportCtrl.ePage.Masters.ChildMenuList[FreightReportCtrl.ePage.Masters.selectedRow].SourceEntityRefKey = undefined;

            if (FreightReportCtrl.ePage.Masters.DynamicControl.Filter) {
                obj.DataObjs[1].SearchInput.SearchInput = FreightReportCtrl.ePage.Masters.DynamicControl.Filter;
            } else {
                obj.DataObjs[1].SearchInput.SearchInput = [];
            }

            var mydate = new Date();
            var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');
            obj.DataObjs[0].DataObject.Date = filtereddate;
            obj.JobDocs.EntityRefKey = FreightReportCtrl.ePage.Masters.ChildMenuList[FreightReportCtrl.ePage.Masters.selectedRow].PK;
            obj.JobDocs.EntitySource = 'SHP';
            obj.JobDocs.EntityRefCode = FreightReportCtrl.ePage.Masters.ChildMenuList[FreightReportCtrl.ePage.Masters.selectedRow].Key;

            apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, obj).then(function (response) {
                if (response.data.Status == 'Success') {
                    FreightReportCtrl.ePage.Masters.ChildMenuList.map(function (value, key) {
                        if (value.PK == obj.JobDocs.EntityRefKey) {
                            value.IsDownloading = false;
                            value.DocPK = response.data.Response.PK;
                            value.DocumentName = response.data.Response.DocumentName;
                        }
                    });
                    toastr.success("Reports successfully generated...");
                } else {
                    toastr.error("Failed...");
                    FreightReportCtrl.ePage.Masters.ChildMenuList[FreightReportCtrl.ePage.Masters.selectedRow].IsDownloading = false;
                    FreightReportCtrl.ePage.Masters.ChildMenuList[FreightReportCtrl.ePage.Masters.selectedRow].SourceEntityRefKey = "Reports";
                }
            });
        }

        function DownloadReport(item) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + item.DocPK + "/" + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                    } else {
                        toastr.error("No Records Found!..");
                    }
                } else {
                    toastr.error("Invalid response");
                }
            });
        }

        Init();
    }
})();