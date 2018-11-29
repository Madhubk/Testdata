(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrdLinesFormController", three_three_OrdLinesFormController);

    three_three_OrdLinesFormController.$inject = ["$scope", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "confirmation"];

    function three_three_OrdLinesFormController($scope, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, confirmation) {
        var three_three_OrdLinesFormCtrl = this;

        function Init() {
            three_three_OrdLinesFormCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderLines_Form",
                "Masters": {
                    "Data": {
                        "UIOrderLine_Forwarder": {}
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
                "Entities": three_three_OrdLinesFormCtrl.currentOrder,
            };

            InitLineForm();
        }

        function InitLineForm() {
            three_three_OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = [];
            three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder = three_three_OrdLinesFormCtrl.lineOrder;
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery = {};
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = {};
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = false;
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.AddToGridLineDelivery = AddToGridLineDelivery;
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.SelectedGridRow = SelectedGridRow;
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.SaveButtonText = "Save";
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDeliveryTab = LineDeliveryTab;
            three_three_OrdLinesFormCtrl.ePage.Masters.AddNewDelivery = AddNewDelivery;
            three_three_OrdLinesFormCtrl.ePage.Masters.AutoPopulate = AutoPopulate;
            three_three_OrdLinesFormCtrl.ePage.Masters.OnChangesVolume = OnChangesVolume;
            three_three_OrdLinesFormCtrl.ePage.Masters.activeTab = 0;

            if (three_three_OrdLinesFormCtrl.action !== 'edit') {
                three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.UnitOfWeight = 'KG';
                three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.UnitOfVolume = 'M3';
                three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.OuterPacksUQ = 'PKG';
                three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData = [];
            } else {
                GetLineDeliveryDetails();
            }
            $scope.$watch('three_three_OrdLinesFormCtrl.lineOrder', function (newValue, oldValue) {
                three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder = newValue;
            }, true);
            // error config
            three_three_OrdLinesFormCtrl.ePage.Masters.ErrorWarningConfig = three_three_OrdLinesFormCtrl.error;
            
            InitDatePicker();
            GetMstPackType();
            GetCfxTypeList();
            GetCountryList();
            GetDynamicControl();
        }

        function InitDatePicker() {
            // DatePicker
            three_three_OrdLinesFormCtrl.ePage.Masters.DatePicker = {};
            three_three_OrdLinesFormCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            three_three_OrdLinesFormCtrl.ePage.Masters.DatePicker.isOpen = [];
            three_three_OrdLinesFormCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            three_three_OrdLinesFormCtrl.ePage.Masters.DatePicker.OnChangeDatePicker = OnChangeDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            three_three_OrdLinesFormCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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

                        three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
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

                        three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
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

                        three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
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

                        three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
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

                        three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
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

                        three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
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

                        three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
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

                        three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ActualVolume = OnChangesActualVolume(Length, Width, Height, _unitOfVolumeValue, _packCount, _type);
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
            if (three_three_OrdLinesFormCtrl.action !== 'edit' && (three_three_OrdLinesFormCtrl.lineOrder.PK == undefined || three_three_OrdLinesFormCtrl.lineOrder.PK == "")) {
                var modalOptions = {
                    closeButtonText: 'No',
                    actionButtonText: 'Yes',
                    headerText: 'Save before tab change..',
                    bodyText: 'Do you want to save?'
                };
                confirmation.showModal({}, modalOptions).then(function (result) {
                    three_three_OrdLinesFormCtrl.save();
                }, function () {
                    console.log("Cancelled");
                    three_three_OrdLinesFormCtrl.ePage.Masters.activeTab = 0;
                });
            }
        }

        function GetLineDeliveryDetails() {
            var _input = {
                "SortColumn": "OLD_Allocated",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "OrderRefKey": three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.PK
            }
            var _filter = {
                "searchInput": helperService.createToArrayOfObject(_input),
                "FilterID": appConfig.Entities.PorOrderLineDelivery.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.FindAll.Url, _filter).then(function (response) {
                if (response.data.Response) {
                    three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData = response.data.Response;
                } else {
                    three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData = [];
                }
            });
        }

        function AddNewDelivery() {
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = true;
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = {};
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity = {};
            three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.SaveButtonText = 'Save';
            GetDynamicControl1();
        }

        function SelectedGridRow(_item, type, index) {
            if (type == "edit") {
                three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.SaveButtonText = "Update";
                // three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = _item;
                three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = true;
                OrderLineGetByIdList(_item);
                // GetDynamicControl1();
            } else {
                apiService.get("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.Delete.Url + _item.PK).then(function (response) {
                    if (response.data.Response) {
                        three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.map(function (value, key) {
                            if (value.PK == _item.PK) {
                                three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.splice(key, 1);
                            }
                        })
                    }
                });
            }
        }

        function OrderLineGetByIdList(_getInput) {
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.GetById.Url + _getInput.PK).then(function (response) {
                if (response.data.Response) {
                    three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = response.data.Response;
                    three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity = response.data.Response.UIJobCustom;
                    GetDynamicControl1();
                }
            });
        }

        function AddToGridLineDelivery(type) {
            if (type != "Save") {
                three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.IsModified = true;
                apiService.post("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.Update.Url, three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView).then(function (response) {
                    if (response.data.Response) {
                        three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.map(function (value, key) {
                            if (value.PK == response.data.Response.PK) {
                                value.DeliveryPoint = response.data.Response.DeliveryPoint;
                                value.DestinationPort = response.data.Response.DestinationPort;
                                value.Allocated = response.data.Response.Allocated;
                            }
                        })
                        three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = false;
                        toastr.success("Successfully saved...");
                    } else {
                        toast.error("Save filed...");
                    }
                });
            } else {
                var _inputDelivery = {
                    "PK": "",
                    "IsValid": true,
                    "DeliveryPoint": three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.DeliveryPoint,
                    "DestinationPort": three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.DestinationPort,
                    "Allocated": three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.Allocated,
                    "SourceRefKey": three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.PK,
                    "UIJobCustom": three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity
                }
                apiService.post("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.Insert.Url, [_inputDelivery]).then(function (response) {
                    if (response.data.Response) {
                        three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.push(response.data.Response[0]);
                        three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = false;
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
                    three_three_OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = helperService.metaBase();
                    three_three_OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = response.data.Response;
                } else {
                    three_three_OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = [];
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
                    three_three_OrdLinesFormCtrl.ePage.Masters.Meta[value].ListSource = helperService.metaBase();
                    three_three_OrdLinesFormCtrl.ePage.Masters.Meta[value].ListSource = response.data.Response[value];
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
                three_three_OrdLinesFormCtrl.ePage.Masters.Meta['Country'].ListSource = helperService.metaBase();
                three_three_OrdLinesFormCtrl.ePage.Masters.Meta['Country'].ListSource = response.data.Response;
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
                    three_three_OrdLinesFormCtrl.ePage.Masters.DynamicControl = response.data.Response;
                    three_three_OrdLinesFormCtrl.lineOrder.UICustomEntity.IsModified = true;
                    three_three_OrdLinesFormCtrl.lineOrder.UICustomEntity.IsNewInsert = true;
                    three_three_OrdLinesFormCtrl.ePage.Masters.DynamicControl.Entities[0].Data = three_three_OrdLinesFormCtrl.lineOrder.UICustomEntity;
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
                    three_three_OrdLinesFormCtrl.ePage.Masters.DynamicControl1 = response.data.Response;
                    three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity.IsModified = true;
                    three_three_OrdLinesFormCtrl.ePage.Masters.DynamicControl1.Entities[0].Data = three_three_OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity;
                }
            });
        }

        function AutoPopulate(type, itemPrice, linePrice, Qty) {
            switch (type) {
                case "Qty":
                    three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.RecievedQuantity = three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.InvoicedQuantity;
                    (Qty && itemPrice != undefined) ? three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.LinePrice = (three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ItemPrice * three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.Quantity).toFixed(4): false;
                    break;
                case "Item Price":
                    (itemPrice && Qty) ? three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.LinePrice = (three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ItemPrice * three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.Quantity).toFixed(4): false;
                    break;
                case "Line Price":
                    (linePrice && Qty) ? three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.ItemPrice = (three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.LinePrice / three_three_OrdLinesFormCtrl.ePage.Masters.Data.UIOrderLine_Forwarder.Quantity).toFixed(4): false;
                    break;
                default:
                    break;
            }
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["OrderLine"],
                Code: [three_three_OrdLinesFormCtrl.currentOrder.Header.Data.UIOrder_Forwarder.OrderCumSplitNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "FORWARDER_ORD_LINE",
                },
                // GroupCode: "PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: three_three_OrdLinesFormCtrl.ePage.Masters.Data,
                ErrorCode: errorCode ? errorCode : []
            };
            three_three_OrdLinesFormCtrl.ePage.Masters.ErrorWarningConfig.ValidateValue(_obj);
        }

        Init();
    }
})();