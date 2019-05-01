(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReportController", ReportController);

    ReportController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "toastr", "appConfig", "$window", "dynamicLookupConfig", "$filter", "$state"];

    function ReportController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, toastr, appConfig, $window, dynamicLookupConfig, $filter, $state) {

        var SPMSReportCtrl = this;

        function Init() {

            SPMSReportCtrl.ePage = {
                "Title": "",
                "Prefix": "Report",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            // variable declaration
            SPMSReportCtrl.ePage.Masters.taskName = "WarehouseReports";
            SPMSReportCtrl.ePage.Masters.dataentryName = "WarehouseReports";
            SPMSReportCtrl.ePage.Masters.defaultFilter = SPMSReportCtrl.defaultFilter;
            SPMSReportCtrl.ePage.Masters.selectedRow = -1;


            // function call from UI
            SPMSReportCtrl.ePage.Masters.GetConfigDetails = GetConfigDetails;
            SPMSReportCtrl.ePage.Masters.GenerateReports = GenerateReports;
            SPMSReportCtrl.ePage.Masters.CloseFilter = CloseFilter;
            SPMSReportCtrl.ePage.Masters.DownloadReport = DownloadReport;

            // function call
            checkCfxMenus();

        }

        // get config details
        function GetConfigDetails(item, index) {
            SPMSReportCtrl.ePage.Masters.selectedRow = index;
            if (item.OtherConfig.dataEntryName) {
                if (item.OtherConfig.IsActiveConfig == true) {
                    $window.open(item.Link, "_blank");
                } else {
                    if (SPMSReportCtrl.ePage.Masters.DynamicControl) {
                        $('#filterSideBar' + SPMSReportCtrl.ePage.Masters.DynamicControl.DataEntryName).removeClass('open');
                    }
                    SPMSReportCtrl.ePage.Masters.IsLoading = true;
                    // Get Dynamic filter controls
                    var _filter = {
                        DataEntryName: item.OtherConfig.dataEntryName
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
                            SPMSReportCtrl.ePage.Masters.DynamicControl = response.data.Response;

                            dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response.LookUpList);

                            $timeout(function () {
                                $('#filterSideBar' + SPMSReportCtrl.ePage.Masters.DynamicControl.DataEntryName).toggleClass('open');
                            });

                            if (SPMSReportCtrl.ePage.Masters.defaultFilter !== undefined) {
                                SPMSReportCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                                    value.Data = SPMSReportCtrl.ePage.Masters.defaultFilter;
                                });
                            }
                            SPMSReportCtrl.ePage.Masters.IsLoading = false;
                            if ($state.current.url == "/spare-parts-report") {
                                SPMSReportCtrl.ePage.Masters.ViewType = 1;
                            } else {
                                SPMSReportCtrl.ePage.Masters.ViewType = 2;
                            }
                        }
                    });
                }
            } else {
                toastr.warning("Cannot load the filters");
            }

        }


        // CfxMenus
        function checkCfxMenus() {
            
            SPMSReportCtrl.ePage.Masters.ChildMenuList = [];
            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "Report",
                "ModuleCode": "WMS",
                "USR_UserName": authService.getUserInfo().UserId,
                "SubModuleCode":"SPMS"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    SPMSReportCtrl.ePage.Masters.OtherConfigList = [];

                    SPMSReportCtrl.ePage.Masters.ParentMenuList = response.data.Response;

                    SPMSReportCtrl.ePage.Masters.ChildMenuList = $filter('orderBy')(response.data.Response[0].MenuList, 'DisplayOrder');

                    if (SPMSReportCtrl.ePage.Masters.ChildMenuList.length > 0) {
                        angular.forEach(SPMSReportCtrl.ePage.Masters.ChildMenuList, function (value, key) {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                            SPMSReportCtrl.ePage.Masters.OtherConfigList.push(value.OtherConfig);
                        });
                    }
                }
            });
        }

        function GenerateReports() {
            SPMSReportCtrl.ePage.Masters.DynamicControl.Entities[0].ConfigData.map(function (value, key) {
                if (!value.Include) {
                    delete (SPMSReportCtrl.ePage.Masters.DynamicControl.Entities[0].Data[value.PropertyName])
                }
            });
            $timeout(function () {
                var tempArray = [];
                SPMSReportCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                    var x = helperService.createToArrayOfObject(value.Data);
                    x.map(function (v, k) {
                        tempArray.push(v);
                    });
                    SPMSReportCtrl.ePage.Masters.DynamicControl.Filter = tempArray;
                });
                getSearchReports();
                CloseFilter();
            }, 500);
        }

        function CloseFilter() {

            $('#filterSideBar' + SPMSReportCtrl.ePage.Masters.DynamicControl.DataEntryName).removeClass('open');
        }

        function getSearchReports() {
            var obj = angular.copy(SPMSReportCtrl.ePage.Masters.OtherConfigList[SPMSReportCtrl.ePage.Masters.selectedRow].ReportTemplate);
            SPMSReportCtrl.ePage.Masters.ChildMenuList[SPMSReportCtrl.ePage.Masters.selectedRow].IsDownloading = true;
            SPMSReportCtrl.ePage.Masters.ChildMenuList[SPMSReportCtrl.ePage.Masters.selectedRow].DocumentName = undefined;

            //Setting Filter to Static Binding and Assigning Filter to SearchInput
            if (SPMSReportCtrl.ePage.Masters.DynamicControl.Filter) {

                obj.DataObjs[1].SearchInput.SearchInput = SPMSReportCtrl.ePage.Masters.DynamicControl.Filter;

                if (obj.DataObjs[2]) {
                    obj.DataObjs[2].SearchInput.SearchInput = SPMSReportCtrl.ePage.Masters.DynamicControl.Filter;
                }

                SPMSReportCtrl.ePage.Masters.DynamicControl.Filter.map(function (val, key) {
                    if (val.FieldName == "WAR_WarehouseCode" || val.FieldName == "WarehouseCode"|| val.FieldName=="WLO_WAR_WarehouseCode") {
                        obj.DataObjs[0].DataObject.Warehouse_Code = val.value;
                    }
                    if (val.FieldName == "ClientCode" || val.FieldName == "ORG_ClientCode") {
                        obj.DataObjs[0].DataObject.Client_Code = val.value;
                    }
                    if (val.FieldName == "ProductCode" || val.FieldName == "PartNum") {
                        obj.DataObjs[0].DataObject.Product_Code = val.value;
                    }
                    if (val.FieldName == "Location" || val.FieldName == "WLO_Location" || val.FieldName == "ORG_Location_Code") {
                        obj.DataObjs[0].DataObject.Location = val.value;
                    }
                    if (val.FieldName == "StockBalanceOn" || val.FieldName == "FromDate") {
                        obj.DataObjs[0].DataObject.Custom_Date = val.value;
                    }

                });

            } else {
                obj.DataObjs[1].SearchInput.SearchInput = [];
            }


            var mydate = new Date();
            var filtereddate = $filter('date')(mydate, 'dd-MMM-yyyy');
            obj.DataObjs[0].DataObject.Date = filtereddate;

            obj.JobDocs.EntityRefKey = SPMSReportCtrl.ePage.Masters.ChildMenuList[SPMSReportCtrl.ePage.Masters.selectedRow].Id;
            obj.JobDocs.EntitySource = 'WMS';
            obj.JobDocs.EntityRefCode = SPMSReportCtrl.ePage.Masters.ChildMenuList[SPMSReportCtrl.ePage.Masters.selectedRow].Description;

            apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, obj).then(function SuccessCallback(response) {
                if (response.data.Response.Status == 'Success' && !response.data.Response.Remarks) {
                    angular.forEach(SPMSReportCtrl.ePage.Masters.ChildMenuList, function (value, key) {
                        if (value.Id == obj.JobDocs.EntityRefKey) {
                            value.IsDownloading = false;
                            value.DocPK = response.data.Response.PK;
                            value.DocumentName = response.data.Response.FileName;
                        }
                    });
                } else {
                    angular.forEach(SPMSReportCtrl.ePage.Masters.ChildMenuList, function (value, key) {
                        if (value.Id == obj.JobDocs.EntityRefKey) {
                            value.IsDownloading = false;
                        }
                    });
                    toastr.info("Response is Empty");
                }
            });
        }

        function DownloadReport(item) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + item.DocPK + "/" + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        Init();

    }

})();