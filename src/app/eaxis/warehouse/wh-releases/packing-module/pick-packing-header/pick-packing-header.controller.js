(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PackingHeaderController", PackingHeaderController);

    PackingHeaderController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "toastr", "$window", "$filter"];

    function PackingHeaderController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, $state, confirmation, toastr, $window, $filter) {

        var PackingHeaderCtrl = this;

        function Init() {

            var currentPick = PackingHeaderCtrl.currentPick[PackingHeaderCtrl.currentPick.label].ePage.Entities;

            PackingHeaderCtrl.ePage = {
                "Title": "",
                "Prefix": "Packing_Header",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPick

            };

            PackingHeaderCtrl.ePage.Masters.Config = pickConfig;
            // Get the Current Outward Details
            PackingHeaderCtrl.ePage.Masters.OutwardDetails = PackingHeaderCtrl.currentOutward;
            PackingHeaderCtrl.ePage.Masters.NewHeader = PackingHeaderCtrl.currentHeader;

            PackingHeaderCtrl.ePage.Masters.PackageRefNo = "New";
            PackingHeaderCtrl.ePage.Masters.SaveButtontxt = "Save";
            PackingHeaderCtrl.ePage.Masters.SaveButton = SaveButton;
            PackingHeaderCtrl.ePage.Masters.Headersaved = false;

            // Date Picker
            PackingHeaderCtrl.ePage.Masters.ReleasedDate = ReleasedDate;
            PackingHeaderCtrl.ePage.Masters.DatePicker = {};
            PackingHeaderCtrl.ePage.Masters.DatePicker.Options = angular.copy(APP_CONSTANT.DatePicker);
            PackingHeaderCtrl.ePage.Masters.DatePicker.isOpen = [];
            PackingHeaderCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            if (PackingHeaderCtrl.ePage.Masters.NewHeader == true) {
                InitialPackageHeaderList()
            } else if (PackingHeaderCtrl.ePage.Masters.NewHeader == false) {
                PackingHeaderCtrl.ePage.Masters.Loading = true;
                GetPackageHeaderList()
            }

        }

        //#region  Date Picker
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            PackingHeaderCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function ReleasedDate() {
            PackingHeaderCtrl.ePage.Masters.Config.PackageListDetails.UIPackageHeader.ReleasedDate = $filter('date')(PackingHeaderCtrl.ePage.Masters.Config.PackageListDetails.UIPackageHeader.ReleasedDate, "dd-MMM-yyyy");
        }
        //#endregion

        //#region insert,update and save Header Object

        // null get by id call for newly creating package Header
        function InitialPackageHeaderList() {
            PackingHeaderCtrl.ePage.Masters.NewHeader = true;
            helperService.getFullObjectUsingGetById(PackingHeaderCtrl.ePage.Entities.Header.API.PackageGetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.UIPackageHeader.PK = response.data.Response.PK;
                    response.data.Response.UIPackageHeader.WorkorderFK = PackingHeaderCtrl.ePage.Masters.OutwardDetails.PK;
                    response.data.Response.UIPackageHeader.WorkorderId = PackingHeaderCtrl.ePage.Masters.OutwardDetails.WorkOrderID;
                    response.data.Response.UIPackageHeader.ClientCode = PackingHeaderCtrl.ePage.Masters.OutwardDetails.ClientCode; response.data.Response.UIPackageHeader.ClientName = PackingHeaderCtrl.ePage.Masters.OutwardDetails.ClientName;
                    response.data.Response.UIPackageHeader.WarehouseCode = PackingHeaderCtrl.ePage.Masters.OutwardDetails.WarehouseCode; response.data.Response.UIPackageHeader.WarehouseName = PackingHeaderCtrl.ePage.Masters.OutwardDetails.WarehouseName;
                    response.data.Response.UIPackageHeader.ExternalReference = PackingHeaderCtrl.ePage.Masters.OutwardDetails.ExternalReference;

                    PackingHeaderCtrl.ePage.Masters.HeaderListDetails = response.data.Response;

                    if (PackingHeaderCtrl.ePage.Masters.NewHeader == true) {
                        // if header is new then insert the object
                        InsertPackageHeaderList();
                    } else {
                        toastr.error("Failed to Create Package")
                    }
                }
            });
        }

        // initial insert for Package header creation
        function InsertPackageHeaderList() {
            apiService.post("eAxisAPI", PackingHeaderCtrl.ePage.Entities.Header.API.InsertPackage.Url, PackingHeaderCtrl.ePage.Masters.HeaderListDetails).then(function (response) {
                if (response.data.Status == 'Success') {
                    PackingHeaderCtrl.ePage.Masters.Config.PackageListDetails = response.data.Response.Response;
                    PackingHeaderCtrl.ePage.Masters.NewHeader = false;
                    // console.log(PackingHeaderCtrl.ePage.Masters.Config.PackageListDetails);
                    toastr.success("Package Created Successfully");
                    // toastr.warning("Please Save to Add Package");
                } else {
                    toastr.error("Failed to Create Package");
                }
            });
        }

        // updating the header and Get by id value
        function SaveButton() {
            PackingHeaderCtrl.ePage.Masters.Loading = true;
            PackingHeaderCtrl.ePage.Masters.SaveButtontxt = "Please Wait...";

            var item = filterObjectUpdate(PackingHeaderCtrl.ePage.Masters.Config.PackageListDetails, "IsModified");

            apiService.post("eAxisAPI", PackingHeaderCtrl.ePage.Entities.Header.API.UpdatePackage.Url, PackingHeaderCtrl.ePage.Masters.Config.PackageListDetails).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", PackingHeaderCtrl.ePage.Entities.Header.API.PackageGetByID.Url + response.data.Response.Response.PK).then(function (response) {
                        PackingHeaderCtrl.ePage.Masters.Config.PackageListDetails = response.data.Response;
                        PackingHeaderCtrl.ePage.Masters.Loading = false;
                        toastr.success("Saved Successfully");
                        PackingHeaderCtrl.ePage.Masters.SaveButtontxt = "Save";
                        PackingHeaderCtrl.ePage.Masters.Headersaved = true;
                    });
                } else {
                    toastr.error("Update Failed");

                }
            });
        }

        // get By id for existing Value
        function GetPackageHeaderList() {
            PackingHeaderCtrl.ePage.Masters.NewHeader = false;
            PackingHeaderCtrl.ePage.Masters.OutwardHeaderDetails = PackingHeaderCtrl.outwardHeader;
            apiService.get("eAxisAPI", PackingHeaderCtrl.ePage.Entities.Header.API.PackageGetByID.Url + PackingHeaderCtrl.ePage.Masters.OutwardHeaderDetails[0].PK).then(function (response) {
                PackingHeaderCtrl.ePage.Masters.Config.PackageListDetails = response.data.Response;
                PackingHeaderCtrl.ePage.Masters.Loading = false;
                PackingHeaderCtrl.ePage.Masters.Headersaved = true;
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
        //#endregion

        Init();
    }
})();