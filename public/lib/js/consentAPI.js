var consentAPI = (function() {
    return {
        /**
         *
         * The base server URL
         * @type {string}
         *
         */
        baseUrl:"http://10.0.64.80:8800/",

        /**
         * Get status of consent for an LPNumber (true/false)
         *
         * @param {string} LPNumber the LPNumber we want to check (sequencing identifier in GEL)
         */
        checkLPNumberConsent: function(LPNumber) {
            jQuery.ajax({
                dataType: "json",
                url: consentAPI.baseUrl + LPNumber,
                success: function(r) {
                    if (r !== true) {
                        alert("Response for sample " + LPNumber + " is NOT CONSENT ( " + r + " ) " +
                            " please check the consent table")
                    }
                    consentAPI.showConsentInDom(LPNumber, r);
                },
                error: function(err) {
                    alert(JSON.stringify(err));
                }
            });
        },

        /**
         * Pastes consent information in the DOM
         *
         * @param {string} LPNumber the LPNumber
         * @param {boolean} consent true or false for the consent response
         */
        //TODO, change this mess for jQuery
        showConsentInDom : function(LPNumber, consent) {
            document.getElementById("consentStatus").appendChild(
                domMethods.createDomElement("a",  {"href" : consentAPI.baseUrl + LPNumber,
                    "target": "_blank","innerHTML" : "<b> " + LPNumber + " CONSENT :</b>" + consent +"<br>"})
            )
        }
    }
})();
