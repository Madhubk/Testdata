(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreePackingEditController", oneThreePackingEditController);

    oneThreePackingEditController.$inject = ["$timeout", "$uibModalInstance", "$injector", "helperService", "toastr", "param", "appConfig", "apiService", "authService"];

    function oneThreePackingEditController($timeout, $uibModalInstance, $injector, helperService, toastr, param, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var oneThreePackingEditModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            var currentObject = param.currentObject[param.currentObject.label].ePage.Entities;
            oneThreePackingEditModalCtrl.ePage = {
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

            oneThreePackingEditModalCtrl.ePage.Masters.DropDownMasterList = param.master.Masters.DropDownMasterList;
            oneThreePackingEditModalCtrl.ePage.Masters.Package.close = close;

            if (param.action == 'edit') {
                oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView = param.currentFormView;
                oneThreePackingEditModalCtrl.ePage.Masters.Package.FormViewCopy = angular.copy(param.currentFormView);
            }

            InitDangerousGoods();
            GetRelatedLookupList();
            InitLocation();
        }
        // =======================Dangerous Goods Begin=======================
        function InitDangerousGoods() {
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Add New';
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.EditDangerousGoods = EditDangerousGoods;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.AddNew = AddNew;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.DeleteDangerousGoods = DeleteDangerousGoods;;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.AddToGridDangerousGoods = AddToGridDangerousGoods;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.SelectedGridRow = SelectedGridRowDangerousGoods;

            GetDangerousGoodsDetails();
        }
        // DangerousGoods Details
        function GetDangerousGoodsDetails() {
            var _gridData = [];

            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.GridData = undefined;
            $timeout(function () {
                if (oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.length > 0) {
                    oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ShipmentDangerousGoods list is Empty");
                }
                oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.GridData = _gridData;
                oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
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
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = true;
        }
        //Edit for DangerousGoods
        function EditDangerousGoods(item, index) {
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = true;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Update';
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = item;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.index = index;
        }
        //Delete For DangerousGoods
        function DeleteDangerousGoods(item, index) {
            if (index !== -1) {
                oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.splice(index, 1);
            }

            GetDangerousGoodsDetails();
        }
        //Add To Grid DangerousGoods 
        function AddToGridDangerousGoods() {
            var _isEmpty = angular.equals(oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.index

                if (_index == undefined) {
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.PK = "";
                    oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods.push(oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView);
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
                    GetDangerousGoodsDetails();
                } else {
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.buttonText = 'Add New';
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.IsFormView = false;
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IsModified = true;
                    oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView.JobDangerousGoods[_index] = oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView;
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView = {};
                }
            }
        }

        function ShipmentDangerousGoodsSelectedData($item) {
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IMOClass = $item.entity.Class;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.DGFlashPoint = $item.entity.FP;
        }

        function ShipmentDangerousGoodsAutoComplete($item) {
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.IMOClass = $item.Class;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentDangerousGoods.FormView.DGFlashPoint = $item.FP;
        }
        // =======================Dangerous Goods End =======================

        // =======================Location Begin =============================
        function InitLocation() {
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Add New';
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.EditLocation = EditLocation;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.AddNewLocation = AddNewLocation;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.DeleteLocation = DeleteLocation;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.AddToGridLocation = AddToGridLocation;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.SelectedGridRow = SelectedGridRow;

            GetLocationDetails();
        }

        function GetLocationDetails() {
            var _gridData = [];
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.GridData = undefined;
            $timeout(function () {
                if (oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView.JobLocation.length > 0) {
                    oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView.JobLocation.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ShipmentJobLocation List is Empty");
                }

                oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.GridData = _gridData;
                oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            });
        }

        function SelectedGridRow(item, type, index) {
            if (type == 'edit')
                EditLocation(item, index);
            else
                DeleteLocation(item, index);
        }

        function AddNewLocation() {
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = true;
        }

        function EditLocation(item, index) {
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = true;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Update';
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = item;
            oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.index = index;
        }

        function DeleteLocation(item, index) {
            if ($item.index !== -1) {
                oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView.JobLocation.splice(index, 1);
            }

            GetLocationDetails();
        }

        function AddToGridLocation() {
            var _isEmpty = angular.equals(oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.index

                if (_index == undefined) {
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.PK = "";
                    oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView.JobLocation.push(oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView);
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false;
                    GetLocationDetails();
                } else {
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.IsFormView = false;
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.buttonText = 'Add New';
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView.IsModified = true;
                    oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView.JobLocation[_index] = oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView;
                    oneThreePackingEditModalCtrl.ePage.Masters.ShipmentJobLocation.FormView = {};
                }
            }
        }
        // ==========================Location Details End ===================================

        function close(type) {
            if (type == 'save') {
                $uibModalInstance.close(oneThreePackingEditModalCtrl.ePage.Masters.Package.FormView);
            } else {
                $uibModalInstance.close(oneThreePackingEditModalCtrl.ePage.Masters.Package.FormViewCopy);
            }
        }

        Init();
    }
})();