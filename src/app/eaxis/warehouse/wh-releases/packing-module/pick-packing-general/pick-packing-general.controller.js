(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PackingGeneralController", PackingGeneralController);

    PackingGeneralController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "toastr", "$window", "$q", "$uibModal"];

    function PackingGeneralController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, $state, confirmation, toastr, $window, $q, $uibModal) {

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
            PackingGeneralCtrl.ePage.Masters.selectedReleaseLineRow = false;
            PackingGeneralCtrl.ePage.Masters.emptyText = '-';
            // For Table
            PackingGeneralCtrl.ePage.Masters.EnableForOutward = true;
            PackingGeneralCtrl.ePage.Masters.EnableForReleaseLine = true;
            PackingGeneralCtrl.ePage.Masters.selectedRowForOutward = -1;
            PackingGeneralCtrl.ePage.Masters.selectedRowForReleaseLine = -1;
            PackingGeneralCtrl.ePage.Masters.setSelectedRowForOutward = setSelectedRowForOutward;
            PackingGeneralCtrl.ePage.Masters.setSelectedRowForReleaseLine = setSelectedRowForReleaseLine;
            PackingGeneralCtrl.ePage.Masters.CreatePackage = CreatePackage;
            PackingGeneralCtrl.ePage.Masters.ReleaseQuantityModel = ReleaseQuantityModel;
            PackingGeneralCtrl.ePage.Masters.SaveReleaseQuantity = SaveReleaseQuantity;
            PackingGeneralCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
            PackingGeneralCtrl.ePage.Masters.GetPickReleaseLine = GetPickReleaseLine;


            // PackingGeneralCtrl.ePage.Masters.ReleaseLineList = {};
            // PackingGeneralCtrl.ePage.Masters.PackageItemList = [];

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
                    PackingGeneralCtrl.ePage.Masters.PickReleaseLine = response.data.Response;
                    PackingGeneralCtrl.ePage.Masters.Config.ItemDeleted = false;
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
                if (response.data.Response.length > 0) {
                    PackingGeneralCtrl.ePage.Masters.OutwardHeaderList = response.data.Response;
                    PackingGeneralCtrl.ePage.Masters.EnablePackageHeader = true;
                    PackingGeneralCtrl.ePage.Masters.NewPackageHeader = false;
                } else {
                    PackingGeneralCtrl.ePage.Masters.EnablePackageHeader = false;
                }
            });
        }

        // Quantity model and Release line adding to package

        function setSelectedRowForReleaseLine(item, index) {
            PackingGeneralCtrl.ePage.Masters.SelectedReleaseLineDetails = item;
            PackingGeneralCtrl.ePage.Masters.selectedReleaseLineRow = true;
            PackingGeneralCtrl.ePage.Masters.selectedRowForReleaseLine = index;
            PackingGeneralCtrl.ePage.Masters.ReleaseLineList = item;
        }

        function ReleaseQuantityModel(Data) {
            // PackingGeneralCtrl.ePage.Masters.PackageItemList = [];
            PackingGeneralCtrl.ePage.Masters.ReleaseLineList = Data;
            if (PackingGeneralCtrl.ePage.Masters.ReleaseLineList.RemainingQty > 0) {
                QuantityModel();
            }
            else {
                toastr.warning("No Quantity for this Release Line")
            }
        }

        function QuantityModel() {
            return PackingGeneralCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "small-popup",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/wh-releases/packing-module/pick-packing-general/pack-quantity.html"
            });
        }

        function CloseEditActivityModal() {
            PackingGeneralCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }

        function SaveReleaseQuantity($item) {

            PackingGeneralCtrl.ePage.Masters.Releasepackitem = $item;
            if (PackingGeneralCtrl.ePage.Masters.Config.SelectedPackage.IsClosed == true) {
                toastr.warning("Package is Closed");
            } else if (PackingGeneralCtrl.ePage.Masters.Config.SelectedPackage.IsClosed == false || PackingGeneralCtrl.ePage.Masters.Config.SelectedPackage.IsClosed == undefined || PackingGeneralCtrl.ePage.Masters.Config.SelectedPackage.IsClosed == null) {
                if (PackingGeneralCtrl.ePage.Masters.Config.SelectedPackage.PK) {
                    if (PackingGeneralCtrl.ePage.Masters.Releasepackitem.RemainingQty < PackingGeneralCtrl.ePage.Masters.Releasepackitem.Units) {
                        toastr.warning("Packing Quantity is Greater than Release Quantity");
                        // PackingGeneralCtrl.ePage.Masters.ReleaseLineList.Units = '';
                    }
                    else {
                        // $item.map(function (value, key) {
                        var obj = {
                            "PK": "",
                            "PackageFK": PackingGeneralCtrl.ePage.Masters.Config.SelectedPackage.PK,
                            "PickLine_FK": PackingGeneralCtrl.ePage.Masters.Releasepackitem.WPL_FK,
                            "PackedQty": PackingGeneralCtrl.ePage.Masters.Releasepackitem.Units,
                            "ProductPk": PackingGeneralCtrl.ePage.Masters.Releasepackitem.WPR_PRO_FK,
                            "ProductCode": PackingGeneralCtrl.ePage.Masters.Releasepackitem.ProductCode,
                            "ProductDesc": PackingGeneralCtrl.ePage.Masters.Releasepackitem.ProductDescription,
                            "UDF1": PackingGeneralCtrl.ePage.Masters.Releasepackitem.PartAttrib1,
                            "UDF2": PackingGeneralCtrl.ePage.Masters.Releasepackitem.PartAttrib2,
                            "UDF3": PackingGeneralCtrl.ePage.Masters.Releasepackitem.PartAttrib3,
                            "PackingDate": PackingGeneralCtrl.ePage.Masters.Releasepackitem.PackingDate,
                            "ExpiryDate": PackingGeneralCtrl.ePage.Masters.Releasepackitem.ExpiryDate,
                            "ReleaseLine_FK": PackingGeneralCtrl.ePage.Masters.Releasepackitem.WRL_FK,
                            "IsModified": false,
                            "IsDeleted": false,
                            "IsNewInsert": true
                        }

                        Save(obj);
                    }
                } else {
                    toastr.warning("Package is not Available");
                }
            }
            CloseEditActivityModal();
        }

        function Save($item) {

            PackingGeneralCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackageItems.push($item);

            var item = filterObjectUpdate(PackingGeneralCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackageItems, "IsModified");

            apiService.post("eAxisAPI", PackingGeneralCtrl.ePage.Entities.Header.API.UpdatePackage.Url, PackingGeneralCtrl.ePage.Masters.Config.PackageListDetails).then(function (response) {
                if (response.data.Response) {
                    // Get By Id Call
                    apiService.get("eAxisAPI", PackingGeneralCtrl.ePage.Entities.Header.API.PackageGetByID.Url + response.data.Response.Response.PK).then(function (response) {
                        PackingGeneralCtrl.ePage.Masters.UpdateditemList = response.data.Response.lstUIPackageItems;
                        PackingGeneralCtrl.ePage.Masters.Config.PackageListDetails = response.data.Response;
                        GetPickReleaseLine();
                    });
                    toastr.success("Saved Successfully");
                } else {
                    toastr.error("Save Failed");
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        Init();
    }
})();