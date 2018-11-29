(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PackingModalController", PackingModalController);

    PackingModalController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModalInstance", "param", "confirmation"];

    function PackingModalController($scope, $rootScope, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModalInstance, param, confirmation) {
        var PackingModalCtrl = this;

        function Init() {
            var currentShipment = param.currentShipment[param.currentShipment.label].ePage.Entities;
            PackingModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Package",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            PackingModalCtrl.ePage.Masters.DropDownMasterList = PackingModalCtrl.ePage.Entities.Header.Meta;
            PackingModalCtrl.currentShipment = param.currentShipment;
            // Package Details
            PackingModalCtrl.ePage.Masters.Package = {};
            // PackingModalCtrl.ePage.Masters.Package.gridConfig = PackingModalCtrl.ePage.Entities.Package.gridConfig;
            PackingModalCtrl.ePage.Masters.Package.IsSelected = false;
            PackingModalCtrl.ePage.Masters.Package.DeleteConfirmation = DeleteConfirmation;
            PackingModalCtrl.ePage.Masters.Package.AddToPackageGrid = AddToPackageGrid;
            PackingModalCtrl.ePage.Masters.Package.ok = ok;
            PackingModalCtrl.ePage.Masters.Package.SelectedGridRow = SelectedGridRow;

            PackingModalCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
            PackingModalCtrl.ePage.Masters.Consolidation = [{
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
                        PackingModalCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        PackingModalCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    PackingModalCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    PackingModalCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });

        }


        function GetPackageDetails() {
            var _gridData = [];
            PackingModalCtrl.ePage.Masters.Package.GridData = undefined;
            PackingModalCtrl.ePage.Masters.Package.FormView = {};
            PackingModalCtrl.ePage.Masters.Package.FormView.F3_NKPackType = PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackType;
            PackingModalCtrl.ePage.Masters.Package.FormView.UnitOfDimension = "M";
            PackingModalCtrl.ePage.Masters.Package.FormView.ActualWeightUQ = PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfWeight;
            PackingModalCtrl.ePage.Masters.Package.FormView.ActualVolumeUQ = PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfVolume;
            PackingModalCtrl.ePage.Masters.Package.IsSelected = false;
            $timeout(function () {
                if (PackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    PackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "STD") {
                            value.Index = key
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("PackageList is Empty");
                }
                PackingModalCtrl.ePage.Masters.Package.GridData = _gridData;
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
            PackingModalCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Update';
            PackingModalCtrl.ePage.Masters.Package.FormView = item;
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
            // PackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
            var _index = PackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.indexOf(item);
            if (_index != -1) {
                item.IsDeleted = true;
                apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [item]).then(function (response) {
                    if (response.data.Response) {
                        PackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(_index, 1);
                        toastr.success("Record Deleted Successfully...!");
                        GetPackageDetails();
                    }
                });
            }
            // });
            // GetPackageDetails();

        }

        function ok() {
            if (PackingModalCtrl.ePage.Masters.Package.GridData.length > 0) {
                PackingModalCtrl.ePage.Masters.Package.GridData.map(function (Value, Key) {
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

            if (PackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0 && PackingModalCtrl.ePage.Masters.Package.GridData.length > 0) {
                if (PackingModalCtrl.ePage.Masters.Consolidation[0].PackageCount != PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackCount || PackingModalCtrl.ePage.Masters.Consolidation[0].ActualWeight != PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Weight || PackingModalCtrl.ePage.Masters.Consolidation[0].ActualVolume != PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Volume || PackingModalCtrl.ePage.Masters.Package.GridData[0].F3_NKPackType != PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackType || PackingModalCtrl.ePage.Masters.Package.GridData[0].ActualWeightUQ != PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfWeight || PackingModalCtrl.ePage.Masters.Package.GridData[0].ActualVolumeUQ != PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfVolume) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Ok',
                        headerText: 'Shipment Package Override?',
                        bodyText: 'Are you sure?'
                    };

                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackCount =
                                PackingModalCtrl.ePage.Masters.Consolidation[0].PackageCount;
                            PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Weight =
                                PackingModalCtrl.ePage.Masters.Consolidation[0].ActualWeight;
                            PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Volume =
                                PackingModalCtrl.ePage.Masters.Consolidation[0].ActualVolume;
                            PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackType = PackingModalCtrl.ePage.Masters.Package.GridData[0].F3_NKPackType;
                            PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfWeight = PackingModalCtrl.ePage.Masters.Package.GridData[0].ActualWeightUQ;
                            PackingModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfVolume = PackingModalCtrl.ePage.Masters.Package.GridData[0].ActualVolumeUQ;
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

            var _isEmpty = angular.equals(PackingModalCtrl.ePage.Masters.Package.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = PackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    return value.PK;
                }).indexOf(PackingModalCtrl.ePage.Masters.Package.FormView.PK);

                PackingModalCtrl.ePage.Masters.Package.FormView.FreightMode = "STD";
                PackingModalCtrl.ePage.Masters.Package.FormView.SHP_FK = PackingModalCtrl.ePage.Entities.Header.Data.PK

                if (_index === -1) {
                    PackingModalCtrl.ePage.Masters.Package.FormView.isNewRecord = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [PackingModalCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                        if (response.data.Response) {
                            PackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(response.data.Response[0]);
                            GetPackageDetails();
                        }
                    });

                } else {
                    PackingModalCtrl.ePage.Masters.Package.FormView.IsModified = true;
                    PackingModalCtrl.ePage.Masters.Package.FormView.FreightMode = "STD";
                    PackingModalCtrl.ePage.Masters.Package.FormView.SHP_FK = PackingModalCtrl.ePage.Entities.Header.Data.PK
                    apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [PackingModalCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                        if (response.data.Response) {
                            PackingModalCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
                            PackingModalCtrl.ePage.Entities.Header.Data.UIJobPackLines[_index] = response.data.Response[0]
                            GetPackageDetails();
                        }
                    });
                }
            }
        }

        function sum() {
            var _PackageCount=0,_ActualWeight=0,_ActualVolume=0;
            if (PackingModalCtrl.ePage.Masters.Package.GridData.length > 0) {
                PackingModalCtrl.ePage.Masters.Package.GridData.map(function(Value,Key){
                    if(Value.FreightMode == 'STD'){
                        _PackageCount = _PackageCount + parseInt(Value.PackageCount);
                    }
                    if(Value.FreightMode == 'STD'){
                        _ActualWeight = (parseFloat(_ActualWeight) + parseFloat(Value.ActualWeight)).toFixed(3);
                    }
                    if(Value.FreightMode == 'STD'){
                        _ActualVolume = (parseFloat(_ActualVolume) + parseFloat(Value.ActualVolume)).toFixed(3);
                    }
                    PackingModalCtrl.ePage.Masters.Consolidation[0].PackageCount = _PackageCount;
                    PackingModalCtrl.ePage.Masters.Consolidation[0].ActualWeight = _ActualWeight;
                    PackingModalCtrl.ePage.Masters.Consolidation[0].ActualVolume = _ActualVolume;
                });
            } else {
                PackingModalCtrl.ePage.Masters.Consolidation = [{
                    "PackageCount": 0,
                    "ActualWeight": 0,
                    "ActualVolume": 0
                }];
            }
        }

        Init();
    }
})();