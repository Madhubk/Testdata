(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_CargoReadinessGridController", one_one_CargoReadinessGridController);

    one_one_CargoReadinessGridController.$inject = ["helperService", "appConfig", "apiService", "toastr"];

    function one_one_CargoReadinessGridController(helperService, appConfig, apiService, toastr) {
        /* jshint validthis: true */
        var one_one_CargoReadinessGridCtrl = this;

        function Init() {
            // var currentObject = one_one_CargoReadinessGridCtrl.currentObject[one_one_CargoReadinessGridCtrl.currentObject.label].ePage.Entities;
            one_one_CargoReadinessGridCtrl.ePage = {
                "Title": "",
                "Prefix": "Routing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIOrder_Buyer": []
                        }
                    }
                }
            };

            InitCargoReadiness();
        }

        function InitCargoReadiness() {
            one_one_CargoReadinessGridCtrl.input.map(function (value, key) {
                value.status = true;
            });
            one_one_CargoReadinessGridCtrl.ePage.Entities.Header.Data.UIOrder_Buyer = one_one_CargoReadinessGridCtrl.input;
            one_one_CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDateBtn = "Submit Cargo Ready Date";
            one_one_CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDate = SaveCargoReadyDate;
            one_one_CargoReadinessGridCtrl.ePage.Masters.IsDisableSaveCargoReadyDate = false;
            one_one_CargoReadinessGridCtrl.ePage.Masters.DataChanges = DataChanges;
        }

        function DataChanges(item) {
            console.log(item);
        }

        function SaveCargoReadyDate() {
            if (one_one_CargoReadinessGridCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.length > 0) {
                var _selectedOrder = [];
                one_one_CargoReadinessGridCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.map(function (value, key) {
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
            one_one_CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDateBtn = "Please wait...";
            one_one_CargoReadinessGridCtrl.ePage.Masters.IsDisableSaveCargoReadyDate = true;
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
                one_one_CargoReadinessGridCtrl.ePage.Masters.SaveCargoReadyDateBtn = "Submit Cargo Ready Date";
                one_one_CargoReadinessGridCtrl.ePage.Masters.IsDisableSaveCargoReadyDate = false;
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