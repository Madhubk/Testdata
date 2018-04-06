(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicLookupController", DynamicLookupController);

    DynamicLookupController.$inject = ["$scope", "$location", "APP_CONSTANT", "apiService", "authService", "helperService", "$http", "dynamicLookupConfig"];

    function DynamicLookupController($scope, $location, APP_CONSTANT, apiService, authService, helperService, $http, dynamicLookupConfig) {
        var DynamicLookupCtrl = this;

        function Init() {
            DynamicLookupCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_Lookup",
                "Masters": {},
                "Meta": helperService.metaBase()
            };

            DynamicLookupCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            DynamicLookupCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            DynamicLookupCtrl.ePage.Masters.AutoCompleteList = AutoCompleteList;
            DynamicLookupCtrl.ePage.Masters.OnChangeLookup = OnChangeLookup;

            // DynamicLookupCtrl.ePage.Masters.label = label;
        }

        function AutoCompleteOnSelect($item, $model, $label, obj, config) {
            if (config.getValues) {
                for (var j = 0; j < config.getValues.length; j++) {
                    obj[config.getValues[j].eField] = $item[config.getValues[j].sField];
                }
            }
            DynamicLookupCtrl.autoCompleteOnSelect({
                $item: $item
            });
        }

        // function label(item, display) {
        //     var arr = [];
        //     console.log(item);
        //     console.log(display);
        //     if (display == undefined && item != undefined) {
        //         // display.map(function (value, key) {
        //         //     arr.push(item[value])
        //         // });
        //         return item;
        //     } else if (display != undefined && item != undefined) {
        //         display.map(function (value, key) {
        //             arr.push(item[value])
        //         });
        //         return arr.join("-");
        //     } else {
        //         return item;
        //     }
        // }

        function AutoCompleteList(Value, obj, config, lookupField) {

            var configObj = config.LookupConfig[lookupField];
            configObj.setValues.map(function (val, key) {
                configObj.defaults[val.sField] = obj[val.eField]
            });
            var defaultInput = helperService.createToArrayOfObject(configObj.defaults);
            var inputObj = {};
            inputObj.SearchInput = defaultInput;
            if (obj != null) {
                for (var i = 0; i < configObj.PossibleFilters.length; i++) {
                    if (configObj.PossibleFilters[i].FieldName != configObj.UIDisplay) {
                        if (obj[configObj.PossibleFilters[i].FieldName] != undefined) {
                            if (obj[configObj.PossibleFilters[i].FieldName])
                                configObj.PossibleFilters[i].value = obj[configObj.PossibleFilters[i].FieldName];
                            else
                                configObj.PossibleFilters[i].value = "";
                        }
                    } else {
                        configObj.PossibleFilters[i].value = Value;
                    }
                }
            }

            var _filterAPIArray = config.FilterAPI.split("/")
            var _isFindLookup = _filterAPIArray[_filterAPIArray.length - 2] === "FindLookup" ? true : false;
            inputObj.FilterID = config.FilterID;
            inputObj.SearchInput.push(configObj.PossibleFilters[0]);

            if (_isFindLookup) {
                var _api = _filterAPIArray.slice(0, -1).join("/");
                inputObj.DBObjectName = config.FilterAPI.split("/").pop();
            } else {
                _api = config.FilterAPI;
            }

            return apiService.post("eAxisAPI", _api, inputObj).then(function (response) {
                return response.data.Response;
            });
        }

        function OnChangeLookup(obj, config){
            DynamicLookupCtrl.ePage.Masters.IsLoading = false;
            DynamicLookupCtrl.ePage.Masters.NoRecords = false;
            if(!DynamicLookupCtrl.myNgModel){
                if (config.getValues) {
                    for (var j = 0; j < config.getValues.length; j++) {
                        obj[config.getValues[j].eField] = undefined;
                    }
                }
            }
        }

        Init();
    }
})();
