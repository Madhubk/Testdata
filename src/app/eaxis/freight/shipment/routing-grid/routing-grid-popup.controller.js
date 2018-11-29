(function () {

    "use strict";

    angular
        .module("Application")
        .controller("RoutingGridPopUpController", RoutingGridPopUpController);
    RoutingGridPopUpController.$inject = ["$injector", "apiService", "helperService", "appConfig", "param", "$uibModalInstance", "authService"];

    function RoutingGridPopUpController($injector, apiService, helperService, appConfig, param, $uibModalInstance, authService) {
        var RoutingGridPopUpCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            RoutingGridPopUpCtrl.ePage = param.ParentObj;
            RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView = RoutingGridPopUpCtrl.ePage.Entities.Header.Data.UIJobRoutes[param.index];
            RoutingGridPopUpCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            RoutingGridPopUpCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            RoutingGridPopUpCtrl.ePage.Masters.Close = Close;
            RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView.Creditor = {
                AddressList: []
            };
            RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView.Carrier = {
                AddressList: []
            };
            RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView.DeptFrom = {
                AddressList: []
            };
            RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView.ArrivalAt = {
                AddressList: []
            };

            LoadAddressContactListAutomatic();
            GetRelatedLookupList();
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "RoutingVessel_3186,ShpRoutingLoadPort_3103,ShpRoutingDischargePort_3102,ShpCarrierOrg_2962,ShpDeptFromOrg_2964,ShpCreditorOrg_2961,ShpArrivalAtOrg_2963",
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

        function LoadAddressContactListAutomatic() {
            // Creditor
            if (RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView.CreditorOrg_FK) {
                GetAddressContactList(RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView, "OrgAddress", "AddressList", "CreditorOrg_FK", "Creditor", RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView);
            }
            // Carrier
            if (RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView.CarrierOrg_FK) {
                GetAddressContactList(RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView, "OrgAddress", "AddressList", "CarrierOrg_FK", "Carrier", RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView);
            }
            // Dept From
            if (RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView.DepartureLocationOrg_FK) {
                GetAddressContactList(RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView, "OrgAddress", "AddressList", "DepartureLocationOrg_FK", "DeptFrom", RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView);
            }
            // Arrival At
            if (RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView.ArrivalLocationOrg_FK) {
                GetAddressContactList(RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView, "OrgAddress", "AddressList", "ArrivalLocationOrg_FK", "ArrivalAt", RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView);
            }
        }

        function GetAddressContactList(GetSelectedRow, api, listSource, keyName, addressType, obj) {
            obj[addressType][listSource] = undefined;
            obj[addressType].IsModified = true;

            var _filter = {
                ORG_FK: GetSelectedRow[keyName]
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    obj[addressType][listSource] = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function AutoCompleteOnSelect($item, type, addressType) {
            GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type, RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView);
        }

        function SelectedLookupData($item, type, addressType) {
            GetAddressContactList($item.data, "OrgAddress", "AddressList", "PK", type, RoutingGridPopUpCtrl.ePage.Masters.Routing.FormView);
        }

        function Close() {
            $uibModalInstance.dismiss('cancel')
        }

        Init();
    }
})();