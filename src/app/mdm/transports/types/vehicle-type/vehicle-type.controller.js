(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VehicleTypeController", VehicleTypeController);

    VehicleTypeController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "typeConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function VehicleTypeController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, typeConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var VehicleTypeCtrl = this;

        function Init() {
            VehicleTypeCtrl.ePage = {
                "Title": "",
                "Prefix": "VehicleType",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": typeConfig.Entities
            };

            VehicleTypeCtrl.ePage.Masters.DropDownMasterList = {};
            VehicleTypeCtrl.ePage.Masters.emptyText = '-'
            VehicleTypeCtrl.ePage.Masters.selectedRow = -1;
            VehicleTypeCtrl.ePage.Masters.Lineslist = true;
            VehicleTypeCtrl.ePage.Masters.HeaderName = '';

            VehicleTypeCtrl.ePage.Masters.Edit = Edit;
            VehicleTypeCtrl.ePage.Masters.CopyRow = CopyRow;
            VehicleTypeCtrl.ePage.Masters.AddNewRow = AddNewRow;
            VehicleTypeCtrl.ePage.Masters.RemoveRow = RemoveRow;
            VehicleTypeCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            VehicleTypeCtrl.ePage.Masters.Back = Back;
            VehicleTypeCtrl.ePage.Masters.Done = Done;
            VehicleTypeCtrl.ePage.Masters.Config = typeConfig;
            VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails = [];
            VehicleTypeCtrl.ePage.Meta.IsLoading = false;
            GetCfxTypeList();
        }

         function GetCfxTypeList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "MSTCONT"
            };
            apiService.post("eAxisAPI", "MstContainer/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails = response.data.Response;
                }
            });
        }
        function setSelectedRow(index,x) {
            angular.forEach(VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails,function(value,key){
                if(value.PK == x.PK){
                    VehicleTypeCtrl.ePage.Masters.selectedRow = key;
                }
            })
            VehicleTypeCtrl.ePage.Masters.LinesselectedRow = index;
        }

        function Back() {
            var item = VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails[VehicleTypeCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails.splice(VehicleTypeCtrl.ePage.Masters.selectedRow, 1);
                        VehicleTypeCtrl.ePage.Masters.Lineslist = true;
                        VehicleTypeCtrl.ePage.Masters.selectedRow = VehicleTypeCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                VehicleTypeCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails[VehicleTypeCtrl.ePage.Masters.selectedRow]);
            VehicleTypeCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            VehicleTypeCtrl.ePage.Masters.selectedRow = index;
            VehicleTypeCtrl.ePage.Masters.Lineslist = false;
            VehicleTypeCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (VehicleTypeCtrl.ePage.Masters.selectedRow != -1) {
                if (VehicleTypeCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (VehicleTypeCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        VehicleTypeCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (VehicleTypeCtrl.ePage.Masters.selectedRow == VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails.length - 1) {
                            return;
                        }
                        VehicleTypeCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails[VehicleTypeCtrl.ePage.Masters.selectedRow]);
            var obj = {
                "Code":item.Code,
                "Description":item.Description,
                "Height":0,
                "IsActive":true,
                "IsDeleted":false,
                "IsModified":false,
                "IsVehicle":true,
                "Length":0,
                "PK":item.PK,
                "ShippingMode":"ROA",
                "Source":"ERP",
                "StateId":0,
                "Width":0
            };

            VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails.splice(VehicleTypeCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            VehicleTypeCtrl.ePage.Masters.Edit(VehicleTypeCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails[VehicleTypeCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get("eAxisAPI", 'MstContainer/Delete/' + item.PK).then(function (response) {
                        toastr.success('Record Removed Successfully');
                        GetCfxTypeList()
                    });
                    VehicleTypeCtrl.ePage.Masters.selectedRow = VehicleTypeCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "Code":"",
                "Description":"",
                "Height":0,
                "IsActive":true,
                "IsDeleted":false,
                "IsModified":false,
                "IsVehicle":true,
                "Length":0,
                "PK":"",
                "ShippingMode":"ROA",
                "Source":"ERP",
                "StateId":0,
                "Width":0
            };

            VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails.push(obj);
            VehicleTypeCtrl.ePage.Masters.Edit(VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.Code && $item.Description) {
                if ($item.PK) {
                    $item.IsModified = true;
                    VehicleTypeCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", VehicleTypeCtrl.ePage.Entities.Header.API.UpdateMstContainer.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails[VehicleTypeCtrl.ePage.Masters.selectedRow] = response.data.Response;
                            toastr.success("Saved Successfully")
                        }
                    });
                } else {
                    VehicleTypeCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", VehicleTypeCtrl.ePage.Entities.Header.API.InsertMstContainer.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            VehicleTypeCtrl.ePage.Entities.Header.Data.VehicleTypeDetails[VehicleTypeCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
                            toastr.success("Saved Successfully")
                        }
                    });
                }
                
            } else {
                toastr.warning("Dont leave any fields Empty")
            }
        }

        Init();
    }
})();
