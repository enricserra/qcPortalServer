module.exports = function(app) {
/*
	app.get( '/home' , function (req, res) {
	  res.render( 'home.ejs' );
	});

    app.get( '/staging' , function (req, res) {
      res.render( 'staging.ejs' );
    });


    app.get( '/archive' , function (req, res) {
      res.render( 'archive.ejs' );
    });
*/
    app.get( '/family' , function (req, res) {
      res.render( 'reviewFamilies.pug' );
    });
    app.get( '/staging' , function (req, res) {
      res.render( 'stagingArea.pug' );
    });
    app.get( '/archive' , function (req, res) {
      res.render( 'archive.pug' );
    });
    app.get( '/styles' , function (req, res) {
      res.render( 'styles.pug' );
    });
    app.get( 'menu' , function (req, res) {
      res.render( 'menu.pug' );
    });
    app.get( 'reviewTable' ), function (req, res) {
        res.render( 'tables/reviewTable.pug')
    };
    app.get( 'stagingTable' ), function (req, res) {
        res.render( 'tables/stagingTable.pug')
    };
/*
    app.get('/interpretationQc', function (req, res){
      res.render( 'interpretationQc.ejs' );
    }
    */
}

