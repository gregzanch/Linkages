var points = [],
   links = [],
   bounce = 1,
   gravity = 0.1,
   r = 30,
   m = 1;
   var coms=[];
   var shapeGroups=[];
   var bodies=[];
  (rigidity = 0.9),
     (grabindex = 0),
     (tstep = 0.5),
     (editselectindex = 0),
     (selStartX = 0),
     (selStartY = 0);
    var press;
    var  displaying;
    var setupdone = false;
    var shift = false;
    var linkstarted = false;
    var selecting = false;
    var editmenusliders = [],
        editMenuHasMouse = false;
    var dclick;
    var cnv;
    var grabSensitivity = 0.02;
    var bodytoolbutton;
    var snapPoints = [];
    var showgrid=false;
    var mouseispressed;
    var newpointmaybe;
    var command;
    var pressx=0,pressy=0;
    var t;
    var disp;
    var skey;
    var collisions=true;
    var lastmouseX, lastmouseY;
    var menu=new menuContext();
    var defineWindow = new windowContext();
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();
    var stringmodeOn=false;
    var optionwindow=new windowContext();
    var edit = ['Update Mass', 'Lock Position', 'Clear Links', 'Delete Body', 'Link All', 'String', 'Clear All', 'Duplicate', 'LinkString'];
    var main = ['Start', 'Define Body', 'Save Model', 'Import', 'Show Snap', 'Undo-Link'];
    var presets = ['Truss', 'Blob'];
function preload() {
 mySound = loadSound("hit.mp3");
}
function setup() {
   width = windowWidth - 30;
   var cnv = createCanvas(width, windowHeight - 150);
   cnv.parent("sketch-holder");
   snaptogrid(20,20);
   menu.init();
   menu.addMenuItem("Run", "startit()");
   menu.addMenuItem("Save Model", "savedata()");
   menu.addMenuItem("Import", "importdata()");
   menu.addMenuItem("Show Snap", "enableSnapToGrid()");
   menu.addMenuItem("Undo Link", "undolink()");
   menu.addMenuItem("update mass", "masschange(this)");
   menu.addMenuItem("Lock Position", "lockposition()");
   menu.addMenuItem("Clear Links", "clearalllink()");
   menu.addMenuItem("Delete Body", "deleteselectedbodies()");
   menu.addMenuItem("Link All", "linkall()");
   menu.addMenuItem("String", "string()");
   menu.addMenuItem("Clear All", "clearall()");
   menu.addMenuItem("Duplicate", "Duplicate()");
   menu.addMenuItem("LinkString", "linkstring()");
   menu.addMenuItem("com", "createCOMgroup()");
   menu.addMenuItem("Shape", "makeShape()");
   menu.addMenuItem("Collisions", "ToggleCollisions()");
   menu.addMenuItem("stringmode", "stringmode()");
   menu.addMenuItem("truss", "trussconnection()");
   menu.addMenuItem("blob", "blob()");
   menu.addMenuItem("Options", "options()");
}

function options(){
if(!optionwindow.isOpen){
  optionwindow.open();
}
else if(optionwindow.isOpen){
  optionwindow.close();
}
}

function stringmode(){
  if(!stringmodeOn){
    stringmodeOn=true;
  }
  else if(stringmodeOn){
    stringmodeOn=false;
  }
}
function startit(){
  menu.collapse();
   if (!setupdone) {
         for (var i = 0; i < links.length; i++) {
            links[i].Length = distance(links[i].p0, links[i].p1);
         }
         setupdone = true;
      } else if (setupdone) {
         setupdone = false;
      }
   }
function deleteselectedbodies(){
  var linkcount=0;
  var newlinkies=[];
 for(var i = 0; i<links.length; i++){
  if(!links[i].p0.isSelected && !links[i].p1.isSelected){
    newlinkies.push(links[i]);
  }
 }
    links=[];
    links=newlinkies;
    var sels=[];
    for(var i = 0; i<points.length; i++){
    if(points[i].isSelected){
        sels.push(points[i].ind);
      }
    }
  for(var i = 0; i<sels.length;i++){
    var spl = null;
    for(var j = 0; j<points.length;j++){
    if(sels[i]==points[j].ind){
      spl = j;
    }
    }
    if(spl!=null){
      points.splice(spl, 1);
    }
  }

}
function undolink() {
   if (links.length != 0) {
      links.splice(links.length - 1, 1);
   }
}
function deletebody() {
   if (points.length != 0) {
      points.splice(grabindex, 1);
   }
}

function lockposition() {
  var mismatchcount=0;
  var lockcount=0;
  var unlockcount=0;
  for(var i = 1; i<points.length;i++){
    if(points[i].isSelected || i==grabindex){
      if (points[i].lock == false && points[i-1].lock == true) {
     mismatchcount++;
   }
   if (points[i].lock == false && points[i-1].lock == false) {
      unlockcount++;
    }
    if (points[i].lock == true && points[i-1].lock == true) {
    lockcount++;
    }
     }
  }

  if(mismatchcount!=0){
    lockAllSelected();
  }
  else if(unlockcount!=0 && mismatchcount==0){
      lockAllSelected();
  }
  else if(lockcount!=0 && mismatchcount==0){
    unlockAllSelected();
  }
}
function unlockAllSelected(){
  for(var i = 0; i<points.length;i++){
    if(points[i].isSelected || i==grabindex){
      points[i].lock  = false;
    }
  }
}
function lockAllSelected(){
  for(var i = 0; i<points.length;i++){
    if(points[i].isSelected || i==grabindex){
      points[i].lock  = true;
      points[i].lockx = points[i].x;
      points[i].locky = points[i].y;
    }
  }
}
function lockbody(pbody) {
      pbody.lock = true;
      pbody.lockx = pbody.x;
      pbody.locky = pbody.y;
}

