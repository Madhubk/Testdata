(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreePackingGridController", oneThreePackingGridController);

        oneThreePackingGridController.$inject = ["$scope", "$filter", "$uibModal", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService"];

    function oneThreePackingGridController($scope, $filter, $uibModal, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var oneThreePackingGridCtrl = this;

        function Init() {
            var currentObject;
            (oneThreePackingGridCtrl.currentObject) ? currentObject = oneThreePackingGridCtrl.currentObject[oneThreePackingGridCtrl.currentObject.label].ePage.Entities : currentObject = oneThreePackingGridCtrl.obj[oneThreePackingGridCtrl.obj.label].ePage.Entities;
            // var currentObject = oneThreePackingGridCtrl.currentObject[oneThreePackingGridCtrl.currentObject.label].ePage.Entities;
            oneThreePackingGridCtrl.ePage = {
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

            oneThreePackingGridCtrl.ePage.Masters.FreightMode = oneThreePackingGridCtrl.freightMode;
            InitPackingGrid();
        }

        function InitPackingGrid() {
            oneThreePackingGridCtrl.ePage.Masters.Package = {};
            oneThreePackingGridCtrl.ePage.Masters.DropDownMasterList = {};
            oneThreePackingGridCtrl.ePage.Masters.Enable = true;
            oneThreePackingGridCtrl.ePage.Masters.selectedRow = -1;
            oneThreePackingGridCtrl.ePage.Masters.selectedRowObj = {}
            oneThreePackingGridCtrl.ePage.Masters.Package.FormView = {};
            oneThreePackingGridCtrl.ePage.Masters.emptyText = '-';
            oneThreePackingGridCtrl.ePage.Masters.TableProperties = {};

            oneThreePackingGridCtrl.ePage.Masters.DatePicker = {};
            oneThreePackingGridCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            oneThreePackingGridCtrl.ePage.Masters.DatePicker.isOpen = [];
            oneThreePackingGridCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            oneThreePackingGridCtrl.ePage.Masters.Pagination = {};
            oneThreePackingGridCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            oneThreePackingGridCtrl.ePage.Masters.Pagination.MaxSize = 3;
            oneThreePackingGridCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;
            // get table properties 
            if (oneThreePackingGridCtrl.tableProperties) {
                $timeout(function () {
                    oneThreePackingGridCtrl.ePage.Masters.TableProperties.UIPackingLines = angular.copy(oneThreePackingGridCtrl.tableProperties);
                });
            } else {
                GetGridColumList();
            }

            InitPacking();
            DropDownMasterList();
        }

        function InitPacking() {
            oneThreePackingGridCtrl.ePage.Masters.Package = {};
            oneThreePackingGridCtrl.ePage.Masters.Package.AddNewPacking = AddNewPacking;
            oneThreePackingGridCtrl.ePage.Masters.Package.PackageDeleteConfirmation = PackageDeleteConfirmation;
            oneThreePackingGridCtrl.ePage.Masters.Package.More = More;
            oneThreePackingGridCtrl.ePage.Masters.PackageCount = PackageCount;
            oneThreePackingGridCtrl.ePage.Masters.Weight = Weight;
            oneThreePackingGridCtrl.ePage.Masters.Volume = Volume;

            /*
             PackageCount();
             Weight();
             Volume(); */
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            oneThreePackingGridCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        oneThreePackingGridCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        oneThreePackingGridCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    oneThreePackingGridCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    oneThreePackingGridCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
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
                        oneThreePackingGridCtrl.ePage.Masters.TableProperties.UIPackingLines = obj;
                    }
                }
            });
        }

        function AddNewPacking() {
            var _LengthCount = 0;
            if (!oneThreePackingGridCtrl.gridData) {
                oneThreePackingGridCtrl.gridData = [];
            }
            oneThreePackingGridCtrl.ePage.Masters.Package.FormView = {};
            oneThreePackingGridCtrl.ePage.Masters.Package.FormView.PK = "";
            oneThreePackingGridCtrl.ePage.Masters.Package.FormView.IsDeleted = false;
            oneThreePackingGridCtrl.ePage.Masters.Count = $filter('filter')(oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines, {
                IsDeleted: false
            }, {
                    'FreightMode': oneThreePackingGridCtrl.freightMode
                }).length;
            oneThreePackingGridCtrl.ePage.Masters.Package.FormView.SHP_FK = oneThreePackingGridCtrl.ePage.Entities.Header.Data.PK;
            oneThreePackingGridCtrl.ePage.Masters.Package.FormView.FreightMode = oneThreePackingGridCtrl.freightMode;
            oneThreePackingGridCtrl.ePage.Masters.Package.FormView.JobDangerousGoods = [];
            oneThreePackingGridCtrl.ePage.Masters.Package.FormView.JobLocation = [];
            oneThreePackingGridCtrl.ePage.Masters.Package.FormView.PkgCntMapping = [];
            oneThreePackingGridCtrl.ePage.Masters.Package.FormView.PackageCount = 0;

            oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(oneThreePackingGridCtrl.ePage.Masters.Package.FormView);
            oneThreePackingGridCtrl.gridData.push(oneThreePackingGridCtrl.ePage.Masters.Package.FormView);
            if(oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0){
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function(Value, Key){
                    if(Value.FreightMode == "OUT"){
                        _LengthCount = _LengthCount + 1;
                    }
                    oneThreePackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].IsLength = _LengthCount;
                });
            }
            oneThreePackingGridCtrl.ePage.Masters.selectedRow = _.filter(oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines, {
                'FreightMode': oneThreePackingGridCtrl.freightMode
            }).length - 1;
            oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.length - 1;
            oneThreePackingGridCtrl.ePage.Masters.selectedRowObj = oneThreePackingGridCtrl.ePage.Masters.Package.FormView;
            // Add Scroll
            $timeout(function () {
                var divObj = document.getElementById("oneThreePackingGridCtrl.ePage.Masters.AddScroll");
                divObj.scrollTop = divObj.scrollHeight;
            }, 50);
        }

        function PackageCount() {
            var InnerPackageCount = 0, OuterPackCount = 0;
            if (oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    if (value.FreightMode == "STD") {
                        if (value.PackageCount) {
                            InnerPackageCount = InnerPackageCount + parseFloat(value.PackageCount);
                        }
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackageCount = InnerPackageCount;
                    }
                    else{
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackageCount = InnerPackageCount;
                    }
                    if (value.FreightMode == "OUT") {
                       if(value.PackageCount){
                        OuterPackCount = OuterPackCount + parseFloat(value.PackageCount);
                       }
                       oneThreePackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].PackageCount = OuterPackCount;
                    }
                    else{
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].PackageCount = OuterPackCount;
                    }
                });
            } else {
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackageCount = InnerPackageCount;
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].PackageCount = OuterPackCount;
            }
        }

        function Weight() {
            var InnerPackWeight = 0, OuterPackWeight = 0;
            if (oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    if (value.FreightMode == "STD") {
                        if (value.ActualWeight) {
                            InnerPackWeight = (parseFloat(InnerPackWeight) + parseFloat(value.ActualWeight)).toFixed(3);
                        }
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualWeight = InnerPackWeight;
                    }else{
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualWeight = InnerPackWeight;
                    }
                    if (value.FreightMode == "OUT") {
                        if (value.ActualWeight) {
                            OuterPackWeight = (parseFloat(OuterPackWeight) + parseFloat(value.ActualWeight)).toFixed(3);
                        }
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualWeight = OuterPackWeight;
                    }else{
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualWeight = OuterPackWeight;
                    }
                });
            }
            else {
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualWeight = InnerPackWeight;
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualWeight = OuterPackWeight;
            }
        }

        function Volume() {
            var InnerPackVolume = 0, OuterPackVolume = 0;
            if (oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    if (value.FreightMode == "STD") {
                        if (value.ActualVolume) {
                            InnerPackVolume = (parseFloat(InnerPackVolume) + parseFloat(value.ActualVolume)).toFixed(3);
                        }
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualVolume = InnerPackVolume;
                    }else{
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualVolume = InnerPackVolume;
                    }
                     if (value.FreightMode == "OUT") {
                        if (value.ActualVolume) {
                            OuterPackVolume = (parseFloat(OuterPackVolume) + parseFloat(value.ActualVolume)).toFixed(3);
                        }
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualVolume = OuterPackVolume;
                    }else{
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualVolume = OuterPackVolume;
                    }
                });
            } else {
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ActualVolume = InnerPackVolume;
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.OutPackageSum[0].ActualVolume = OuterPackVolume;
            }
        }

        function PackageDeleteConfirmation(index, item) {
            if (oneThreePackingGridCtrl.ePage.Masters.selectedRowObj) {
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
                oneThreePackingGridCtrl.ePage.Masters.RemoveList = $filter('filter')(oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines, {
                    PackageCount: oneThreePackingGridCtrl.ePage.Masters.selectedRowObj.PackageCount
                })
                oneThreePackingGridCtrl.ePage.Masters.RemoveList.map(function (value, key) {
                    value.IsDeleted = true;
                });
                oneThreePackingGridCtrl.ePage.Masters.CountList = $filter('filter')(oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines, {
                    IsDeleted: false
                });
                oneThreePackingGridCtrl.ePage.Masters.CountList.map(function (val, key) {
                    val.PackageCount = key + 1;
                });
                /* oneThreePackingGridCtrl.gridData.map(function (val, key) {
                    if (val.PK == item.PK && val.PackageCount == item.PackageCount) {
                        oneThreePackingGridCtrl.gridData.splice(key, 1);
                    }
                }); */
            } else {
                oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (val, key) {
                    if (val.PK == item.PK && val.PackageCount == item.PackageCount) {
                        oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(key, 1);
                    }
                });
                if(oneThreePackingGridCtrl.gridData){
                    oneThreePackingGridCtrl.gridData.map(function (val, key) {
                        if (val.PK == item.PK && val.PackageCount == item.PackageCount) {
                            oneThreePackingGridCtrl.gridData.splice(key, 1);
                        }
                    });
                }
            }
            oneThreePackingGridCtrl.ePage.Masters.selectedRow = -1;
            if (oneThreePackingGridCtrl.ePage.Masters.selectedRow == -1) {
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
                templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_packing-grid/1_3_packing-grid-edit.html",
                controller: 'oneThreePackingEditController',
                controllerAs: "oneThreePackingEditModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "currentObject": oneThreePackingGridCtrl.currentObject,
                            "currentFormView": item,
                            "master": oneThreePackingGridCtrl.ePage,
                            "index": index,
                            "action": 'edit'
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    oneThreePackingGridCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (val, key) {
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