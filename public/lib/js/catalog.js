var catalog = (function() {

    return {

        /**
         * The base url of catalog
         */
        baseUrl: "http://10.0.32.140:8080/opencga2",

        /**
         * Provides a url from an LP number to search for the bam in catalog
         *
         * @public
         * @param {string} n lpnumber of the sample for which we are looking for a path
         *
         */
        sampleName2BamFileSearchUrl:function(n) {
            return (catalog.baseUrl + "/webservices/rest/v1/files/search?sid=" +
            localStorage.catalogSessionId + "&bioformat=ALIGNMENT&studyId=2&name=" + n + ".bam&");
        },

        /**
         * Provides a url from an LP number to search for the sample in catalog
         *
         * @public
         * @param {string} n lpnumber of the sample for which we are looking for
         *
         */
        sampleName2SampleSearchUrl: function(n) {
            return (catalog.baseUrl + "/webservices/rest/v1/samples/search/?sid=" +
            localStorage.catalogSessionId + "&name=" + n + "&studyId=2");
        },

        /**
         * Provides a url from a sampleId to search for the tiering for that sample in catalog
         *
         * @public
         * @param {string} n lpnumber of the sample for which we are looking for
         *
         */
        sampleId2TieringSearchUrl: function(n) {
            return (catalog.baseUrl + "/webservices/rest/v1/files/search/?sid=" +
            localStorage.catalogSessionId + "&sampleIds=" + n + "&attributes.AnalysisType=Tiering&studyId=2");
        },

        /**
         * Provides a url from a tieringId to search for the tiering file for that id in catalog
         *
         * @public
         * @param {string} n tieringId  of the sample for which we are looking for
         *
         */
        tieringId2TieringfileIdSearchUrl: function(n) {
            return (catalog.baseUrl + "/webservices/rest/v1/files/" + n +
            "/content/?sid=" + localStorage.catalogSessionId + "&");
        },

        /**
         * Handles errors in ajax requests
         *
         * @public
         * @param {object} err error received from catalog
         * @param {object} res response received from catalog
         */
        ajaxError: function (err, res) {
            return (err && err.exception ? alert("Error: ERRINFO " + err.exception) :
                alert("Error: RESPONSEOBJ " + JSON.stringify(res)));
        },

        /**
         * makes an xmlhttp request
         *
         * @public
         * @param {string} url the url of the request
         * @param {object} then callback/promise for success
         * @param {object} err callback/promise for error
         */
        request: function (url, then, err) {
            jQuery.ajax({
                dataType: "json",
                url: url,
                success: then,
                error: err
            });
        },


        //TODO create a read only proper user for this, this user is almighty
        /**
         * makes an xmlhttp request to catalog for a login token
         *
         * @public
         */
        logToCatalog: function () {
            jQuery.ajax({
                dataType: "json",
                url: catalog.baseUrl + "/webservices/rest/v1/users/gel/login?password=GBc69mY9m86mSxv",
                data: "data",
                success: function (res) {
                    localStorage.catalogSessionId = res.response[0].result[0].sessionId;
                },
                error: catalog.ajaxError
            });
        },



        /**
         * goes from a sampleName (LPNumber) to pushing a bamfile path onto hiddenVars.bamPathsArray
         *
         * @public
         * @param {string} n lpnumber of the sample for which we are looking for a path
         *
         */
        sampleName2BamPath: function (n) {
            localStorage.catalogSessionId === "" ?
                setTimeout(function () {catalog.sampleName2BamPath(n)}, 1000) :
                catalog.request(catalog.sampleName2BamFileSearchUrl(n),
                    (function (response) { catalog.response2bampath(response) }), catalog.ajaxError);
        },

        /**
         * Uses the xmlhttp return and pushes a string of bam file path to the array bamPathsArray
         *
         * @public
         * @param {object} a object returned in the search catalog.request
         *
         */
        response2bampath: function (a) {
            hiddenVars.bamPathsArray.push(a.response[0].result[0].path);
        },


        /**
         * uses an LPNumber to get a catalogsampleId  (to get a tiering Id)
         *
         * @public
         * @param {string} n lpnumber of the sample for which we are looking for a path
         *
         */
        sampleName2CatalogSampleId: function (n) {
            localStorage.catalogSessionId === "" ? ( setTimeout(function () {
                catalog.sampleName2CatalogSampleId(n);}, 1000) ) :
                (catalog.request(catalog.sampleName2SampleSearchUrl(n), (function (response) {
                    catalog.sampleId2TieringId(response.response[0].result[0].id)
                }), catalog.ajaxError));

        },

        /**
         * uses a catalog sampleId to call tieringId2TieringFileId
         *
         * @public
         * @param {string} sampleId the sampleId in catalog
         *
         */
        sampleId2TieringId: function (sampleId) {
            catalog.request(catalog.sampleId2TieringSearchUrl(sampleId),
                (function (response) {
                    catalog.tieringId2tieringFileId(response.response[0].result[0].id)
                }),
                catalog.ajaxError);
        },


        /**
         * uses a catalog tieringId to get its fileId and call parseGelTieringVariants
         *
         * @public
         * @param {string} tieringId the tieringId in catalog
         *
         */
        tieringId2tieringFileId: function (tieringId) {
            catalog.request(catalog.tieringId2TieringfileIdSearchUrl(tieringId), (function (response) {
                    catalog.parseGelTieringVariants(response);
                })
                , catalog.ajaxError);
        },



        /**
         * maps to parseIfTier1orTier2Variant
         *
         * @public
         * @param {object} t the object returned when searching for tiering
         *
         */
        parseGelTieringVariants: function (t) {
            t.map(catalog.parseIfTier1orTier2Variant)
        },


        /**
         * Selects biologically relevant variants (tier1 or 2) to be displayed
         *
         * @public
         * @param {object} v a variant from tiering
         *
         */
        parseIfTier1orTier2Variant: function(v) {
            v["reportEvents"].map(
                function(x) {
                    return catalog.useTieredVariantReportEvent(x, v)
                });
        },


        /**
         * Creates the "schema" that will populate the dom for each variant
         *
         * @public
         * @param {object} v a variant from gelTiering in catalog
         * @param {object} s the schema with questions/answers for each variant
         *
         */
        createVariantTieringSchema: function(v, s) {
            var t = catalog.instantiateVariantSchema(v, s);
            t.fatherNode = {"name": "gelTieringQC", "graphName": "gelTieringQC"};
            return t;
        },

        /**
         * Creates the "View" button for a variant
         *
         * @private
         * @param {object} v variant object as defined in catalog/interpreted genome
         *
         */
        _createVariantButton: function(v) {
            return (domMethods.createDomElement("button", {"innerHTML" : "VIEW",
                "value" : "[\"" + v["chromosome"] + "\"," + v["position"] + "];" + "samples=", "onclick" :
                    function () {
                        genomeBrowser.viewPredefinedVariant(this)
                    }}));
        },

        /**
         * Creates the container for a variant
         *
         * @private
         * @param {object} v variant object as defined in catalog/interpreted genome
         * @param {object} e reportedEvent associated with this variant
         *
         */
        _createVariantContainer: function(v, e){
            return document.getElementById(e.genomicFeature.ids.HGNC +
                "  CHR :" + v.chromosome + " POS : " + v.position + " REF: " +
                v.reference + " ALT : " + v.alternate);
        },

        /**
         * Creates the text for a variant
         *
         * @private
         * @param {object} e reportedEvent associated with this variant
         *
         */
        _createVariantParagraph: function(e){
            return domMethods.createDomElement("p", {innerHTML : "<br<br>" + e.eventJustification + "<br><br>"});
        },

        /**
         * Uses a tiered variant to create the DOM stuff (container,
         *
         * @private
         * @param {object} e reportedEvent associated with this variant
         * @param {object} v tiered variant from catalog
         *
         */
        useTieredVariantReportEvent: function(e, v) {
            if (catalog.isTier1orTier2(e) && catalog.hasNotBeenCreated(v, "gelTieringQC")) {
                var s = new AvroSchema(catalog.createVariantTieringSchema(v, gelTieringVariantSchema));
                s.fatherNode = {"name": "gelTieringQC", "graphName": "gelTieringQC"};
                s.performActions;
                var container = catalog._createVariantContainer(v, e);
                container.appendChild(catalog._createVariantButton(v));
                container.appendChild(catalog._createVariantParagraph(e));

                genePanel.getGenePanelInfoPerGene(e.genomicFeature.ids.HGNC);
                var myNodes = document.getElementById("gelTieringQC").childNodes;
                for (var i = 2; i < myNodes.length; i = i + 3) {
                    myNodes[i].click()
                }
            }

        },

        /**
         * Check if a variant DOM items have already been created
         * Can not use map because dom elements are not array prototypes (don't have the method)
         *
         * @private
         * @param {object} v variant object as defined in catalog tiering
         * @param {object} id id of where it is goind to be created
         *
         */
        hasNotBeenCreated: function (v, id) {
            var father = document.getElementById(id);
            for (var i = 0; i < father.childNodes.length; i++) {
                if (father.childNodes[i].id === catalog.createIdFromVariant(v)) {
                    return false
                }
            }
            return true;
        },

         /**
         * Creates an id in the DOM for the variant
         *
         * @private
         * @param {object} v variant object as defined in catalog tiering
         *
         */
        createIdFromVariant: function (v) {
            return (v.reportEvents[0].genomicFeature.ids.HGNC + "  CHR :" + v.chromosome + " POS : " + v.position +
                " REF: " + v.reference + " ALT : " + v.alternate);
        },

        /**
         * Check if a variant is tier1 or 2
         *
         * @private
         * @param {object} v variant object as defined in catalog tiering
         *
         */
        isTier1orTier2: function (v) {
            return (v.tier === "TIER1" || v.tier === "TIER2");
        },

        /**
         * Creates an instance of avroSchema for a variant
         *
         * @private
         * @param {object} v variant object as defined in catalog tiering
         * @param {object} s schema according to the avro schema definition
         *
         */
        instantiateVariantSchema: function (v, s) {
            var returnSchema = s;
            returnSchema.name = v.reportEvents[0].genomicFeature.ids.HGNC + "  CHR :" + v.chromosome +
                " POS : " + v.position + " REF: " + v.reference + " ALT : " + v.alternate;
            returnSchema.fatherNode = {"name": "Interpretation QC", "graphName": "interpretationQC"};
            return returnSchema;
        }
    };
})();
