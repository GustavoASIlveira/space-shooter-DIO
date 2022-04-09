(function(){
	let gameOver = true
	let letsPlay = true
	
	const space = document.querySelector('.container')
	
	let spaceX = 0
	
	let score = 0
	const txtScore = document.querySelector('.score')
	
	let lasers = []
	let aliens = []
	
	let minTime = 500
	let alienTime = Math.floor((Math.random() * 100) + minTime)
	
	const startScreen = document.querySelector('#startScreen')
	
	const pressEnter = document.querySelector('.press-enter')
	pressEnter.style.left = 300 - parseInt(getComputedStyle(pressEnter).getPropertyValue('width'))/2 + 'px'
	pressEnter.style.top = 350 + 'px'
	
	const txtGameOver = document.querySelector('.game-over')
	txtGameOver.style.left = 300 - parseInt(getComputedStyle(txtGameOver).getPropertyValue('width'))/2 + 'px'
	txtGameOver.style.top = 300 - parseInt(getComputedStyle(txtGameOver).getPropertyValue('height'))/2 + 'px'
	
	let objPlayer = null
	
	function createPlayer(){
		objPlayer = {
			img: document.createElement('img'),
			width: 70,
			height: 60,
			posX: 25,
			posY: 250,
			mvUp: false,
			mvDown: false,
			canShoot: true,
			speed: 4,
			score: 0,
			move: function(){
				if(this.mvUp){
					this.posY = Math.max(0,this.posY - this.speed)
				} else 
				if(this.mvDown){
					this.posY = Math.min(540,this.posY + this.speed)
				}
			},
			shoot: function(){
				if(this.canShoot){
					lasers.push(createLaser(this))
					this.canShoot = false
					setTimeout(()=>{
						this.canShoot = true
					},1000)
				}
			},
			render: function(){
				this.img.style.left = this.posX + 'px'
				this.img.style.top = this.posY + 'px'
			},
			explode: function(){
					createExplosion(this)
				},
			checkCollision: function(arr){
				let collide = false
				arr.forEach((a,i) => {
					if(
						this.posX + this.width >= a.posX 
					&&	this.posX <= a.posX + a.width
					&&	this.posY + this.height >= a.posY
					&&	this.posY <= a.posY + a.height	
					){
						a.explode()
						a.img.remove()
						arr.splice(i,1)
						collide = true
					}
				})
				return collide
			}
		}
		
		objPlayer.img.classList.add('player')
		objPlayer.img.src = 'img/player.png'
	}
	
	// == 
	document.addEventListener('keydown',keydownHandler)
	document.addEventListener('keyup',keyupHandler)
	
	function keydownHandler(e){
		if(e.key === 'ArrowUp' || e.key === 'ArrowUp' || e.key === ' '){
			e.preventDefault()
		}
		
		if(e.key === 'ArrowUp'){
			objPlayer.mvUp = true
		}
		
		if(e.key === 'ArrowDown'){
			objPlayer.mvDown = true
		}
		
		if(e.key === ' '){
			objPlayer.shoot()
		}
		
		if(e.key === 'Enter'){
			if(letsPlay){
				startGame()
				letsPlay = false
			}
		}
	}
	
	function keyupHandler(e){
		if(e.key === 'ArrowUp' || e.key === 'ArrowUp' || e.key === ' '){
			e.preventDefault()
		}
		
		if(e.key === 'ArrowUp'){
			objPlayer.mvUp = false
		}
		
		if(e.key === 'ArrowDown'){
			objPlayer.mvDown = false
		}
	}
	
	function startGame(){
		startScreen.style.visibility = 'hidden'
		pressEnter.style.visibility = 'hidden'
		score = 0
		txtScore.innerHTML = 'SCORE: ' + score
		lasers = []
		aliens = []
		createPlayer()
		space.appendChild(objPlayer.img)
		gameOver = false
		loop()
	}
	
	function endGame(){
		gameOver = true
		
		lasers.forEach((laser,i)=>{
			laser.img.remove()
			lasers.splice(i,1)
		})
		
		aliens.forEach((alien,i)=>{
			alien.img.remove()
			aliens.splice(i,1)
		})
		
		objPlayer.img.remove()
		objPlayer = null
		
		txtGameOver.style.visibility = 'visible'
		
		setTimeout(()=>{
			txtGameOver.style.visibility = 'hidden'
			startScreen.style.visibility = 'visible'
			pressEnter.style.visibility = 'visible'
			
			letsPlay = true
		},2000)
	}
	
	function createLaser(player){
		let laser = {
			img: document.createElement('img'),
			posX: player.posX + player.width,
			posY: player.posY + 20,
			width: 45,
			height: 20,
			speed: 5,
			render: function(){
				this.img.style.left = this.posX + 'px'
				this.img.style.top = this.posY + 'px'
			},
			move: function(){
				this.posX += this.speed
			},
			checkCollision: function(arr){
				let collide = false
				arr.forEach((a,i) => {
					if(
						this.posX + this.width >= a.posX 
					&&	this.posX <= a.posX + a.width
					&&	this.posY + this.height >= a.posY
					&&	this.posY <= a.posY + a.height	
					){
						a.explode()
						a.img.remove()
						arr.splice(i,1)
						collide = true
						score += a.points
					}
				})
				return collide
			}
		}
		
		laser.img.src = 'img/shoot.png'	
		laser.img.classList.add('laser')			
		space.appendChild(laser.img)
		
		return laser
	}
	
	function createAlien(){
		const alienType = Math.floor(Math.random() * 3)
		let alien
		
		switch(alienType){
			case 0:
				//type 0
				alien = {
					img: document.createElement('img'),
					posX: 650,
					posY: Math.floor(Math.random() * 551),
					width: 50,
					height: 50,
					speed: 5,
					points: 100,
					render: function(){
						this.img.style.left = this.posX + 'px'
						this.img.style.top = this.posY + 'px'
					},
					move: function(){
						this.posX -= this.speed
					},
					explode: function(){
						createExplosion(this)
					}
				}
				alien.img.src = 'img/alien0.png'
			break
			
			case 1:
				//type 1
				alien = {
					img: document.createElement('img'),
					posX: 650,
					posY: Math.random() > .5 ? 60 : 490,
					width: 90,
					height: 60,
					speed: 2,
					points: 50,
					ySpeed: 3,
					render: function(){
						this.img.style.left = this.posX + 'px'
						this.img.style.top = this.posY + 'px'
					},
					move: function(){
						this.posX -= this.speed
						this.posY -= this.ySpeed
						if(this.posY >= 500 || this.posY <= 50){
							this.ySpeed *= -1
						}
						
					},
					explode: function(){
						createExplosion(this)
					}
				}
				alien.img.src = 'img/alien1.png'
			break
			
			case 2:
				//type 2
				alien = {
					img: document.createElement('img'),
					posX: 650,
					posY: Math.floor((Math.random() * 350) + 100),
					posYinit: 0,
					width: 65,
					height: 40,
					speed: 3,
					points: 75,
					ySpeed: 3,
					render: function(){
						this.img.style.left = this.posX + 'px'
						this.img.style.top = this.posY + 'px'
					},
					move: function(){
						this.posX -= this.speed
						this.posY -= this.ySpeed
						if(this.posY >= this.posYinit + 50 || this.posY <= this.posYinit - 50){
							this.ySpeed *= -1
						}
						
					},
					explode: function(){
						createExplosion(this)
					}
				}
				alien.img.src = 'img/alien2.png'
				alien.posYinit = alien.posY
			break
		}
		
		
		alien.img.classList.add('alien')
		alien.img.style.width = alien.width + 'px'
		alien.img.style.height = alien.height + 'px'
		space.appendChild(alien.img)
		
		return alien
	}
	
	function createExplosion(sprite){
		let explosion = document.createElement('img')
			explosion.src = 'img/explosion.png'
			explosion.classList.add('explosion')
			explosion.classList.add('fade')
			explosion.style.left = (sprite.posX + sprite.width/2) - 45 + 'px'
			explosion.style.top = (sprite.posY + sprite.height/2) - 32.5 + 'px'
			
		space.appendChild(explosion)
		
		setTimeout(()=>{
			explosion.remove()
		},500)
	}
	
	function loop(){
		if(!gameOver){
			requestAnimationFrame(loop)
			update()
			render()
		}
	}
	
	function update(){
		objPlayer.move()
		
		//LASER
		lasers.forEach((laser, i) => {
			laser.move()
			
			if(laser.posX > 350){
				laser.img.remove()
				lasers.splice(i,1)
				return
			}
			
			if(laser.checkCollision(aliens)){
				txtScore.innerHTML = 'SCORE: ' + score
				laser.img.remove()
				lasers.splice(i,1)
				return
			}
		})
		
		//UPDATE ALIENS
		aliens.forEach((alien, i) => {
			alien.move()
			
			if(alien.posX <= -100){
				alien.img.remove()
				aliens.splice(i,1)
				endGame()
			}
		})
		
		//CREATE ALIENS
		if(alienTime <= 0){
			aliens.push(createAlien())
			alienTime = Math.floor((Math.random() * 100) + minTime)
			if(minTime > 100){
				minTime -= 25
			}
		} else {
			alienTime--
		}
		
		//PLAYER CHECK COLLISION
		if(objPlayer.checkCollision(aliens)){
			objPlayer.img.remove()
			objPlayer.explode()
			endGame()
		}
		
		//move fundo
		space.style.backgroundPositionX = spaceX + 'px'
		spaceX--
		if(spaceX < -600){
			spaceX = 0
		}
	}
	
	function render(){
		objPlayer.render()
		lasers.forEach((laser) => {
			laser.render()
		})
		
		aliens.forEach((alien) => {
			alien.render()
		})
	}
}())
