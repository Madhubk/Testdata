(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_OrdLinesFormController", one_three_OrdLinesFormController);

    one_three_OrdLinesFormController.$inject = ["$scope", "$injector", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "confirmation"];

    function one_three_OrdLinesFormController($scope, $injector, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, confirmation) {
        var one_three_OrdLinesFormCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            one_three_OrdLinesFormCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderLines_Form",
                "Masters": {
                    "Data": {
                        "UIOrderLine_Buyer_Forwarder": {}
                    },
                    "Meta": {
                        "INCOTERM": {
                            "ListSource": []
                        },
                        "ORDSTATUS": {
                            "ListSource": []
                        },
                        "Country": {
                            "ListSource": []
                        },
                        "AddressContactObject": {
                            "ListSource": []
                        },
                        "VOLUMEUNIT": {
                            "ListSource": []
                        },
                        "WEIGHTUNIT": {
                            "ListSource": []
                        },
                        "HEIGHTUNIT": {
                            "ListSource": []
                        }
                    }
                },
                "Meta": helperService.metaBase(),
                "Entities": one_three_OrdLinesFormCtrl.currentOrder,
            };

            InitLineForm();
        }

        function InitLineForm() {
            one_three_OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = [];
            one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder = one_three_OrdLinesFormCtrl.lineOrder;
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery = {};
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = {};
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = false;
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.AddToGridLineDelivery = AddToGridLineDelivery;
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.SelectedGridRow = SelectedGridRow;
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.SaveButtonText = "Save";
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDeliveryTab = LineDeliveryTab;
            one_three_OrdLinesFormCtrl.ePage.Masters.AddNewDelivery = AddNewDelivery;
            one_three_OrdLinesFormCtrl.ePage.Masters.AutoPopulate = AutoPopulate;
            one_three_OrdLinesFormCtrl.ePage.Masters.OnChangesVolume = OnChangesVolume;
            one_three_OrdLinesFormCtrl.ePage.Masters.activeTab = 0;

            if (one_three_OrdLinesFormCtrl.action !== 'edit') {
                one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.UnitOfWeight = 'KG';
                one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.UnitOfVolume = 'M3';
                one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.OuterPacksUQ = 'PKG';
                one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData = [];
            } else {
                GetLineDeliveryDetails();
            }
            $scope.$watch('one_three_OrdLinesFormCtrl.lineOrder', function (newValue, oldValue) {
                one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder = newValue;
            }, true);
            // error config
            one_three_OrdLinesFormCtrl.ePage.Masters.ErrorWarningConfig = one_three_OrdLinesFormCtrl.error;

            InitDatePicker();
            GetRelatedLookupList();
            GetMstPackType();
            GetCfxTypeList();
            GetCountryList();
            GetDynamicControl();
        }

        function InitDatePicker() {
            // DatePicker
            one_three_OrdLinesFormCtrl.ePage.Masters.DatePicker = {};
            one_three_OrdLinesFormCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_three_OrdLinesFormCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_three_OrdLinesFormCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            one_three_OrdLinesFormCtrl.ePage.Masters.DatePicker.OnChangeDatePicker = OnChangeDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_three_OrdLinesFormCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "DestinationPort_3094,DestinationPort_3094",
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


        function OnChangeDatePicker(type, code) {
            switch (type) {
                case "ReqExWorksDate":
                    CommonErrorObjInput(code);
                    break;
                case "LineDropDate":
                    CommonErrorObjInput(code);
                    break;
                default:
                    break;
            }
        }

        function OnChangesVolume(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount) {
            if (UnitOfVolume && UnitOfDimension && Length && Width && Height && _packCount != 0) {
                switch (UnitOfVolume) {
                    case 'CC':
                        OnChangesDimension(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount);
                        break;
                    case 'CF':
                        OnChangesDimension(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount);
                        break;
                    case 'CI':
                        OnChangesDimension(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount);
                        break;
                    case 'CY':
                        OnChangesDimension(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount);
                        break;
                    case 'D3':
                        OnChangesDimension(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount);
                        break;
                    case 'L':
                        OnChangesDimension(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount);
                        break;
                    case 'M3':
                        OnChangesDimension(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount);
                        break;
                    case 'ML':
                        OnChangesDimension(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount);
                        break;
                    case 'TE':
                        OnChangesDimension(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount);
                        break;
                    default:
                        break;
                }
            }
        }

        function OnChangesDimension(UnitOfVolume, UnitOfDimension, Length, Width, Height, _packCount) {
            var _type = "normal";
            var _unitOfVolumeValue = 1;
            if (UnitOfVolume && UnitOfDimension && Length && Width && Height) {
                switch (UnitOfDimension) {
                    case 'CM':
                        if (UnitOfVolume == 'CF') {
                            _type = 'diff';
                            _unitOfVolumeValue = 0.0328084;
                        }
                        if (UnitOfVolume == 'CI') {
                            _type = 'diff';
                            _unitOfVolumeValue = 0.393701;
                        }
                        if (UnitOfVolume == 'CY') {
                            _type = 'diff';
                            _unitOfVolumeValue = 0.0109361;
                        }
                        if (UnitOfVolume == 'M3') {
                            _type = 'diff';
                            _unitOfVolumeValue = 0.01;
                        }
                        if (UnitOfVolume == 'D3') {
                            _type = 'diff';
                            _unitOfVolumeValue = 0.1;
                        }
                        (UnitOfVolume == 'ML') ? _unitOfVolumeValue = 0.000000001: false;
                        (UnitOfVolume == 'L') ? _unitOfVolumeValue = 0.001: false;
                        (UnitOfVolume == 'TE') ? _unitOfVolumeValue = 1 / 12500: false;

                        one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
                        break;
                    case 'FT':
                        (UnitOfVolume == 'CC') ? _unitOfVolumeValue = 28316.8: false;
                        (UnitOfVolume == 'CI') ? _unitOfVolumeValue = 1728: false;
                        (UnitOfVolume == 'CY') ? _unitOfVolumeValue = 0.037037: false;
                        (UnitOfVolume == 'M3') ? _unitOfVolumeValue = 0.0283168: false;
                        (UnitOfVolume == 'ML') ? _unitOfVolumeValue = 0.0000283168: false;
                        (UnitOfVolume == 'D3') ? _unitOfVolumeValue = 28.3168: false;
                        (UnitOfVolume == 'L') ? _unitOfVolumeValue = 28.3168: false;
                        (UnitOfVolume == 'TE') ? _unitOfVolumeValue = 0.2220044: false;

                        one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
                        break;
                    case 'IN':
                        (UnitOfVolume == 'CF') ? _unitOfVolumeValue = 0.000578704: false;
                        (UnitOfVolume == 'CC') ? _unitOfVolumeValue = 16.3871: false;
                        (UnitOfVolume == 'CY') ? _unitOfVolumeValue = 0.0000214335: false;
                        (UnitOfVolume == 'M3') ? _unitOfVolumeValue = 0.0000163871: false;
                        (UnitOfVolume == 'ML') ? _unitOfVolumeValue = 0.0000000163871: false;
                        (UnitOfVolume == 'D3') ? _unitOfVolumeValue = 0.0163871: false;
                        (UnitOfVolume == 'L') ? _unitOfVolumeValue = 0.0163871: false;
                        (UnitOfVolume == 'TE') ? _unitOfVolumeValue = 0.000128: false;

                        one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
                        break;
                    case 'KM':
                        (UnitOfVolume == 'CC') ? _unitOfVolumeValue = 1000000000000000: false;
                        (UnitOfVolume == 'CF') ? _unitOfVolumeValue = 35310000000: false;
                        (UnitOfVolume == 'CI') ? _unitOfVolumeValue = 61020000000000: false;
                        (UnitOfVolume == 'CY') ? _unitOfVolumeValue = 1308000000: false;
                        (UnitOfVolume == 'M3') ? _unitOfVolumeValue = 1000000000: false;
                        (UnitOfVolume == 'ML') ? _unitOfVolumeValue = 1000000: false;
                        (UnitOfVolume == 'D3') ? _unitOfVolumeValue = 1000000000000: false;
                        (UnitOfVolume == 'L') ? _unitOfVolumeValue = 1000000000000: false;
                        (UnitOfVolume == 'TE') ? _unitOfVolumeValue = 7840001254.400200: false;

                        one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
                        break;
                    case 'M':
                        (UnitOfVolume == 'CC') ? _unitOfVolumeValue = 1000000: false;
                        (UnitOfVolume == 'CF') ? _unitOfVolumeValue = 35.3147: false;
                        (UnitOfVolume == 'CI') ? _unitOfVolumeValue = 61023.7: false;
                        (UnitOfVolume == 'CY') ? _unitOfVolumeValue = 1.30795: false;
                        (UnitOfVolume == 'ML') ? _unitOfVolumeValue = 0.001: false;
                        (UnitOfVolume == 'D3') ? _unitOfVolumeValue = 1000: false;
                        (UnitOfVolume == 'L') ? _unitOfVolumeValue = 1000: false;
                        (UnitOfVolume == 'TE') ? _unitOfVolumeValue = 7.840001: false;

                        one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
                        break;
                    case 'MI':
                        (UnitOfVolume == 'CC') ? _unitOfVolumeValue = 4168000000000000: false;
                        (UnitOfVolume == 'CF') ? _unitOfVolumeValue = 147200000000: false;
                        (UnitOfVolume == 'CI') ? _unitOfVolumeValue = 254400000000000: false;
                        (UnitOfVolume == 'CY') ? _unitOfVolumeValue = 5452000000: false;
                        (UnitOfVolume == 'D3') ? _unitOfVolumeValue = 4168000000000: false;
                        (UnitOfVolume == 'M3') ? _unitOfVolumeValue = 4168000000: false;
                        (UnitOfVolume == 'L') ? _unitOfVolumeValue = 4168000000000: false;
                        (UnitOfVolume == 'ML') ? _unitOfVolumeValue = 4168000: false;
                        (UnitOfVolume == 'TE') ? _unitOfVolumeValue = 32678550740.022300: false;

                        one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
                        break;
                    case 'MM':
                        (UnitOfVolume == 'CC') ? _unitOfVolumeValue = 0.001: false;
                        (UnitOfVolume == 'CF') ? _unitOfVolumeValue = 3.53147e-8: false;
                        (UnitOfVolume == 'CI') ? _unitOfVolumeValue = 6.10237e-5: false;
                        (UnitOfVolume == 'CY') ? _unitOfVolumeValue = 1.30795e-9: false;
                        (UnitOfVolume == 'D3') ? _unitOfVolumeValue = 1e-6: false;
                        (UnitOfVolume == 'M3') ? _unitOfVolumeValue = 1e-9: false;
                        (UnitOfVolume == 'L') ? _unitOfVolumeValue = 1e-6: false;
                        (UnitOfVolume == 'ML') ? _unitOfVolumeValue = 1e-12: false;
                        (UnitOfVolume == 'TE') ? _unitOfVolumeValue = 7.840e-9: false;

                        one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
                        break;
                    case 'YD':
                        (UnitOfVolume == 'CC') ? _unitOfVolumeValue = 764555: false;
                        (UnitOfVolume == 'CF') ? _unitOfVolumeValue = 27: false;
                        (UnitOfVolume == 'CI') ? _unitOfVolumeValue = 46656: false;
                        (UnitOfVolume == 'D3') ? _unitOfVolumeValue = 764.555: false;
                        (UnitOfVolume == 'M3') ? _unitOfVolumeValue = 0.764555: false;
                        (UnitOfVolume == 'L') ? _unitOfVolumeValue = 764.555: false;
                        (UnitOfVolume == 'ML') ? _unitOfVolumeValue = 0.000764555: false;
                        (UnitOfVolume == 'TE') ? _unitOfVolumeValue = 5.99411: false;

                        one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
                        break;
                    default:
                        break;
                }
            }
        }

        function OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type) {
            var _value;
            if (_type == 'diff') {
                _value = Math.abs(((Length * _unitOfVolumeValue) * (Width * _unitOfVolumeValue) * (Height * _unitOfVolumeValue)) * _packCount);
            } else {
                _value = Math.abs(((Length * Width * Height) * _unitOfVolumeValue) * _packCount);
            }
            return _value;
        }

        function LineDeliveryTab() {
            if (one_three_OrdLinesFormCtrl.action !== 'edit' && (one_three_OrdLinesFormCtrl.lineOrder.PK == undefined || one_three_OrdLinesFormCtrl.lineOrder.PK == "")) {
                var modalOptions = {
                    closeButtonText: 'No',
                    actionButtonText: 'Yes',
                    headerText: 'Save before tab change..',
                    bodyText: 'Do you want to save?'
                };
                confirmation.showModal({}, modalOptions).then(function (result) {
                    one_three_OrdLinesFormCtrl.save();
                }, function () {
                    console.log("Cancelled");
                    one_three_OrdLinesFormCtrl.ePage.Masters.activeTab = 0;
                });
            }
        }

        function GetLineDeliveryDetails() {
            var _input = {
                "SortColumn": "OLD_Allocated",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "OrderRefKey": one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.PK
            }
            var _filter = {
                "searchInput": helperService.createToArrayOfObject(_input),
                "FilterID": appConfig.Entities.PorOrderLineDelivery.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.FindAll.Url, _filter).then(function (response) {
                if (response.data.Response) {
                    one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData = response.data.Response;
                } else {
                    one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData = [];
                }
            });
        }

        function AddNewDelivery() {
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = true;
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = {};
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity = {};
            one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.SaveButtonText = 'Save';
            GetDynamicControl1();
        }

        function SelectedGridRow(_item, type, index) {
            if (type == "edit") {
                one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.SaveButtonText = "Update";
                // one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = _item;
                one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = true;
                OrderLineGetByIdList(_item);
                // GetDynamicControl1();
            } else {
                apiService.get("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.Delete.Url + _item.PK).then(function (response) {
                    if (response.data.Response) {
                        one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.map(function (value, key) {
                            if (value.PK == _item.PK) {
                                one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.splice(key, 1);
                            }
                        })
                    }
                });
            }
        }

        function OrderLineGetByIdList(_getInput) {
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.GetById.Url + _getInput.PK).then(function (response) {
                if (response.data.Response) {
                    one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = response.data.Response;
                    one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity = response.data.Response.UIJobCustom;
                    GetDynamicControl1();
                }
            });
        }

        function AddToGridLineDelivery(type) {
            if (type != "Save") {
                one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.IsModified = true;
                apiService.post("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.Update.Url, one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView).then(function (response) {
                    if (response.data.Response) {
                        one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.map(function (value, key) {
                            if (value.PK == response.data.Response.PK) {
                                value.DeliveryPoint = response.data.Response.DeliveryPoint;
                                value.DestinationPort = response.data.Response.DestinationPort;
                                value.Allocated = response.data.Response.Allocated;
                            }
                        })
                        one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = false;
                        toastr.success("Successfully saved...");
                    } else {
                        toast.error("Save filed...");
                    }
                });
            } else {
                var _inputDelivery = {
                    "PK": "",
                    "IsValid": true,
                    "DeliveryPoint": one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.DeliveryPoint,
                    "DestinationPort": one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.DestinationPort,
                    "Allocated": one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.Allocated,
                    "SourceRefKey": one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.PK,
                    "UIJobCustom": one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity
                }
                apiService.post("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.Insert.Url, [_inputDelivery]).then(function (response) {
                    if (response.data.Response) {
                        one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.push(response.data.Response[0]);
                        one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = false;
                        toastr.success("Successfully saved...");
                    } else {
                        toastr.error("Save failed...")
                    }
                });
            }
        }

        function GetMstPackType() {
            var _inputPacks = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPacks).then(function (response) {
                if (response.data.Response) {
                    one_three_OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = helperService.metaBase();
                    one_three_OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = response.data.Response;
                } else {
                    one_three_OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = [];
                }
            });
        }

        function GetCfxTypeList() {
            var typeCodeList = ["INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ORDSTATUS", "HEIGHTUNIT"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                typeCodeList.map(function (value, key) {
                    one_three_OrdLinesFormCtrl.ePage.Masters.Meta[value].ListSource = helperService.metaBase();
                    one_three_OrdLinesFormCtrl.ePage.Masters.Meta[value].ListSource = response.data.Response[value];
                });
            });
        }

        function GetCountryList() {
            var _input = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Country.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.Country.API.FindLookup.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.Country.API.FindLookup.Url, _input).then(function (response) {
                one_three_OrdLinesFormCtrl.ePage.Masters.Meta['Country'].ListSource = helperService.metaBase();
                one_three_OrdLinesFormCtrl.ePage.Masters.Meta['Country'].ListSource = response.data.Response;
            });
        }

        function GetDynamicControl() {
            // Get Dynamic filter controls
            var _filter = {
                DataEntryName: "OrderLineCustom"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    one_three_OrdLinesFormCtrl.ePage.Masters.DynamicControl = response.data.Response;
                    one_three_OrdLinesFormCtrl.lineOrder.UICustomEntity.IsModified = true;
                    one_three_OrdLinesFormCtrl.lineOrder.UICustomEntity.IsNewInsert = true;
                    one_three_OrdLinesFormCtrl.ePage.Masters.DynamicControl.Entities[0].Data = one_three_OrdLinesFormCtrl.lineOrder.UICustomEntity;
                }
            });
        }

        function GetDynamicControl1() {
            // Get Dynamic filter controls
            var _filter = {
                DataEntryName: "OrderLineDeliveryCustom"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    one_three_OrdLinesFormCtrl.ePage.Masters.DynamicControl1 = response.data.Response;
                    one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity.IsModified = true;
                    one_three_OrdLinesFormCtrl.ePage.Masters.DynamicControl1.Entities[0].Data = one_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity;
                }
            });
        }

        function AutoPopulate(type, itemPrice, linePrice, Qty) {
            switch (type) {
                case "Qty":
                    one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.RecievedQuantity = one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.InvoicedQuantity;
                    (Qty && itemPrice != undefined) ? one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.LinePrice = (one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ItemPrice * one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.Quantity).toFixed(4): false;
                    break;
                case "Item Price":
                    (itemPrice && Qty) ? one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.LinePrice = (one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ItemPrice * one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.Quantity).toFixed(4): false;
                    break;
                case "Line Price":
                    (linePrice && Qty) ? one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.ItemPrice = (one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.LinePrice / one_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Buyer_Forwarder.Quantity).toFixed(4): false;
                    break;
                default:
                    break;
            }
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["OrderLine"],
                Code: [one_three_OrdLinesFormCtrl.currentOrder.Header.Data.UIOrder_Buyer_Forwarder.OrderCumSplitNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "BUYER_ORD_LINE",
                },
                // GroupCode: "PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: one_three_OrdLinesFormCtrl.ePage.Masters.Data,
                ErrorCode: errorCode ? errorCode : []
            };
            one_three_OrdLinesFormCtrl.ePage.Masters.ErrorWarningConfig.ValidateValue(_obj);
        }

        Init();
    }
})();