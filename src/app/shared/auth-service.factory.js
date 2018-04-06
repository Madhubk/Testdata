(function () {
    "use strict";

    angular
        .module("Application")
        .factory("authService", AuthService);

    AuthService.$inject = ["$localStorage", "$timeout", "$state", "APP_CONSTANT"];

    function AuthService($localStorage, $timeout, $state, APP_CONSTANT) {
        var authService = {
            getUserInfo: GetUserInfo,
            setUserInfo: SetUserInfo,
            clearLocalStorage: ClearLocalStorage
        };

        return authService;

        function SetUserInfo(data) {
            if (typeof (Storage) !== "undefined") {
                $localStorage.UserInfo = data;
            }
        }

        function GetUserInfo() {
            var UserInfo = {};
            if (typeof (Storage) !== "undefined" && $localStorage.UserInfo != undefined) {
                UserInfo = JSON.parse(EncryptData($localStorage.UserInfo));
            }
            return UserInfo;
        }

        function EncryptData(input) {
            // Encrypt Data
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Hex.parse(input)
            });
            var cipherParams = CryptoJS.AES.decrypt(
                cipherParams,
                APP_CONSTANT.Crypto.key, {
                    iv: APP_CONSTANT.Crypto.iv
                });
            var _descrString = cipherParams.toString(CryptoJS.enc.Utf8);

            return _descrString;
        }

        function ClearLocalStorage() {
            $localStorage.$reset();
        }
    }
})();
