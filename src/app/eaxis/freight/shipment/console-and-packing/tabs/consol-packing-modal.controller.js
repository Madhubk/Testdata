(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolPackingModalController", ConsolPackingModalController);

    ConsolPackingModalController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "shipmentConfig", "helperService", "toastr", "$uibModalInstance", "param", "confirmation"];

    function ConsolPackingModalController($scope, $rootScope, $timeout, APP_CONSTANT, authService, apiService, appConfig, shipmentConfig, helperService, toastr, $uibModalInstance, param, confirmation) {
        var ConsolPackingModalCtrl = this;

        function Init() {
            var currentShipment = param.currentShipment[param.currentShipment.label].ePage.Entities;
            ConsolPackingModalCtrl.ePage = {
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
            ConsolPackingModalCtrl.ePage.Masters.DropDownMasterList = shipmentConfig.Entities.Header.Meta;
            ConsolPackingModalCtrl.ePage.Masters.Package.save = save
            ConsolPackingModalCtrl.ePage.Masters.Package.close = close

            if (param.action == 'edit') {
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView = param.currentFormView
                ConsolPackingModalCtrl.ePage.Masters.Package.FormViewCopy = angular.copy(param.currentFormView)
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView.IsModified = true
            } else {
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView = {};
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView.PK = "";
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView.SHP_FK = ConsolPackingModalCtrl.ePage.Entities.Header.Data.PK
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView.FreightMode = "OUT"
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods = [];
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation = [];
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView.PkgCntMapping = [];
            }
            InitDangerousGoods();
            InitLocation();

        }

        // =======================Dangerous Goods Begin=======================

        function InitDangerousGoods() {
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Add New'

            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.gridConfig = ConsolPackingModalCtrl.ePage.Entities.ShipmentDangerousGoods.gridConfig;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.EditDangerousGoods = EditDangerousGoods;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.AddNew = AddNew
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.DeleteDangerousGoods = DeleteDangerousGoods;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.AddToGridDangerousGoods = AddToGridDangerousGoods;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.SelectedGridRow = SelectedGridRowDangerousGoods

            GetDangerousGoodsDetails();
        }

        // DangerousGoods Details
        function GetDangerousGoodsDetails() {
            var _gridData = [];

            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.GridData = undefined;
            $timeout(function () {
                if (ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.length > 0) {
                    ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ShipmentDangerousGoods list is Empty");
                }
                ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.GridData = _gridData;
                ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
            });
        }

        function SelectedGridRowDangerousGoods($item) {
            if ($item.action == 'edit')
                EditDangerousGoods($item)
            else
                DeleteDangerousGoods($item)
        }

        function AddNew() {
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {}
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = true;
        }
        //Edit for DangerousGoods
        function EditDangerousGoods($item) {
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = true;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Update'
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = $item.data;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.index = $item.index;
        }

        //Delete For DangerousGoods
        function DeleteDangerousGoods($item) {

            if ($item.index !== -1) {
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.splice($item.index, 1);
            }

            GetDangerousGoodsDetails();
        }

        //Add To Grid DangerousGoods 
        function AddToGridDangerousGoods() {
            var _isEmpty = angular.equals(ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.index

                if (_index == undefined) {
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.PK = "";
                    ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.push(ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView);
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
                    GetDangerousGoodsDetails();
                } else {
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Add New'
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IsModified = true
                    ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods[_index] = ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView;
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {}
                }
            }
        }

        function ShipmentDangerousGoodsSelectedData($item) {
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IMOClass = $item.entity.Class;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.DGFlashPoint = $item.entity.FP;
        }

        function ShipmentDangerousGoodsAutoComplete($item) {
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IMOClass = $item.Class;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.DGFlashPoint = $item.FP;
        }

        // =======================Dangerous Goods End =======================

        // =======================Location Begin =============================

        function InitLocation() {
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Add New'

            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.gridConfig = ConsolPackingModalCtrl.ePage.Entities.ShipmentJobLocation.gridConfig;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.EditLocation = EditLocation;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.AddNewLocation = AddNewLocation;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.DeleteLocation = DeleteLocation;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.AddToGridLocation = AddToGridLocation;
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.SelectedGridRow = SelectedGridRow

            GetLocationDetails();
        }

        function GetLocationDetails() {
            var _gridData = [];
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.GridData = undefined;
            $timeout(function () {
                if (ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation.length > 0) {
                    ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ShipmentJobLocation List is Empty");
                }

                ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.GridData = _gridData;
                ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            });
        }

        function SelectedGridRow($item) {
            if ($item.action == 'edit')
                EditLocation($item)
            else
                DeleteLocation($item)
        }

        function AddNewLocation() {
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = true
        }

        function EditLocation($item) {
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = true
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Update'
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = $item.data
            ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.index = $item.index
        }

        function DeleteLocation($item) {
            if ($item.index !== -1) {
                ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation.splice($item.index, 1);
            }

            GetLocationDetails();
        }

        function AddToGridLocation() {
            var _isEmpty = angular.equals(ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.index

                if (_index == undefined) {
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.PK = "";
                    ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation.push(ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView);
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false
                    GetLocationDetails();
                } else {
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Add New'
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.IsModified = true;
                    ConsolPackingModalCtrl.ePage.Masters.Package.FormView.JobLocation[_index] = ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView;
                    ConsolPackingModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {}
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
            apiService.post("eAxisAPI", url, [ConsolPackingModalCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                if (response.data.Response) {
                    var _export = {
                        "data": response.data.Response[0],
                        "index": param.index
                    };
                    $uibModalInstance.close(_export)
                }
            });
        }

        function close() {

            if (param.action == 'edit') {
                var _export1 = {
                    "data": ConsolPackingModalCtrl.ePage.Masters.Package.FormViewCopy,
                    "index": param.index
                };
                $uibModalInstance.close(_export1)

            } else {
                $uibModalInstance.dismiss('close')
            }

        }



        Init();
    }
})();