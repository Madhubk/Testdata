(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_CargoReadinessGridController", three_three_CargoReadinessGridController);

    three_three_CargoReadinessGridController.$inject = ["helperService", "appConfig", "apiService", "toastr"];

    function three_three_CargoReadinessGridController(helperService, appConfig, apiService, toastr) {
        /* jshint validthis: true */
        var three_three_CargoReadinessGridCtrl = this;

        function Init() {
            // var currentObject = three_three_CargoReadinessGridCtrl.currentObject[three_three_CargoReadinessGridCtrl.currentObject.label].ePage.Entities;
            three_three_CargoReadinessGridCtrl.ePage = {
                "Title": "",
                "Prefix": "Routing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIOrder_Forwarder": []
                        }
                    }
                }
            };

            InitCargoReadiness();
        }

        function InitCargoReadiness() {
            three_three_CargoReadinessGridCtrl.input.map(function (value, key) {
                value.status = true;
            });
            three_three_CargoReadinessGridCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder = three_three_CargoReadinessGridCtrl.input;
            three_three_CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDateBtn = "Submit Cargo Ready Date";
            three_three_CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDate = SaveCargoReadyDate;
            three_three_CargoReadinessGridCtrl.ePage.Masters.IsDisableSaveCargoReadyDate = false;
            three_three_CargoReadinessGridCtrl.ePage.Masters.DataChanges = DataChanges;
        }

        function DataChanges(item) {
            console.log(item);
        }

        function SaveCargoReadyDate() {
            if (three_three_CargoReadinessGridCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.length > 0) {
                var _selectedOrder = [];
                three_three_CargoReadinessGridCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.map(function (value, key) {
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
            three_three_CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDateBtn = "Please wait...";
            three_three_CargoReadinessGridCtrl.ePage.Masters.IsDisableSaveCargoReadyDate = true;
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
                three_three_CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDateBtn = "Submit Cargo Ready Date";
                three_three_CargoReadinessGridCtrl.ePage.Masters.IsDisableSaveCargoReadyDate = false;
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