function masschange(x) {
   points[grabindex].mass = document.getElementById("massSlider").value;
   console.log(document.getElementById("massSlider").value);
}
function string() {
   clearall();
   clearalllink();
   for (var i = 0; i < 40; i++) {
      points.push({
         ind: i,
         strokew: 0.5,
         color: 200,
         lock: false,
         x: 30 + 30 * i,
         y: height / 2,
         oldx: 30 + 30 * i,
         oldy: height / 2,
         lockx: 30 + 30 * i,
         locky: height / 2,
         nextx: 30 + 30 * i,
         nexty: height / 2,
         collided: false,
         mass: 1,
         r: 10,
         friction: 1,
         theta: 0,
         w: 1,
         isSelected: false,
         ff: 0
      });
   }

   for (var i = 1; i < points.length; i++) {
      links.push({
         p0: points[i],
         p0ind: points[i].ind,
         p1: points[i - 1],
         p1ind: points[i-1].ind,
         Length: distance(points[i], points[i - 1])
      });
   }
}
//-------------------------------------------------------
function keyPressed() {
   if (keyCode === 32) {
      if (!setupdone) {
         for (var i = 0; i < links.length; i++) {
            links[i].Length = distance(links[i].p0, links[i].p1);
         }
             for(var i = 0; i<points.length;i++){
                if(points[i].isSelected){
                  points[i].oldx=points[i].x;
                  points[i].oldy=points[i].y;
                }
             }
         setupdone = true;
         if(menu.expanded){
           menu.collapse();
         }
         if(defineWindow.isActive){
           defineWindow.isActive=false;
         }
      } else if (setupdone) {
         setupdone = false;
         if(!menu.expanded){
           menu.expand();
         }
      }
   }
   if(keyCode == 83){
     skey=true;
     stringmodeOn=true;
     console.log("stringmode on");
   }
   if(keyCode == 8){
     deleteselectedbodies();
   }
   if (keyCode === 16) {
      shift = true;
   }
   if (keyCode === 40) {
      for (var i = 0; i < links.length; i++) {
         links[i].Length -= 2;
      }
   }
   if (keyCode === 38) {
      for (var i = 0; i < links.length; i++) {
         links[i].Length += 2;
      }
   }
}
function keyReleased() {
   if (keyCode == 16) {
      shift = false;

   }
   if(keyCode == 83){
     skey = false;
     stringmodeOn=false;
        console.log("stringmode off");
   }
}
function doubleClicked() {
   dclick = true;
 //   console.log("doubleClicked");
    if(newpointmaybe && !selecting){
                //    console.log("point pushed");
                    points.push({
                       ind: generateID(),
                       strokew: 0.5,
                       color: 200,
                       lock: false,
                       x: mouseX,
                       y: mouseY,
                       oldx: mouseX,
                       oldy: mouseY,
                       lockx: mouseX,
                       locky: mouseY,
                       nextx: mouseX,
                       nexty: mouseY,
                       collided: false,
                       mass: 1,
                       r: 10,
                       friction: 1,
                       theta: 0,
                       w: 1,
                       isSelected: false,
                       ff:0
                    });
                    linkstarted = false;
                    newpointmaybe=false;
      }


  if(hoveringpoint().bool){
    console.log(points[hoveringpoint().ind]);
  }


}
function hoveringpoint(){
  var info={};
  if (mouseX > menu.menuWidth && mouseX < width && mouseY < height && mouseY > 0 && !menu.checkToggleButtonHover()) {
     if (!setupdone) {
        if (points.length != 0) {
           for (var i = 0; i < points.length; i++) {
              if (dist(mouseX, mouseY, points[i].x, points[i].y) < points[i].r+radd) {
                    if (!shift) {
                        info={
                          bool: true,
                          ind: i
                        };
                    }
                  }
                }
              }
            }
          }
          else {
            info={
              bool: false,
              ind: null
            };
          }
          return info;
}
function mousePressed() {
  menu.mousePressed(mouseX,mouseY);
  lastmouseX=mouseX;
  lastmouseY=mouseY;
 mouseispressed=true;
   if (mouseX > menu.menuWidth && mouseX < width && mouseY < height && mouseY > 0 && !menu.checkToggleButtonHover()) {
      if (!setupdone) {
         if (points.length != 0) {
            for (var i = 0; i < points.length; i++) {
               if (
                  dist(mouseX, mouseY, points[i].x, points[i].y) < points[i].r+radd) {
                  if (mouseButton === LEFT) {
                     if (!shift && !command) {
                        press = true;
                        pressx=mouseX;
                        pressy=mouseY;
                        grabindex = i;
                        console.log("body " + i + " has been pressed");
                     } else if (shift && !command) {
                        if (!linkstarted && points.length > 1) {
                           linkstart = i;
                           linkstarted = true;
                           console.log("link started at " + i);
                        } else if (linkstarted && points.length > 1) {
                           if (linkstart != i) {
                              links.push({
                                 p0: points[linkstart],
                                 p0ind: points[linkstart].ind,
                                 p1: points[i],
                                 p1ind: points[i].ind,
                                 Length: distance(points[linkstart], points[i])
                              });
                              linkstarted = false;
                              console.log(
                                 "body " +
                                    linkstart +
                                    " and body" +
                                    i +
                                    " are linked"
                              );
                           }
                        } else {
                           console.log("shift pressed but link broke");
                        }
                     }
                     else if (!shift && command){

                     }

                  }
               }
            }
         }

         if (!press && !shift && !command && !stringmodeOn) {
           grabindex=null;
            newpointmaybe=true;
            selecting=true;
            selStartX=mouseX;
            selStartY=mouseY;
         }
      } else if (setupdone) {
         for (var i = 0; i < points.length; i++) {
            if (dist(mouseX, mouseY, points[i].x, points[i].y) < r+radd) {
               if (mouseButton === LEFT) {
                  press = true;
                  grabindex = i;
               }
            }
         }
      }
   }
}
function mouseReleased() {
   press = false;
   mouseispressed=false;
     menu.mouseReleased(mouseX,mouseY);
   for (var i = 0; i < points.length; i++) {
      points[i].friction = 1;

   }
  if(!setupdone){
    for(var i = 0; i<points.length;i++){
       if(points[i].isSelected){
         points[i].oldx=points[i].x;
         points[i].oldy=points[i].y;
       }
    }
 }


     selecting=false;
   t=0;

}
//-------------------------------------------------------
function linkall() {
   if (points.length > 1) {
      for (var i = 0; i < points.length; i++) {
         for (var j = 0; j < points.length; j++) {
            if (j < i) {
              if(points[i].isSelected && points[j].isSelected){
               links.push({
                  p0: points[i],
                  p0ind: points[i].ind,
                  p1: points[j],
                  p1ind: points[j].ind,
                  Length: distance(points[i], points[j])
               });
             }
            }
         }
      }
   }
}
function windowResized() {
   resizeCanvas(windowWidth - 30, windowHeight - 150);
}
function draw() {
   // friction = document.getElementById('fricSlider').value/100;
   gravity = float(document.getElementById("gravSlider").value);
   radd = int(document.getElementById("rSlider").value);
   bounce = float(document.getElementById("bounceSlider").value) / 100;
   rigidity = document.getElementById("rigiditySlider").value / 100;
   grabSensitivity = float(
      document.getElementById("grabSensitivitySlider").value
   );

   background(252);

   if (!setupdone) {
      setscreen();
   }
   if (setupdone) {
      update();
   }

  if(coms.length!=0){
    for(var i =0; i<coms.length; i++){
      coms[i].draw();
    }
  }
  if(shapeGroups.length!=0){
    for(var i =0; i<shapeGroups.length; i++){
      shapeGroups[i].draw();
    }
  }
    menu.update();
  menu.draw();

  push();
  stroke(0);
  strokeWeight(2);
  line(0, 0, width, 0);
  line(width, 0, width, height);
  line(width, height, 0, height);
  line(0, height, 0, 0);
  pop();
}
function update() {
   for (var i = 0; i < 5; i++) {
      updatePoints();
      constrainPoints();
      checkCollisions();
      updatelinks();
   }
   renderPoints();
   renderlinks();
   push();
   if (press && shift) {
      points[grabindex].x = lerp(points[grabindex].x, mouseX, grabSensitivity);
      points[grabindex].y = lerp(points[grabindex].y, mouseY, grabSensitivity);

      line(mouseX, mouseY, points[grabindex].x, points[grabindex].y);
   } else if (press && !shift) {
      for (var i = 0; i < 3; i++) {
         points[grabindex].friction = 0.5;
         points[grabindex].x = lerp( points[grabindex].x, mouseX, grabSensitivity + 0.2);
         points[grabindex].y = lerp( points[grabindex].y, mouseY, grabSensitivity + 0.2);
         points[grabindex].oldx = lerp( points[grabindex].oldx, pmouseX, grabSensitivity + 0.2);
         points[grabindex].oldy = lerp( points[grabindex].oldy, pmouseY, grabSensitivity + 0.2);
         points[grabindex].nextx = lerp(points[grabindex].nextx, mouseX+2*(mouseX-pmouseX),grabSensitivity + 0.2);
         points[grabindex].nexty = lerp(points[grabindex].nexty, mouseY+2*(mouseY-pmouseY),grabSensitivity + 0.2);
         line(mouseX, mouseY, points[grabindex].x, points[grabindex].y);
      }
   }
   pop();
}
function clearall() {
   points = [];
   links = [];
   coms=[];
   shapeGroups=[];
   setupdone = false;
}
function clearalllink() {
   links = [];
}
//-------------------------------------------------------
function importdata(){
   setupdone=false;
   if(displayImportBox()=="importing"){
      actuallyimportdata();
   }

}
function displayImportBox() {
    var x = document.getElementById("importElement");
   var state;
    if (x.style.display === "none") {
        x.style.display = "block";
        document.getElementById("Import").innerHTML="Submit";
       state="editing";
    } else {
        x.style.display = "none";
        document.getElementById("Import").innerHTML="Import";
       state="importing";
    }
   return state;
}
function actuallyimportdata(){
   clearall();
   clearalllink();
   var strdata = document.getElementById("importedText").value;
   console.log(strdata.split("_"));
   var stray = strdata.split("_");
   var ps=[];
   var ls=[];
   for(var i = 0; i<stray.length;i++){
      if(stray[i].startsWith("p")){
         ps.push(stray[i]);
      }
      if(stray[i].startsWith("l")){
         ls.push(stray[i]);
      }
   }
   for(var i = 0; i<ps.length;i++){
   var pp = ps[i].split(" ");
        points.push({
               ind: int(pp[1]),
               strokew: int(pp[2]),
               color: int(pp[3]),
               lock: bool(pp[4]),
               x: int(pp[5]),
               y: int(pp[6]),
               oldx: int(pp[7]),
               oldy: int(pp[8]),
               lockx: int(pp[9]),
               locky: int(pp[10]),
               nextx: int(pp[11]),
               nexty: int(pp[12]),
               collided: bool(pp[13]),
               mass: int(pp[14]),
               r: int(pp[15]),
               friction: int(pp[16]),
               theta: int(pp[17]),
               w: int(pp[18]),
               isSelected: bool(pp[19]),
               ff: int(pp[20])
            });
   }
   for(var i = 0; i<ls.length;i++){
   var ll = ls[i].split(" ");
      links.push({
         p0: points[pidToIndex(ll[1])],
         p0ind: ll[1],
         p1: points[pidToIndex(ll[2])],
         p1ind: ll[2],
         Length: distance(points[pidToIndex(ll[1])],points[pidToIndex(ll[2])])
      });

   }
}
function pidToIndex(pid){
   var indexxx;
   for(var i = 0; i<points.length;i++){
      if(int(pid) == points[i].ind){
         indexxx=i;
      }
   }
   return indexxx;
}
function bool(ss){
  if(ss ==="false"){
    return false;
  }
    if(ss==="true"){
      return true;
   }
  }
