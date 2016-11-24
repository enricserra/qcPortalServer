module.exports = function(app) {

    app.get( '/family' , function (req, res) {
      res.render( 'reviewFamilies.pug' );
    });

    app.get( '/staging' , function (req, res) {
      res.render( 'stagingArea.pug' );
    });

    app.get( '/archive' , function (req, res) {
      res.render( 'archive.pug' );
    });

};

