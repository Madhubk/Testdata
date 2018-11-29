(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CarrierVehicleController", CarrierVehicleController);

    CarrierVehicleController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "mappingConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function CarrierVehicleController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, mappingConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var CarrierVehicleCtrl = this;

        function Init() {
            CarrierVehicleCtrl.ePage = {
                "Title": "",
                "Prefix": "Carrier_Vehicle",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };

            CarrierVehicleCtrl.ePage.Masters.DropDownMasterList = {};
            CarrierVehicleCtrl.ePage.Masters.emptyText = '-'
            CarrierVehicleCtrl.ePage.Masters.selectedRow = -1;
            CarrierVehicleCtrl.ePage.Masters.Lineslist = true;
            CarrierVehicleCtrl.ePage.Masters.HeaderName = '';

            CarrierVehicleCtrl.ePage.Masters.Edit = Edit;
            CarrierVehicleCtrl.ePage.Masters.CopyRow = CopyRow;
            CarrierVehicleCtrl.ePage.Masters.AddNewRow = AddNewRow;
            CarrierVehicleCtrl.ePage.Masters.RemoveRow = RemoveRow;
            CarrierVehicleCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            CarrierVehicleCtrl.ePage.Masters.Back = Back;
            CarrierVehicleCtrl.ePage.Masters.Done = Done;
            CarrierVehicleCtrl.ePage.Masters.getCfxMappingDetails = getCfxMappingDetails;
            CarrierVehicleCtrl.ePage.Masters.OnChangeVehicleType = OnChangeVehicleType;

            CarrierVehicleCtrl.ePage.Masters.Config = mappingConfig;
            CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails = [];
            CarrierVehicleCtrl.ePage.Meta.IsLoading = false;

            getVehicleType();

        }
        function getVehicleType() {
            var _filter = {
                "SortColumn": "CNM_Code",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "MSTCONT"
            };
            apiService.post("eAxisAPI", "MstContainer/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    CarrierVehicleCtrl.ePage.Masters.VehicleType = response.data.Response;
                }
            });
        }

        function OnChangeVehicleType(item) {
            angular.forEach(CarrierVehicleCtrl.ePage.Masters.VehicleType, function (value, key) {
                if (value.Code == item) {
                    CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails[CarrierVehicleCtrl.ePage.Masters.selectedRow].AddRef1Code = value.Code;
                    CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails[CarrierVehicleCtrl.ePage.Masters.selectedRow].AddRef1_FK = value.PK;
                }
            });
        }

        function getCfxMappingDetails() {
            angular.forEach(CarrierVehicleCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                if (value.MappingCode == "CARRIER_VEHICLE") {
                    CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails.push(value);
                }
            });
        }

        function setSelectedRow(index, x) {
            //CarrierVehicleCtrl.ePage.Masters.selectedRow = index;
            CarrierVehicleCtrl.ePage.Masters.selectedRowPK = x.PK;
            angular.forEach(CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails,function(value,key){
                if(value.PK == x.PK){
                    CarrierVehicleCtrl.ePage.Masters.selectedRow = key;
                }                
            })
            CarrierVehicleCtrl.ePage.Masters.LineselectedRow = index;
        }

        function Back() {
            var item = CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails[CarrierVehicleCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails.splice(CarrierVehicleCtrl.ePage.Masters.selectedRow, 1);
                        CarrierVehicleCtrl.ePage.Masters.Lineslist = true;
                        CarrierVehicleCtrl.ePage.Masters.selectedRow = CarrierVehicleCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                CarrierVehicleCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails[CarrierVehicleCtrl.ePage.Masters.selectedRow]);
            CarrierVehicleCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            CarrierVehicleCtrl.ePage.Masters.selectedRow = index;
            console.log(CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails[CarrierVehicleCtrl.ePage.Masters.selectedRow])
            CarrierVehicleCtrl.ePage.Masters.Lineslist = false;
            CarrierVehicleCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (CarrierVehicleCtrl.ePage.Masters.selectedRow != -1) {
                if (CarrierVehicleCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (CarrierVehicleCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        CarrierVehicleCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (CarrierVehicleCtrl.ePage.Masters.selectedRow == CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails.length - 1) {
                            return;
                        }
                        CarrierVehicleCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails[CarrierVehicleCtrl.ePage.Masters.selectedRow]);
            var obj = {
                "PK": "",
                "MappingCode": item.MappingCode,
                "MappingForCode": item.MappingForCode,
                // "MappingToCode": item.MappingToCode,
                // "MappingTo_FK": item.MappingTo_FK,
                "MappingFor_FK": item.MappingFor_FK,
                "AddRef1_FK": item.AddRef1_FK,
                "AddRef1Code": item.AddRef1Code,
                "AddRef1Type": item.AddRef1Type,
                "IsDeleted": item.IsDeleted,
                "IsModified": item.IsModified
            };

            CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails.splice(CarrierVehicleCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            CarrierVehicleCtrl.ePage.Masters.Edit(CarrierVehicleCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails[CarrierVehicleCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get("eAxisAPI", 'CfxMapping/Delete/' + item.PK).then(function (response) {
                        toastr.success('Record Removed Successfully');
                        getCfxMappingDetail();
                    });
                    CarrierVehicleCtrl.ePage.Masters.selectedRow = CarrierVehicleCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "MappingCode": "CARRIER_VEHICLE",
                "MappingForCode": "",
                // "MappingToCode": "",
                // "MappingTo_FK": "",
                "MappingFor_FK": "",
                "AddRef1_FK": "",
                "AddRef1Code": "",
                "AddRef1Type": "",
                "IsDeleted": false,
                "IsModified": false
            };

            CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails.push(obj);
            CarrierVehicleCtrl.ePage.Masters.Edit(CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.MappingForCode && $item.AddRef1Code) {
                if ($item.PK) {
                    $item.IsModified = true;
                    CarrierVehicleCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", CarrierVehicleCtrl.ePage.Entities.Header.API.UpdateCfxMapping.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails[CarrierVehicleCtrl.ePage.Masters.selectedRow] = response.data.Response;
                        }
                    });
                } else {
                    CarrierVehicleCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", CarrierVehicleCtrl.ePage.Entities.Header.API.InsertCfxMapping.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails[CarrierVehicleCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
                        }
                    });
                }
                getCfxMappingDetail();
            } else {
                toastr.warning("Dont leave any fields Empty")
            }

        }
        function getCfxMappingDetail() {
            CarrierVehicleCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": CarrierVehicleCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", CarrierVehicleCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    CarrierVehicleCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues = response.data.Response;
                    CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails = [];
                    angular.forEach(CarrierVehicleCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                        if (value.MappingCode == "CARRIER_VEHICLE") {
                            CarrierVehicleCtrl.ePage.Entities.Header.Data.CarrierVehicleDetails.push(value);
                        }
                    });
                    CarrierVehicleCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        Init();
    }
})();
