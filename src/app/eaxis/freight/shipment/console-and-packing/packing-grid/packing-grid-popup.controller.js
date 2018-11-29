(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PackingEditController", PackingEditController);

    PackingEditController.$inject = ["$timeout", "$uibModalInstance", "$injector", "helperService", "toastr", "param", "appConfig", "apiService", "authService"];

    function PackingEditController($timeout, $uibModalInstance, $injector, helperService, toastr, param, appConfig, apiService, authService) {
        var PackingEditModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            var currentObject = param.currentObject[param.currentObject.label].ePage.Entities;
            PackingEditModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Package",
                "Masters": {
                    "Package": {},
                    "ShipmentDangerousGoods": {},
                    "ShipmentJobLocation": {},
                },
                "Meta": helperService.metaBase(),
                "Entities": currentObject
            };

            PackingEditModalCtrl.ePage.Masters.DropDownMasterList = param.master.Masters.DropDownMasterList;
            PackingEditModalCtrl.ePage.Masters.Package.close = close;

            if (param.action == 'edit') {
                PackingEditModalCtrl.ePage.Masters.Package.FormView = param.currentFormView;
                PackingEditModalCtrl.ePage.Masters.Package.FormViewCopy = angular.copy(param.currentFormView);
            }

            InitDangerousGoods();
            GetRelatedLookupList();
            InitLocation();
        }
        // =======================Dangerous Goods Begin=======================
        function InitDangerousGoods() {
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Add New';
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.EditDangerousGoods = EditDangerousGoods;
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.AddNew = AddNew;
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.DeleteDangerousGoods = DeleteDangerousGoods;;
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.AddToGridDangerousGoods = AddToGridDangerousGoods;
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.SelectedGridRow = SelectedGridRowDangerousGoods;

            GetDangerousGoodsDetails();
        }
        // DangerousGoods Details
        function GetDangerousGoodsDetails() {
            var _gridData = [];

            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.GridData = undefined;
            $timeout(function () {
                if (PackingEditModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.length > 0) {
                    PackingEditModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ShipmentDangerousGoods list is Empty");
                }
                PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.GridData = _gridData;
                PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "ShpPackingsOrigin_3101,ShpPackingsCommodity_3125,ShpDGSubstance_2989,ShpUNDGContact_2988",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        function SelectedGridRowDangerousGoods(item, type, index) {
            if (type == 'edit')
                EditDangerousGoods(item, index);
            else
                DeleteDangerousGoods(item, index);
        }

        function AddNew() {
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = true;
        }
        //Edit for DangerousGoods
        function EditDangerousGoods(item, index) {
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = true;
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Update';
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = item;
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.index = index;
        }
        //Delete For DangerousGoods
        function DeleteDangerousGoods(item, index) {
            if (index !== -1) {
                PackingEditModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.splice(index, 1);
            }

            GetDangerousGoodsDetails();
        }
        //Add To Grid DangerousGoods 
        function AddToGridDangerousGoods() {
            var _isEmpty = angular.equals(PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.index

                if (_index == undefined) {
                    PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.PK = "";
                    PackingEditModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.push(PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView);
                    PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
                    GetDangerousGoodsDetails();
                } else {
                    PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Add New';
                    PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
                    PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IsModified = true;
                    PackingEditModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods[_index] = PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView;
                    PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
                }
            }
        }

        function ShipmentDangerousGoodsSelectedData($item) {
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IMOClass = $item.entity.Class;
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.DGFlashPoint = $item.entity.FP;
        }

        function ShipmentDangerousGoodsAutoComplete($item) {
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IMOClass = $item.Class;
            PackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.DGFlashPoint = $item.FP;
        }
        // =======================Dangerous Goods End =======================

        // =======================Location Begin =============================
        function InitLocation() {
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false;
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Add New';
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.EditLocation = EditLocation;
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.AddNewLocation = AddNewLocation;
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.DeleteLocation = DeleteLocation;
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.AddToGridLocation = AddToGridLocation;
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.SelectedGridRow = SelectedGridRow;

            GetLocationDetails();
        }

        function GetLocationDetails() {
            var _gridData = [];
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.GridData = undefined;
            $timeout(function () {
                if (PackingEditModalCtrl.ePage.Masters.Package.FormView.JobLocation.length > 0) {
                    PackingEditModalCtrl.ePage.Masters.Package.FormView.JobLocation.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ShipmentJobLocation List is Empty");
                }

                PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.GridData = _gridData;
                PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            });
        }

        function SelectedGridRow(item, type, index) {
            if (type == 'edit')
                EditLocation(item, index);
            else
                DeleteLocation(item, index);
        }

        function AddNewLocation() {
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = true;
        }

        function EditLocation(item, index) {
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = true;
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Update';
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = item;
            PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.index = index;
        }

        function DeleteLocation(item, index) {
            if ($item.index !== -1) {
                PackingEditModalCtrl.ePage.Masters.Package.FormView.JobLocation.splice(index, 1);
            }

            GetLocationDetails();
        }

        function AddToGridLocation() {
            var _isEmpty = angular.equals(PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.index

                if (_index == undefined) {
                    PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.PK = "";
                    PackingEditModalCtrl.ePage.Masters.Package.FormView.JobLocation.push(PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView);
                    PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false;
                    GetLocationDetails();
                } else {
                    PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false;
                    PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Add New';
                    PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.IsModified = true;
                    PackingEditModalCtrl.ePage.Masters.Package.FormView.JobLocation[_index] = PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView;
                    PackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
                }
            }
        }
        // ==========================Location Details End ===================================

        function close(type) {
            if (type == 'save') {
                $uibModalInstance.close(PackingEditModalCtrl.ePage.Masters.Package.FormView);
            } else {
                $uibModalInstance.close(PackingEditModalCtrl.ePage.Masters.Package.FormViewCopy);
            }
        }

        Init();
    }
})();