function savedata() {
   console.log(points);
   console.log(links);
   var pointstring="";

   for(var i = 0; i<points.length;i++){
   pointstring+="_p " +
               str(points[i].ind) + " " +
               str(points[i].strokew) + " " +
               str(points[i].color) + " " +
               str(points[i].lock) + " " +
               str(points[i].x) + " " +
               str(points[i].y) + " " +
               str(points[i].oldx) + " " +
               str(points[i].oldy) + " " +
               str(points[i].lockx) + " " +
               str(points[i].locky) + " " +
               str(points[i].nextx) + " " +
               str(points[i].nexty) + " " +
               str(points[i].collided) + " " +
               str(points[i].mass) + " " +
               str(points[i].r) + " " +
               str(points[i].friction) + " " +
               str(points[i].theta) + " " +
               str(points[i].w) + " " +
               str(points[i].isSelected) + " " +
               str(points[i].ff) + "\n";

   }

   for(var i = 0; i<links.length; i++){
      pointstring+="_l " + str(links[i].p0ind)+" " +str(links[i].p1ind)+ "\n";
   }

   createDiv('<p>'+pointstring+'</p>');


}
function generateID(){
   var genid = str(int(random(500000)));
   return genid;
}
//-------------------------------------------------------
function setscreen() {
  push();
   strokeWeight(0.2);
   stroke(0);
   fill(0);
   text("EDIT", width-150, 50);
   pop();
   if(showgrid){
   renderGrid(20,20);
   }
   renderPoints();
   renderlinks();
   if (press && !shift) {
     t+=.01;
     if(t>.5){
       disp = true;
     }
     var txt;
      if(showgrid){
         points[grabindex].strokew = 1;
      points[grabindex].x = closestSnap(mouseX,mouseY).x;
      points[grabindex].y = closestSnap(mouseX,mouseY).y;
      points[grabindex].oldx = closestSnap(mouseX,mouseY).x;
      points[grabindex].oldy = closestSnap(mouseX,mouseY).y;
    for(var i = 0; i<points.length;i++){
      if(points[i].isSelected && i!=grabindex){
        points[i].x= points[i].oldx+(points[grabindex].x-pressx);
        points[i].y= points[i].oldy+(points[grabindex].y-pressy);
      }
    }
      }
      else{
      points[grabindex].strokew = 1;
      points[grabindex].x+= mouseX-pmouseX;
      points[grabindex].y+= mouseY-pmouseY;
      points[grabindex].oldx = points[grabindex].x;
      points[grabindex].oldy = points[grabindex].y;
      for(var i = 0; i<points.length;i++){
        if(points[i].isSelected && i!=grabindex){
          points[i].x+= mouseX-pmouseX;
          points[i].y+= mouseY-pmouseY;
        }
      }

      }
      push();
      txt="("+str(int(points[grabindex].x))+", "+str(int(points[grabindex].y))+")";
      stroke(0);
      strokeWeight(.25);
      textSize(14);
      textAlign(CENTER);
      text(txt,points[grabindex].x+60,points[grabindex].y-60);
      line(points[grabindex].x,points[grabindex].y,points[grabindex].x+60,points[grabindex].y-60);
      pop();
      for (var i = 0; i < points.length; i++) {
         if (i != grabindex) {
            points[i].strokew = 0.5;
         }
      }

   }
   if(newpointmaybe && dist(mouseX,mouseY,pmouseX,pmouseY)>2){
     newpointmaybe=false;
   }
   if(points.length!=0){
         if (selecting) {
           push();
            stroke(0);
            strokeWeight(0.5);
            fill(0, 0, 0, 30);
            rect(selStartX, selStartY, mouseX-selStartX, mouseY-selStartY);
            pop();
            console.log("selecting...");

                        for(var i =0; i<points.length;i++){
                                if(contains(selStartX, selStartY, mouseX, mouseY, points[i].x, points[i].y)){
                                  points[i].isSelected=true;
                                }
                                else{points[i].isSelected=false;
                                }
                          }
                        }
                }

                if(stringmodeOn){
                  if(mouseispressed){
                    if(lastmouseX==mouseX && lastmouseY==mouseY){
                        createBody(mouseX,mouseY);
                    }
                    if(dist(mouseX,mouseY,lastmouseX,lastmouseY)>30){
                        createBody(mouseX,mouseY);
                        lastmouseX=mouseX;
                        lastmouseY=mouseY;
                        if(shift && points.length>1){
                          createlink(points[points.length-1],points[points.length-2]);
                        }
                    }

                  }
                }
              }
