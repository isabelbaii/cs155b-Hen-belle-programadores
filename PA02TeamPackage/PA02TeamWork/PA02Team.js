/*
Game 0
This is a ThreeJS program which implements a simple game
The user moves a cube around the board trying to knock balls into a cone

*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, edgeCam;  // we have two cameras in the main scene
	var avatar;
	var suzanne;
	var brs;   //big red sphere
	// here are some mesh objects ...

	var cone;
	var npc;
	var npcKiller; //Jerry's
  var torusKnot; //ISABEL'S
  var box; //Frank's
  var coneNew;//Richard's
  var josue; //Josue's


	var endScene, endCamera, endText, loseText, loseScene, initialPicture, initialText;





	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false, rotateToLeft:false, rotateToRight:false,
		    avatarCamAngle:Math.PI}

	var gameState =
	     {score:0, health:3, scene:'main', camera:'none' }


	// Here is the main game control
	gameState.scene = 'initialPicture';
  init(); //
	initControls();
	animate();  // start the animation loop!




	function createEndScene(){
		endScene = initScene();
		loseScene = initScene();
		initialPicture = initScene();

		endText = createSkyBox('youwon.png',10);
		loseText = createSkyBox('youlose.png',10);
		initialText = createSkyBox('initialPicture.png',10);
		//endText.rotateX(Math.PI);
		endScene.add(endText);
		loseScene.add(loseText);
		initialPicture.add(initialText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		endScene.add(light1);
		var light2 = createPointLight();
		light1.position.set(0,200,20);
		loseScene.add(light2);
		var light3 = createPointLight();
		light1.position.set(0,200,20);
		initialPicture.add(light3);
		endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		endCamera.position.set(0,50,1);
		endCamera.lookAt(0,0,0);

	}

	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createEndScene();
			initRenderer();
			createMainScene();
	}


	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,50,0);
			camera.lookAt(0,0,0);



			// create the ground and the skybox
			var ground = createGround('grass.png');
			scene.add(ground);
			var skybox = createSkyBox('sky.jpg',1);
			scene.add(skybox);

			// create the avatar
			/*
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			avatar = createAvatar();
			avatar.translateY(20);
			avatarCam.translateY(-4);
			avatarCam.translateZ(3);
			scene.add(avatar);
			gameState.camera = avatarCam;
			*/

      edgeCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
      edgeCam.position.set(20,20,10);


			addBalls();

			cone = createConeMesh(4,6);
			cone.position.set(10,3,7);
			scene.add(cone);

      coneNew = createConeMesh3(3,12);
			coneNew.position.set(30,7,0);
			coneNew.setAngularVelocity(new THREE.Vector3(0,controls.speed*1,0));
			scene.add(coneNew);

			cone2 = createConeMesh2(3,12);
			cone2.position.set(30,18,0);
			cone2.rotateX(Math.PI);
			scene.add(cone2);



			npc = createBoxMesh2(0x0000ff,1,2,4);
			npc.position.set(30,5,-30);
      npc.addEventListener('collision',function(other_object){
        if (other_object==avatar){
					gameState.health--;
					npc.__dirtyPosition = true;
		      npc.position.set(60,10,10);

					if(gameState.health == 0){
						gameState.scene = 'youlose';
					}
        }


      })
			scene.add(npc);

			brs = createBouncyRedSphere();
			brs.position.set(-40,40,40);
			scene.add(brs);
			console.log('just added brs');
			console.dir(brs);

      //Frank's
			box = createBouncyYellowCube();
			box.position.set(-30,6,30);
			scene.add(box);
			console.log('just added box');
			console.dir(box);

      josue = createjosueBall(5,10);
			josue.position.set(15,5,2);
			scene.add(josue);
			josue.translateY(50);
			josue.rotateZ(-Math.PI/2);
			josue.__dirtyPosition = true;
			josue.__dirtyRotation = true;
			josue.setAngularVelocity(new THREE.Vector3(0,10,0));
			josue.setLinearVelocity(new THREE.Vector3(0,0,0));


			var platform = createRedBox();
			platform.position.set(0,50,0);
			platform.__dirtyPosition==true;
			scene.add(platform);

      var wall = createWall(0xffaa00,50,3,1);
      wall.position.set(10,0,10);
      scene.add(wall);
			//console.dir(npc);
			//playGameMusic();

			//playGameMusic();

			npcKiller = createNPCKiller(0xffaa00,1,2,4);
			npcKiller.position.set(20,5,-30);
			npcKiller.addEventListener('collision',function(other_object){
        if (other_object==npc){
					gameState.health -= 2;
					npc.__dirtyPosition = true;
		      npc.position.set(20,5,10);

					if(gameState.health == 0){
						gameState.scene = 'youlose';
					}
        }
      })
			scene.add(npcKiller);

      //ISABEl//
      torusKnot = createTorusKnot(0xffaa00,3,.75,10);
      torusKnot.position.set(30,30,-20);
      torusKnot.addEventListener('collision',function(other_object){
        if (other_object == torusKnot){
          gameState.score += 1;
          torusKnot.__dirtyPosition = true;
          torusKnot.position.set(30,10,20);
      }

    })
    scene.add(torusKnot);

			function createRedBox(){
				var geometry = new THREE.BoxGeometry( 10, 2, 10);
				var material = new THREE.MeshLambertMaterial( { color: 0xff0000} );
				mesh = new Physijs.BoxMesh( geometry, material, 0);
		    //mesh = new Physijs.BoxMesh( geometry, material,0 );
				mesh.castShadow = true;
				return mesh;
			}

			function createBouncyRedSphere(){
				//var geometry = new THREE.SphereGeometry( 4, 20, 20);
				var geometry = new THREE.SphereGeometry( 5, 16, 16);
				var material = new THREE.MeshLambertMaterial( { color: 0xff0000} );
				var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
				var mass = 10;
		    var mesh = new Physijs.SphereMesh( geometry, pmaterial, mass );
				mesh.setDamping(0.1,0.1);
				mesh.castShadow = true;

				mesh.addEventListener( 'collision',
					function( other_object, relative_velocity, relative_rotation, contact_normal ) {
						if (other_object==avatar){
							console.log("avatar hit the big red ball");
							soundEffect('bad.wav');
							gameState.health = gameState.health - 1;
							if(gameState.health == 0){
								gameState.scene ='youlose';
							}
						}
					}
				)

				return mesh;

			}

      function createBouncyYellowCube(){
      //var geometry = new THREE.SphereGeometry( 4, 20, 20);
      var geometry = new THREE.BoxGeometry( 5, 5, 5);
      var material = new THREE.MeshLambertMaterial( { color: 0xf4ec07} );
      var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
      var mass = 10;
      var mesh = new Physijs.SphereMesh( geometry, pmaterial, mass );
      mesh.setDamping(0.1,0.1);
      mesh.castShadow = true;

      mesh.addEventListener( 'collision',
        function( other_object, relative_velocity, relative_rotation, contact_normal ) {
          if (other_object==avatar){
            console.log("avatar hit the big yellow Cube");
            soundEffect('bad.wav');
            gameState.health = gameState.health - 1;
            if(gameState.health == 0){
              gameState.scene ='youlose';
            }
          }
        }
      )

      return mesh;

    }
			initSuzanneJSON();
			//initSuzanneOBJ();

	}




	function randN(n){
		return Math.random()*n;
	}




	function addBalls(){
		var numBalls = 1;


		for(i=0;i<numBalls;i++){
			var ball = createBall();
			ball.position.set(randN(20)+15,30,randN(20)+15);
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==cone){
						console.log("ball "+i+" hit the cone");
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						gameState.health += 1;
						if (gameState.score==numBalls) {
							gameState.scene='youwon';
						}
            //scene.remove(ball);  // this isn't working ...
						// make the ball drop below the scene ..
						// threejs doesn't let us remove it from the schene...
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}
          else if (other_object == cone){
            gameState.health +=1;
          }else if(other_object == avatar){
						gameState.health += 1;
					}
				}
			)
		}
	}



	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/'+file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}



	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function initSuzanneJSON(){
		//load the monkey avatar into the scene, and add a Physics mesh and camera
		var loader = new THREE.JSONLoader();
		loader.load("../models/suzanne.json",
					function ( geometry, materials ) {
						console.log("loading suzanne");
						var material = //materials[ 0 ];
						new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
						//geometry.scale.set(0.5,0.5,0.5);
						suzanne = new Physijs.BoxMesh( geometry, material );

						avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
						gameState.camera = avatarCam;

						avatarCam.position.set(0,6,-15);
						avatarCam.lookAt(0,4,10);
						suzanne.add(avatarCam);
						suzanne.position.set(-40,20,-40);
						suzanne.castShadow = true;
						scene.add( suzanne  );
						avatar=suzanne;
					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
					function(err){console.log("error in loading: "+err);}
				)
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createNPCKiller(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

  /**
		Isabel's
	*/
	function createTorusKnot(color, w, h, d){
		var geometry = new THREE.TorusKnotGeometry (w,h,d);
		var material = new THREE.MeshLambertMaterial( {color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		mesh.castShadow = true;
		return mesh;
	}

	function createWall(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material, 0 );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}




	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = true;

		mesh.rotateX(Math.PI/2);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}



	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry( 80, 80, 80 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );

		mesh.receiveShadow = false;


		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}

	function createAvatar(other_object){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.BoxGeometry( 5, 5, 6);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;

		avatarCam.position.set(0,4,0);
		avatarCam.lookAt(0,4,10);
		mesh.add(avatarCam);

  /*
    var scoop1 = createBoxMesh2(0xff0000,10,1,0.1);
		scoop1.position.set(0,-2,5);
		mesh.add(scoop1);
    */

		return mesh;

	}

  function createjosueBall(){
    var geometry = new THREE.SphereGeometry( 4, 5, 20);
    var material = new THREE.MeshLambertMaterial( { color: 0xF0A53F,shininess: 10, wireframe: true});
    var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    //var mesh = new THREE.Mesh( geometry, material );
    var mesh = new Physijs.SphereMesh( geometry, material );
    mesh.setDamping(0.1,0.1);
    mesh.castShadow = true;
    scene.add( mesh );
    return mesh;
  }


	function createConeMesh(r,h){
		var geometry = new THREE.ConeGeometry( r, h, 32);
		var texture = new THREE.TextureLoader().load( '../images/tile.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0 );
		mesh.castShadow = true;
		return mesh;
	}

  function createConeMesh2(r,h){
		var geometry = new THREE.ConeGeometry( r, h, 32);
		var material = new THREE.MeshLambertMaterial( { color: 0xffaaaa,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0);
		mesh.castShadow = true;
		return mesh;
	}

	function createConeMesh3(r,h){
		var geometry = new THREE.ConeGeometry( r, h, 32);
		var material = new THREE.MeshLambertMaterial( { color: 0xffaaaa,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		var mesh = new Physijs.ConeMesh( geometry, pmaterial);
		mesh.castShadow = true;
		return mesh;
	}




	function createBall(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}





	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
		console.log("Keydown: '"+event.key+"'");
		//console.dir(event);
		// first we handle the "play again" key in the "youwon" scene
		if (gameState.scene == 'youwon' && event.key=='r') {
			gameState.scene = 'main';
			gameState.score = 0;
			addBalls();
			return;
		}

		if(gameState.scene == 'initialPicture' && event.key=='p'){
			gameState.scene = 'main';
			gameState.score = 0;
			return;
		}

		if(gameState.scene=='youlose'&&event.key=='r'){
			gameState.scene = 'main';
			gameState.score = 0;
			return;
		}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "r": controls.up = true; break;
			case "f": controls.down = true; break;
			case "m": controls.speed = 30; break;
      case " ": controls.fly = true;
          console.log("space!!");
          break;
      case "h": controls.reset = true; break;
      case "q": controls.rotateToLeft = true; break;
      case "e": controls.rotateToRight = true; break;


			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;
      case "3": gameState.camera = edgeCam; break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;

		}

	}

	function keyup(event){
		//console.log("Keydown:"+event.key);
		//console.dir(event);
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
			case "q": controls.rotateToLeft = false; break;
      case "e": controls.rotateToRight = false; break;
		}
	}

	function updateNPC(){
		npc.lookAt(avatar.position);
	  npc.__dirtyPosition = true;
	}

	function updateNPCKiller(){
		npcKiller.lookAt(npc.position);
		npcKiller.__dirtyPosition = true;
		npcKiller.setLinearVelocity(npcKiller.getWorldDirection().multiplyScalar(0.5));
	}

  /**ISABEL
  */

  function updateTorusKnot(){
    torusKnot.lookAt(npc.position);
    torusKnot.__dirtyPosition = true;
    torusKnot.setLinearVelocity(torusKnot.getWorldDirection().multiplyScalar(0.5));
  }


  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();
		var goLeft = avatar.getWorldDirection();

		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}


    if(controls.rotateToLeft){
      avatarCam.rotateY(0.01);
    }else if(controls.rotateToRight){
      avatarCam.rotateY(-0.01);
    }


    if (controls.reset){
      avatar.__dirtyPosition = true;
      avatar.position.set(40,10,40);
    }

	}



	function animate() {

		requestAnimationFrame( animate );

		switch(gameState.scene) {

			case "youwon":
				endText.rotateY(0.005);
				renderer.render(endScene, endCamera);
				break;

			case "youlose":
				loseText.rotateY(0.005);
				renderer.render(loseScene, endCamera);
				break;

			case "initialPicture":
				initialText.rotateY(0.005);
				renderer.render(initialPicture, endCamera);
				break;

			case "main":
				updateAvatar();
				updateNPC();
				updateNPCKiller();
        edgeCam.lookAt(avatar.position);
	    	scene.simulate();
				if(npc.position.x - avatar.position.x < 20){
					npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(0.5));
				}
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);

		}

		//draw heads up display ..
	  var info = document.getElementById("info");
		//var info1 = document.getElementById("info1");
		info.innerHTML='<div style="font-size:24pt">Score: ' + gameState.score + ';  Health: ' + gameState.health +'</div>';
		//info1.innerHTML='<div style="font-size:24pt">Health: ' + gameState.health + '</div>';

	}
