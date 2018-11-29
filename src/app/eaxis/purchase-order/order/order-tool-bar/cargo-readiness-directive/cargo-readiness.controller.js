(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CargoReadinessGridController", CargoReadinessGridController);

    CargoReadinessGridController.$inject = ["helperService", "appConfig", "apiService", "toastr"];

    function CargoReadinessGridController(helperService, appConfig, apiService, toastr) {
        /* jshint validthis: true */
        var CargoReadinessGridCtrl = this;

        function Init() {
            // var currentObject = CargoReadinessGridCtrl.currentObject[CargoReadinessGridCtrl.currentObject.label].ePage.Entities;
            CargoReadinessGridCtrl.ePage = {
                "Title": "",
                "Prefix": "Routing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIPorOrderheader": []
                        }
                    }
                }
            };

            InitCargoReadiness();
        }

        function InitCargoReadiness() {
            CargoReadinessGridCtrl.input.map(function (value, key) {
                value.status = true;
            });
            CargoReadinessGridCtrl.ePage.Entities.Header.Data.UIPorOrderheader = CargoReadinessGridCtrl.input;
            CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDateBtn = "Submit Cargo Ready Date";
            CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDate = SaveCargoReadyDate;
            CargoReadinessGridCtrl.ePage.Masters.IsDisableSaveCargoReadyDate = false;
            CargoReadinessGridCtrl.ePage.Masters.DataChanges = DataChanges;
        }

        function DataChanges(item) {
            console.log(item);
        }

        function SaveCargoReadyDate() {
            if (CargoReadinessGridCtrl.ePage.Entities.Header.Data.UIPorOrderheader.length > 0) {
                var _selectedOrder = [];
                CargoReadinessGridCtrl.ePage.Entities.Header.Data.UIPorOrderheader.map(function (value, key) {
                    if (value.status) {
                        if (EmptyOrNullCheck(value.CargoReadyDate)) {
                            _selectedOrder = [];
                            toastr.warning("Selected Order(s) must have  manotary for 'Cargo Ready Date'");
                            console.log(_selectedOrder);
                            return false;
                        } else {
                            _selectedOrder.push(value);
                        }
                    }
                });
                SaveOnly(_selectedOrder);
            }
        }

        function SaveOnly(_items) {
            CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDateBtn = "Please wait...";
            CargoReadinessGridCtrl.ePage.Masters.IsDisableSaveCargoReadyDate = true;
            var _updateInput = [];
            for (i = 0; i < _items.length; i++) {
                var _tempObj = {
                    "EntityRefPK": _items[i].PK,
                    "Properties": [{
                        "PropertyName": "POH_CargoReadyDate",
                        "PropertyNewValue": _items[i].CargoReadyDate
                    }, {
                        "PropertyName": "POH_Comments",
                        "PropertyNewValue": _items[i].Comments
                    }, {
                        "PropertyName": "POH_OrderStatus",
                        "PropertyNewValue": "CRD"
                    }]
                };
                _updateInput.push(_tempObj);
            }

            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _updateInput).then(function (response) {
                if (response.data.Response) {
                    JobCommentInsert(response.data.Response);
                    CreateVesselGroup(_items);
                    toastr.success("Successfully saved...");
                } else {
                    toastr.error("Save Failed...");
                }
                CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDateBtn = "Submit Cargo Ready Date";
                CargoReadinessGridCtrl.ePage.Masters.IsDisableSaveCargoReadyDate = false;
            });
        }

        function JobCommentInsert(data) {
            var _jobCommentsArray = [];
            for (i = 0; i < data.length; i++) {
                var _jobCommentsInput = {
                    "PK": "",
                    "EntityRefKey": data[i].PK,
                    "EntitySource": "SFU",
                    "Comments": data[i].Comments
                }
                _jobCommentsArray.push(_jobCommentsInput);
            }

            // job comments api call
            if (_jobCommentsArray.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, _jobCommentsArray).then(function (response) {
                    if (response.data.Response) {} else {
                        toastr.error("Job Comments Save Failed...")
                    }
                })
            }
        }

        function CreateVesselGroup(item) {
            var _vesselPlanning = [];
            item.map(function (value, key) {
                var _vesselPlanningInput = {
                    "OrderNo": value.OrderNo,
                    "OrderSplitNo": value.OrderSplitNo,
                    "POH_FK": value.PK,
                    "Buyer": value.Buyer,
                    "Supplier": value.Supplier,
                    "FollowUpDetailPK": ""
                }
                _vesselPlanning.push(_vesselPlanningInput);
            })

            var _input = {
                "GroupPK": "",
                "UIVesselPlanningDetails": _vesselPlanning
            }
            apiService.post("eAxisAPI", appConfig.Entities.VesselPlanning.API.CreateVesselPlanningGroup.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {} else {
                    toastr.error("Vessel group failed...");
                }
            });
        }

        function EmptyOrNullCheck(val) {
            if (val == "" || val == null || val == undefined)
                return true;
            else
                return false;
        }

        Init();
    }
})();