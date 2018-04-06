(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentDocumentsController", ShipmentDocumentsController);

    ShipmentDocumentsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "shipmentConfig", "helperService", "toastr"];

    function ShipmentDocumentsController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, shipmentConfig, helperService, toastr) {
        /* jshint validthis: true */
        var ShipmentDocumentsCtrl = this;

        function Init() {
            var currentShipment = ShipmentDocumentsCtrl.currentShipment[ShipmentDocumentsCtrl.currentShipment.label].ePage.Entities;
            ShipmentDocumentsCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_Documents",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            ShipmentDocumentsCtrl.ePage.Masters.DropDownMasterList = shipmentConfig.Entities.Header.Meta;

            // Date Picker
            ShipmentDocumentsCtrl.ePage.Masters.DatePicker = {};
            ShipmentDocumentsCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ShipmentDocumentsCtrl.ePage.Masters.DatePicker.isOpen = [];
            ShipmentDocumentsCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            // =================Document Tab Start=================
            ShipmentDocumentsCtrl.ePage.Masters.SelectedFiles = SelectedFiles;

            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments = {};
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.IsSelected = false;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.IsFormView = false;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.FormView = {};
            // Shipment Documents Grid
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.gridConfig = ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.Grid.GridConfig;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.gridConfig._columnDef = ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.Grid.ColumnDef;
            // Functions For Shipment Documents
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.DocumentsRowSelectionChanged = DocumentsRowSelectionChanged;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.EditDocuments = EditDocuments;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.DeleteDocuments = DeleteDocuments;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.UpdateDocumetGridData = UpdateDocumetGridData;
            // =================Document Tab End=================

            // =================Document Tracking Tab Start=================
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking = {};
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.IsSelected = false;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.IsFormView = false;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.FormView = {};
            // Shipment Documents Tracking Grid
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.gridConfig = ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.Grid.GridConfig;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.gridConfig._columnDef = ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.Grid.ColumnDef;
            // Functions For Shipment Documents Tracking
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.DocumentsTrackingRowSelectionChanged = DocumentsTrackingRowSelectionChanged;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.AddNewDocumentsTracking = AddNewDocumentsTracking;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.EditDocumentsTracking = EditDocumentsTracking;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.DeleteDocumentsTracking = DeleteDocumentsTracking;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.AddToGridDocumentsTracking = AddToGridDocumentsTracking;

            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.GridData = [];
            // =================Document Tracking Tab End=================

            if (!ShipmentDocumentsCtrl.currentShipment.isNew) {
                GetDocumentsTrackingList();
            } else {
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.GridData = [];
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.GridData = [];
            }
        }

        // Date Picker for Documents
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ShipmentDocumentsCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        // =================Document Tab Start=================
        function SelectedFiles($item) {
            $item.map(function (value, key) {
                ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.ListSource.push(value);
            });

            GetDocumentsDetails();
        }

        function GetDocumentsDetails() {
            var _gridData = [];
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.GridData = undefined;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.IsFormView = false;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.IsSelected = false;
            $timeout(function () {
                if (ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.ListSource.length > 0) {
                    ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.ListSource.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ShipmentDocuments List is Empty");
                }

                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.GridData = _gridData;
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.FormView = {};
            });
        }

        //Edit For Documents
        function EditDocuments() {
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.IsFormView = true;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.FormView = ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.SelectedRow.entity;
        }

        //Delete For Documents
        function DeleteDocuments() {
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.IsFormView = false;
            ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.ListSource.map(function (value, key) {
                var _index = ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.ListSource.indexOf(ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.SelectedRow.entity);
                if (_index !== -1) {
                    ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.ListSource.splice(_index, 1);
                }
            });

            GetDocumentsDetails();
            toastr.success("Record Deleted Successfully...!");
        }

        // AddToGrid For Service
        function UpdateDocumetGridData() {
            var _index = ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.ListSource.indexOf(ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.FormView);
            if (_index === -1) {
                // ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.FormView.isNewRecord = true;
                // ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.ListSource.push(ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.FormView);

                // GetDocumentsDetails();
            } else {
                ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocuments.ListSource[_index] = ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.FormView;
                toastr.success("Record Updated Successfully...!");
            }
        }

        //RowSelection For Documents
        function DocumentsRowSelectionChanged($item) {
            if ($item.isSelected) {
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.SelectedRow = $item;
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.IsSelected = true;
            } else {
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.SelectedRow = undefined;
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocuments.IsSelected = false;
            }
        }
        // =================Document Tab End=================

        // =================Document Tracking Tab Start=================
        function GetDocumentsTrackingList() {
            var _filter = {
                "EntityRefKey": "57b121dd-8a34-4949-9b65-c9816660eb5d"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.ListSource = response.data.Response;

                    GetDocumentsTrackingDetails();
                }
            });
        }

        function GetDocumentsTrackingDetails() {
            var _gridData = [];
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.GridData = undefined;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.IsFormView = false;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.IsSelected = false;
            $timeout(function () {
                if (ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.length > 0) {
                    ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.ListSource.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ShipmentDocumentsTracking List is Empty");
                }

                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.GridData = _gridData;
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.FormView = {};
            });
        }

        //RowSelection For Documents
        function DocumentsTrackingRowSelectionChanged($item) {
            if ($item.isSelected) {
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.SelectedRow = $item;
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.IsSelected = true;
            } else {
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.SelectedRow = undefined;
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.IsSelected = false;
            }
        }

        //Add New For Documents 
        function AddNewDocumentsTracking() {
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.FormView = {};
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.IsFormView = true;
        }

        //Edit For Documents
        function EditDocumentsTracking() {
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.IsFormView = true;
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.FormView = ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.SelectedRow.entity;
        }

        //Delete For Documents
        function DeleteDocumentsTracking() {
            ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.IsFormView = false;
            ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.ListSource.map(function (value, key) {
                var _index = ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.ListSource.indexOf(ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.SelectedRow.entity);
                if (_index !== -1) {
                    ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.ListSource.splice(_index, 1);
                }
            });

            GetDocumentsTrackingDetails();
            toastr.success("Record Deleted Successfully...!");
        }

        // AddToGrid For Service
        function AddToGridDocumentsTracking() {
            var _index = ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.ListSource.indexOf(ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.FormView);

            if (_index === -1) {
                ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.FormView.isNewRecord = true;
                ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.ListSource.push(ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.FormView);

                GetDocumentsTrackingDetails();
                toastr.success("Record Added Successfully...!");
            } else {
                ShipmentDocumentsCtrl.ePage.Entities.ShipmentDocumentsTracking.ListSource[_index] = ShipmentDocumentsCtrl.ePage.Masters.ShipmentDocumentsTracking.FormView;
                toastr.success("Record Updated Successfully...!");
            }
        }
        // =================Document Tracking Tab End=================

        Init();
    }
})();
