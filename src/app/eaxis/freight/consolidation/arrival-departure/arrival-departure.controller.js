(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolArrivalDepartureController", ConsolArrivalDepartureController);

    ConsolArrivalDepartureController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "confirmation", "consolidationConfig"];

    function ConsolArrivalDepartureController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, confirmation, consolidationConfig) {
        /* jshint validthis: true */
        var ConsolArrivalDepartureCtrl = this;

        function Init() {
            var currentConsol = ConsolArrivalDepartureCtrl.currentConsol[ConsolArrivalDepartureCtrl.currentConsol.label].ePage.Entities;
            ConsolArrivalDepartureCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Arrival_Departure",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };
            ConsolArrivalDepartureCtrl.ePage.Masters.DatePicker = {};
            ConsolArrivalDepartureCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConsolArrivalDepartureCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConsolArrivalDepartureCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ConsolArrivalDepartureCtrl.ePage.Masters.DropDownMasterList = consolidationConfig.Entities.Header.Meta;
            ConsolArrivalDepartureCtrl.ePage.Masters.SelectedData = SelectedData;
            ConsolArrivalDepartureCtrl.ePage.Masters.DepatureCTO = {
                "IsMiscFreightServices": "true"
            }
            ConsolArrivalDepartureCtrl.ePage.Masters.DepatureCFS = {
                "IsMiscFreightServices": "true"
            }
            ConsolArrivalDepartureCtrl.ePage.Masters.DepatureContainerYard = {
                "IsMiscFreightServices": "true"
            }
            ConsolArrivalDepartureCtrl.ePage.Masters.ArrivalCTO  = {
                "IsMiscFreightServices": "true"
            }
            ConsolArrivalDepartureCtrl.ePage.Masters.ArrivalCFS = {
                "IsMiscFreightServices": "true"
            }
            ConsolArrivalDepartureCtrl.ePage.Masters.ArrivalContainerYard = {
                "IsMiscFreightServices": "true"
            }
            ConsolArrivalDepartureCtrl.ePage.Masters.DropDownMasterListAddress = {
                "OAD_DepartureCTOAddressFK": helperService.metaBase(),
                "OAD_PackDepotAddressFK": helperService.metaBase(),
                "OAD_ContainerYardEmptyPickupAddressPK": helperService.metaBase(),
                "OAD_ArrivalCTOAddressFK": helperService.metaBase(),
                "OAD_UnpackDepotAddressFK": helperService.metaBase(),
                "OAD_ContainerYardEmptyReturnAddressFK": helperService.metaBase(),
                "OAD_ArrivalUnpackCFSTransportAddressFK": helperService.metaBase(),
                "OAD_DeparturePackCFSTransportAddressFK": helperService.metaBase()
            }
            if (!ConsolArrivalDepartureCtrl.currentConsol.isNew) {
                dynamicOrgAddressFetch();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConsolArrivalDepartureCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }


        function dynamicOrgAddressFetch() {
            var dynamicFindAllOrgAddressInput = [{
                "OAD_DepartureCTOAddressFK": ConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_DepartureCTOFK
            }, {
                "OAD_PackDepotAddressFK": ConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_PackDepotFK
            }, {
                "OAD_ContainerYardEmptyPickupAddressPK": ConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ContainerYardEmptyPickupFK
            }, {
                "OAD_ArrivalCTOAddressFK": ConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ArrivalCTOFK
            }, {
                "OAD_UnpackDepotAddressFK": ConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_UnpackDepotFK
            }, {
                "OAD_ContainerYardEmptyReturnAddressFK": ConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ContainerYardEmptyReturnFK
            }, {
                "OAD_ArrivalUnpackCFSTransportAddressFK": ConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ArrivalUnpackCFSTransportFK
            }, {
                "OAD_DeparturePackCFSTransportAddressFK": ConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_DeparturePackCFSTransportFK
            }];
            var dynamicFindAllInputBuild = []
            dynamicFindAllOrgAddressInput.map(function (value, key) {

                if (value[Object.keys(value).join()] !== null) {
                    dynamicFindAllInputBuild.push({
                        "FieldName": Object.keys(value).join(),
                        "value": value[Object.keys(value).join()]
                    })
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInputBuild,
                "FilterID": appConfig.Entities.OrgAddress.API.DynamicFindAll.FilterID
            };
            if (dynamicFindAllInputBuild.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.DynamicFindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        dynamicFindAllInputBuild.map(function (value, key) {
                            ConsolArrivalDepartureCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].ListSource = response.data.Response[value.FieldName];
                        });
                    }
                });
            }
        }

        function SelectedData(item, ListSource) {

            if (ListSource) {
                getSetNearByField(item, "OrgAddress", ListSource);
            }

        }

        function getSetNearByField(item, api, listSource) {
            var _filter = {
                ORG_FK: item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsolArrivalDepartureCtrl.ePage.Masters.DropDownMasterListAddress[listSource].ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }



        Init();
    }
})();