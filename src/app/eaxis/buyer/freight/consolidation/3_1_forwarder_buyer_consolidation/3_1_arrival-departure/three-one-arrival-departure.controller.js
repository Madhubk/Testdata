(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeOneConsolArrivalDepartureController", ThreeOneConsolArrivalDepartureController);

    ThreeOneConsolArrivalDepartureController.$inject = ["APP_CONSTANT", "apiService", "appConfig", "helperService", "three_consolidationConfig"];

    function ThreeOneConsolArrivalDepartureController(APP_CONSTANT, apiService, appConfig, helperService, three_consolidationConfig) {
        /* jshint validthis: true */
        var ThreeOneConsolArrivalDepartureCtrl = this;

        function Init() {
            var currentConsol = ThreeOneConsolArrivalDepartureCtrl.currentConsol[ThreeOneConsolArrivalDepartureCtrl.currentConsol.label].ePage.Entities;
            ThreeOneConsolArrivalDepartureCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Arrival_Departure",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };
            ThreeOneConsolArrivalDepartureCtrl.ePage.Masters.DatePicker = {};
            ThreeOneConsolArrivalDepartureCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ThreeOneConsolArrivalDepartureCtrl.ePage.Masters.DatePicker.isOpen = [];
            ThreeOneConsolArrivalDepartureCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ThreeOneConsolArrivalDepartureCtrl.ePage.Masters.DropDownMasterList = three_consolidationConfig.Entities.Header.Meta;
            ThreeOneConsolArrivalDepartureCtrl.ePage.Masters.SelectedData = SelectedData;
            ThreeOneConsolArrivalDepartureCtrl.ePage.Masters.DropDownMasterListAddress = {
                "OAD_DepartureCTOAddressFK": helperService.metaBase(),
                "OAD_PackDepotAddressFK": helperService.metaBase(),
                "OAD_ContainerYardEmptyPickupAddressPK": helperService.metaBase(),
                "OAD_ArrivalCTOAddressFK": helperService.metaBase(),
                "OAD_UnpackDepotAddressFK": helperService.metaBase(),
                "OAD_ContainerYardEmptyReturnAddressFK": helperService.metaBase(),
                "OAD_ArrivalUnpackCFSTransportAddressFK": helperService.metaBase(),
                "OAD_DeparturePackCFSTransportAddressFK": helperService.metaBase()
            }
            if (!ThreeOneConsolArrivalDepartureCtrl.currentConsol.isNew) {
                dynamicOrgAddressFetch();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ThreeOneConsolArrivalDepartureCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }


        function dynamicOrgAddressFetch() {
            var dynamicFindAllOrgAddressInput = [{
                "OAD_DepartureCTOAddressFK": ThreeOneConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_DepartureCTOFK
            }, {
                "OAD_PackDepotAddressFK": ThreeOneConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_PackDepotFK
            }, {
                "OAD_ContainerYardEmptyPickupAddressPK": ThreeOneConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ContainerYardEmptyPickupFK
            }, {
                "OAD_ArrivalCTOAddressFK": ThreeOneConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ArrivalCTOFK
            }, {
                "OAD_UnpackDepotAddressFK": ThreeOneConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_UnpackDepotFK
            }, {
                "OAD_ContainerYardEmptyReturnAddressFK": ThreeOneConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ContainerYardEmptyReturnFK
            }, {
                "OAD_ArrivalUnpackCFSTransportAddressFK": ThreeOneConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ArrivalUnpackCFSTransportFK
            }, {
                "OAD_DeparturePackCFSTransportAddressFK": ThreeOneConsolArrivalDepartureCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_DeparturePackCFSTransportFK
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
                            ThreeOneConsolArrivalDepartureCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].ListSource = response.data.Response[value.FieldName];
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
                    ThreeOneConsolArrivalDepartureCtrl.ePage.Masters.DropDownMasterListAddress[listSource].ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }



        Init();
    }
})();