function createBody(xx,yy){
      console.log("point pushed");
      points.push({
         ind: generateID(),
         strokew: 0.5,
         color: 200,
         lock: false,
         x: xx,
         y: yy,
         oldx: xx,
         oldy: yy,
         lockx: xx,
         locky: yy,
         nextx: xx,
         nexty: yy,
         collided: false,
         mass: 1,
         r: 10,
         friction: 1,
         theta: 0,
         w: 1,
         isSelected: false,
         ff:0
      });
}
function createlink(pnot, pone){
      links.push({
         p0: pnot,
         p0ind: pnot.ind,
         p1: pone,
         p1ind: pone.ind,
         Length: distance(pnot, pone)
      });
}
function renderGrid(sclx,scly){
     for(var i = 0; i<width; i+=sclx){
        push();
        stroke(160,160);
        strokeWeight(1);
         line(i,0,i,height);
         pop();
      }
         for(var i = 0; i<height; i+=scly){
               push();
               stroke(160,160);
               strokeWeight(1);
         line(0,i,width,i);
          pop();
      }
    }
function displayStat(p){
  if(!p.lock){
    p.lock=true;
  }
  else if(p.lock){
    p.lock=false;
  }
}
function renderPoints() {
   var sumx = 0;
   var sumy = 0;
   var summass = 0;
   for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (i == grabindex) {
         drawgrabbedbody(p.x, p.y, p.r * p.mass, p.r * p.mass, p.theta,p.ff);
      } else if (p.lock) {
         drawlockedbody(p.x, p.y, p.r * p.mass, p.r * p.mass, p.theta,p.ff);
      } else if(p.isSelected){
         drawSelectedbody(p.x, p.y, p.r * p.mass, p.r * p.mass, p.theta,p.ff);
      }else {
         drawregularbody(p.x, p.y, p.r * p.mass, p.r * p.mass, p.theta,p.ff);
      }
   }
   // if(points.length>1){
   //    fill(0,30);
   // ellipse(points[0].x/2+points[1].x/2,points[0].y/2+points[1].y/2,2*(points[0].r+radd),2*(points[0].r+radd));
   // }
}
function drawSelectedbody(x, y, r, r, ang,ff) {
   if (!setupdone) {
      push();
      translate(x, y);
      //rotate(ang);
      strokeWeight(1.25);
      fill(190);
      stroke(0,90,190);
      ellipse(0, 0, 2*(r + radd), 2*(r + radd));
      pop();
   } else if (setupdone) {
      drawregularbody(x, y, r, r, ang,ff);
   }
}
function drawgrabbedbody(x, y, r, r, ang,ff) {
   if (!setupdone) {
      push();
      translate(x, y);
      //rotate(ang);
      strokeWeight(2);
      fill(190);
      stroke(0,90,190);
      ellipse(0, 0, 2*(r + radd), 2*(r + radd));
      pop();
   } else if (setupdone) {
      drawregularbody(x, y, r, r, ang,ff);
   }
}
function drawlockedbody(x, y, r, r, ang,ff) {
   push();
   translate(x, y);
  // rotate(ang);
   strokeWeight(1);
   fill(100);
   stroke(0);
   ellipse(0, 0, 2*(r + radd), 2*(r + radd));
   pop();
}
function drawregularbody(x, y, r, r, ang,ff) {
   push();
   translate(x, y);
  // rotate(ang);
   strokeWeight(0.75);
   fill(210);
   stroke(0);
   ellipse(0, 0, 2*(r + radd), 2*(r + radd));
   line(0,0,ff*10,0);
   pop();
}
function renderlinks() {
   for (var i = 0; i < links.length; i++) {
      var s = links[i];
      push();
      strokeWeight(0.8);
      line(s.p0.x, s.p0.y, s.p1.x, s.p1.y);
      pop();
   }
}
//-------------------------------------------------------
function contains(x1,y1,x2,y2,px,py){
   var containsX;
   var containsY;
 if(x1<x2){
    if(x1<px && px<x2){
      containsX=true;
    }
  }
  else if(x2<x1){
    if(x2<px && px<x1){
      containsX=true;
    }
  }
  if(y1<y2){
    if(y1<py && py<y2){
      containsY=true;
    }
  }
  else if(y2<y1){
    if(y2<py && py<y1){
      containsY=true;
    }
  }
  if(containsX && containsY){
    return true;
  }
  else{
    return false;
  }
    }
