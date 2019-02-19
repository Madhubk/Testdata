(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdBuyerViewShipmentController", OrdBuyerViewShipmentController);

    OrdBuyerViewShipmentController.$inject = ["$window", "helperService", "appConfig", "apiService", "freightApiConfig"];

    function OrdBuyerViewShipmentController($window, helperService, appConfig, apiService, freightApiConfig) {
        var OrdBuyerViewShipmentCtrl = this;

        function Init() {
            var obj = OrdBuyerViewShipmentCtrl.obj[OrdBuyerViewShipmentCtrl.obj.label].ePage.Entities;
            OrdBuyerViewShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlyShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderShipment();
        }

        function InitOrderShipment() {
            OrdBuyerViewShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            OrdBuyerViewShipmentCtrl.ePage.Masters.EditSingleRecordView = EditSingleRecordView;
            OrdBuyerViewShipmentCtrl.ePage.Masters.ContainerView = ContainerView;
            OrdBuyerViewShipmentCtrl.ePage.Masters.ConshpMappingList = [];
            OrdBuyerViewShipmentCtrl.ePage.Masters.ContainerList = [];

            if (!OrdBuyerViewShipmentCtrl.obj.isNew) {
                if (OrdBuyerViewShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK && OrdBuyerViewShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    GetShpConMapping(OrdBuyerViewShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK);
                    ShipmentList(OrdBuyerViewShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK);
                }
            }
        }

        function GetShpConMapping(shp_pk) {
            var _filter = {
                'SHP_FK': shp_pk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerConShpMapping.API.FindAll.FilterID
            };
            if (shp_pk != null) {
                apiService.post("eAxisAPI", appConfig.Entities.BuyerConShpMapping.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        OrdBuyerViewShipmentCtrl.ePage.Masters.ConshpMappingList = response.data.Response;
                        OrdBuyerViewShipmentCtrl.ePage.Masters.ShipmentDetailsShow = true;
                        // GetContainerList(response.data.Response);
                    } else {
                        OrdBuyerViewShipmentCtrl.ePage.Masters.ConshpMappingList = [];
                        OrdBuyerViewShipmentCtrl.ePage.Masters.ContainerList = [];
                    }
                });
            }
        }

        function GetContainerList(data) {
            OrdBuyerViewShipmentCtrl.ePage.Masters.ContainerList = [];
            if (data.length > 0) {
                data.map(function (value1, key1) {
                    value1.map(function (value2, key2) {
                        var _isExist = OrdBuyerViewShipmentCtrl.ePage.Masters.ContainerList.some(function (value3, index) {
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
                            OrdBuyerViewShipmentCtrl.ePage.Masters.ContainerList.push(_obj);
                        }
                    });
                });
            } else {
                OrdBuyerViewShipmentCtrl.ePage.Masters.ContainerList = [];
            }
        }

        function ShipmentList(_shpFk) {
            var _filter = {
                SHP_FK: _shpFk
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
            var _cntPackageData = [];
            data.map(function (value, key) {
                if (value.PkgCntMapping.length > 0) {
                    value.PkgCntMapping.map(function (val, key) {
                        _cntPackageData.push(val);
                    });
                }
            });
            if (_cntPackageData.length > 0) {
                var _cntListInput = CommaSeperatedFieldValueFromList(_cntPackageData, 'CNT');
                var _filter = {
                    CNT_PKS: _cntListInput
                }
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": freightApiConfig.Entities.CntContainer_Buyer.API.findall.FilterID
                }
                apiService.post("eAxisAPI", freightApiConfig.Entities.CntContainer_Buyer.API.findall.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            OrdBuyerViewShipmentCtrl.ePage.Masters.ContainerList = response.data.Response;
                        }
                    } else {
                        OrdBuyerViewShipmentCtrl.ePage.Masters.ContainerList = [];
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

        function EditSingleRecordView(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipment_Buyer.PK,
                Code: curEntity.UIShipment_Buyer.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment-view?q=" + _queryString, "_blank");
        }

        function ContainerView(curEntity) {
            var _queryString = {
                PK: curEntity.CNT,
                ContainerNo: curEntity.ContainerNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/container-view?q=" + _queryString, "_blank");
        }

        Init();
    }
})();