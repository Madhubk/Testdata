(function () {
    "use strict";

    angular
        .module("Application", ['angularPrint', 'angular-qrbarcode'])
        .controller("GenerateBarcodeController", GenerateBarcodeController);

    GenerateBarcodeController.$inject = ["$rootScope","AngularPrint", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig",  "helperService", "toastr", "$document", "$filter","warehouseConfig"];

    function GenerateBarcodeController($rootScope,AngularPrint, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig,  helperService, toastr, $document, $filter,warehouseConfig) {

        var GenerateBarcodeCtrl = this;

        function Init() {


            GenerateBarcodeCtrl.ePage = {
                "Title": "",
                "Prefix": "Generate-Barcode",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };
            // Variable declaration
            GenerateBarcodeCtrl.ePage.Masters.DropDownMasterList = {};
            GenerateBarcodeCtrl.ePage.Masters.IsShow = false;

            // function call from html
            GenerateBarcodeCtrl.ePage.Masters.GenerateBarCode = GenerateBarCode;
            GenerateBarcodeCtrl.ePage.Masters.Print = Print;

            $timeout(function () {
                $('#filterSideBar').toggleClass('open');
            });
            GenerateBarcodeCtrl.ePage.Masters.ViewType = 1;
            // function call
            GetDropDownList();
            barCodeInitialization();
        }
        function Print() {           
            var printable = document.querySelector("#printThisElement")
            AngularPrint(printable)
        }

        // Get CFXType Dropdown list
        function GetDropDownList() {
            var typeCodeList = ["CodeType"];
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
                        GenerateBarcodeCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        GenerateBarcodeCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        // Generate Barcode
        function GenerateBarCode() {
            var isError = false;
            if (GenerateBarcodeCtrl.ePage.Masters.Code == undefined) {
                toastr.warning("Please Enter no of code");
                isError = true;
            }
            if (GenerateBarcodeCtrl.ePage.Masters.CodeType == undefined) {
                toastr.warning("Please Select Code Type");
                isError = true;
            }
            if (!isError) {
                var _filter = {
                    "Quantity": GenerateBarcodeCtrl.ePage.Masters.Code,
                    "PageNumber": 1,
                    "PageSize": 30
                };
                // var _input = {
                //     "searchInput": helperService.createToArrayOfObject(_filter)
                // };

                apiService.post("eAxisAPI",warehouseConfig.Entities.Header.API.WmsBarcode.Url, _filter).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        GenerateBarcodeCtrl.ePage.Masters.BarcodeDetails = response.data.Response;
                        GenerateBarcodeCtrl.ePage.Masters.IsShow = true;
                    }
                });
            }
        }

        function barCodeInitialization() {
            GenerateBarcodeCtrl.ePage.Masters.bc = {
                format: 'CODE128',
                lineColor: '#000000',
                width: 1,
                height: 40,
                displayValue: true,
                fontOptions: $scope.txt,
                font: 'monospace',
                textAlign: 'center',
                textPosition: 'bottom',
                textMargin: 3,
                fontSize: 10.5,
                background: '#ffffff',
                margin: 5,
                marginTop: 5,
                marginBottom: 5,
                marginLeft: 5,
                marginRight: 5,
                valid: function (valid) {
                }
            }
        }
        

        Init();
    }

})();
