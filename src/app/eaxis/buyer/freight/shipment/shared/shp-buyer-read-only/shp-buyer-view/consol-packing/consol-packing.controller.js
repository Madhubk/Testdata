(function () {
    "use strict";

    angular
        .module("Application")
        .controller("shpBuyerViewConsolPackingController", shpBuyerViewConsolPackingController);

    shpBuyerViewConsolPackingController.$inject = ["helperService", "appConfig", "apiService"];

    function shpBuyerViewConsolPackingController(helperService, appConfig, apiService) {
        /* jshint validthis: true */
        var shpBuyerViewConsolPackingCtrl = this;

        function Init() {
            var obj = shpBuyerViewConsolPackingCtrl.obj[shpBuyerViewConsolPackingCtrl.obj.label].ePage.Entities;
            shpBuyerViewConsolPackingCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol-packing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };
            shpBuyerViewConsolPackingCtrl.ePage.Masters.EmptyText = '-';
            GetConsolListing();
        }

        function GetConsolListing() {
            var _filter = {
                "SHP_FK": shpBuyerViewConsolPackingCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    shpBuyerViewConsolPackingCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    GetContainerList(response.data.Response);
                }
            });
        }

        function GetContainerList(data) {
            shpBuyerViewConsolPackingCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            if (data.length > 0) {
                data.map(function (value1, key1) {
                    value1.UICntContainerList.map(function (value2, key2) {
                        var _isExist = shpBuyerViewConsolPackingCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
                            return value3.PK === value2.PK;
                        });

                        if (!_isExist) {
                            var _obj = {
                                "ContainerNo": value2.ContainerNo,
                                "CNT": value2.PK,
                                "ContainerCount": value2.ContainerCount,
                                "RC_Type": value2.RC_Type,
                                "SealNo": value2.SealNo,
                                "SealNo2": value2.SealNo2
                            };
                            shpBuyerViewConsolPackingCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                        }
                    });
                });
            } else {
                shpBuyerViewConsolPackingCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            }
        }


        Init();
    }
})();