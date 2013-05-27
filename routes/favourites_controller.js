var models = require('../models/models.js');
var count = require('../modules/count');

// GET /users/25/favourites
exports.index = function(req, res, next) {

  // Busqueda del array de posts favoritos de un usuario
console.log("index!!!!!!!!!!!!!!!");
  models.Favourite.findAll({where: {userId: req.user.id}}).success(function(favourites) {

         // generar array con postIds de los post favoritos

         var postIds = favourites.map( function(favourite){return favourite.postId;} );

        // busca los posts identificados por array postIds

        var patch;

        if (postIds.length == 0) {
          patch= '"Posts"."id" in (NULL)';
        } else {
          patch='"Posts"."id" in ('+postIds.join(',')+')';
        } 

        // busca los posts identificados por array postIds

        models.Post.findAll({order: 'updatedAt DESC',

          where: patch, 

          include:[{model:models.User,as:'Author'},
          models.Favourite ]
        })
        .success(function(posts) {

         console.log(posts);
         var format = req.params.format || 'html';
         format = format.toLowerCase();
         switch (format) { 
          case 'html':
          case 'htm':
          res.render('posts/index', {
            posts: posts,
            visitas: count.getCount() + 1
          });
          break;
          case 'json':
          res.send(posts);
          break;
          case 'xml':
          res.send(posts_to_xml(posts));
          break;
          case 'txt':
          res.send(posts.map(function(post) {
            return post.title+' ('+post.body+')';
          }).join('\n'));
          break;
          default:
          console.log('No se soporta el formato \".'+format+'\" pedido para \"'+req.url+'\".');
          res.send(406);
        }
      })
        .error(function(error) {
          next(error);
        });
  });
}


//PUT  /users/:userid/favourites/:postid
exports.put = function(req, res, next) {

  models.Favourite.findOrCreate({userId: req.session.user.id, postId: req.post.id}).success(function(favourite, created) {
    console.log(favourite.values);
    console.log(created);
    if(created){
      req.flash('success', 'Favorito creado con éxito.');
      res.redirect('/posts/'+ req.post.id);
      }else{
          res.redirect('/posts/'+ req.post.id);
        }
});

}
//DELETE  /users/:userid/favourites/:postid
exports.destroy = function(req, res, next) {

    models.Favourite.find({where: {userId: req.user.id, postId: req.post.id}}).success(function(favourite){

      favourite.destroy()
          .success(function() {
              req.flash('success', 'Favorito eliminado con éxito.');
              res.redirect('/posts/' + req.post.id );
          })
          .error(function(error) {
              next(error);
          });


    });

};
