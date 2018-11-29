(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerGridFormController", ContainerGridFormController);

    ContainerGridFormController.$inject = ["$rootScope", "$scope", "$state", "$q", "$injector", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$filter", "toastr", "errorWarningService", "dynamicLookupConfig"];

    function ContainerGridFormController($rootScope, $scope, $state, $q, $injector, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, $filter, toastr, errorWarningService, dynamicLookupConfig) {
        /* jshint validthis: true */
        var ContainerGridFormCtrl = this;
        // dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {

            ContainerGridFormCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Container",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };

            ContainerGridFormCtrl.ePage.Masters.Container = {};
            ContainerGridFormCtrl.ePage.Masters.Container.FormView = ContainerGridFormCtrl.currentContainer;
            ContainerGridFormCtrl.ePage.Masters.Container.checkValid = CheckValid

            //DatePicker
            ContainerGridFormCtrl.ePage.Masters.DatePicker = {};
            ContainerGridFormCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ContainerGridFormCtrl.ePage.Masters.DatePicker.isOpen = [];
            ContainerGridFormCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            // ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Consol.Entity[ContainerGridFormCtrl.refCode + "Container"].GlobalErrorWarningList;
            // ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Consol.Entity[ContainerGridFormCtrl.refCode + "Container"];
            // ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.ErrorCodeList = errorWarningService.Modules.Consol.ErrorCodeList

            // var obj = angular.copy(_.filter(ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.ErrorCodeList, {
            //     'Code': "W0006"
            // })[0])
            // ContainerGridFormCtrl.ePage.Masters.copy = angular.copy(obj.Message)


            ContainerGridFormCtrl.ePage.Masters.DropDownMasterList = {
                "CON_CNTMODE": {
                    "ListSource": []
                },
                "CNT_DELIVERYMODE": {
                    "ListSource": []
                },
                "CNT_SEALBY": {
                    "ListSource": []
                },
                "WEIGHTUNIT": {
                    "ListSource": []
                },
                "CNT_STATUS": {
                    "ListSource": []
                },
                "CNT_QUALITY": {
                    "ListSource": []
                },
                "CNT_TEMPSET": {
                    "ListSource": []
                },
                "CNT_AIRVENTSET": {
                    "ListSource": []
                }
            }
            ContainerGridFormCtrl.ePage.Masters.SelectedData = SelectedData
            ContainerGridFormCtrl.ePage.Masters.SelectedConTypeData = SelectedConTypeData
            ContainerGridFormCtrl.ePage.Masters.UpdateTotal = UpdateTotal
            ContainerGridFormCtrl.ePage.Masters.UpdateMeasures = UpdateMeasures
            ContainerGridFormCtrl.ePage.Masters.UpdateBackLeft = UpdateBackLeft
            ContainerGridFormCtrl.ePage.Masters.DropDownMasterListAddress = {
                "OAD_DeliverEmptyToAddressFK": helperService.metaBase(),
                "OAD_PickUpEmptyFromAddressFK": helperService.metaBase()
            }
            GetCfxTypeList();
            dynamicOrgAddressFetch()
            defaultContType();
            GetRelatedLookupList();
        }

        function GetCfxTypeList() {
            var typeCodeList = ["CON_CNTMODE", "CNT_DELIVERYMODE", "CNT_SEALBY", "WEIGHTUNIT", "CNT_STATUS", "CNT_QUALITY", "CNT_TEMPSET", "CNT_AIRVENTSET"];
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
                    ContainerGridFormCtrl.ePage.Masters.DropDownMasterList[value].ListSource = helperService.metaBase();
                    ContainerGridFormCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                });
            });
        }


        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ContainerGridFormCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function SelectedData(item, ListSource) {
            if (ListSource) {
                getSetNearByField(item, "OrgAddress", ListSource);
            }
        }

        function UpdateTotal() {
            ContainerGridFormCtrl.ePage.Masters.Container.FormView.GrossWeight = (parseFloat(ContainerGridFormCtrl.ePage.Masters.Container.FormView.TareWeight) + parseFloat(ContainerGridFormCtrl.ePage.Masters.Container.FormView.GoodsWeight) + parseFloat(ContainerGridFormCtrl.ePage.Masters.Container.FormView.DunnageWeight)).toFixed(3);
        }

        function UpdateMeasures(x, y, z, a) {
            var _temp = parseInt(ContainerGridFormCtrl.ePage.Masters.Container.FormView[x]) < parseInt(ContainerGridFormCtrl.ePage.Masters.Container.FormView[y])
            if (_temp) {
                ContainerGridFormCtrl.ePage.Masters.Container.FormView[z] = (ContainerGridFormCtrl.ePage.Masters.Container.FormView[y] - ContainerGridFormCtrl.ePage.Masters.Container.FormView[x]).toFixed(3);
                if (a != undefined) {
                    ContainerGridFormCtrl.ePage.Masters.Container.FormView[a] = ContainerGridFormCtrl.ePage.Masters.Container.FormView[z]
                }
            } else {
                ContainerGridFormCtrl.ePage.Masters.Container.FormView[z] = (0).toFixed(3);
                if (a != undefined) {
                    ContainerGridFormCtrl.ePage.Masters.Container.FormView[a] = ContainerGridFormCtrl.ePage.Masters.Container.FormView[z]
                }
            }

        }

        function UpdateBackLeft(x, y, z) {
            var _temp = parseInt(ContainerGridFormCtrl.ePage.Masters.Container.FormView[z]) > parseInt(ContainerGridFormCtrl.ePage.Masters.Container.FormView[y])
            if (_temp) {
                ContainerGridFormCtrl.ePage.Masters.Container.FormView[x] = (ContainerGridFormCtrl.ePage.Masters.Container.FormView[z] - ContainerGridFormCtrl.ePage.Masters.Container.FormView[y]).toFixed(3);
            } else {
                ContainerGridFormCtrl.ePage.Masters.Container.FormView[x] = (0).toFixed(3);
            }
        }

        function SelectedConTypeData($item, RC_Type) {

            //ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Consol', ContainerGridFormCtrl.refCode + "Container", RC_Type, 'E0007', false)
            ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_TareWeight = (parseInt($item.CNM_TareWeight)).toFixed(3);
            ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_GrossWeight = (parseInt($item.CNM_GrossWeight)).toFixed(3);
            ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_Height = (parseInt($item.CNM_Height)).toFixed(3);
            ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_Length = (parseInt($item.CNM_Length)).toFixed(3);
            ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_Width = (parseInt($item.CNM_Width)).toFixed(3);
            ContainerGridFormCtrl.ePage.Masters.Container.FormView.TotalHeight = (parseInt($item.CNM_Height)).toFixed(3);
            ContainerGridFormCtrl.ePage.Masters.Container.FormView.TotalLength = (parseInt($item.CNM_Length)).toFixed(3);
            ContainerGridFormCtrl.ePage.Masters.Container.FormView.TotalWidth = (parseInt($item.CNM_Width)).toFixed(3);
            ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_CubicCapacity = (parseInt($item.CNM_CubicCapacity)).toFixed(3);

        }

        function getSetNearByField(item, api, listSource) {
            var _filter = {
                ORG_FK: item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ContainerGridFormCtrl.ePage.Masters.DropDownMasterListAddress[listSource].ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function defaultContType() {
            var _filter = {
                PK: ContainerGridFormCtrl.ePage.Masters.Container.FormView.RC
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstContainer.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.MstContainer.API.FindLookup.DBObjectName
            };
            if (_filter.PK != null) {
                apiService.post("eAxisAPI", appConfig.Entities.MstContainer.API.FindLookup.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        var $item = response.data.Response[0]
                        ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_TareWeight = (parseInt($item.CNM_TareWeight)).toFixed(3);
                        ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_GrossWeight = (parseInt($item.CNM_GrossWeight)).toFixed(3);
                        ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_Height = (parseInt($item.CNM_Height)).toFixed(3);
                        ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_Length = (parseInt($item.CNM_Length)).toFixed(3);
                        ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_Width = (parseInt($item.CNM_Width)).toFixed(3);
                        ContainerGridFormCtrl.ePage.Masters.Container.FormView.CNM_CubicCapacity = (parseInt($item.CNM_CubicCapacity)).toFixed(3);
                        UpdateMeasures('CNM_Height', 'TotalHeight', 'OverhangHeight');
                        UpdateMeasures('CNM_Width', 'TotalWidth', 'OverhangWeight', 'OnFileLeft')
                        UpdateMeasures('CNM_Length', 'TotalLength', 'OverhangLength', 'OverhangFront');
                        UpdateBackLeft('OverhangFront', 'OverhangBack', 'OverhangLength');
                        UpdateBackLeft('OnFileLeft', 'OverhangRight', 'OverhangWeight');

                    } else {
                        console.log("Empty Response");
                    }
                });
            }

        }

        function dynamicOrgAddressFetch() {
            var dynamicFindAllOrgAddressInput = [{
                "OAD_DeliverEmptyToAddressFK": ContainerGridFormCtrl.ePage.Masters.Container.FormView.DeliverEmptyToFK
            }, {
                "OAD_PickUpEmptyFromAddressFK": ContainerGridFormCtrl.ePage.Masters.Container.FormView.PickUpEmptyFromFK
            }];
            var dynamicFindAllInputBuild = []
            dynamicFindAllOrgAddressInput.map(function (value, key) {

                if (value[Object.keys(value).join()] !== null) {
                    dynamicFindAllInputBuild.push({
                        "FieldName": Object.keys(value).join(),
                        "value": value[Object.keys(value).join()]
                    })
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInputBuild,
                "FilterID": appConfig.Entities.OrgAddress.API.DynamicFindAll.FilterID
            };
            if (dynamicFindAllInputBuild.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.DynamicFindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        dynamicFindAllInputBuild.map(function (value, key) {
                            ContainerGridFormCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].ListSource = response.data.Response[value.FieldName];
                        });
                    }
                });
            }
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "ContainerConCommodity_3258,ContainerConPickupEmptyFromCode_2972,ContainerConDeliverEmptyToCode_2971,ContainerConType_3259",
                SAP_FK: authService.getUserInfo().AppPK,
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

        function CheckValid(ContainerNo) {
            if (ContainerNo) {
                var validator = new ContainerValidator();
                var isvalid = validator.isValid(ContainerNo);
                var valMsgs = validator.getErrorMessages();
                var valMsgsTxt = valMsgs.join(', ');
                var msg = ""
                if (isvalid == false) {
                    msg = valMsgsTxt + '.';
                    if (valMsgs.indexOf('The check digit does not match') != -1) {
                        msg += ' Check digit must be ' + validator.createCheckDigit(ContainerNo.substr(0, 10)) + '.';
                    }
                    _.filter(ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.ErrorCodeList, {
                        'Code': "W0006"
                    })[0].Message = msg;
                    //ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Consol', ContainerGridFormCtrl.refCode + "Container", false, 'W0006', false)
                } else {
                    _.filter(ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.ErrorCodeList, {
                        'Code': "W0006"
                    })[0].Message = ContainerGridFormCtrl.ePage.Masters.copy;
                    //ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Consol', ContainerGridFormCtrl.refCode + "Container", true, 'W0006', false)
                }
            } else {
                _.filter(ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.ErrorCodeList, {
                    'Code': "W0006"
                })[0].Message = ContainerGridFormCtrl.ePage.Masters.copy;
                //ContainerGridFormCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Consol', ContainerGridFormCtrl.refCode + "Container", false, 'W0006', false)
            }
        }


        function ContainerValidator() {

            /**
             * @functions list
             *
             * isValid()
             * validate()
             * getErrorMessages()
             * createCheckDigit()
             * clearErrors()
             * buildCheckDigit()
             * identify()
             *
             **/

            this.alphabetNumerical = {
                'A': 10,
                'B': 12,
                'C': 13,
                'D': 14,
                'E': 15,
                'F': 16,
                'G': 17,
                'H': 18,
                'I': 19,
                'J': 20,
                'K': 21,
                'L': 23,
                'M': 24,
                'N': 25,
                'O': 26,
                'P': 27,
                'Q': 28,
                'R': 29,
                'S': 30,
                'T': 31,
                'U': 32,
                'V': 34,
                'W': 35,
                'X': 36,
                'Y': 37,
                'Z': 38
            };
            this.pattern = /^([A-Z]{3})(U|J|Z)(\d{6})(\d)$/;
            this.patternWithoutCheckDigit = /^([A-Z]{3})(U|J|Z)(\d{6})$/;
            this.errorMessages = [];
            this.ownerCode = [];
            this.productGroupCode;
            this.registrationDigit = [];
            this.checkDigit;
            this.containerNumber;

            /**
             * Check if the container has a valid container code
             *
             * @return boolean
             */
            this.isValid = function (containerNumber) {
                var valid = this.validate(containerNumber);
                if (this.empty(this.errorMessages)) {
                    return true;
                }
                return false;
            }

            this.validate = function (containerNumber) {
                this.matches = [];

                if (!this.empty(containerNumber) && this.is_string(containerNumber)) {
                    this.matches = this.identify(containerNumber);

                    if (this.count(this.matches) !== 5) {
                        this.errorMessages.push('The container number is invalid');
                    } else {
                        var checkDigit = this.buildCheckDigit(this.matches);

                        if (this.checkDigit != checkDigit) {
                            this.errorMessages.push('The check digit does not match');
                            this.matches = [];
                        }
                    }
                } else {
                    this.errorMessages = {
                        0: 'The container number must be a string'
                    };
                }
                return this.matches;
            }

            this.getErrorMessages = function () {
                return this.errorMessages;
            }

            this.createCheckDigit = function (containerNumber) {
                var checkDigit = -1;
                if (!this.empty(containerNumber) && this.is_string(containerNumber)) {
                    this.matches = this.identify(containerNumber, true);

                    if (this.count(this.matches) !== 4 || (this.matches[4])) {
                        this.errorMessages.push('Invalid container number');
                    } else {
                        checkDigit = this.buildCheckDigit(this.matches);
                        if (checkDigit < 0) {
                            this.errorMessages.push('Invalid container number');
                        }
                    }
                } else {
                    this.errorMessages.push('Container number must be a string');
                }
                return checkDigit;
            }

            this.clearErrors = function () {
                this.errorMessages = [];
            }

            this.buildCheckDigit = function (matches) {

                if ((matches[1])) {
                    this.ownerCode = this.str_split(matches[1]);
                }
                if ((matches[2])) {
                    this.productGroupCode = matches[2];
                }
                if ((matches[3])) {
                    this.registrationDigit = this.str_split(matches[3]);
                }
                if ((matches[4])) {
                    this.checkDigit = matches[4];
                }

                // convert owner code + product group code to its numerical value
                var numericalOwnerCode = [];
                for (var i = 0; i < this.count(this.ownerCode); i++) {
                    numericalOwnerCode[i] = this.alphabetNumerical[this.ownerCode[i]];
                }
                numericalOwnerCode.push(this.alphabetNumerical[this.productGroupCode]);

                // merge numerical owner code with registration digit
                var numericalCode = this.array_merge(numericalOwnerCode, this.registrationDigit);
                var sumDigit = 0;

                // check six-digit registration number and last check digit
                for (var i = 0; i < this.count(numericalCode); i++) {
                    sumDigit += numericalCode[i] * Math.pow(2, i);
                }

                var sumDigitDiff = Math.floor(sumDigit / 11) * 11;
                var checkDigit = sumDigit - sumDigitDiff;
                return (checkDigit == 10) ? 0 : checkDigit;
            }

            this.identify = function (containerNumber, withoutCheckDigit) {
                //SHS set default values for params
                var withoutCheckDigit = typeof withoutCheckDigit !== 'undefined' ? withoutCheckDigit : false;

                this.clearErrors();

                if (withoutCheckDigit) {
                    this.matches = this.preg_match(this.patternWithoutCheckDigit, this.strtoupper(containerNumber));
                } else {
                    this.matches = this.preg_match(this.pattern, this.strtoupper(containerNumber));
                }
                return this.matches;
            }

            //SHS Helper functions
            this.is_string = function (param) {
                return typeof param == 'string' ? true : false;
            }

            this.preg_match = function (pattern, string) {
                var regex = new RegExp(pattern);
                return regex.exec(string);
            }

            this.strtoupper = function (string) {
                return string.toUpperCase();
            }

            this.count = function (array) {
                if (array == null) {
                    return 0;
                } else {
                    return array.length;
                }
            }

            this.str_split = function (string, split_length) {
                //   example 1: str_split('Hello Friend', 3);
                //   returns 1: ['Hel', 'lo ', 'Fri', 'end']

                if (split_length == null) {
                    split_length = 1;
                }
                if (string == null || split_length < 1) {
                    return false;
                }
                string += '';
                var chunks = [],
                    pos = 0,
                    len = string.length;
                while (pos < len) {
                    chunks.push(string.slice(pos, pos += split_length));
                }

                return chunks;
            }

            this.array_merge = function () {
                //   example 1: arr1 = {"color": "red", 0: 2, 1: 4}
                //   example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
                //   example 1: array_merge(arr1, arr2)
                //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
                //   example 2: arr1 = []
                //   example 2: arr2 = {1: "data"}
                //   example 2: array_merge(arr1, arr2)
                //   returns 2: {0: "data"}

                var args = Array.prototype.slice.call(arguments),
                    argl = args.length,
                    arg,
                    retObj = {},
                    k = '',
                    argil = 0,
                    j = 0,
                    i = 0,
                    ct = 0,
                    toStr = Object.prototype.toString,
                    retArr = true;

                for (i = 0; i < argl; i++) {
                    if (toStr.call(args[i]) !== '[object Array]') {
                        retArr = false;
                        break;
                    }
                }

                if (retArr) {
                    retArr = [];
                    for (i = 0; i < argl; i++) {
                        retArr = retArr.concat(args[i]);
                    }
                    return retArr;
                }

                for (i = 0, ct = 0; i < argl; i++) {
                    arg = args[i];
                    if (toStr.call(arg) === '[object Array]') {
                        for (j = 0, argil = arg.length; j < argil; j++) {
                            retObj[ct++] = arg[j];
                        }
                    } else {
                        for (k in arg) {
                            if (arg.hasOwnProperty(k)) {
                                if (parseInt(k, 10) + '' === k) {
                                    retObj[ct++] = arg[k];
                                } else {
                                    retObj[k] = arg[k];
                                }
                            }
                        }
                    }
                }
                return retObj;
            }

            this.empty = function (mixed_var) {
                //   example 1: empty(null);
                //   returns 1: true
                //   example 2: empty(undefined);
                //   returns 2: true
                //   example 3: empty([]);
                //   returns 3: true
                //   example 4: empty({});
                //   returns 4: true
                //   example 5: empty({'aFunc' : function () { alert('humpty'); } });
                //   returns 5: false

                var undef, key, i, len;
                var emptyValues = [undef, null, false, 0, '', '0'];

                for (i = 0, len = emptyValues.length; i < len; i++) {
                    if (mixed_var === emptyValues[i]) {
                        return true;
                    }
                }

                if (typeof mixed_var === 'object') {
                    for (key in mixed_var) {
                        //if (mixed_var.hasOwnProperty(key)) {
                        return false;
                        //}
                    }
                    return true;
                }

                return false;
            }
        }

        Init();
    }
})();