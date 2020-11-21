var dog,dogimage, happyDog;
var foodS, foodStock;
var database; 
var foodStock,lastFed,feed,add;
var foodObject,fedTime;

function preload()
{
  dogimage = loadImage("dog.png");
  happyDog = loadImage("happydog.png");
}

function setup() 
{
  database = firebase.database();
  
  createCanvas(1000,400);

  dog = createSprite(800,200,150,150);
  dog.addImage(dogimage);
  dog.scale=0.15;
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  foodObject =new Food();

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  add = createButton("Add food");
  add.position(800,95);
  add.mousePressed(addFood);
}

function draw() 
{  
  background(46, 139, 87);
  
  foodObject.display();
  fedTime=database.ref('fedTime')
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  textSize(15);
  fill(255,255,254);
  if (lastFed>12) {
    text("Last Feed : "+lastFed%12+"PM",450,30);
  } else if(lastFed==0) {
    text("Last Feed : 12:00 AM",450,30)
  }else{
    text("Last Feed : "+lastFed+"AM"+450,30)
  }
 

  drawSprites();
  textSize(11);
  fill("black");
  text("NOTE : Press UP_ARROW to feed the dog milk!",150,20);
  text("Food Count: "+foodS,100,100);
  
}

function readStock(data)
{
  foodS=data.val();
 foodObject.updateFoodStock(foodS);
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
    Food:foodS
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