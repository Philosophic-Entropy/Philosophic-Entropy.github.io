var istart = 0;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var len = 10;
var pinit = 0.01;
var mtime=500;

var xlen = new Array();
var ylen = new Array();

var canvas = document.getElementById("myCanvas");
var ysize = canvas.height;
var xsize = canvas.width;

ctx.strokeStyle="black";
ctx.fillStyle="black";
ctx.beginPath();
ctx.moveTo(5,           5);
ctx.lineTo(xsize*0.5-5, 5);
ctx.lineTo(xsize*0.5-5, ysize-5);
ctx.lineTo(5,           ysize-5);
ctx.lineTo(5,           5);
ctx.stroke();


ctx.beginPath();
ctx.moveTo(xsize-5,     5);
ctx.lineTo(xsize*0.5+5,  5);
ctx.lineTo(xsize*0.5+5, ysize-5);
ctx.lineTo(xsize-5,      ysize-5);
ctx.lineTo(xsize-5,      5);
ctx.stroke();

var xstart = 5;

// setup up grid
var xgrid = xsize / len/2;
var ygrid = ysize / len;

var igrid = new Array();
var lgrid = new Array();
var ixpoly = new Array();
var iypoly = new Array();
var nipoly = new Array();
var npoly = 0;
var npolyf = 5;
var nmaxl = 200;
var len1=1;
var len2=1;
var fill1 = npoly;
var fill2 = npolyf;
var apoly = new Array();

for (var i = 0; i <=npoly+npolyf; i++) {
    ixpoly[i] = new Array();
    iypoly[i] = new Array();
    nipoly[i] = 0;
    apoly[i]=1;
    for (var j=0; j <= nmaxl; j++) {
        ixpoly[i][j]=0;
        iypoly[i][j]=0;
    }
}


for (i=0; i <= 2*xgrid; i++) {
    igrid[i] = new Array();
    lgrid[i] = new Array();
    for (j=0; j <= ygrid; j++) {
        igrid[i][j]=0;
        lgrid[i][j] = new Array();
        for (var k = 0; k <4; k++) {
            lgrid[i][j][k]=0;
        }  
  }
}

// now, initiate polymers, randomly
for (i = 0; i <=npoly+npolyf; i++) {
    var ifind=1;
    while (ifind==1) {
    
        var drand = Math.random()
        var xdrand = drand * (xgrid-10)+5;
        drand = Math.random()
        var ydrand = drand * (ygrid-10)+5;
        
        var ix = Math.round(xdrand);
        var iy = Math.round(ydrand);

        if (i >= npoly) {
            ix = ix + xgrid;
        }
    
        nipoly[i]=1;
        if (igrid[ix][iy]==0) {
            ixpoly[i][0]=ix;
            iypoly[i][0]=iy;
            igrid[ix][iy]=1;
            ifind = 0;
        } else {
            ifind = 1;
        }
    }
}



// fills grid position
function fgrid(xilen,yilen) {
  var i = xilen/len;
  var j = yilen/len;
  igrid[i][j]=1;
  
  return
}

function checkgrid(ix,iy,ip) {
    if (ip==1) {
        if (ix > xgrid-5) {
            return 1;
        }else if (ix < 5) {
            return 1;
        }
    } else {
        if (ix > 2*xgrid-5) {
            return 1;
        }else if (ix < xgrid+5) {
            return 1;
        }
    }
    if (iy > ygrid-5) {
        return 1;
    }else if (iy < 5) {
        return 1;
    }
    
    if (igrid[ix][iy]==1) {
        return 1;
    } else {
        igrid[ix][iy]=1;
        return 0;
    }
}



