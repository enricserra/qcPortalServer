var genePanel = (function() {
    return {

        /** @type {string} */
        baseUrl: "https://bioinfo.extge.co.uk/crowdsourcing/WebServices",

        /**
         * Url for searching genes
         *
         * @public
         */
        get geneSearchUrl() {return genePanel.baseUrl + "/search_genes/"},
        

        /**
         * Get gene panel info from panel app and place it in the DOM
         *
         * @public
         * @param {string} g geneSymbol to query in panel app
         */
        getGenePanelInfoPerGene: function(g) {
            jQuery.ajax({
                dataType: "json",
                url: "https://bioinfo.extge.co.uk/crowdsourcing/WebServices/search_genes/" + g + "/?",
                data: "data",
                success: function (res) {
                    genePanel._modifyDomUsingGenePanelInfo(g, res);
                }
            });
        },

        /**
         * Use gene panel query and place it in the DOM
         *
         * @private
         * @param {string} g geneSymbol used
         * @param {object} res object from querying panel app
         */
        _modifyDomUsingGenePanelInfo: function(g, res) {
            if(document.getElementById(g) === null && genePanel._hasDisease(res)) {
                document.getElementById("firstRow").appendChild(genePanel._createAssociatedDomElements(g));
                jsonVisualizer.JsonVis(res.results.map(genePanel._formatAndReturn), g, 0)

            }
        },

        /**
         * Create the dom elements associated with a gene pannel (wrapped in a td)
         *
         * @private
         * @param {string} g geneSymbol used
         */
        _createAssociatedDomElements: function(g) {
            var td = domMethods.createDomElement("td", {bgColor: "#7FFFD4", style : "vertical-align:top", "textContent" : g});
            td.appendChild(domMethods.createDomElement("div", {id : g }));
            return td;
        },

        /**
         * Check if a list of panels have the specific disease
         *
         * @private
         * @param {Object} r result element from the query
         */
        _hasDisease: function(r) {
            return ((r.results.filter(genePanel._hasSpecificDisease)).length > 0)
        },
        /**
         * Check if an element is in specific disease array (specificDISORDERLIST)
         *
         * @private
         * @param {Object} a result element from querying genePanel
         */
        _hasSpecificDisease : function(a) {
            return (specificDISORDERLIST.indexOf(a.SpecificDiseaseName) >-1);
        },

        /**
         * Use gene panel query and place it in the DOM
         *
         * @private
         * @param {Object} r result element from the query
         */
        _formatAndReturn: function (r) {
            return { SpecificDiseaseName: r.SpecificDiseaseName, version : r.version,
                    LevelOfConfidence: r.LevelOfConfidence, ModeOfInheritance: r.ModeOfInheritance + "<hr>" };
            //Logic for filtering by disease disabled
            //return (specificDISORDERLIST.indexOf(r.SpecificDiseaseName) !== -1) ?
                //({ SpecificDiseaseName: r.SpecificDiseaseName, version : r.version,
                    //LevelOfConfidence: r.LevelOfConfidence, ModeOfInheritance: r.ModeOfInheritance + "<hr>" })
                //: "";
        }
    }
})();

