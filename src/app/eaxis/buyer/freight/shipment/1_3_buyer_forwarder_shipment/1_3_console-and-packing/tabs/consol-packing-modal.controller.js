(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreeConsolPackingModalController", oneThreeConsolPackingModalController);

    oneThreeConsolPackingModalController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "three_shipmentConfig", "helperService", "toastr", "$uibModalInstance", "param", "confirmation"];

    function oneThreeConsolPackingModalController($scope, $rootScope, $timeout, APP_CONSTANT, authService, apiService, appConfig, three_shipmentConfig, helperService, toastr, $uibModalInstance, param, confirmation) {
        /* jshint validthis: true */
        var oneThreeConsolPackingModalCtrl = this;

        function Init() {
            var currentShipment = param.currentShipment[param.currentShipment.label].ePage.Entities;
            oneThreeConsolPackingModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Package",
                "Masters": {
                    "Package": {},
                    "ShipmentDangerousGoods": {},
                    "ShipmentJobLocation": {},
                },
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            oneThreeConsolPackingModalCtrl.ePage.Masters.DropDownMasterList = three_shipmentConfig.Entities.Header.Meta;
            oneThreeConsolPackingModalCtrl.ePage.Masters.Package.save = save;
            oneThreeConsolPackingModalCtrl.ePage.Masters.Package.close = close;

            if (param.action == 'edit') {
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView = param.currentFormView;
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormViewCopy = angular.copy(param.currentFormView);
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.IsModified = true;
            } else {
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView = {};
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.PK = "";
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.SHP_FK = oneThreeConsolPackingModalCtrl.ePage.Entities.Header.Data.PK;
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.FreightMode = "OUT";
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods = [];
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation = [];
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.PkgCntMapping = [];
            }

            InitDangerousGoods();
            InitLocation();
        }
        // =======================Dangerous Goods Begin=======================
        function InitDangerousGoods() {
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Add New';
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.EditDangerousGoods = EditDangerousGoods;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.AddNew = AddNew;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.DeleteDangerousGoods = DeleteDangerousGoods;;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.AddToGridDangerousGoods = AddToGridDangerousGoods;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.SelectedGridRow = SelectedGridRowDangerousGoods;

            GetDangerousGoodsDetails();
        }
        // DangerousGoods Details
        function GetDangerousGoodsDetails() {
            var _gridData = [];

            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.GridData = undefined;
            $timeout(function () {
                if (oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.length > 0) {
                    oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ShipmentDangerousGoods list is Empty");
                }
                oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.GridData = _gridData;
                oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
            });
        }

        function SelectedGridRowDangerousGoods(item, type, index) {
            if (type == 'edit')
                EditDangerousGoods(item, index);
            else
                DeleteDangerousGoods(item, index);
        }

        function AddNew() {
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = true;
        }
        //Edit for DangerousGoods
        function EditDangerousGoods(item, index) {
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = true;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Update';
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = item;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.index = index;
        }
        //Delete For DangerousGoods
        function DeleteDangerousGoods(item, index) {
            if (index !== -1) {
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.splice(index, 1);
            }

            GetDangerousGoodsDetails();
        }
        //Add To Grid DangerousGoods 
        function AddToGridDangerousGoods() {
            var _isEmpty = angular.equals(oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.index

                if (_index == undefined) {
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.PK = "";
                    oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.push(oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView);
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
                    GetDangerousGoodsDetails();
                } else {
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Add New';
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IsModified = true;
                    oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods[_index] = oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView;
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
                }
            }
        }

        function ShipmentDangerousGoodsSelectedData($item) {
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IMOClass = $item.entity.Class;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.DGFlashPoint = $item.entity.FP;
        }

        function ShipmentDangerousGoodsAutoComplete($item) {
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IMOClass = $item.Class;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.DGFlashPoint = $item.FP;
        }
        // =======================Dangerous Goods End =======================

        // =======================Location Begin =============================
        function InitLocation() {
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Add New';
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.EditLocation = EditLocation;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.AddNewLocation = AddNewLocation;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.DeleteLocation = DeleteLocation;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.AddToGridLocation = AddToGridLocation;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.SelectedGridRow = SelectedGridRow;

            GetLocationDetails();
        }

        function GetLocationDetails() {
            var _gridData = [];
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.GridData = undefined;
            $timeout(function () {
                if (oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation.length > 0) {
                    oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ShipmentJobLocation List is Empty");
                }

                oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.GridData = _gridData;
                oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            });
        }

        function SelectedGridRow(item, type, index) {
            if (type == 'edit')
                EditLocation(item, index);
            else
                DeleteLocation(item, index);
        }

        function AddNewLocation() {
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = true;
        }

        function EditLocation(item, index) {
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = true;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Update';
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = item;
            oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.index = index;
        }

        function DeleteLocation(item, index) {
            if ($item.index !== -1) {
                oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation.splice(index, 1);
            }

            GetLocationDetails();
        }

        function AddToGridLocation() {
            var _isEmpty = angular.equals(oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.index

                if (_index == undefined) {
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.PK = "";
                    oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation.push(oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView);
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false;
                    GetLocationDetails();
                } else {
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false;
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Add New';
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.IsModified = true;
                    oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation[_index] = oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView;
                    oneThreeConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
                }
            }
        }
        // ==========================Location Details End ===================================

        function save() {
            if (param.index == undefined) {
                var url = appConfig.Entities.JobPackLines.API.Insert.Url
            } else {
                url = appConfig.Entities.JobPackLines.API.Update.Url
            }
            apiService.post("eAxisAPI", url, [oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                if (response.data.Response) {
                    var _export = {
                        "data": response.data.Response[0],
                        "index": param.index
                    };
                    $uibModalInstance.close(_export);
                }
            });
        }

        function close() {
            if (param.action == 'edit') {
                var _export1 = {
                    "data": oneThreeConsolPackingModalCtrl.ePage.Masters.Package.FormViewCopy,
                    "index": param.index
                };
                $uibModalInstance.close(_export1);

            } else {
                $uibModalInstance.dismiss('close');
            }
        }

        Init();
    }
})();