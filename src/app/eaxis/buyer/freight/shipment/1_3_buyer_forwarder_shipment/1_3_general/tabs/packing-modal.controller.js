(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreePackingModalController", oneThreePackingModalController);

    oneThreePackingModalController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModalInstance", "param", "confirmation"];

    function oneThreePackingModalController($scope, $rootScope, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModalInstance, param, confirmation) {
        /* jshint validthis: true */
        var oneThreePackingModalCtrl = this;

        function Init() {
            var currentShipment = param.currentShipment[param.currentShipment.label].ePage.Entities;
            oneThreePackingModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Package",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            oneThreePackingModalCtrl.ePage.Masters.DropDownMasterList = oneThreePackingModalCtrl.ePage.Entities.Header.Meta;
            oneThreePackingModalCtrl.currentShipment = param.currentShipment;
            // Package Details
            oneThreePackingModalCtrl.ePage.Masters.Package = {};
            // oneThreePackingModalCtrl.ePage.Masters.Package.gridConfig = oneThreePackingModalCtrl.ePage.Entities.Package.gridConfig;
            oneThreePackingModalCtrl.ePage.Masters.Package.IsSelected = false;
            oneThreePackingModalCtrl.ePage.Masters.Package.DeleteConfirmation = DeleteConfirmation;
            oneThreePackingModalCtrl.ePage.Masters.Package.AddToPackageGrid = AddToPackageGrid;
            oneThreePackingModalCtrl.ePage.Masters.Package.ok = ok;
            oneThreePackingModalCtrl.ePage.Masters.Package.SelectedGridRow = SelectedGridRow;

            oneThreePackingModalCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
            oneThreePackingModalCtrl.ePage.Masters.Consolidation = [{
                "PackageCount": 0,
                "ActualWeight": 0,
                "ActualVolume": 0
            }];

            GetMastersList();
            GetPackageDetails();
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["WEIGHTUNIT", "VOLUMEUNIT", "HEIGHTUNIT"];
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
                        oneThreePackingModalCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        oneThreePackingModalCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    oneThreePackingModalCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    oneThreePackingModalCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });

        }


        function GetPackageDetails() {
            var _gridData = [];
            oneThreePackingModalCtrl.ePage.Masters.Package.GridData = undefined;
            oneThreePackingModalCtrl.ePage.Masters.Package.FormView = {};
            oneThreePackingModalCtrl.ePage.Masters.Package.FormView.F3_NKPackType = oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackType;
            oneThreePackingModalCtrl.ePage.Masters.Package.FormView.UnitOfDimension = "M";
            oneThreePackingModalCtrl.ePage.Masters.Package.FormView.ActualWeightUQ = oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfWeight;
            oneThreePackingModalCtrl.ePage.Masters.Package.FormView.ActualVolumeUQ = oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfVolume;
            oneThreePackingModalCtrl.ePage.Masters.Package.IsSelected = false;
            $timeout(function () {
                if (oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "STD") {
                            value.Index = key
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("PackageList is Empty");
                }
                oneThreePackingModalCtrl.ePage.Masters.Package.GridData = _gridData;
                sum();
            });
        }

        function SelectedGridRow(item, type) {
            if (type == 'edit')
                EditPackage(item)
            else
                DeleteConfirmation(item)
        }

        function EditPackage(item) {
            oneThreePackingModalCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Update';
            oneThreePackingModalCtrl.ePage.Masters.Package.FormView = item;
        }


        function DeleteConfirmation(item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeletePackage(item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeletePackage(item) {
            // oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
            var _index = oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.indexOf(item);
            if (_index != -1) {
                item.IsDeleted = true;
                apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [item]).then(function (response) {
                    if (response.data.Response) {
                        oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(_index, 1);
                        toastr.success("Record Deleted Successfully...!");
                        GetPackageDetails();
                    }
                });
            }
            // });
            // GetPackageDetails();

        }

        function ok() {
            if (oneThreePackingModalCtrl.ePage.Masters.Package.GridData.length > 0) {
                oneThreePackingModalCtrl.ePage.Masters.Package.GridData.map(function (Value, Key) {
                    if (!Value.PackageCount) {
                        Value.PackageCount = 0;
                    }
                    if (!Value.ActualWeight) {
                        Value.ActualWeight = 0;
                    }
                    if (!Value.ActualVolume) {
                        Value.ActualVolume = 0;
                    }
                });
            }
            sum();

            if (oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0 && oneThreePackingModalCtrl.ePage.Masters.Package.GridData.length > 0) {
                if (oneThreePackingModalCtrl.ePage.Masters.Consolidation[0].PackageCount != oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackCount || oneThreePackingModalCtrl.ePage.Masters.Consolidation[0].ActualWeight != oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Weight || oneThreePackingModalCtrl.ePage.Masters.Consolidation[0].ActualVolume != oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Volume || oneThreePackingModalCtrl.ePage.Masters.Package.GridData[0].F3_NKPackType != oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackType || oneThreePackingModalCtrl.ePage.Masters.Package.GridData[0].ActualWeightUQ != oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfWeight || oneThreePackingModalCtrl.ePage.Masters.Package.GridData[0].ActualVolumeUQ != oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfVolume) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Ok',
                        headerText: 'Shipment Package Override?',
                        bodyText: 'Are you sure?'
                    };

                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackCount =
                                oneThreePackingModalCtrl.ePage.Masters.Consolidation[0].PackageCount;
                            oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Weight =
                                oneThreePackingModalCtrl.ePage.Masters.Consolidation[0].ActualWeight;
                            oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Volume =
                                oneThreePackingModalCtrl.ePage.Masters.Consolidation[0].ActualVolume;
                            oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackType = oneThreePackingModalCtrl.ePage.Masters.Package.GridData[0].F3_NKPackType;
                            oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfWeight = oneThreePackingModalCtrl.ePage.Masters.Package.GridData[0].ActualWeightUQ;
                            oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfVolume = oneThreePackingModalCtrl.ePage.Masters.Package.GridData[0].ActualVolumeUQ;
                            $uibModalInstance.dismiss('close');
                        }, function () {
                            $uibModalInstance.dismiss('close');
                        });
                } else {
                    $uibModalInstance.dismiss('close');
                }
            } else {
                $uibModalInstance.dismiss('close');
            }
        }

        function AddToPackageGrid(btn) {

            var _isEmpty = angular.equals(oneThreePackingModalCtrl.ePage.Masters.Package.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    return value.PK;
                }).indexOf(oneThreePackingModalCtrl.ePage.Masters.Package.FormView.PK);

                oneThreePackingModalCtrl.ePage.Masters.Package.FormView.FreightMode = "STD";
                oneThreePackingModalCtrl.ePage.Masters.Package.FormView.SHP_FK = oneThreePackingModalCtrl.ePage.Entities.Header.Data.PK

                if (_index === -1) {
                    oneThreePackingModalCtrl.ePage.Masters.Package.FormView.isNewRecord = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [oneThreePackingModalCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                        if (response.data.Response) {
                            oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(response.data.Response[0]);
                            GetPackageDetails();
                        }
                    });

                } else {
                    oneThreePackingModalCtrl.ePage.Masters.Package.FormView.IsModified = true;
                    oneThreePackingModalCtrl.ePage.Masters.Package.FormView.FreightMode = "STD";
                    oneThreePackingModalCtrl.ePage.Masters.Package.FormView.SHP_FK = oneThreePackingModalCtrl.ePage.Entities.Header.Data.PK
                    apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [oneThreePackingModalCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                        if (response.data.Response) {
                            oneThreePackingModalCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
                            oneThreePackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines[_index] = response.data.Response[0]
                            GetPackageDetails();
                        }
                    });
                }
            }
        }

        function sum() {
            var _PackageCount = 0,
                _ActualWeight = 0,
                _ActualVolume = 0;
            if (oneThreePackingModalCtrl.ePage.Masters.Package.GridData.length > 0) {
                oneThreePackingModalCtrl.ePage.Masters.Package.GridData.map(function (Value, Key) {
                    if (Value.FreightMode == 'STD') {
                        _PackageCount = _PackageCount + parseInt(Value.PackageCount);
                    }
                    if (Value.FreightMode == 'STD') {
                        _ActualWeight = (parseFloat(_ActualWeight) + parseFloat(Value.ActualWeight)).toFixed(3);
                    }
                    if (Value.FreightMode == 'STD') {
                        _ActualVolume = (parseFloat(_ActualVolume) + parseFloat(Value.ActualVolume)).toFixed(3);
                    }
                    oneThreePackingModalCtrl.ePage.Masters.Consolidation[0].PackageCount = _PackageCount;
                    oneThreePackingModalCtrl.ePage.Masters.Consolidation[0].ActualWeight = _ActualWeight;
                    oneThreePackingModalCtrl.ePage.Masters.Consolidation[0].ActualVolume = _ActualVolume;
                });
            } else {
                oneThreePackingModalCtrl.ePage.Masters.Consolidation = [{
                    "PackageCount": 0,
                    "ActualWeight": 0,
                    "ActualVolume": 0
                }];
            }
        }

        Init();
    }
})();