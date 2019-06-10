(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PackingGeneralController", PackingGeneralController);

    PackingGeneralController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "toastr", "$window"];

    function PackingGeneralController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, $state, confirmation, toastr, $window) {

        var PackingGeneralCtrl = this;

        function Init() {

            var currentPick = PackingGeneralCtrl.currentPick[PackingGeneralCtrl.currentPick.label].ePage.Entities;

            PackingGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Pick_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPick

            };

            PackingGeneralCtrl.ePage.Masters.Config = pickConfig;
            PackingGeneralCtrl.ePage.Masters.NewPackageHeader = false;
            PackingGeneralCtrl.ePage.Masters.selectedRow = false;
            PackingGeneralCtrl.ePage.Masters.emptyText = '-';
            // For Table
            PackingGeneralCtrl.ePage.Masters.EnableForOutward = true;
            PackingGeneralCtrl.ePage.Masters.selectedRowForOutward = -1;
            PackingGeneralCtrl.ePage.Masters.setSelectedRowForOutward = setSelectedRowForOutward;
            PackingGeneralCtrl.ePage.Masters.CreatePackage = CreatePackage;


            GetUserBasedGridColumListForOutward();
            GetMiscServDetails();
        }

        // For Enabling the Directive
        function CreatePackage() {
            PackingGeneralCtrl.ePage.Masters.EnablePackageHeader = true;
            // PackingGeneralCtrl.ePage.Masters.SelectedOutward = data;
            PackingGeneralCtrl.ePage.Masters.NewPackageHeader = true;
        }

        function GetUserBasedGridColumListForOutward() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PICKOUTWARD",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    PackingGeneralCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        PackingGeneralCtrl.ePage.Entities.Header.TableProperties.UIWmsOutward = obj;
                        PackingGeneralCtrl.ePage.Masters.UserHasValueForOutward = true;
                    }
                } else {
                    PackingGeneralCtrl.ePage.Masters.UserValueForOutward = undefined;
                }
            })
        }

        function setSelectedRowForOutward(item, index) {
            PackingGeneralCtrl.ePage.Masters.SelectedOutwardLineDetails = item;
            PackingGeneralCtrl.ePage.Masters.selectedRow = true;
            PackingGeneralCtrl.ePage.Masters.selectedRowForOutward = index;
            GetPickReleaseLine();
            GetPackageHeaderList();
        }

        function GetMiscServDetails() {
            PackingGeneralCtrl.ePage.Entities.Header.GlobalVariables.MiscServDetails = [];
            if (PackingGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.length > 0) {
                PackingGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                PackingGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.map(function (value, key) {
                    var _filter = {
                        "ORG_FK": value.ORG_Client_FK
                    };

                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                    };

                    apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            var obj = {
                                "ORG_FK": response.data.Response[0].ORG_FK,
                                "IMPartAttrib1Name": response.data.Response[0].IMPartAttrib1Name,
                                "IMPartAttrib2Name": response.data.Response[0].IMPartAttrib2Name,
                                "IMPartAttrib3Name": response.data.Response[0].IMPartAttrib3Name,
                                "IMPartAttrib1Type": response.data.Response[0].IMPartAttrib1Type,
                                "IMPartAttrib2Type": response.data.Response[0].IMPartAttrib2Type,
                                "IMPartAttrib3Type": response.data.Response[0].IMPartAttrib3Type,
                            }
                            PackingGeneralCtrl.ePage.Entities.Header.GlobalVariables.MiscServDetails.push(obj);
                        }
                        if (PackingGeneralCtrl.ePage.Entities.Header.GlobalVariables.MiscServDetails.length == PackingGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.length) {
                            PackingGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                        }
                    });
                })
            }
        }

        function GetPickReleaseLine() {
            PackingGeneralCtrl.ePage.Masters.Loading = true;
            PackingGeneralCtrl.ePage.Masters.LoadingValue = "Fetching Details.."
            var _filter = {
                "WorkOrderID": PackingGeneralCtrl.ePage.Masters.SelectedOutwardLineDetails.WorkOrderID
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": PackingGeneralCtrl.ePage.Entities.Header.API.PickReleaseLine.FilterID
            };
            apiService.post("eAxisAPI", PackingGeneralCtrl.ePage.Entities.Header.API.PickReleaseLine.Url, _input).then(function SuccessCallback(response) {
                PackingGeneralCtrl.ePage.Masters.Loading = false;
                if (response.data.Response) {
                    PackingGeneralCtrl.ePage.Masters.PickReleaseLine = response.data.Response.Response;
                }
            });
        }

        function GetPackageHeaderList() {
            var _filter = {
                "WorkorderFK": PackingGeneralCtrl.ePage.Masters.SelectedOutwardLineDetails.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": PackingGeneralCtrl.ePage.Entities.Header.API.PackageHeaderFindAll.FilterID
            };
            apiService.post("eAxisAPI", PackingGeneralCtrl.ePage.Entities.Header.API.PackageHeaderFindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response.length>0) {
                    PackingGeneralCtrl.ePage.Masters.OutwardHeaderList = response.data.Response;
                    PackingGeneralCtrl.ePage.Masters.EnablePackageHeader = true;
                    PackingGeneralCtrl.ePage.Masters.NewPackageHeader = false;
                }else{
                    PackingGeneralCtrl.ePage.Masters.EnablePackageHeader = false;
                }
            });
        }

        Init();
    }
})();