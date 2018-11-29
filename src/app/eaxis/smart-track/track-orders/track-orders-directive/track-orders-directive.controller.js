(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackOrderDirectiveController", TrackOrderDirectiveController);

    TrackOrderDirectiveController.$inject = ["$location", "helperService", "appConfig", "apiService"];

    function TrackOrderDirectiveController($location, helperService, appConfig, apiService) {
        var TrackOrderDirectiveCtrl = this;

        function Init() {
            var currentOrder = TrackOrderDirectiveCtrl.currentOrder[TrackOrderDirectiveCtrl.currentOrder.label].ePage.Entities;
            TrackOrderDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_Orders_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitTrackOrders();
        }

        function InitTrackOrders() {
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder = {};
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackContainerPackage = {};
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackContainerPackage.GridData = [];
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderContainer = {};
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderContainer.GridData = [];
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.Data = TrackOrderDirectiveCtrl.ePage.Entities.Header.Data;
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.SelectedShipmentRow = SelectedShipmentRow;
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderShipment = TrackOrderShipment;
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.AddressContactBinding = AddressContactBinding;
            if (TrackOrderDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK) {
                ShipmentList();
            }
        }

        function ShipmentList() {
            var _filter = {
                SHP_FK: TrackOrderDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        ContainerList(response.data.Response);
                    }
                }
            });
        }

        function ContainerList(data) {
            data.map(function (value, key) {
                if (value.PkgCntMapping.length > 0) {
                    value.PkgCntMapping.map(function (val, key) {
                        TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackContainerPackage.GridData.push(val);
                    });
                }
            });
            if (TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackContainerPackage.GridData.length > 0) {
                var _cntListInput = CommaSeperatedFieldValueFromList(TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackContainerPackage.GridData, 'CNT');
                var _filter = {
                    CNT_PKS: _cntListInput
                }
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID
                }
                apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderContainer.GridData = response.data.Response;
                        }
                    } else {
                        TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderContainer.GridData = [];
                    }
                });
            }
        }

        function CommaSeperatedFieldValueFromList(item, fieldName) {
            var field = "";
            item.map(function (val, key) {
                field += val[fieldName] + ','
            });
            return field.substring(0, field.length - 1);
        }

        function AddressContactBinding($item, type) {
            var str = "";
            if ($item != undefined && type == "Address") {
                str = $item.Address1 + " " + $item.Address2;;
                return str
            } else if ($item != undefined && type == "Contact") {
                str = $item.ContactName + " " + $item.Email + " " + $item.Phone;
                return str
            } else {
                return str
            }
        }

        function SelectedContainerRow(item) {
            _queryString = {
                entity: item.data
            };
            var _queryString = helperService.encryptData(_queryString);
            $location.path('EA/smart-track/track-containers').search({
                item: _queryString
            });
        }

        function SelectedShipmentRow(SHP_FK) {
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderShipment = {};
            apiService.get("eAxisAPI", TrackOrderDirectiveCtrl.ePage.Entities.TrackOrderShipment.API.GetByID.Url + SHP_FK).then(function (response) {
                if (response.data.Response) {
                    TrackOrderShipment(response.data.Response);
                }
            })
        }

        function TrackOrderShipment(item) {
            _queryString = {
                entity: item
            };
            var _queryString = helperService.encryptData(_queryString);
            $location.path('EA/smart-track/track-shipments').search({
                item: _queryString
            });
        }

        Init();
    }
})();