(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WarehosueReportController", WarehosueReportController);

    WarehosueReportController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "reportConfig", "$timeout", "toastr", "appConfig", "$window", "dynamicLookupConfig","$filter"];

    function WarehosueReportController($location, APP_CONSTANT, authService, apiService, helperService, reportConfig, $timeout, toastr, appConfig, $window, dynamicLookupConfig,$filter) {

        var ReportCtrl = this;

        function Init() {

            ReportCtrl.ePage = {
                "Title": "",
                "Prefix": "Report",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": reportConfig.Entities
            };
            // variable declaration
            ReportCtrl.ePage.Masters.taskName = "WarehouseReports";
            ReportCtrl.ePage.Masters.dataentryName = "WarehouseReports";
            ReportCtrl.ePage.Masters.defaultFilter = ReportCtrl.defaultFilter;
            ReportCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            ReportCtrl.ePage.Masters.selectedRow = -1;

            // function call from UI
            ReportCtrl.ePage.Masters.GetConfigDetails = GetConfigDetails;
            ReportCtrl.ePage.Masters.GenerateReports = GenerateReports;
            ReportCtrl.ePage.Masters.CloseFilter = CloseFilter;
            ReportCtrl.ePage.Masters.DownloadReport = DownloadReport;

            // function call
            GetDynamicLookupMasterList();
            checkCfxMenus();

        }
        
        // get config details
        function GetConfigDetails(item, index) {
            ;
            ReportCtrl.ePage.Masters.selectedRow = index;
            if (item.OtherConfig.dataEntryName) {
                if (item.OtherConfig.IsActiveConfig == true) {
                    $window.open(item.Link, "_blank");
                }
                else {
                    if (ReportCtrl.ePage.Masters.DynamicControl) {
                        $('#filterSideBar' + ReportCtrl.ePage.Masters.DynamicControl.DataEntryName).removeClass('open');
                    }
                    ReportCtrl.ePage.Masters.IsLoading = true;
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
                            ReportCtrl.ePage.Masters.DynamicControl = response.data.Response;
                            $timeout(function () {
                                $('#filterSideBar' + ReportCtrl.ePage.Masters.DynamicControl.DataEntryName).toggleClass('open');
                            });

                            if (ReportCtrl.ePage.Masters.defaultFilter !== undefined) {
                                ReportCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                                    value.Data = ReportCtrl.ePage.Masters.defaultFilter;
                                });
                            }
                            ReportCtrl.ePage.Masters.IsLoading = false;
                            ReportCtrl.ePage.Masters.ViewType = 2;
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
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader,Warehouse,WarehouseRow,WarehouseArea,OrgHeader,WarehouseOutward,WarehouseInward,WarehouseTransport,MstServiceLevel,CurrencyMaster,CarrierServiceLevel,MDM_CarrierList,WarehouseLocation";
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
                    ReportCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }
        // CfxMenus
        function checkCfxMenus() {
            
            ReportCtrl.ePage.Masters.ChildMenuList = [];
            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "Report",
                "USR_UserName":authService.getUserInfo().UserId,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAllMenuWise.FilterID
            };
            apiService.post("eAxisAPI", "CfxMenus/MasterCascadeFindAll", _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    ReportCtrl.ePage.Masters.OtherConfigList = [];

                    ReportCtrl.ePage.Masters.ParentMenuList = response.data.Response;

                    ReportCtrl.ePage.Masters.ChildMenuList = $filter('orderBy')(response.data.Response[0].MenuList,'DisplayOrder');

                    if (ReportCtrl.ePage.Masters.ChildMenuList.length > 0) {
                        angular.forEach(ReportCtrl.ePage.Masters.ChildMenuList, function (value, key) {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                            ReportCtrl.ePage.Masters.OtherConfigList.push(value.OtherConfig);
                        });
                    }
                }
            });
        }

        function GenerateReports() {
            ReportCtrl.ePage.Masters.DynamicControl.Entities[0].ConfigData.map(function (value, key) {
                if (!value.Include) {
                    delete (ReportCtrl.ePage.Masters.DynamicControl.Entities[0].Data[value.PropertyName])
                }
            });
            $timeout(function () {
                var tempArray = [];
                ReportCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                    var x = helperService.createToArrayOfObject(value.Data);
                    x.map(function (v, k) {
                        tempArray.push(v);
                    });
                    ReportCtrl.ePage.Masters.DynamicControl.Filter = tempArray;
                });
                getSearchReports();
                CloseFilter();
            }, 500);
        }

        function CloseFilter(){

            $('#filterSideBar' + ReportCtrl.ePage.Masters.DynamicControl.DataEntryName).removeClass('open');
        }

        function getSearchReports(){
            var obj = angular.copy(ReportCtrl.ePage.Masters.OtherConfigList[ReportCtrl.ePage.Masters.selectedRow].ReportTemplate);
            ReportCtrl.ePage.Masters.ChildMenuList[ReportCtrl.ePage.Masters.selectedRow].IsDownloading = true;
            ReportCtrl.ePage.Masters.ChildMenuList[ReportCtrl.ePage.Masters.selectedRow].DocumentName = undefined;

            if(ReportCtrl.ePage.Masters.DynamicControl.Filter){

                obj.DataObjs[1].SearchInput.SearchInput = ReportCtrl.ePage.Masters.DynamicControl.Filter;

                if(ReportCtrl.ePage.Masters.ChildMenuList[ReportCtrl.ePage.Masters.selectedRow].Description =='Stock On Hand'){
                        angular.forEach(ReportCtrl.ePage.Masters.DynamicControl.Filter,function(value1,key){
                        if(value1.FieldName == 'ClientCode')
                        obj.DataObjs[0].DataObject.Client_Code = value1.value;
                        if(value1.FieldName == 'WAR_WarehouseCode')
                        obj.DataObjs[0].DataObject.Warehouse_Code = value1.value;
                    });
                }
            }else{
                obj.DataObjs[1].SearchInput.SearchInput = [];
            }
            var mydate = new Date();
            var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');
            obj.DataObjs[0].DataObject.Date = filtereddate;

            obj.JobDocs.EntityRefKey = ReportCtrl.ePage.Masters.ChildMenuList[ReportCtrl.ePage.Masters.selectedRow].Id;
            obj.JobDocs.EntitySource = 'WMS';
            obj.JobDocs.EntityRefCode = ReportCtrl.ePage.Masters.ChildMenuList[ReportCtrl.ePage.Masters.selectedRow].Description;

            apiService.post("eAxisAPI", ReportCtrl.ePage.Entities.Header.API.GenerateReport.Url, obj).then(function SuccessCallback(response) {
                if(response.data.Response.Status=='Success'){
                    angular.forEach(ReportCtrl.ePage.Masters.ChildMenuList,function(value,key){
                        if(value.Id == obj.JobDocs.EntityRefKey){
                            value.IsDownloading = false;
                            value.DocPK = response.data.Response.PK;
                            value.DocumentName = response.data.Response.DocumentName;
                        }
                    });
                }
            });
        }

       function DownloadReport(item){
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