function closestSnap(valx, valy){
   var min = dist(valx,valy,snapPoints[0].x,snapPoints[0].y);
   minindex = 0;
   for(var i = 0; i<snapPoints.length; i++){
      var distance =dist(valx,valy,snapPoints[i].x,snapPoints[i].y);
      if(distance<min){
         min = distance;
         minindex = i;
      }
   }
 return snapPoints[minindex];
}
function distance(p0, p1) {
   var dx = p1.x - p0.x,
      dy = p1.y - p0.y;
   return Math.sqrt(dx * dx + dy * dy);
}
function nextdistance(p0, p1) {
   var dx = p1.nextx - p0.nextx,
      dy = p1.nexty - p0.nexty;
   return Math.sqrt(dx * dx + dy * dy);
}
function checkCollisions() {
  if(collisions){
   if(points.length!=0){
   for (var i = 0; i < points.length; i++) {
      for (var j = 0; j < points.length; j++) {
         if (j < i) {
            var distBetween = nextdistance(points[i], points[j]);
            var rtot = points[i].r + points[j].r + 2*radd;
            if (distBetween < rtot) {
                 var a = points[i];
                 var b = points[j];
                          var  bVectx = b.x - a.x;
                          var   bVecty = b.y - a.y;
                          var bVectMag = sqrt(bVectx * bVectx + bVecty * bVecty);
                          var theta  = atan2(bVecty,bVectx);
                          var sine   = sin(theta);
                          var cosine = cos(theta);
                          var  bTemp0x = 0;
                          var  bTemp0y=0;
                          var  bTemp1x  = cosine * bVectx + sine * bVecty;
                          var  bTemp1y  = cosine * bVecty - sine * bVectx;
                          var  vTemp0x  = cosine * (a.x-a.oldx) + sine * (a.y-a.oldy);
                          var  vTemp0y  = cosine * (a.y-a.oldy) - sine * (a.x-a.oldx);
                          var  vTemp1x  = cosine * (b.x-b.oldx) + sine * (b.y-b.oldy);
                          var  vTemp1y  = cosine * (b.y-b.oldy) - sine * (b.x-b.oldx);
                          var    vFinal0x = ((a.mass - b.mass) * vTemp0x  + 2 *  b.mass * vTemp1x) /( a.mass + b.mass);
                          var    vFinal0y = vTemp0y;
                          var  vFinal1x = ((b.mass - a.mass) * vTemp1x + 2 *  a.mass *
                                               vTemp0x) /( a.mass + b.mass);
                          var  vFinal1y = vTemp1y;

                                bTemp0x += vFinal0x;
                                bTemp1x += vFinal1x;

                          var  bFinal0x = cosine * bTemp0x - sine * bTemp0y;
                          var   bFinal0y = cosine * bTemp0y + sine * bTemp0x;
                          var   bFinal1x = cosine * bTemp1x - sine * bTemp1y;
                          var   bFinal1y = cosine * bTemp1y + sine * bTemp1x;
                                    b.x=a.x+bFinal1x*1.05;
                                    b.y=a.y+bFinal1y*1.05;
                                    a.x=a.x+bFinal0x*1.05;
                                    a.y=a.y+bFinal0y*1.05;
                                a.oldx=a.x-(cosine * vFinal0x - sine * vFinal0y);
                                a.oldy=a.y-(cosine * vFinal0y + sine * vFinal0x);
                                b.oldx=b.x-(cosine * vFinal1x - sine * vFinal1y);
                                b.oldy=b.y-(cosine * vFinal1y + sine * vFinal1x);


            }
         }
         }
      }
   }
 }
}
function updatePoints() {
   for (var i = 0; i < points.length; i++) {
      var p = points[i],
         vx = (p.x - p.oldx) * p.friction,
         vy = (p.y - p.oldy) * p.friction;
      p.theta += p.w;
      if (!p.lock) {
         p.oldx = p.x;
         p.oldy = p.y;
         p.x += vx+p.friction*p.ff;
         p.y += vy;
         p.y += gravity;
      }
      if (p.lock) {
         p.oldx = p.lockx;
         p.oldy = p.locky;
         p.x = p.lockx;
         p.y = p.locky;
      }
      p.nextx = p.x + p.friction*p.ff+(p.x - p.oldx) * p.friction;
      p.nexty = p.y + (p.y - p.oldy) * p.friction;
   }
}
function constrainPoints() {
   for (var i = 0; i < points.length; i++) {
      var p = points[i],
         vx = (p.x - p.oldx) * p.friction,
         vy = (p.y - p.oldy) * p.friction;
      var sw = p.strokew;
      if (p.x > width - p.r - radd) {

         p.x = width - p.r - radd;
         p.oldx = p.x + vx * bounce;
      } else if (p.x < p.r + radd) {
        sw*=2;
         p.x = p.r + radd;
         p.oldx = p.x + vx * bounce;
      }
      else if (p.y > height - p.r - radd) {
          p.ff=0;
         p.y = height - p.r - radd;
         p.oldy = p.y + vy * bounce;
      } else if (p.y < p.r + radd) {
        sw*=2;
         p.y = p.r + radd;
         p.oldy = p.y + vy * bounce;
      }
      else {
        sw*=1;
      }
      p.strokew=sw;
   }
}
function updatelinks() {
   for (var i = 0; i < links.length; i++) {
      var s = links[i],
         mtot = s.p0.mass + s.p1.mass,
         m0 = s.p0.mass / mtot,
         m1 = s.p1.mass / mtot,
         dx = s.p1.x - s.p0.x,
         dy = s.p1.y - s.p0.y,
         distance = Math.sqrt(dx * dx + dy * dy),
         difference = s.Length - distance,
         percent = difference / distance / 2,
         offsetX = dx * percent,
         offsetY = dy * percent;

      s.p0.x -= offsetX * rigidity * m1;
      s.p0.y -= offsetY * rigidity * m1;
      s.p1.x += offsetX * rigidity * m0;
      s.p1.y += offsetY * rigidity * m0;
   }
}