function  movepoly() {
    // First, move polymer one length higher
    len1 = 0;
    
    ctx.strokeStyle="red";
    ctx.fillStyle="red";
        
	for (i=5; i < xgrid-5; i++) {
        for (j=5; j < ygrid-5; j++) {
            drand = Math.random();
            if (drand < pinit) {
                if (igrid[i][j] < 2) {
                    drand = Math.random();
                    var itgrid = 0;
                    var jtgrid = 0;
                    if (drand < 0.25) { // check right
                        itgrid = 0;
                        jtgrid = 2;
                        ix = i + 1;
                        iy = j;
                    }else if (drand < 0.5) { // check down
                        itgrid = 1;
                        jtgrid = 3;
                        ix = i;
                        iy = j - 1;
                    }else if (drand < 0.75) { // check left
                        itgrid = 2;
                        jtgrid = 0;
                        ix = i - 1;
                        iy = j;
                    }else { // check up
                        itgrid = 3;
                        jtgrid = 1;
                        ix = i;
                        iy = j + 1;
                    }
                    if (lgrid[i][j][itgrid]==0) {
                        var ifind = checkgrid(ix,iy,1);
                        if (ifind==0 && igrid[ix][iy]<2) {
                            if (lgrid[ix][iy][jtgrid]==0) {
                                
                                var count1=0;
                                var count2=0;
                                for (var n=0; n<4;n++) {
                                    count1=count1+lgrid[i][j][n];
                                    count2=count2+lgrid[ix][iy][n];
                                }
                                if (count1<2 && count2<2) {        
                                    igrid[i][j]=igrid[i][j]+1;
                                    igrid[ix][iy] = igrid[ix][iy] + 1;
                                
                                    lgrid[i][j][itgrid]=1;  
                                    lgrid[ix][iy][jtgrid]=1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    var ngrid = 0;
    var npoly = 0;
    for (i=5; i < xgrid-6; i++) {
        for (j=5; j < ygrid-6; j++) {
            // now draw lines
            if (igrid[i][j]>0) {
                ngrid++;
                
                if (igrid[i][j]==1) {
                    npoly++;
                }
                
                if (lgrid[i][j][0]>0) {  
                    ix = i+1;
                    iy = j;
                    if (igrid[ix][iy]>0 && lgrid[ix][iy][2]>0) {
                        ctx.beginPath();
                        ctx.moveTo(i*len,j*len);
                        ctx.lineTo(ix*len, iy*len);
                        ctx.stroke();
                    }
                }
                
                
                if (lgrid[i][j][3]>0) {  
                    ix = i;
                    iy = j+1;
                    if (igrid[ix][iy]>0 && lgrid[ix][iy][1]>0) {
                        ctx.beginPath();
                        ctx.moveTo(i*len,j*len);
                        ctx.lineTo(ix*len, iy*len);  
                        ctx.stroke();
                    }
                }
            }
            
        }
    }
    
    fill1 = Math.round(1000*ngrid/ (xgrid-10)/(ygrid-10))/1000
    
    len1 = Math.round(100*ngrid/npoly)/100;
    
	return
}


function  movepoly2() {
    // First, move polymer one length higher
    len2 = 0;
	for (i=npoly; i < npoly+npolyf; i++) {
        // first check to see if we can increment chain
        drand = Math.random();
        
        if (drand < 1.1) {      
            var n = nipoly[i]-1;
            ix = ixpoly[i][n];
            iy = iypoly[i][n];
        
            drand = Math.random();
            if (drand < 0.25) { // check right
                ix = ix + 1;            
            }else if (drand < 0.5) { // check down
                iy = iy - 1;
            }else if (drand < 0.75) { // check left
                ix = ix - 1;
            }else { // check up
                iy = iy + 1;
            }
        
            var ifind = checkgrid(ix,iy,2);
            
            if (ifind==0 && nipoly[i] < nmaxl) {
                nipoly[i]++;
                n = nipoly[i]-1;
                ixpoly[i][n] = ix;
                iypoly[i][n] = iy;
            }
        }
        
        ctx.strokeStyle="blue";
        ctx.fillStyle="blue";
        
        len2 = len2 + nipoly[i];
        if (nipoly[i]>1) {
            // now draw lines
            ctx.beginPath();
            n = 0
            ix = ixpoly[i][n];
            iy = iypoly[i][n];
        
            ix = ix*len + xstart;
            iy = iy*len;
            
            ctx.moveTo(ix,iy);
            
            for (j =0; j < nipoly[i]; j++)  {
                ix = len*ixpoly[i][j]+xstart;
                iy = len*iypoly[i][j];
            
                ctx.lineTo(ix, iy);
            }
        
        
            ctx.stroke();
        }
    }
    fill2 = Math.round(1000*len2/ (xgrid-10)/(ygrid-10))/1000;
        
    len2 = len2 / npolyf;
    
	return
}

                       
function runsim() {
    if (istart==0) return;
    
    movepoly();  
    
    ctx.fillStyle="white";
    ctx.fillRect(10, ysize-28, 310, 22);
    
    ctx.font = "20px Arial";
    ctx.fillStyle="red";
    ctx.fillText("<N>=",10,ysize-10); 
    ctx.fillText(len1,70,ysize-10); 
    ctx.fillText("den=",150,ysize-10); 
    ctx.fillText(fill1,200,ysize-10); 
    movepoly2();  
    
    ctx.fillStyle="white";
    ctx.fillRect(10+xsize*0.5, ysize-28, 310, 22);
    
    ctx.font = "20px Arial";
    ctx.fillStyle="blue";
    ctx.fillText("<N>=",10+xsize*0.5,ysize-10); 
    ctx.fillText(len2,70+xsize*0.5,ysize-10); 
    ctx.fillText("den=",150+0.5*xsize,ysize-10); 
    ctx.fillText(fill2,200+0.5*xsize,ysize-10); 
}



document.addEventListener("click", function(event) {
    
    if (istart==0) {
        istart=1;
        var timer=setInterval(function(){
            runsim();
            }, mtime); // the above code is executed every 100 ms
    } else {
        istart=0;
            
    }
    
	return
    
});
   