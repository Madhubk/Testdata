(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynMultiDashboardController", DynMultiDashboardController);

    DynMultiDashboardController.$inject = ["helperService", "authService", "apiService", "appConfig"];

    function DynMultiDashboardController(helperService, authService, apiService, appConfig) {
        /* jshint validthis: true */
        var DynMultiDashboardCtrl = this;

        function Init() {
            DynMultiDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_Multiple_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitTab();
        }

        function InitTab() {
            DynMultiDashboardCtrl.ePage.Masters.Tab = {};

            if (DynMultiDashboardCtrl.pageType && DynMultiDashboardCtrl.parentMenu) {
                GetTabList();
            }
        }

        function GetTabList() {
            DynMultiDashboardCtrl.ePage.Masters.Tab.ListSource = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "PageType": DynMultiDashboardCtrl.pageType,
                "ParentMenu": DynMultiDashboardCtrl.parentMenu,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynMultiDashboardCtrl.ePage.Masters.Tab.ListSource = response.data.Response;
                } else {
                    DynMultiDashboardCtrl.ePage.Masters.Tab.ListSource = [];
                }
            });
        }

        function CryptoTest() {
            var _key = CryptoJS.enc.Base64.parse("2b7e151628aed2a6abf7158809cf4f3c");
            var _iv = CryptoJS.enc.Base64.parse("3ad77bb40d7a3660a89ecaf32466ef97");
            // var _input = 'Encryption';
            var _input = JSON.stringify(authService.getUserInfo());

            console.log('source String = ' + _input);
            var encrypted = CryptoJS.AES.encrypt(
                _input,
                _key, {
                    iv: _iv
                });
            console.log('encrypted = ' + encrypted);

            var _cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
            console.log('ciphertext = ' + _cipherText);

            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Hex.parse(_cipherText)
            });
            var cipherParams = CryptoJS.AES.decrypt(
                cipherParams,
                _key, {
                    iv: _iv
                });
            var _descrString = cipherParams.toString(CryptoJS.enc.Utf8);
            console.log('decrypted = ' + _descrString);

            debugger
        }

        function CryptoTest2() {
            // var hash1 = CryptoJS.MD5("Message");
            // var hash2 = CryptoJS.SHA1("Message");
            // var hash3 = CryptoJS.SHA256("Message");

            // var Base64 = hash3.toString(CryptoJS.enc.Base64);
            // var Hex = hash3.toString(CryptoJS.enc.Hex);
            // var Latin1 = hash3.toString(CryptoJS.enc.Latin1);

            // var sha256 = CryptoJS.algo.SHA256.create();
            // sha256.update("Message Part 1");
            // sha256.update("Message Part 2");
            // sha256.update("Message Part 3");
            // var hash4 = sha256.finalize().toString(CryptoJS.enc.Base64);

            // var hash5 = CryptoJS.HmacMD5("Message", "Secret Passphrase").toString(CryptoJS.enc.Base64);
            // var hash6 = CryptoJS.HmacSHA1("Message", "Secret Passphrase").toString(CryptoJS.enc.Base64);
            // var hash7 = CryptoJS.HmacSHA256("Message", "Secret Passphrase").toString(CryptoJS.enc.Base64);
            // var hash8 = CryptoJS.HmacSHA512("Message", "Secret Passphrase").toString(CryptoJS.enc.Base64);

            // var salt = CryptoJS.lib.WordArray.random(128 / 8);
            // var key128Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
            //     keySize: 128 / 32
            // }).toString(CryptoJS.enc.Base64);
            // var key256Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
            //     keySize: 256 / 32
            // }).toString(CryptoJS.enc.Base64);
            // var key512Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
            //     keySize: 512 / 32
            // }).toString(CryptoJS.enc.Base64);
            // var key512Bits1000Iterations = CryptoJS.PBKDF2("Secret Passphrase", salt, {
            //     keySize: 512 / 32,
            //     iterations: 1000
            // }).toString(CryptoJS.enc.Base64);

            // var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase").key;
            // var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");


            // var words = CryptoJS.enc.Base64.parse('SGVsbG8sIFdvcmxkIQ==');
            // var base64 = CryptoJS.enc.Base64.stringify(words);
            // var words = CryptoJS.enc.Latin1.parse('Hello, World!');
            // var latin1 = CryptoJS.enc.Latin1.stringify(words);
            // var words = CryptoJS.enc.Hex.parse('48656c6c6f2c20576f726c6421');
            // var hex = CryptoJS.enc.Hex.stringify(words);
            // var words = CryptoJS.enc.Utf8.parse('𤭢');
            // var utf8 = CryptoJS.enc.Utf8.stringify(words);
            // var words = CryptoJS.enc.Utf16.parse('Hello, World!');
            // var utf16 = CryptoJS.enc.Utf16.stringify(words);
            // var words = CryptoJS.enc.Utf16LE.parse('Hello, World!');
            // var utf16 = CryptoJS.enc.Utf16LE.stringify(words);




            // var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase").key.toString(CryptoJS.enc.Hex);
            var encrypted = CryptoJS.SHA256("Message").toString(CryptoJS.enc.Hex);
            var words = CryptoJS.enc.Hex.parse(encrypted);
            var hex = CryptoJS.enc.Hex.stringify(words);
            debugger;
        }

        // CryptoTest();
        // CryptoTest2();
        Init();
    }
})();
