(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdLinesFormController", OrdLinesFormController);

    OrdLinesFormController.$inject = ["$scope", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "orderConfig", "confirmation"];

    function OrdLinesFormController($scope, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, orderConfig, confirmation) {
        var OrdLinesFormCtrl = this;

        function Init() {
            OrdLinesFormCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderLines_Form",
                "Masters": {
                    "OrderLines": {},
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
                        "AddressContactObject":{
                            "ListSource" : []
                        }
                    }
                },
                "Meta": helperService.metaBase(),
                "Entities": OrdLinesFormCtrl.currentOrder,
            };

            InitLineForm();
        }

        function InitLineForm() {
            OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = [];
            OrdLinesFormCtrl.ePage.Masters.OrderLines = OrdLinesFormCtrl.lineOrder;
            OrdLinesFormCtrl.ePage.Masters.LineDelivery = {};
            OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = {};  
            OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = false;
            OrdLinesFormCtrl.ePage.Masters.LineDelivery.AddToGridLineDelivery = AddToGridLineDelivery;
            OrdLinesFormCtrl.ePage.Masters.LineDelivery.SelectedGridRow = SelectedGridRow;
            OrdLinesFormCtrl.ePage.Masters.LineDelivery.SaveButtonText = "Save";
            OrdLinesFormCtrl.ePage.Masters.LineDeliveryTab = LineDeliveryTab;
            OrdLinesFormCtrl.ePage.Masters.AddNewDelivery = AddNewDelivery;
            OrdLinesFormCtrl.ePage.Masters.activeTab = 0;
         
            if (OrdLinesFormCtrl.action !== 'edit') {
                OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData = [];
            } else {
                GetLineDeliveryDetails();
            }
            $scope.$watch('OrdLinesFormCtrl.lineOrder', function (newValue, oldValue) {
                OrdLinesFormCtrl.ePage.Masters.OrderLines = newValue;
            }, true);

            InitDatePicker();
            GetMstPackType();
            GetCfxTypeList();
            GetCountryList();
            GetDynamicControl();
        }

        function InitDatePicker(){
            // DatePicker
            OrdLinesFormCtrl.ePage.Masters.DatePicker = {};
            OrdLinesFormCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrdLinesFormCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrdLinesFormCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }
  
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrdLinesFormCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        function LineDeliveryTab() {
            if (OrdLinesFormCtrl.action !== 'edit' && (OrdLinesFormCtrl.lineOrder.PK == undefined || OrdLinesFormCtrl.lineOrder.PK == "")) {
                var modalOptions = {
                    closeButtonText: 'No',
                    actionButtonText: 'Yes',
                    headerText: 'Save before tab change..',
                    bodyText: 'Do you want to save?'
                };
                confirmation.showModal({}, modalOptions).then(function (result) {
                    OrdLinesFormCtrl.save();
                }, function () {
                    console.log("Cancelled");
                    OrdLinesFormCtrl.ePage.Masters.activeTab = 0;
                });
            }
        }
        
        function GetLineDeliveryDetails() {
            var _input = {
                "SortColumn" : "OLD_Allocated",
                "SortType" : "DESC",
                "PageNumber" : "1",
                "PageSize" : 25,
                "OrderRefKey" : OrdLinesFormCtrl.ePage.Masters.OrderLines.PK
            }
            var _filter = {
                "searchInput": helperService.createToArrayOfObject(_input),
                "FilterID": appConfig.Entities.PorOrderLineDelivery.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.FindAll.Url, _filter).then(function (response) {
                if (response.data.Response) {
                    OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData = response.data.Response;
                } else {
                    OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData = [];   
                }
            });
        }
        
        function AddNewDelivery() {
            OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = true;
            OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView={};
            OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity = {};
            OrdLinesFormCtrl.ePage.Masters.LineDelivery.SaveButtonText = 'Save';
            GetDynamicControl1();
        }
        
        function SelectedGridRow(_item, type, index) {
            if (type == "edit") {
                OrdLinesFormCtrl.ePage.Masters.LineDelivery.SaveButtonText = "Update";
                // OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = _item;
                OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = true;
                OrderLineGetByIdList(_item);
                // GetDynamicControl1();
            } else{
                apiService.get("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.Delete.Url+_item.PK).then(function (response) {
                    if (response.data.Response) {
                        OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.map(function (value, key) {                            
                            if (value.PK == _item.PK) {
                                OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.splice(key, 1);
                            }
                        }) 
                    }
                });
            }
        }

        function OrderLineGetByIdList(_getInput) {
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.GetById.Url+_getInput.PK).then(function (response) {
                if (response.data.Response) {
                    OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView = response.data.Response;
                    OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity = response.data.Response.UIJobCustom;
                    GetDynamicControl1();
                }
            });
        }

        function AddToGridLineDelivery(type) {
            if (type != "Save") {                
                OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.IsModified = true;
                apiService.post("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.Update.Url, OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView).then(function (response) {
                    if (response.data.Response) {
                        OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.map(function (value, key) {
                            if (value.PK == response.data.Response.PK) {
                                value.DeliveryPoint = response.data.Response.DeliveryPoint;
                                value.DestinationPort = response.data.Response.DestinationPort;
                                value.Allocated = response.data.Response.Allocated;
                            }
                        })
                        OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = false;
                        toastr.success("Successfully saved...");
                    } else {
                        toast.error("Save filed...");
                    }
                });
            } else {
                var _inputDelivery = {
                    "PK" : "",
                    "IsValid": true,
                    "DeliveryPoint": OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.DeliveryPoint,
                    "DestinationPort": OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.DestinationPort,
                    "Allocated": OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.Allocated,
                    "SourceRefKey" : OrdLinesFormCtrl.ePage.Masters.OrderLines.PK,
                    "UIJobCustom" : OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity
                }
                apiService.post("eAxisAPI", appConfig.Entities.PorOrderLineDelivery.API.Insert.Url, [_inputDelivery]).then(function (response) {
                    if (response.data.Response) {
                        OrdLinesFormCtrl.ePage.Masters.LineDelivery.GridData.push(response.data.Response[0]);
                        OrdLinesFormCtrl.ePage.Masters.LineDelivery.IsFormView = false;
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
                if(response.data.Response){
                    OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = helperService.metaBase();
                    OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = response.data.Response;
                } else {
                    OrdLinesFormCtrl.ePage.Masters.Meta.ListSource = [];
                }
            });
        }

        function GetCfxTypeList() {
            var typeCodeList = ["INCOTERM", "ORDSTATUS"];
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
                    OrdLinesFormCtrl.ePage.Masters.Meta[value].ListSource = helperService.metaBase();
                    OrdLinesFormCtrl.ePage.Masters.Meta[value].ListSource = response.data.Response[value];
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
                OrdLinesFormCtrl.ePage.Masters.Meta['Country'].ListSource = helperService.metaBase();
                OrdLinesFormCtrl.ePage.Masters.Meta['Country'].ListSource = response.data.Response;
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
                    OrdLinesFormCtrl.ePage.Masters.DynamicControl = response.data.Response;
                    OrdLinesFormCtrl.lineOrder.UICustomEntity.IsModified = true;
                    OrdLinesFormCtrl.lineOrder.UICustomEntity.IsNewInsert = true;
                    OrdLinesFormCtrl.ePage.Masters.DynamicControl.Entities[0].Data = OrdLinesFormCtrl.lineOrder.UICustomEntity;
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
                    OrdLinesFormCtrl.ePage.Masters.DynamicControl1 = response.data.Response;
                    OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity.IsModified = true;
                    OrdLinesFormCtrl.ePage.Masters.DynamicControl1.Entities[0].Data = OrdLinesFormCtrl.ePage.Masters.LineDelivery.FormView.UICustomEntity;
                }
            });
        }

        Init();

    }

})();