var istart = 0;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var ntot = 5;
var dstep = 200;
var mtime=10;

var nn = new Array(ntot);
nn[0] = 1;
nn[1] = 2;
nn[2] = 4;
nn[3] = 10;
nn[4] = 100;


var canvas = document.getElementById("myCanvas");
var ysize = canvas.height;
var xsize = canvas.width;

ctx.strokeStyle="black";
ctx.fillStyle="black";
ctx.beginPath();
ctx.moveTo(5,           5);
ctx.lineTo(xsize-5, 5);
ctx.lineTo(xsize-5, ysize-5);
ctx.lineTo(5,           ysize-5);
ctx.lineTo(5,           5);
ctx.stroke();

var rsize = 5+ysize/20/ntot;
var rsize2 = rsize*1.1;

var xstart = 2*rsize+5;
var xend = xsize - 2*rsize-5;

var x1 = xstart;
var y1 = ysize/(ntot+2);        
var x2 = [];
var y2 = [];

var istep = -1;
var distep = 1;
var dd = (xend-xstart)/dstep;
var xmsize = xend-xstart;
var nstep = Math.round(xmsize/dd );

// setup rhoi to equal nstep
var rhoi = new Array(ntot);  
for (var n = 0; n < ntot; n++) {
    x2[n] = xstart;
    y2[n] = (n+2)*ysize/(ntot+2);
    rhoi[n] = new Array(nstep);
    
    var trho = 0;
    for (var i=0; i < nstep; i++) {
        var rho = 1.0-Math.pow(Math.sin(nn[n]*Math.PI*i/nstep),2);
        rhoi[n][i] = rho;
        
        trho = trho + rhoi[n][i];
    }

    trho = nstep / trho;  // scale rho by nstep
    for (i=0; i < nstep; i++) {
        rhoi[n][i] = rhoi[n][i]*trho;
    }
}

var dx1 = dd;
var dx2 = dd;
var nmult = 0.0;    

function runsim() {
    
    ctx.strokeStyle="black";
    ctx.fillStyle="black";
    ctx.beginPath();
    ctx.moveTo(5,           5);
    ctx.lineTo(xsize-5, 5);
    ctx.lineTo(xsize-5, ysize-5);
    ctx.lineTo(5,           ysize-5);
    ctx.lineTo(5,           5);
    ctx.stroke();

    if (istart==0) return;
    istep = istep + distep;
    
    if (istep>=nstep-1) {
        distep = -1;
    } else if (istep <= 0) {
        distep = 1;
        x1 = xstart;
        for (n=0; n < ntot; n++) {
            x2[n] = xstart;
        }
    }
    
    
    ctx.font = "12px Arial";
    ctx.fillStyle = "red";
    
    
    // Circle one
    ctx.beginPath();
    ctx.clearRect(x1-rsize-5,y1-rsize-5,2*rsize+10,2*rsize+10);
    ctx.clearRect(xsize*0.5-30,ysize*0.5+10,100,20);
        
    dx1 = dd*distep;
    x1 = x1 + dx1;

    ctx.fillText("classical",0.5*xsize-20,y1-2*rsize);
    ctx.arc(x1,y1,rsize,0,2*Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    
    
    ctx.strokeStyle="red";
    ctx.beginPath();
    rho = 2*rsize;
    ctx.moveTo(xstart,y1+rho-rsize);
    var xx = 0;
    for (i=0; i<nstep; i++) {
        xx = xx + dd;
        rho = 2*rsize;
        ctx.lineTo(xstart+xx,y1+rho-rsize);
    }
    ctx.stroke();
    /*
    // Text
    
    ctx.fillText(rhoi[0][istep],xsize*0.5-20,ysize*0.5+20)
    ctx.fillText(x2[0],xsize*0.5+20,ysize*0.5+20)
    */
    
    for (n=0; n<ntot; n++) {
    // Circle Two
        ctx.beginPath();
        ctx.clearRect(x2[n]-rsize-5,y2[n]-rsize-5,2*rsize+10,2*rsize+10);
        dx2 = dd*distep*rhoi[n][istep];
                
        x2[n] = x2[n] + dx2;
        
        if (x2[n] < xstart) {
            x2[n] = xstart;
        } else if (x2[n] > xend) {
            x2[n] = xend;
        }
    
        ctx.fillStyle = "blue";
        ctx.fillText(nn[n],0.5*xsize+15,y2[n]-2*rsize);
//        ctx.clearRect(0.5*xsize-25,y2[n]-40,100,20);
//        ctx.fillText(rhoi[n][istep],0.5*xsize-5,y2[n]-30);
        ctx.fillText("n =",0.5*xsize-10,y2[n]-2*rsize);
        ctx.fill();
        
        var grd= ctx.createRadialGradient(x2[n],y2[n],0,x2[n],y2[n],rsize2);  
        grd.addColorStop(0,"blue");
        grd.addColorStop(1,"white");
        ctx.arc(x2[n],y2[n],rsize2,0,2*Math.PI);
        
        ctx.fillStyle = grd;
        ctx.fill();
        
        ctx.strokeStyle="blue";
        ctx.beginPath();
        rho = 2*rsize*(rhoi[n][0]);
        ctx.moveTo(xstart,y2[n]+rho-rsize);
        xx = 0;
        for (i=0; i<nstep; i++) {
            xx = xx + dd;
            rho = 2*rsize*(rhoi[n][i]);
            ctx.lineTo(xstart+xx,y2[n]+rho-rsize);
        }
        ctx.stroke();
        
    }
    return;
}



document.addEventListener("click", function(event) {
    
    if (istart==0) {
        istart=1;
        nmult = nmult + 1;
        var timer=setInterval(function(){    
            runsim();
            }, mtime); // the above code is executed every 100 ms
    } else {
        istart=0;
        
    }
    
	return
    
});
   