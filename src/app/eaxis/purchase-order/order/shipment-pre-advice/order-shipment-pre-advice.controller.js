(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdShipmentPreAdviceController", OrdShipmentPreAdviceController);

    OrdShipmentPreAdviceController.$inject = ["$scope", "$window", "$injector", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "toastr", "appConfig"];

    function OrdShipmentPreAdviceController($scope, $window, $injector, $uibModal, APP_CONSTANT, apiService, helperService, toastr, appConfig) {
        var OrdShipmentPreAdviceCtrl = this;
        var Config = $injector.get("orderConfig");
        function Init() {
            var currentOrder = OrdShipmentPreAdviceCtrl.currentOrder[OrdShipmentPreAdviceCtrl.currentOrder.label].ePage.Entities;
            OrdShipmentPreAdviceCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Shipment_Pre_Advice",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };
            /*if (OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIPreAdviceShipment.length == 0) {
                OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIPreAdviceShipment.UIJobVoyageOrigin  = [];
                OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIPreAdviceShipment.UIJobSailing = [];
                OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIPreAdviceShipment.UIJobVoyageDestination = [];
                OrdShipmentPreAdviceCtrl.ePage.Masters.SaveButtonText = "Save";
            } else {
                OrdShipmentPreAdviceCtrl.ePage.Masters.SaveButtonText = "Update";
            }*/
            InitShipmentPreAdvice();
        }

        function InitShipmentPreAdvice() {
            // DatePicker
            OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker = {};
            OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            OrdShipmentPreAdviceCtrl.ePage.Masters.SelectedData = SelectedData;
            OrdShipmentPreAdviceCtrl.ePage.Masters.Save = Save;
            OrdShipmentPreAdviceCtrl.ePage.Masters.IsDisable = false;
            OrdShipmentPreAdviceCtrl.ePage.Masters.AddVessel = AddVessel;
            OrdShipmentPreAdviceCtrl.ePage.Masters.RemoveVessel = RemoveVessel;
            OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];

            if (OrdShipmentPreAdviceCtrl.currentOrder.isNew) {
                OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = [];
            } else {
                VesselPlanningGridLoad();
                VesselPlanningHistory();   
            }    
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrdShipmentPreAdviceCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        function SelectedData($item, type) {
            if (type == 'grid') {
                OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIShipmentHeader = $item.entity;
            } else {
                OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIShipmentHeader = $item;
            }
            OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK = OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK
            OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ShipmentNo = OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
        }
        
        function VesselPlanningGridLoad() {
            var _filter = {
                "SourceRefKey" : OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {                    
                    OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = response.data.Response;
                } else {
                    OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid = [];
                }
            });
        }
        
        function VesselPlanningHistory() {
            var _filter = {
                "EntitySource": "SPA",
                "EntityRefKey" : OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = response.data.Response;
                } else {
                    OrdShipmentPreAdviceCtrl.ePage.Masters.PreAdviceHistory = [];
                }
            });
        }
        
        function filterInput(data, type) {            
            var _inputVoyageOrigin = [];
            var _filterVoyageOrigin = {
                "PK" : data.UIJobVoyageOrigin.UIJobVoyageOrigin_PK,
                "ETD" : data.UIJobVoyageOrigin.PlannedETD,
                "POL" : data.UIJobVoyageOrigin.PortOfLoading,
                "DocumentaryCutoff" : data.UIJobVoyageOrigin.CargoCutOffDate,
                "CutOff" : data.UIJobVoyageOrigin.BookingCutOffDate,
                "IsValid" : true,
                "IsModified" : type
            }
            _inputVoyageOrigin.push(_filterVoyageOrigin);

            var _inputVoyageDestination = [];
            var _filterVoyageDestination = {
                "PK" : data.UIJobVoyageDestination.VoyageDestination_PK,
                "IsValid" : true,
                "POD" : data.UIJobVoyageDestination.PortOfDischarge,
                "ETA" : data.UIJobVoyageDestination.PlannedETA,
                "IsModified" : type
            }
            _inputVoyageDestination.push(_filterVoyageDestination);

            var _inputJobSailing = [];
            var _filterJobSailing = {
                "PK" : data.UIJobSailing.UIJobSailing_PK,
                "IsValid" : true,
                "IsModified" : type
            }
            _inputJobSailing.push(_filterJobSailing)

            var _filter = {
                "PK" : data.Vessel_FK,
                "VoyageFlight": data.PlannedVoyage,
                "Vessel": data.PlannedVessel,
                "IsModified" : type,
                "IsValid": true,
                "UIJobVoyageOrigin" : _inputVoyageOrigin,
                "UIJobVoyageDestination": _inputVoyageDestination,
                "UIJobSailing": _inputJobSailing
            }
            return _filter;
        }
        
        function Save(type) {
            OrdShipmentPreAdviceCtrl.ePage.Masters.IsDisable = true;
            if (type == "Save") {
                var _filter = filterInput(OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIPreAdviceShipment, false)
                apiService.post('eAxisAPI', appConfig.Entities.SailingDetails.API.Insert.Url, _filter).then(function (response) {
                    if (response.data.Response) {
                        UpdateOrdersRecord(response.data.Response,OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data);
                    }
                });
                OrdShipmentPreAdviceCtrl.ePage.Masters.SaveButtonText = "Update";
                OrdShipmentPreAdviceCtrl.ePage.Masters.IsDisable = false;
            } else {
                var _filter = filterInput(OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIPreAdviceShipment, true)
                apiService.post('eAxisAPI', appConfig.Entities.SailingDetails.API.Update.Url, _filter).then(function (response) {
                    if (response.data.Response) {
                        UpdateOrdersRecord(response.data.Response,OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data);
                    }
                });
                OrdShipmentPreAdviceCtrl.ePage.Masters.SaveButtonText = "Update";
                OrdShipmentPreAdviceCtrl.ePage.Masters.IsDisable = false;
            }
        }
        
        function UpdateOrdersRecord(_inputData,_item) {
            var _filter = [];
            var _tempObj = {
                "EntityRefPK": _item.PK,
                "Properties": [{
                    "PropertyName": "POH_JBS_FK",
                    "PropertyNewValue": _inputData.UIJobSailing[0].PK
                }]
            };
            _filter.push(_tempObj);
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _filter).then(function (response) {
                if (response.data.Response) {
                } else{
                    toastr.error("Save failed...");
                }
            });
        }
        
        function AddVessel(data, type) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "vessel-modal",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eAxis/purchase-order/order/shipment-pre-advice/vessel-planning/vessel-planning-modal.html",
                controller: 'ordVesselModalController',
                controllerAs: "OrdVesselModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Input" : data,
                            "Type" : type,
                            "Mode" : OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {                       
                    if (OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid.length > 0 ) {
                        response.map(function (value, key) {
                            if (!_.find(OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid, {
                                    PK: value.PK
                                })) {
                               OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid.push(value);
                            } else {
                                value.CarrierOrg_Code = response[key].CarrierOrg_Code;
                                value.VoyageFlight = response[key].VoyageFlight;
                                value.Vessel = response[key].Vessel;
                                value.PortOfDischarge = response[key].DischargePort;
                                value.ETD = response[key].ETD;
                                value.PortOfLoading = response[key].LoadPort;
                                value.ETA = response[key].ETA;
                                value.ATA = response[key].ATA;
                                value.ATD = response[key].ATD;
                                value.CarrierOrg_FK = response[key].CarrierOrg_FK;
                            }
                        })
                    } else {
                      OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid.push(response[0])   
                    }
                    OrdShipmentPreAdviceCtrl.ePage.Entities.Header.Data.UIPreAdviceShipment = {};
                    toastr.success("Successfully saved...");
                },
                function (response) {
                }
            );
        }
        
        function RemoveVessel(data , index) {
            apiService.get('eAxisAPI', appConfig.Entities.JobRoutes.API.Delete.Url+data.PK).then(function (response) {
                if (response.data.Response) {
                    OrdShipmentPreAdviceCtrl.ePage.Masters.VesselPlanningGrid.splice(index, 1);
                    toastr.success("Successfully removed...");
                }
            });
        }

        Init();
    }
})();
