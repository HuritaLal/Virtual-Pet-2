var dog,dogimage, happyDog;
var foodS, foodStock;
var database; 
var foodStock,lastFed,feed,add;
var foodObject,fedTime;

function preload()
{
  dogimage = loadImage("dog.png");
  happyDog = loadImage("happyDog.png");
}

function setup() 
{
  database = firebase.database();
  
  createCanvas(500,500);

  dog = createSprite(225,225,10,10);
  dog.addImage(dogimage);
  dog.scale=0.2;
  foodStock=database.ref('food');
  foodStock.on("value",readStock);

  fedTime=database.ref('feedTime')
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  foodObject =new Food();

  feed = createButton("Feed the dog");
  feed.position(450,100);
  feed.mousePressed(feedDog);

  add = createButton("Add food");
  add.position(650,100);
  add.mousePressed(addFood);
}

function draw() 
{  
  background(46, 139, 87);
  
  foodObject.display();

  textSize(15);
  fill(255,255,254);
  if (lastFed>12) {
    text("Last Feed : "+lastFed%12+"PM",350,30);
  } else if(lastFed==0) {
    text("Last Feed : 12:00 AM",350,30)
  }else{
    text("Last Feed : "+lastFed+"AM"+350,30)
  }
 

  drawSprites();
  textSize(11);
  fill("black");
  text("NOTE : Press UP_ARROW to feed the dog milk!",150,20);
  text("Food Count: "+foodS,200,140);
  
}

function readStock(data)
{
  foodS=data.val();
 // foodobject.updateFoodStock(position);
}

function writeStock(x)
{if(x<=0)
  {
    x=0
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    food:x
  })
}

function addFood(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObject.getFoodStock(),
    fedTime:hour()
  })
}