function importexample(strng){
     clearall();
   clearalllink();
   var strdata = strng;
   console.log(strdata.split("_"));
   var stray = strdata.split("_");
   var ps=[];
   var ls=[];
   for(var i = 0; i<stray.length;i++){
      if(stray[i].startsWith("p")){
         ps.push(stray[i]);
      }
      if(stray[i].startsWith("l")){
         ls.push(stray[i]);
      }
   }
   for(var i = 0; i<ps.length;i++){
   var pp = ps[i].split(" ");
        points.push({
               ind: int(pp[1]),
               strokew: int(pp[2]),
               color: int(pp[3]),
               lock: bool(pp[4]),
               x: int(pp[5]),
               y: int(pp[6]),
               oldx: int(pp[7]),
               oldy: int(pp[8]),
               lockx: int(pp[9]),
               locky: int(pp[10]),
               nextx: int(pp[11]),
               nexty: int(pp[12]),
               collided: bool(pp[13]),
               mass: int(pp[14]),
               r: int(pp[15]),
               friction: int(pp[16]),
               theta: int(pp[17]),
               w: int(pp[18]),
               isSelected: bool(pp[19]),
               ff: int(pp[20])
            });
   }
   for(var i = 0; i<ls.length;i++){
   var ll = ls[i].split(" ");
      links.push({
         p0: points[pidToIndex(ll[1])],
         p0ind: ll[1],
         p1: points[pidToIndex(ll[2])],
         p1ind: ll[2],
         Length: distance(points[pidToIndex(ll[1])],points[pidToIndex(ll[2])])
      });

   }
}
function snaptogrid(scalex,scaley){
   snapPoints=[];
   for(var i = 0; i<width; i+=scalex){
      for(var j = 0; j<height; j+=scaley){
         snapPoints.push({
            sclx: scalex,
            scly: scaley,
            x: i,
            y: j
         });
      }
   }
}
function enableSnapToGrid(){
   if(!showgrid){
   showgrid = true;
   }
   else if (showgrid){
   showgrid = false;
   }
}
function setExample(exnum){
  if(exnum == 0){
      var str = ""
  }




}
function createCOMgroup(){
  var selects=[];
  var count=0;
  for (var i =0; i<points.length;i++){
    if(points[i].isSelected){
      selects.push(points[i]);
    }
  }
 coms.push(new comgroup(selects));
 coms[coms.length-1].enabletrails();
 }
