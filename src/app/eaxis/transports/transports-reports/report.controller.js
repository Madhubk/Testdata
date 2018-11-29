(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransportsReportController", TransportsReportController);

    TransportsReportController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "reportConfig", "$timeout", "toastr", "appConfig", "$window", "dynamicLookupConfig", "$filter"];

    function TransportsReportController($location, APP_CONSTANT, authService, apiService, helperService, reportConfig, $timeout, toastr, appConfig, $window, dynamicLookupConfig, $filter) {

        var TransportsReportCtrl = this;

        function Init() {

            TransportsReportCtrl.ePage = {
                "Title": "",
                "Prefix": "Report",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": reportConfig.Entities
            };
            // variable declaration
            TransportsReportCtrl.ePage.Masters.taskName = "TransportsReports";
            TransportsReportCtrl.ePage.Masters.dataentryName = "TransportsReports";
            TransportsReportCtrl.ePage.Masters.defaultFilter = TransportsReportCtrl.defaultFilter;
            TransportsReportCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            TransportsReportCtrl.ePage.Masters.selectedRow = -1;

            // function call from UI
            TransportsReportCtrl.ePage.Masters.GetConfigDetails = GetConfigDetails;
            TransportsReportCtrl.ePage.Masters.GenerateReports = GenerateReports;
            TransportsReportCtrl.ePage.Masters.CloseFilter = CloseFilter;
            TransportsReportCtrl.ePage.Masters.DownloadReport = DownloadReport;

            // function call
            GetDynamicLookupMasterList();
            checkCfxMenus();

        }

        // get config details
        function GetConfigDetails(item, index) {

            TransportsReportCtrl.ePage.Masters.selectedRow = index;
            if (item.OtherConfig.dataEntryName) {
                if (item.OtherConfig.IsActiveConfig == true) {
                    $window.open(item.Link, "_blank");
                }
                else {
                    if (TransportsReportCtrl.ePage.Masters.DynamicControl) {
                        $('#filterSideBar' + TransportsReportCtrl.ePage.Masters.DynamicControl.DataEntryName).removeClass('open');
                    }
                    TransportsReportCtrl.ePage.Masters.IsLoading = true;
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
                            TransportsReportCtrl.ePage.Masters.DynamicControl = response.data.Response;
                            $timeout(function () {
                                $('#filterSideBar' + TransportsReportCtrl.ePage.Masters.DynamicControl.DataEntryName).toggleClass('open');
                            });

                            if (TransportsReportCtrl.ePage.Masters.defaultFilter !== undefined) {
                                TransportsReportCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                                    value.Data = TransportsReportCtrl.ePage.Masters.defaultFilter;
                                });
                            }
                            TransportsReportCtrl.ePage.Masters.IsLoading = false;
                            TransportsReportCtrl.ePage.Masters.ViewType = 1;
                        }
                    });
                }
            } else {
                toastr.warning("Cannot load the filters");
            }

        }

        // lookup master list
        function GetDynamicLookupMasterList() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,OrgSupplierPart";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": "DYNDAT"
            };

            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function (response) {

                var res = response.data.Response;
                res.map(function (value, key) {
                    TransportsReportCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }
        // CfxMenus
        function checkCfxMenus() {

            TransportsReportCtrl.ePage.Masters.ChildMenuList = [];
            var _filter = {
                // "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "Report",
                "USR_UserName": authService.getUserInfo().UserId,
                "Code": "EA_SPOTLIGHTREPORTS"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAllMenuWise.FilterID
            };
            apiService.post("eAxisAPI", "CfxMenus/MasterCascadeFindAll", _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    TransportsReportCtrl.ePage.Masters.OtherConfigList = [];

                    TransportsReportCtrl.ePage.Masters.ParentMenuList = response.data.Response;

                    TransportsReportCtrl.ePage.Masters.ChildMenuList = $filter('orderBy')(response.data.Response[0].MenuList, 'DisplayOrder');

                    if (TransportsReportCtrl.ePage.Masters.ChildMenuList.length > 0) {
                        angular.forEach(TransportsReportCtrl.ePage.Masters.ChildMenuList, function (value, key) {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                            TransportsReportCtrl.ePage.Masters.OtherConfigList.push(value.OtherConfig);
                        });
                    }
                }
            });
        }

        function GenerateReports() {
            TransportsReportCtrl.ePage.Masters.DynamicControl.Entities[0].ConfigData.map(function (value, key) {
                if (!value.Include) {
                    delete (TransportsReportCtrl.ePage.Masters.DynamicControl.Entities[0].Data[value.PropertyName])
                }
            });
            $timeout(function () {
                var tempArray = [];
                TransportsReportCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                    var x = helperService.createToArrayOfObject(value.Data);
                    x.map(function (v, k) {
                        tempArray.push(v);
                    });
                    TransportsReportCtrl.ePage.Masters.DynamicControl.Filter = tempArray;
                });
                getSearchReports();
                CloseFilter();
            }, 500);
        }

        function CloseFilter() {

            $('#filterSideBar' + TransportsReportCtrl.ePage.Masters.DynamicControl.DataEntryName).removeClass('open');
        }

        function getSearchReports() {
            var obj = angular.copy(TransportsReportCtrl.ePage.Masters.OtherConfigList[TransportsReportCtrl.ePage.Masters.selectedRow].ReportTemplate);
            TransportsReportCtrl.ePage.Masters.ChildMenuList[TransportsReportCtrl.ePage.Masters.selectedRow].IsDownloading = true;
            TransportsReportCtrl.ePage.Masters.ChildMenuList[TransportsReportCtrl.ePage.Masters.selectedRow].DocumentName = undefined;

            if (TransportsReportCtrl.ePage.Masters.DynamicControl.Filter) {
                if (TransportsReportCtrl.ePage.Masters.ChildMenuList[TransportsReportCtrl.ePage.Masters.selectedRow].Description == 'Items Not Manifested') {
                    var _obj = {
                        FieldName: "ManifestNumber",
                        value: "null"
                    }
                    TransportsReportCtrl.ePage.Masters.DynamicControl.Filter.push(_obj);
                } else if (TransportsReportCtrl.ePage.Masters.ChildMenuList[TransportsReportCtrl.ePage.Masters.selectedRow].Description == 'Items Manifested') {
                    var _obj = {
                        FieldName: "ManifestNumber",
                        value: "NOTNULL"
                    }
                    TransportsReportCtrl.ePage.Masters.DynamicControl.Filter.push(_obj);
                } else if (TransportsReportCtrl.ePage.Masters.ChildMenuList[TransportsReportCtrl.ePage.Masters.selectedRow].Description == 'Planned Level Load Consignments') {
                    var _obj = {
                        FieldName: "CreatedBy",
                        value: "Level Load Program"
                    }
                    TransportsReportCtrl.ePage.Masters.DynamicControl.Filter.push(_obj);
                }
                else if (TransportsReportCtrl.ePage.Masters.ChildMenuList[TransportsReportCtrl.ePage.Masters.selectedRow].Description == 'Draft Level Load Consignments') {
                    var _obj = {
                        "CreatedBy": "Level Load Program",
                        "TMC_ConsignmentStatusDesc": "Draft"
                    };

                    TransportsReportCtrl.ePage.Masters.DynamicControl.Filter = helperService.createToArrayOfObject(_obj);
                }

                obj.DataObjs[1].SearchInput.SearchInput = TransportsReportCtrl.ePage.Masters.DynamicControl.Filter;

            } else {
                obj.DataObjs[1].SearchInput.SearchInput = [];
            }
            var mydate = new Date();
            var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');
            obj.DataObjs[0].DataObject.Date = filtereddate;

            obj.JobDocs.EntityRefKey = TransportsReportCtrl.ePage.Masters.ChildMenuList[TransportsReportCtrl.ePage.Masters.selectedRow].Id;
            obj.JobDocs.EntitySource = 'TMS';
            obj.JobDocs.EntityRefCode = TransportsReportCtrl.ePage.Masters.ChildMenuList[TransportsReportCtrl.ePage.Masters.selectedRow].Description;

            apiService.post("eAxisAPI", TransportsReportCtrl.ePage.Entities.Header.API.GenerateReport.Url, obj).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    angular.forEach(TransportsReportCtrl.ePage.Masters.ChildMenuList, function (value, key) {
                        if (value.Id == obj.JobDocs.EntityRefKey) {
                            value.IsDownloading = false;
                            value.DocPK = response.data.Response.PK;
                            value.DocumentName = response.data.Response.DocumentName;
                        }
                    });
                }
            });
        }

        function DownloadReport(item) {
            apiService.get("eAxisAPI", "JobDocument/DownloadExcelFile/" + item.DocPK + "/" + authService.getUserInfo().AppPK).then(function (response) {
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
