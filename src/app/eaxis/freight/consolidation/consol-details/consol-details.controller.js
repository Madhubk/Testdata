(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolDetailsController", ConsolDetailsController);

    ConsolDetailsController.$inject = ["$window", "apiService", "appConfig", "helperService"];

    function ConsolDetailsController($window, apiService, appConfig, helperService) {
        /* jshint validthis: true */
        var ConsolDetailsCtrl = this;

        function Init() {
            ConsolDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Details",
                "Masters": {
                    "DropDownMasterListAddress": {
                        "OAD_SendingForwarderAddressFK": helperService.metaBase(),
                        "OAD_ReceivingForwarderAddressFK": helperService.metaBase(),
                        "OAD_CarrierAddressFK": helperService.metaBase(),
                        "OAD_CreditorAddressFK": helperService.metaBase()
                    }
                },
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            ConsolInit();
        }

        function ConsolInit() {
            ConsolDetailsCtrl.ePage.Masters.ConsolObj = ConsolDetailsCtrl.currentObj;
            ConsolDetailsCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (ConsolDetailsCtrl.ePage.Masters.ConsolObj) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ConsolDetailsCtrl.ePage.Masters.ConsolObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ConsolDetailsCtrl.ePage.Entities.Header.Data = response.data.Response;
                        dynamicOrgAddressFetch();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function dynamicOrgAddressFetch() {
            var dynamicFindAllOrgAddressInput = [{
                "OAD_SendingForwarderAddressFK": ConsolDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_SendingForwarderFK
            }, {
                "OAD_ReceivingForwarderAddressFK": ConsolDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ReceivingForwarderFK
            }, {
                "OAD_CarrierAddressFK": ConsolDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_CarrierFK
            }, {
                "OAD_CreditorAddressFK": ConsolDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_CreditorFK
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
                            ConsolDetailsCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].ListSource = response.data.Response[value.FieldName];
                            response.data.Response[value.FieldName].map(function (val, key) {
                                if (value.value == response.data.Response[value.FieldName][key].ORG_FK) {
                                    ConsolDetailsCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].Address1 = val.Address1;
                                    ConsolDetailsCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].Address2 = val.Address2;
                                }
                            });
                        });
                    }
                });
            }
        }

        function SingleRecordView() {
            var _queryString = {
                PK: ConsolDetailsCtrl.ePage.Masters.ConsolObj.EntityRefKey,
                Code: ConsolDetailsCtrl.ePage.Masters.ConsolObj.KeyReference
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/consolidation/" + _queryString, "_blank");
        }

        Init();
    }
})();