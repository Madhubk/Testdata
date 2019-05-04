(function () {
    "use strict";

    angular.module("Application")
        .controller("ExchangeRateGeneralController", ExchangeRateGeneralController);

    ExchangeRateGeneralController.$inject = ["$uibModal", "$scope", "$filter", "$timeout", "helperService", "APP_CONSTANT", "apiService", "authService", "appConfig", "exchangerateConfig"];

    function ExchangeRateGeneralController($uibModal, $scope, $filter, $timeout, helperService, APP_CONSTANT, apiService, authService, appConfig, exchangerateConfig) {

        var ExchangeRateGeneralCtrl = this;

        function Init() {

            var currentExchangeRate = ExchangeRateGeneralCtrl.currentExchangeRate[ExchangeRateGeneralCtrl.currentExchangeRate.code].ePage.Entities;
            ExchangeRateGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_ExchangeRate",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentExchangeRate
            };

            ExchangeRateGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            ExchangeRateGeneralCtrl.ePage.Masters.Config = exchangerateConfig;
            ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList = ExchangeRateGeneralCtrl.ePage.Entities.Header.Data;
            ExchangeRateGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            ExchangeRateGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            //ExchangeRateGeneralCtrl.ePage.Entities.Header.lstUIMstExchangeRate = [];
            console.log(ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList);
            console.log(ExchangeRateGeneralCtrl.ePage.Masters);


            // Date Picker
            ExchangeRateGeneralCtrl.ePage.Masters.DatePicker = {};
            ExchangeRateGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExchangeRateGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExchangeRateGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            //Date Picker Validation
            ExchangeRateGeneralCtrl.ePage.Masters.OnChangeDate=OnChangeDate;
            

            console.log(ExchangeRateGeneralCtrl.ePage.Entities.Header.TableProperties.lstUIMstExchangeRate.ccheckbox.isenabled);

            /* Function  */
            ExchangeRateGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;


            // #region DropDown 
            ExchangeRateGeneralCtrl.ePage.Masters.DropDownMasterList = {
                "ExRateType": {
                    "ListSource": []
                },
                "ExRateSubType": {
                    "ListSource": []
                }
            };
            GetMastersDropDownList();
            validateStartDate();
            //#endregion 

        }
        function validateStartDate() {
            if (ExchangeRateGeneralCtrl.currentExchangeRate.isNew) {
                ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.StartDate = "";
            }
        }
        // #region DropDownList
        function GetMastersDropDownList() {
            var typeCodeList = ["EXRATETYPE", "EXSUBRATE"];
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
                        ExchangeRateGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ExchangeRateGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        // #endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {            
            if (fieldvalue != '') {
                if (code == "E1327") {
                    if(ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.Rate != null && ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.Rate !=""){
                    ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.Rate
                    ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.ConvFromAtoB = ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.Rate;
                    ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.ConvFromBtoA = 1 / ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.Rate;
                    }
                }
                else {
                    angular.forEach(ExchangeRateGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                        if (value.Code.trim() === code) {
                            GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                        }
                    });
                }

            }
            
        }


        function OnChangeDate($item,$type){
            
            if($type='StartDate'){
                var stDate=new Date(ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.StartDate).toISOString();
                var iDate =ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.StartDate;
                var arr=iDate.split("-");
                console.log(arr[0]);
                console.log(arr[1]);
                console.log(arr[2]);                
                var sDate=arr[2]+"-"+arr[0] + "-" + arr[1]+"T00:00:00";               
                var found= ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.lstUIMstExchangeRate.some(el => el.StartDate===sDate && el.RateType===ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.RateType && el.ExRateSubType===ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.ExRateSubType);
                if(found){
                    ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.StartDate="";
                }
            
            }
            else if($type=='ExpiryDate'){}
            console.log($item);
            
        }

        function SelectedLookupData($index, $item, type) {
            if (type == 'ToCurrency') {
                if (ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.FromCurrency != null && $item.Code != ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.FromCurrency) {
                    var _filter = {
                        "FromCurrency": ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.UIMstExchangeRate.FromCurrency,
                        "NKExCurrency": $item.Code
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": exchangerateConfig.Entities.API.ExchangerateMaster.API.ExRateList.FilterID
                    };


                    apiService.post("eAxisAPI", exchangerateConfig.Entities.API.ExchangerateMaster.API.ExRateList.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList.lstUIMstExchangeRate = response.data.Response;
                        }
                    });
                }
            }
        }

        //#region DatePicker
        function OpenDatePicker($event, opened) {

            $event.preventDefault();
            $event.stopPropagation();
            ExchangeRateGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        function AddNewRow() {

            var obj = {
                "StartDate": "",
                "ExpiryDate": "",
                "RateType": "",
                "RateSubType": "",
                "Rate": "",
                "LineNo": ExchangeRateGeneralCtrl.ePage.Entities.Header.lstUIMstExchangeRate.length + 1
            };

            ExchangeRateGeneralCtrl.ePage.Entities.Header.lstUIMstExchangeRate.push(obj);
            ExchangeRateGeneralCtrl.ePage.Masters.selectedRow = ExchangeRateGeneralCtrl.ePage.Entities.Header.lstUIMstExchangeRate.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("ExchangeRateGeneralCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            //ExchangeRateGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ExchangeRateGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ExchangeRateGeneralCtrl.currentExchangeRate.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                ExchangeRateGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ExchangeRateGeneralCtrl.currentExchangeRate.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 
        
        Init()
    }
})();