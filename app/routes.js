module.exports = function(app) {

	app.get( '/home' , function (req, res) {
	  res.render( 'home.ejs' );
	});

    app.get( '/staging' , function (req, res) {
      res.render( 'familyView.ejs' );
    });


    app.get( '/archive' , function (req, res) {
      res.render( 'archive.ejs' );
    });

    app.get( '/family' , function (req, res) {
      res.render( 'familyView.ejs' );
    });


}
