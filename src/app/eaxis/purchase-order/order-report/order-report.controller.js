(function () {
    "use strict";

    angular
        .module("Application")
        .controller("orderReportController", OrderReportController);

    OrderReportController.$inject = ["$filter", "$timeout", "$window", "$location", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig", "dynamicLookupConfig"];

    function OrderReportController($filter, $timeout, $window, $location, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig, dynamicLookupConfig) {
        var OrderReportCtrl = this;

        function Init() {
            OrderReportCtrl.ePage = {
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
            OrderReportCtrl.ePage.Masters.taskName = "OrderReports";
            OrderReportCtrl.ePage.Masters.dataentryName = "OrderReports";
            OrderReportCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            OrderReportCtrl.ePage.Masters.defaultFilter = OrderReportCtrl.defaultFilter;
            OrderReportCtrl.ePage.Masters.selectedRow = -1;
            // function call from UI
            OrderReportCtrl.ePage.Masters.GetConfigDetails = GetConfigDetails;
            OrderReportCtrl.ePage.Masters.GenerateReports = GenerateReports;
            OrderReportCtrl.ePage.Masters.CloseFilter = CloseFilter;
            OrderReportCtrl.ePage.Masters.DownloadReport = DownloadReport;

            GetDynamicLookupMasterList();
            GetReportList();
        }

        // get config details
        function GetConfigDetails(item, index) {
            OrderReportCtrl.ePage.Masters.selectedRow = index;
            if (item.Value.DataEntryName) {
                if (OrderReportCtrl.ePage.Masters.DynamicControl) {
                    $('#filterSideBar' + OrderReportCtrl.ePage.Masters.DynamicControl.DataEntryName).removeClass('open');
                }
                OrderReportCtrl.ePage.Masters.IsLoading = true;
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
                        OrderReportCtrl.ePage.Masters.DynamicControl = response.data.Response;
                        $timeout(function () {
                            $('#filterSideBar' + OrderReportCtrl.ePage.Masters.DynamicControl.DataEntryName).toggleClass('open');
                        });

                        if (OrderReportCtrl.ePage.Masters.defaultFilter !== undefined) {
                            OrderReportCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                                value.Data = OrderReportCtrl.ePage.Masters.defaultFilter;
                            });
                        }
                        OrderReportCtrl.ePage.Masters.IsLoading = false;
                        OrderReportCtrl.ePage.Masters.ViewType = 2;
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
                    OrderReportCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }
        // CfxMenus
        function GetReportList() {
            OrderReportCtrl.ePage.Masters.ChildMenuList = [];
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": authService.getUserInfo().AppPK,
                "SourceEntityRefKey": "Reports",
                "EntitySource": "EXCELCONFIG",
                "ModuleCode": "ORD",
                "USR_UserName": authService.getUserInfo().UserId,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + _filter.SAP_FK, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    OrderReportCtrl.ePage.Masters.OtherConfigList = [];
                    OrderReportCtrl.ePage.Masters.ChildMenuList = response.data.Response;

                    if (OrderReportCtrl.ePage.Masters.ChildMenuList.length > 0) {
                        OrderReportCtrl.ePage.Masters.ChildMenuList.map(function (value, key) {
                            value.Value = JSON.parse(value.Value);
                            OrderReportCtrl.ePage.Masters.OtherConfigList.push(value.Value);
                        });
                    }
                }
            });
        }

        function GenerateReports() {
            OrderReportCtrl.ePage.Masters.DynamicControl.Entities[0].ConfigData.map(function (value, key) {
                if (!value.Include) {
                    delete(OrderReportCtrl.ePage.Masters.DynamicControl.Entities[0].Data[value.PropertyName]);
                }
            });
            $timeout(function () {
                var tempArray = [];
                OrderReportCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                    var x = helperService.createToArrayOfObject(value.Data);
                    x.map(function (v, k) {
                        tempArray.push(v);
                    });
                    OrderReportCtrl.ePage.Masters.DynamicControl.Filter = tempArray;
                });
                getSearchReports();
                CloseFilter();
            }, 500);
        }

        function CloseFilter() {
            $('#filterSideBar' + OrderReportCtrl.ePage.Masters.DynamicControl.DataEntryName).removeClass('open');
        }

        function getSearchReports() {
            var obj = angular.copy(OrderReportCtrl.ePage.Masters.OtherConfigList[OrderReportCtrl.ePage.Masters.selectedRow].TemplateJson);
            OrderReportCtrl.ePage.Masters.ChildMenuList[OrderReportCtrl.ePage.Masters.selectedRow].IsDownloading = true;
            OrderReportCtrl.ePage.Masters.ChildMenuList[OrderReportCtrl.ePage.Masters.selectedRow].SourceEntityRefKey = undefined;

            if (OrderReportCtrl.ePage.Masters.DynamicControl.Filter) {
                obj.DataObjs[1].SearchInput.SearchInput = OrderReportCtrl.ePage.Masters.DynamicControl.Filter;
            } else {
                obj.DataObjs[1].SearchInput.SearchInput = [];
            }

            var mydate = new Date();
            var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');
            obj.DataObjs[0].DataObject.Date = filtereddate;
            obj.JobDocs.EntityRefKey = OrderReportCtrl.ePage.Masters.ChildMenuList[OrderReportCtrl.ePage.Masters.selectedRow].PK;
            obj.JobDocs.EntitySource = 'ORD';
            obj.JobDocs.EntityRefCode = OrderReportCtrl.ePage.Masters.ChildMenuList[OrderReportCtrl.ePage.Masters.selectedRow].Key;

            apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, obj).then(function (response) {
                if (response.data.Response.Status == 'Success') {
                    OrderReportCtrl.ePage.Masters.ChildMenuList.map(function (value, key) {
                        if (value.PK == obj.JobDocs.EntityRefKey) {
                            value.IsDownloading = false;
                            value.DocPK = response.data.Response.PK;
                            value.DocumentName = response.data.Response.DocumentName;
                        }
                    });
                    toastr.success("Reports successfully generated...");
                } else {
                    toastr.error("Failed...");
                    OrderReportCtrl.ePage.Masters.ChildMenuList[OrderReportCtrl.ePage.Masters.selectedRow].IsDownloading = false;
                    OrderReportCtrl.ePage.Masters.ChildMenuList[OrderReportCtrl.ePage.Masters.selectedRow].SourceEntityRefKey = "Reports";
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