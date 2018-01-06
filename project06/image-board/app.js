//app.js
const express = require('express');
const app = express();
const db = require('./db');
const mongoose = require('mongoose');
const Image = mongoose.model('Image');
const ImagePost = mongoose.model('ImagePost');
const bodyParser = require('body-parser');

//error setting global variable
let error = false;

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');


app.get('/image-posts',(req,res)=>{

	ImagePost.find((err,posts,count)=>{


		if(posts.length === 0){
			res.render('image-form');
		}

		else{

			if(err){
				
				res.render('image-form',{'posts':posts,'err':error});
				
			}
			else{
				res.render('image-form',{'posts':posts,'err':error});
			}
			

		}


	});

});

app.post('/image-posts',(req,res)=>{

	const body = req.body;

	if(body.title === '' || body.title === undefined){
		console.log('Error no title for image post');
		error = true;
		res.redirect('/image-posts');
	}
	else{
		const newImagePost = new ImagePost({'title':body.title});

		for(let i=1; i<4; i++){

			const url = body['url'+i];

			const caption = body['caption'+i];

			if((url !== '') || (caption !== '')){
				const newImage = new Image({'caption':caption,'url':url});
				newImagePost.images.push(newImage);
			}

		}

		newImagePost.save((err)=>{

			if(err){
				error = true;
				res.redirect('image-posts');
			}
			else{
				error = false
				res.redirect('image-posts');
			}
		});
	}

});


app.get('/image-posts/:slug',(req,res)=>{


	const slug = req.params.slug;

	ImagePost.findOne({'slug':slug},(err,post,count)=>{

		res.render('single-post',{'post':post});

	});

});


app.post('/add-img:slug',(req,res)=>{

	const slug = req.params.slug.slice(1,req.params.slug.length);
	

	const url = req.body.url;
	const caption = req.body.caption;

	const newImage = new Image({'caption':caption,'url':url});

	ImagePost.findOneAndUpdate({'slug':slug},{$push:{images:newImage}},(err,post)=>{


		res.redirect('/image-posts/'+slug);					

	});

});


app.post('/del-img:slug',(req,res)=>{

	const slug = req.params.slug.slice(1,req.params.slug.length);

	const checkedIds = Object.keys(req.body);


	for(let i=0;i<checkedIds.length;i++){

		ImagePost.findOneAndUpdate({'slug':slug},{$pull:{images: {_id:checkedIds[i]}}},{ 'new': true },(err)=>{

			if(err){
				console.log(err);
			}
			else{
				console.log('Removed id: '+checkedIds[i]);
			}
		})
	}

	res.redirect('/image-posts/'+slug);


});














app.listen(3000);