function comgroup(sel){
  this.sel=sel;
  this.trailarray=[];
  var trails;
  this.draw = function(){

    this.sumx=0;
    this.sumy=0;
    this.summass=0;
    for(var i = 0; i<this.sel.length;i++){
      this.sumx+=this.sel[i].x*this.sel[i].mass;
      this.sumy+=this.sel[i].y*this.sel[i].mass;
      this.summass+=this.sel[i].mass;
    }

    if(this.trailarray.length<100 && trails){
      this.trailarray.push({
        x: this.sumx/this.summass,
        y: this.sumy/this.summass
      });
    }
    else if(trails){
      this.trailarray=shiftarray(this.trailarray);
      this.trailarray[0].x=this.sumx/this.summass;
      this.trailarray[0].y = this.sumy/this.summass;
    }
    if(trails){
      for(var i = 0; i< this.trailarray.length;i++){
        var col = map(i,0,this.trailarray.length, 255,50);
        var rad = map(i,0,this.trailarray.length, 15,1);
        fill(0,col);
        ellipse(this.trailarray[i].x,this.trailarray[i].y, rad,rad);
      }
    }
        ellipse(this.trailarray[0].x,this.trailarray[0].y,30,30);
  }
  this.enabletrails=function(){
    trails=true;
  }
};
function shiftarray(ar){
  for(var i = ar.length-1; i>0; i--){
    ar[i].x=ar[i-1].x;
        ar[i].y=ar[i-1].y;
  }
  return ar;
}
function makeShape(){
  var temp=[];
  for (var i =0; i<points.length;i++){
    if(points[i].isSelected){
      temp.push(points[i]);
    }
  }
  shapeGroups.push(new shapeGroup(temp));
}
function shapeGroup(shapes){
  this.shapes=shapes;
  this.draw=function(){
    push();
    fill(0,50);
    stroke(0,100);
    strokeWeight(.5);
      beginShape();
      for (var i =0; i<this.shapes.length;i++){
      var x = this.shapes[i].x;
      var y = this.shapes[i].y;
      vertex(x,y);
      }
        endShape(CLOSE);
        pop();
  }
};
function menuContext(){
  this.init=function(){
    this.items=[];
    this.groups=[];
    this.toggleButton={x:30,y:30};
    this.mx=mouseX;
    this.my=mouseY;
    this.menuWidth=0;
    this.expanded=true;
    this.expandRate=.9;
    this.maxMenuWidth=200;
    this.buttons=[];
    this.nexty=200;
    this.buttoncount=0;
    this.y1=0;
    this.verticalButtonSpacing=30;
    this.leftButtonMargin=30;
    this.toggleButtonOffset=30;
    this.backgroundAlpha=50;
    this.x1=0;
    this.y2=height;
    this.getmousepress=false;
    this.xpress=0;
    this.ypress=0;
    this.addspace=false;

   }
  this.expand=function(){
      this.expanded = true;
  }
  this.collapse = function(){
      this.expanded = false;
  }
  this.addMenuItem = function(name,func){
    var btn = createButton(name);
    if(!this.addspace){
      this.nexty+=this.verticalButtonSpacing;
    }
    else if(this.addspace){
      this.nexty+=this.verticalButtonSpacing*1.5;
      this.addspace=false;
      }
      this.buttons.push({buttonPointer: btn, x: this.menuWidth-this.maxMenuWidth+this.leftButtonMargin, y:this.nexty});
      this.buttons[this.buttoncount].buttonPointer.position(this.menuWidth-this.maxMenuWidth+this.leftButtonMargin,this.nexty);
      this.buttons[this.buttoncount].buttonPointer.attribute('onclick',func);
      this.buttons[this.buttoncount].buttonPointer.attribute('id',name);
      this.buttons[this.buttoncount].buttonPointer.attribute('style',"position: relative; display: inline-block; background-color: #00000;cursor: pointer;box-shadow:0 1px 4px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14); border: solid 1px black;color: #000000; text-align: left; font-size: 12px;padding: 2px;width: 120px;transition: all 0.1s;cursor: pointer;margin: 5px;");
      this.buttons[this.buttoncount].buttonPointer.hide();
      this.buttoncount+=1;
  }
  this.addMenuSpace=function(){
    this.addspace=true;
  }
  this.mousePressed=function(mx,my){
    this.xpress=mx;
    this.ypress=my;

      if(this.checkToggleButtonHover()){
        if(this.expanded){
          this.collapse();
        }
        else if(!this.expnded){
          setupdone=false;
          this.expand();
        }
      }
      for(var i = 0; i<this.buttons.length;i++){
          var y = 30;
        if(mouseisin(this.x1,this.y1+y*i,this.x1+this.menuWidth,(this.y1+y*i)+y)){
          console.log(i);
            if(this.expanded){
              document.getElementsByTagName('button')[i].click();
            }
        }
      }
  }
  this.mouseReleased=function(mx,my){
    this.getmousepress=false;
  }
  this.update=function(){
    this.mx=mouseX;
    this.my=mouseY;
      if(this.checkToggleButtonHover()){
      this.toggleButton.x=lerp(this.toggleButton.x,this.menuWidth+this.toggleButtonOffset+10,.8);
      }
      else{
        this.toggleButton.x=lerp(this.toggleButton.x,this.menuWidth+this.toggleButtonOffset,.8);
      }
    }
    this.checkToggleButtonHover=function(){
      if(this.mx>this.menuWidth && this.mx<this.toggleButton.x+10 && this.my>this.y1&&this.my<this.toggleButton.y+10){
        return true;
      }
      else{
        return false;
        }
      }
  this.draw=function(){
      var x;
      if(this.expanded){
        var xpos = this.toggleButton.x;
        var ypos = this.toggleButton.y;
        push();
        fill(150);
        this.menuWidth=lerp(this.menuWidth,this.maxMenuWidth,this.expandRate);
        x=this.menuWidth;
        strokeWeight(.5);
        rect(this.x1,this.y1,this.menuWidth,this.y2);
        line(xpos-10,ypos-10,xpos,ypos);
        line(xpos-10,ypos+10,xpos,ypos);
        pop();
      }
      else if(!this.expanded){
        var xpos = this.toggleButton.x;
        var ypos = this.toggleButton.y;
        push();
        fill(150);
        this.menuWidth=lerp(this.menuWidth,this.y1,this.expandRate);
        x=this.menuWidth;
            strokeWeight(.5);
        rect(this.x1,this.y1,this.menuWidth,this.y2);
        line(xpos-10,ypos-10,xpos,ypos);
        line(xpos-10,ypos+10,xpos,ypos);
        pop();
      }
      for(var i = 0; i<this.buttons.length;i++){
        push();
          var y = 30;
        if(mouseisin(this.x1,this.y1+y*i,this.x1+x,(this.y1+y*i)+y)){
            fill(220);
            }
        else{
            fill(200);
        }
            strokeWeight(.5);
        rect(this.x1,this.y1+y*i,x,y);
      //  stroke(int(document.getElementById('strokes').value));
      stroke(225);
        strokeWeight(.125);
      //  fill(int(document.getElementById('fills').value));
        fill(27);
       textFont('Helvetica');
      //  textSize(int(document.getElementById('tsize').value));
      textSize(12);
        var xx = map(x,0,this.maxMenuWidth,this.maxMenuWidth,0);
        var offset = int(document.getElementById('offset').value);
      var offset = 15;
        text(document.getElementsByTagName('button')[i].innerHTML,this.x1-xx+offset,(this.y1+y*i)+20);
        pop();
      }
    }
}
function mlog(x){
  console.log(int(x.value));
}
function mouseisin(x1,y1,x2,y2){
  if(x1<mouseX && mouseX<x2 && y1<mouseY && mouseY<y2){
    return true;
  }
  else{
    return false;
  }
}

function windowContext(){
  this.init=function(x,y,w,h){
    this.x1=x;
    this.y1=y;
    this.w=w;
    this.h=h;
    this.x2=this.x1+this.w;
    this.y2=this.y2+this.h;
      this.buttons=[];
      this.sliders=[];
      this.inputs=[];
        this.brightness=100;
        this.alpha=100;
        this.border=0;
        this.borderthick=.25;
  }
  this.addWindowButton = function(name,func,xpos,ypos,wi,he){
    var btn = createButton(name);
      this.buttons.push({
        buttonPointer: btn,
        text: name,
        w: wi,
        h: he,
        x: xpos,
        y: ypos
      });
      this.buttons[this.buttoncount].buttonPointer.attribute('onclick',func);
      this.buttons[this.buttoncount].buttonPointer.attribute('id',name);
      this.buttons[this.buttoncount].buttonPointer.hide();
      this.buttoncount+=1;
  }

  this.draw=function(){
    push();
    strokeWeight(this.borderthick);
    stroke(this.border,this.alpha);
    fill(this.brightness,this.alpha);
    rect(this.x,this.y,this.w,this.h);
    pop();
    for(var i =0; i<this.buttons.length;i++){
      var b = this.buttons[i];
      drawButton(this.x+b.x,this.y+b.y,b.w,b.h,b.text);
    }
  }

  this.toggleOpen=function(){
    if(this.isOpen){
    this.close();
  }
    else if(!this.isOpen){
    this.open();
    }
  }
  this.open=function(){
    this.isOpen=true;
  }
  this.close=function(){
    this.isOpen=false;
  }


}
function drawButton(x,y,w,h,text){
  push();
  strokeWeight(.25);
  stroke(0,100);
  fill(100);
  rect(x,y,w,h);
  stroke(225);
  strokeWeight(.125);
    fill(27);
   textFont('Helvetica');
  textSize(12);
  var paddingx=10;
  var paddingy=20;
    text(text,x+paddingx,y+paddingy);
  pop();
}

