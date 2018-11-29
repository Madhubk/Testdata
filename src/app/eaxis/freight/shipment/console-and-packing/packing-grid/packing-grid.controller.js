(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PackingGridController", PackingGridController);

    PackingGridController.$inject = ["$scope", "$filter", "$uibModal", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService"];

    function PackingGridController($scope, $filter, $uibModal, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var PackingGridCtrl = this;

        function Init() {
            var currentObject;
            (PackingGridCtrl.currentObject) ? currentObject = PackingGridCtrl.currentObject[PackingGridCtrl.currentObject.label].ePage.Entities : currentObject = PackingGridCtrl.obj[PackingGridCtrl.obj.label].ePage.Entities;
            // var currentObject = PackingGridCtrl.currentObject[PackingGridCtrl.currentObject.label].ePage.Entities;
            PackingGridCtrl.ePage = {
                "Title": "",
                "Prefix": "Package",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObject,
                "GlobalVariables": {
                    "Loading": false,
                    "NonEditable": false
                }
            };

            PackingGridCtrl.ePage.Masters.FreightMode = PackingGridCtrl.freightMode;
            InitPackingGrid();
        }

        function InitPackingGrid() {
            PackingGridCtrl.ePage.Masters.Package = {};
            PackingGridCtrl.ePage.Masters.DropDownMasterList = {};
            PackingGridCtrl.ePage.Masters.Enable = true;
            PackingGridCtrl.ePage.Masters.selectedRow = -1;
            PackingGridCtrl.ePage.Masters.selectedRowObj = {}
            PackingGridCtrl.ePage.Masters.Package.FormView = {};
            PackingGridCtrl.ePage.Masters.emptyText = '-';
            PackingGridCtrl.ePage.Masters.TableProperties = {};

            PackingGridCtrl.ePage.Masters.DatePicker = {};
            PackingGridCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PackingGridCtrl.ePage.Masters.DatePicker.isOpen = [];
            PackingGridCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            PackingGridCtrl.ePage.Masters.Pagination = {};
            PackingGridCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            PackingGridCtrl.ePage.Masters.Pagination.MaxSize = 3;
            PackingGridCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;
            // get table properties 
            if (PackingGridCtrl.tableProperties) {
                $timeout(function () {
                    PackingGridCtrl.ePage.Masters.TableProperties.UIPackingLines = angular.copy(PackingGridCtrl.tableProperties);
                });
            } else {
                GetGridColumList();
            }

            InitPacking();
            DropDownMasterList();
        }

        function InitPacking() {
            PackingGridCtrl.ePage.Masters.Package = {};
            PackingGridCtrl.ePage.Masters.Package.AddNewPacking = AddNewPacking;
            PackingGridCtrl.ePage.Masters.Package.PackageDeleteConfirmation = PackageDeleteConfirmation;
            PackingGridCtrl.ePage.Masters.Package.More = More;
            PackingGridCtrl.ePage.Masters.PackageCount = PackageCount;
            PackingGridCtrl.ePage.Masters.Weight = Weight;
            PackingGridCtrl.ePage.Masters.Volume = Volume;

            /*
             PackageCount();
             Weight();
             Volume(); */
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            PackingGridCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function DropDownMasterList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["HEIGHTUNIT", "WEIGHTUNIT", "VOLUMEUNIT"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        PackingGridCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        PackingGridCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });

            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    PackingGridCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    PackingGridCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });
        }

        function GetGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": "PACKAGE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value);
                        PackingGridCtrl.ePage.Masters.TableProperties.UIPackingLines = obj;
                    }
                }
            });
        }

        function AddNewPacking() {
            var _LengthCount = 0;
            if (!PackingGridCtrl.gridData) {
                PackingGridCtrl.gridData = [];
            }
            PackingGridCtrl.ePage.Masters.Package.FormView = {};
            PackingGridCtrl.ePage.Masters.Package.FormView.PK = "";
            PackingGridCtrl.ePage.Masters.Package.FormView.IsDeleted = false;
            PackingGridCtrl.ePage.Masters.Count = $filter('filter')(PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines, {
                IsDeleted: false
            }, {
                    'FreightMode': PackingGridCtrl.freightMode
                }).length;
            PackingGridCtrl.ePage.Masters.Package.FormView.SHP_FK = PackingGridCtrl.ePage.Entities.Header.Data.PK;
            PackingGridCtrl.ePage.Masters.Package.FormView.FreightMode = PackingGridCtrl.freightMode;
            PackingGridCtrl.ePage.Masters.Package.FormView.JobDangerousGoods = [];
            PackingGridCtrl.ePage.Masters.Package.FormView.JobLocation = [];
            PackingGridCtrl.ePage.Masters.Package.FormView.PkgCntMapping = [];
            PackingGridCtrl.ePage.Masters.Package.FormView.PackageCount = 0;

            PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(PackingGridCtrl.ePage.Masters.Package.FormView);
            PackingGridCtrl.gridData.push(PackingGridCtrl.ePage.Masters.Package.FormView);
            if(PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0){
                PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function(Value, Key){
                    if(Value.FreightMode == "OUT"){
                        _LengthCount = _LengthCount + 1;
                    }
                    PackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].IsLength = _LengthCount;
                });
            }
            PackingGridCtrl.ePage.Masters.selectedRow = _.filter(PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines, {
                'FreightMode': PackingGridCtrl.freightMode
            }).length - 1;
            PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.length - 1;
            PackingGridCtrl.ePage.Masters.selectedRowObj = PackingGridCtrl.ePage.Masters.Package.FormView;
            // Add Scroll
            $timeout(function () {
                var divObj = document.getElementById("PackingGridCtrl.ePage.Masters.AddScroll");
                divObj.scrollTop = divObj.scrollHeight;
            }, 50);
        }

        function PackageCount() {
            var InnerPackageCount = 0, OuterPackCount = 0;
            if (PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    if (value.FreightMode == "STD") {
                        if (value.PackageCount) {
                            InnerPackageCount = InnerPackageCount + parseFloat(value.PackageCount);
                        }
                        PackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackageCount = InnerPackageCount;
                    }
                    else{
                        PackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackageCount = InnerPackageCount;
                    }
                    if (value.FreightMode == "OUT") {
                       if(value.PackageCount){
                        OuterPackCount = OuterPackCount + parseFloat(value.PackageCount);
                       }
                       PackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].PackageCount = OuterPackCount;
                    }
                    else{
                        PackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].PackageCount = OuterPackCount;
                    }
                });
            } else {
                PackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackageCount = InnerPackageCount;
                PackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].PackageCount = OuterPackCount;
            }
        }

        function Weight() {
            var InnerPackWeight = 0, OuterPackWeight = 0;
            if (PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    if (value.FreightMode == "STD") {
                        if (value.ActualWeight) {
                            InnerPackWeight = (parseFloat(InnerPackWeight) + parseFloat(value.ActualWeight)).toFixed(3);
                        }
                        PackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualWeight = InnerPackWeight;
                    }else{
                        PackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualWeight = InnerPackWeight;
                    }
                    if (value.FreightMode == "OUT") {
                        if (value.ActualWeight) {
                            OuterPackWeight = (parseFloat(OuterPackWeight) + parseFloat(value.ActualWeight)).toFixed(3);
                        }
                        PackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualWeight = OuterPackWeight;
                    }else{
                        PackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualWeight = OuterPackWeight;
                    }
                });
            }
            else {
                PackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualWeight = InnerPackWeight;
                PackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualWeight = OuterPackWeight;
            }
        }

        function Volume() {
            var InnerPackVolume = 0, OuterPackVolume = 0;
            if (PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    if (value.FreightMode == "STD") {
                        if (value.ActualVolume) {
                            InnerPackVolume = (parseFloat(InnerPackVolume) + parseFloat(value.ActualVolume)).toFixed(3);
                        }
                        PackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualVolume = InnerPackVolume;
                    }else{
                        PackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualVolume = InnerPackVolume;
                    }
                     if (value.FreightMode == "OUT") {
                        if (value.ActualVolume) {
                            OuterPackVolume = (parseFloat(OuterPackVolume) + parseFloat(value.ActualVolume)).toFixed(3);
                        }
                        PackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualVolume = OuterPackVolume;
                    }else{
                        PackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualVolume = OuterPackVolume;
                    }
                });
            } else {
                PackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualVolume = InnerPackVolume;
                PackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualVolume = OuterPackVolume;
            }
        }

        function PackageDeleteConfirmation(index, item) {
            if (PackingGridCtrl.ePage.Masters.selectedRowObj) {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Delete ?',
                    bodyText: 'Are you  sure?'
                }; 
 
                confirmation.showModal( {}, modalOptions)
                    .then(function (result) {
                        DeletePacking(index, item);
                    }, function () {
                        console.log("Cancelled");
                    });
            }
        }

        function DeletePacking(index, item) {
            if (item.PK) {
                PackingGridCtrl.ePage.Masters.RemoveList = $filter('filter')(PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines, {
                    PackageCount: PackingGridCtrl.ePage.Masters.selectedRowObj.PackageCount
                })
                PackingGridCtrl.ePage.Masters.RemoveList.map(function (value, key) {
                    value.IsDeleted = true;
                });
                PackingGridCtrl.ePage.Masters.CountList = $filter('filter')(PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines, {
                    IsDeleted: false
                });
                PackingGridCtrl.ePage.Masters.CountList.map(function (val, key) {
                    val.PackageCount = key + 1;
                });
                /* PackingGridCtrl.gridData.map(function (val, key) {
                    if (val.PK == item.PK && val.PackageCount == item.PackageCount) {
                        PackingGridCtrl.gridData.splice(key, 1);
                    }
                }); */
            } else {
                PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (val, key) {
                    if (val.PK == item.PK && val.PackageCount == item.PackageCount) {
                        PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(key, 1);
                    }
                });
                if(PackingGridCtrl.gridData){
                    PackingGridCtrl.gridData.map(function (val, key) {
                        if (val.PK == item.PK && val.PackageCount == item.PackageCount) {
                            PackingGridCtrl.gridData.splice(key, 1);
                        }
                    });
                }
            }
            PackingGridCtrl.ePage.Masters.selectedRow = -1;
            if (PackingGridCtrl.ePage.Masters.selectedRow == -1) {
                PackageCount();
                Weight();
                Volume();
            }
        }
        // More details For paackage
        function More(index, item) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "consolpacking right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eAxis/freight/shipment/console-and-packing/packing-grid/packing-grid-edit.html",
                controller: 'PackingEditController',
                controllerAs: "PackingEditModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "currentObject": PackingGridCtrl.currentObject,
                            "currentFormView": item,
                            "master": PackingGridCtrl.ePage,
                            "index": index,
                            "action": 'edit'
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    PackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (val, key) {
                        if (val.PK == response.PK && val.PackageCount == response.PackageCount) {
                            val = response;
                        }
                    });
                },
                function (response) { }
            );
        }

        Init();
    }
})();