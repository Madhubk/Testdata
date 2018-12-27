(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardDispatchController", OutwardDispatchController);

    OutwardDispatchController.$inject = ["$scope", "$state", "$timeout", "APP_CONSTANT", "apiService", "outwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "$injector", "$window", "toastr", "confirmation"];

    function OutwardDispatchController($scope, $state, $timeout, APP_CONSTANT, apiService, outwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, $injector, $window, toastr, confirmation) {

        var OutwardDispatchCtrl = this;

        function Init() {

            var currentOutward = OutwardDispatchCtrl.currentOutward[OutwardDispatchCtrl.currentOutward.label].ePage.Entities;

            OutwardDispatchCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Dispatch",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutward
            };
            OutwardDispatchCtrl.ePage.Masters.Config = outwardConfig;
            OutwardDispatchCtrl.ePage.Masters.DropDownMasterList = {};

            OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails = OutwardDispatchCtrl.manifestDetails;
            OutwardDispatchCtrl.ePage.Masters.TransportMode = ["Road", "Air", "Sea"];
            if (!OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.TransportMode)
                OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.TransportMode = OutwardDispatchCtrl.ePage.Masters.TransportMode[0];
            OutwardDispatchCtrl.ePage.Masters.DocumentInput = [];
            // DatePicker
            OutwardDispatchCtrl.ePage.Masters.DatePicker = {};
            OutwardDispatchCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OutwardDispatchCtrl.ePage.Masters.DatePicker.isOpen = [];
            OutwardDispatchCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            OutwardDispatchCtrl.ePage.Masters.SelectedLookupCarrier = SelectedLookupCarrier;
            OutwardDispatchCtrl.ePage.Masters.OnChangeVehicleType = OnChangeVehicleType;
            OutwardDispatchCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            OutwardDispatchCtrl.ePage.Masters.StandardMenuConfig = StandardMenuConfig;
            OutwardDispatchCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            GetDropDownList();
            getVehicleType();
            generalOperation();
        }

        function OnChangeValues(fieldvalue, code) {
            angular.forEach(OutwardDispatchCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                OutwardDispatchCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OutwardDispatchCtrl.currentOutward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                OutwardDispatchCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, OutwardDispatchCtrl.currentOutward.label);
            }
        }

        function generalOperation() {
            if (OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.TransporterCode == null) {
                OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.TransporterCode = "";
            }
            if (OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.TransporterName == null) {
                OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.TransporterName = "";
            }
            OutwardDispatchCtrl.ePage.Masters.Transporter = OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.TransporterCode + ' - ' + OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.TransporterName;
            if (OutwardDispatchCtrl.ePage.Masters.Transporter == ' - ')
                OutwardDispatchCtrl.ePage.Masters.Transporter = ""
        }

        function StandardMenuConfig(value, index) {
            OutwardDispatchCtrl.ePage.Masters.DocumentInput[index] = {
                // Entity
                "EntityRefKey": OutwardDispatchCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK,
                "EntityRefCode": OutwardDispatchCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID,
                "EntitySource": "ORD",
                // Parent Entity
                "ParentEntityRefKey": value.TMC_FK,
                "ParentEntityRefCode": value.TMC_ConsignmentNumber,
                "ParentEntitySource": "TMC",
                // Additional Entity
                "AdditionalEntityRefKey": OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.PK,
                "AdditionalEntityRefCode": OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.ManifestNumber,
                "AdditionalEntitySource": "TMM",
                "RowObj": undefined,
                "Config": undefined,
                "Entity": "TransportsManifest"
            };
        }

        function SingleRecordView() {
            var _queryString = {
                PK: OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.PK,
                ManifestNumber: OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.ManifestNumber,
                ConfigName: "dmsManifestConfig",
                Header: OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/outwardmanifest/" + _queryString, "_blank");
        }

        function OnChangeVehicleType(item) {
            angular.forEach(OutwardDispatchCtrl.ePage.Masters.VehicleType, function (value, key) {
                if (value.Code == item) {
                    OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.VehicleTypeCode = value.Code;
                    OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.VehicleTypeDescription = value.Description;
                    OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.VehicleType = value.PK;
                    OnChangeValues(OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.VehicleTypeCode, 'E3065');
                }
            });
        }

        function SelectedLookupCarrier(item) {
            OutwardDispatchCtrl.ePage.Masters.Transporter = item.Code + ' - ' + item.FullName;
            OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.Transporter_ORG_FK = item.PK;
            OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.TransporterCode = item.Code;
            OnChangeValues(OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.TransporterCode, 'E3064')
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            OutwardDispatchCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function getVehicleType() {
            var _filter = {
                "SortColumn": "CNM_Code",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": OutwardDispatchCtrl.ePage.Entities.Header.API.MstContainer.FilterID
            };
            apiService.post("eAxisAPI", OutwardDispatchCtrl.ePage.Entities.Header.API.MstContainer.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    OutwardDispatchCtrl.ePage.Masters.VehicleType = response.data.Response;
                    if (!OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.VehicleTypeCode) {
                        OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.VehicleTypeCode = response.data.Response[0].Code;
                        OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.VehicleType = response.data.Response[0].PK;
                        OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.VehicleTypeDescription = response.data.Response[0].Description;
                    }
                }
            });
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["ManifestType", "ManifestLoadType"];
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
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        OutwardDispatchCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OutwardDispatchCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                        if (value == "ManifestLoadType") {
                            if (!OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.LoadType)
                                OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.LoadType = response.data.Response[value][0].Key;
                        }
                        if (value == "ManifestType") {
                            if (!OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.ManifestType)
                                OutwardDispatchCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.ManifestType = response.data.Response[value][1].Key;
                        }
                    });
                }
            });
        }

        Init();
    }

})();