function cloth(){
  var tot = points.length;
     for (var i = 0; i < 10; i++) {
       for (var j = 0; j<10; j++){
        points.push({
           ind: generateID(),
           strokew: 0.5,
           color: 200,
           lock: false,
           x: 30 + 30 * i,
           y: 30 + 30 * j,
           oldx: 30 + 30 * i,
           oldy:  30 + 30 * j,
           lockx: 30 + 30 * i,
           locky:  30 + 30 * j,
           nextx: 30 + 30 * i,
           nexty:  30 + 30 * j,
           collided: false,
           mass: 1,
           r: 10,
           friction: 1,
           theta: 0,
           w: 1,
           isSelected: false,
           ff: 0
        });
     }
   }
  }
function linkstring(){
  if (points.length > 1) {
    var strlinks=[];
     for (var i = 0; i < points.length; i++) {
             if(points[i].isSelected){
               strlinks.push(points[i]);
        }
     }
     for(var i = 1; i<strlinks.length;i++){
       links.push({
          p0: strlinks[i],
          p0ind: strlinks[i].ind,
          p1: strlinks[i-1],
          p1ind: strlinks[i-1].ind,
          Length: distance(strlinks[i], strlinks[i-1])
       });
     }
  }
}
function Body(){
 this.data={};
  this.createBody=function(xpos,ypos){
       this.data={
       ind: generateID(),
       strokew: 0.5,
       color: 200,
       lock: false,
       x: xpos,
       y: ypos,
       oldx: xpos,
       oldy: ypos,
       lockx: xpos,
       locky: ypos,
       nextx: xpos,
       nexty: ypos,
       collided: false,
       mass: 1,
       r: 10,
       friction: 1,
       theta: 0,
       w: 1,
       isSelected: false
     };
 }

     this.draw=function(){
            if(this.data.lock) {
             drawlockedbody(this.data.x, this.data.y, this.data.r * this.data.mass, this.data.r * this.data.mass, this.data.theta);
          } else if(this.data.isSelected){
            drawSelectedbody(this.data.x, this.data.y, this.data.r * this.data.mass, this.data.r * this.data.mass, this.data.theta);
          }else {
             drawregularbody(this.data.x, this.data.y, this.data.r * this.data.mass, this.data.r * this.data.mass, this.data.theta, this.data.ff);
          }
       }



 }
function ToggleCollisions(){
   if(!collisions){
     collisions=true;
 }
 else if(collisions){
   collisions =false;
 }
}
function blob(){
     var strdata = document.getElementById("blub").innerHTML;
     console.log(strdata.split("_"));
     var stray = strdata.split("_");
     var ps=[];
     var ls=[];
     for(var i = 0; i<stray.length;i++){
        if(stray[i].startsWith("p")){
           ps.push(stray[i]);
        }
        if(stray[i].startsWith("l")){
           ls.push(stray[i]);
        }
     }
     for(var i = 0; i<ps.length;i++){
     var pp = ps[i].split(" ");
          points.push({
                 ind: int(pp[1]),
                 strokew: int(pp[2]),
                 color: int(pp[3]),
                 lock: bool(pp[4]),
                 x: int(pp[5]),
                 y: int(pp[6]),
                 oldx: int(pp[7]),
                 oldy: int(pp[8]),
                 lockx: int(pp[9]),
                 locky: int(pp[10]),
                 nextx: int(pp[11]),
                 nexty: int(pp[12]),
                 collided: bool(pp[13]),
                 mass: int(pp[14]),
                 r: int(pp[15]),
                 friction: int(pp[16]),
                 theta: int(pp[17]),
                 w: int(pp[18]),
                 isSelected: bool(pp[19]),
                 ff: int(pp[20])
              });
     }
     for(var i = 0; i<ls.length;i++){
     var ll = ls[i].split(" ");
        links.push({
           p0: points[pidToIndex(ll[1])],
           p0ind: ll[1],
           p1: points[pidToIndex(ll[2])],
           p1ind: ll[2],
           Length: distance(points[pidToIndex(ll[1])],points[pidToIndex(ll[2])])
        });

     }
  }
function trussconnection(){

  var start1 = 50;
  var start2 = 100;
  createBody(start1,start1);  // points[points.length-4]    // 1
  createBody(start2,start1); // points[points.length-3]    // 2
  createBody(start1,start2); // points[points.length-2]    // 3
  createBody(start2,start2); // points[points.length-1]   // 4


  createlink(points[points.length-2],points[points.length-4]); // 3-1
  createlink(points[points.length-4],points[points.length-3]); // 1-2
  createlink(points[points.length-1],points[points.length-3]); // 4-2
  createlink(points[points.length-3],points[points.length-2]); // 3-2
  createlink(points[points.length-2],points[points.length-1]); // 3-4
  createlink(points[points.length-1],points[points.length-4]); // 4-1

  createBody(start2,start1+start2);
  createBody(start1,start1+start2);

  createlink(points[points.length-2],points[points.length-1]);
  createlink(points[points.length-1],points[points.length-3]);
  createlink(points[points.length-1],points[points.length-4]);
  createlink(points[points.length-3],points[points.length-2]);
  createlink(points[points.length-2],points[points.length-4]);




}
function MenuButton() {
  this.init = function(x, y, w, h, name, type){
  	this.x = x;
  	this.y = y;
  	this.w = w;
  	this.h = h;
    this.r=230;
    this.g=230;
    this.b=230;
    this.a=230;
    this.stroke=0;
    this.strokeWeight=.5;
  	this.name = name;
  	this.type = type;
    this.isHover=false;
  }
  this.setColor=function(r,g,b,a,str,strw){
    this.r=r
    this.g=g;
    this.b=b;
    this.a=a;
    this.stroke=str;
    this.strokeWeight=strw;
  }
  this.update = function() {
    if(this.checkHover() && this.mousePressed){
  		 this.isPressed = true;
       this.isHover = true;
  	 }

  }
  this.checkHover=function(){
    if (mouseX > this.x && mouseX < this.x+this.w &&
        mouseY > this.y && mouseY < this.y+this.h){
          return true;
        }
        else{
          return false;
        }
  }
  this.draw = function(){
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    fill(this.r,this.h,this.b,this.a);
    	rect(this.x,this.y,this.w,this.h);
      textAlign(CENTER);
      textSize(12);
    text(this.name,this.x,this.y);
  }
  this.mousepress = function(){
      this.mousePressed = true;
  }
  this.mousereleased = function(){
    this.mousepress=false;
  }
  this.expand = function(){
  	this.expanded = true;
  }
  this.collapse = function(){
  	this.expanded = false;
  	}
  }
