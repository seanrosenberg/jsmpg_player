// augment Sylvester some
Matrix.Translation = function (v)
{
  if (v.elements.length == 2) {
    var r = Matrix.I(3);
    r.elements[2][0] = v.elements[0];
    r.elements[2][1] = v.elements[1];
    return r;
  }

  if (v.elements.length == 3) {
    var r = Matrix.I(4);
    r.elements[0][3] = v.elements[0];
    r.elements[1][3] = v.elements[1];
    r.elements[2][3] = v.elements[2];
    return r;
  }

  throw "Invalid length for Translation";
};

Matrix.prototype.flatten = function ()
{
    var result = [];
    if (this.elements.length === 0)
        return [];


    for (var j = 0; j < this.elements[0].length; j++)
        for (var i = 0; i < this.elements.length; i++)
            result.push(this.elements[i][j]);
    return result;
};

Matrix.prototype.ensure4x4 = function()
{
    if (this.elements.length == 4 &&
        this.elements[0].length == 4)
        return this;

    if (this.elements.length > 4 ||
        this.elements[0].length > 4)
        return null;

    for (var i = 0; i < this.elements.length; i++) {
        for (var j = this.elements[i].length; j < 4; j++) {
            if (i == j)
                this.elements[i].push(1);
            else
                this.elements[i].push(0);
        }
    }

    for (var i = this.elements.length; i < 4; i++) {
        if (i === 0)
            this.elements.push([1, 0, 0, 0]);
        else if (i == 1)
            this.elements.push([0, 1, 0, 0]);
        else if (i == 2)
            this.elements.push([0, 0, 1, 0]);
        else if (i == 3)
            this.elements.push([0, 0, 0, 1]);
    }

    return this;
};

Matrix.prototype.make3x3 = function()
{
    if (this.elements.length != 4 ||
        this.elements[0].length != 4)
        return null;

    return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
                          [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
                          [this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
};

Vector.prototype.flatten = function ()
{
    return this.elements;
};

function mht(m) {
    var s = "";
    if (m.length == 16) {
        for (var i = 0; i < 4; i++) {
            s += "<span style='font-family: monospace'>[" + m[i*4+0].toFixed(4) + "," + m[i*4+1].toFixed(4) + "," + m[i*4+2].toFixed(4) + "," + m[i*4+3].toFixed(4) + "]</span><br>";
        }
    } else if (m.length == 9) {
        for (var i = 0; i < 3; i++) {
            s += "<span style='font-family: monospace'>[" + m[i*3+0].toFixed(4) + "," + m[i*3+1].toFixed(4) + "," + m[i*3+2].toFixed(4) + "]</font><br>";
        }
    } else {
        return m.toString();
    }
    return s;
}

//
//
//
// Usage for myself
//
//

function GetEye4() {
    return [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];

}


function GetResolutionMatrix(resolution) {
    var I4 = GetEye4();
    if (resolution > 0) {
        I4[I4.length - 1] = resolution;
    }
    return I4;
}

function GetZoomMatrix(zoom) {
    var I4 = GetEye4();
    if (arguments.length !== 0) {
        I4[I4.length - 1] *= zoom;
    }
    return I4;
}

function GetScaleMatrix(x_scale, y_scale, z_scale) {
    var I4 = GetEye4();
    if (arguments.length !== 0) {
        I4[0] *= x_scale;
        I4[5] *= y_scale;
        I4[10] *= z_scale;
    }
    return I4;
}

function GetTranslateMatrix(Tx, Ty, Tz) {
	var I4;
    if (arguments.length !== 0) {
        I4 = GetEye4();
        var I4_length = I4.length;
        I4[I4_length - 4] = Tx;
        I4[I4_length - 3] = Ty;
        I4[I4_length - 2] = Tz;
    }
    return I4;
}

function GetCorrectedZunit(fov) {
	var result = 0.5/Math.tan(0.5 * fov * Math.PI /180.0);
	return result;
}

function GetCartesianMatrix(w_res, h_res, z_res) {
	var result = GetEye4();
	result[0] /= w_res;
	result[5] /= h_res;
	result[10] /= z_res;
	return result;
}

function GetCartesianVtx(canvas_w, canvas_h) {
	return new Float32Array([
			0, 0, 
			canvas_w, 0,
		   	0, canvas_h,
		   	0, canvas_h,
		   	canvas_w, 0,
		   	canvas_w, canvas_h]);
}

function GetMaxFovWithPerspective(z_near) {
	var result = 2* Math.atan(0.5/z_near) * 180 / Math.PI;
	return result;
}

//
// gluLookAt
//
//
//

function LookAt(matrix) {
	var result = Matrix.I(4);
	result = makeLookAt(matrix[0],matrix[1],matrix[2],
	matrix[3],matrix[4],matrix[5],
	matrix[6], matrix[7], matrix[8]);

	return new Float32Array(result.flatten());

}

function makeLookAtMatrix(ex, ey, ez, cx, cy, cz, ux, uy, uz)
{
	return new Float32Array(makeLookAt(ex,ey,ez,cx,cy,cz,ux,uy,uz).flatten());
}

function makeLookAt(ex, ey, ez,
                    cx, cy, cz,
                    ux, uy, uz)
{
    var eye = $V([ex, ey, ez]);
    var center = $V([cx, cy, cz]);
    var up = $V([ux, uy, uz]);

    var mag;

    var z = eye.subtract(center).toUnitVector();
    var x = up.cross(z).toUnitVector();
    var y = z.cross(x).toUnitVector();

    var m = $M([[x.e(1), x.e(2), x.e(3), 0],
                [y.e(1), y.e(2), y.e(3), 0],
                [z.e(1), z.e(2), z.e(3), 0],
                [0, 0, 0, 1]]);

    var t = $M([[1, 0, 0, -ex],
                [0, 1, 0, -ey],
                [0, 0, 1, -ez],
                [0, 0, 0, 1]]);
    return m.x(t);
}

//
// glOrtho
//
function makeOrtho(left, right,
                   bottom, top,
                   znear, zfar)
{
    var tx = -(right+left)/(right-left);
    var ty = -(top+bottom)/(top-bottom);
    var tz = -(zfar+znear)/(zfar-znear);
	var result = Matrix.I(4);
	result = $M([[2/(right-left), 0, 0, tx],
               [0, 2/(top-bottom), 0, ty],
               [0, 0, -2/(zfar-znear), tz],
               [0, 0, 0, 1]]);

    return new Float32Array(result.flatten()); 

}

//
// gluPerspective
//
function makePerspective(fovy, aspect, znear, zfar)
{
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

//
// glFrustum
//
function makeFrustum(left, right,
                     bottom, top,
                     znear, zfar)
{
    var X = 2*znear/(right-left);
    var Y = 2*znear/(top-bottom);
    var A = (right+left)/(right-left);
    var B = (top+bottom)/(top-bottom);
    var C = -(zfar+znear)/(zfar-znear);
    var D = -2*zfar*znear/(zfar-znear);

   	var result = Matrix.I(4);
	result = $M([[X, 0, A, 0],
               [0, Y, B, 0],
               [0, 0, C, D],
               [0, 0, -1, 0]]);

    return new Float32Array(result.flatten()); 
}

//
// glOrtho
//
function makeOrtho(left, right, bottom, top, znear, zfar)
{
    var tx = - (right + left) / (right - left);
    var ty = - (top + bottom) / (top - bottom);
    var tz = - (zfar + znear) / (zfar - znear);
	var result = Matrix.I(4);
	result = $M([[2 / (right - left), 0, 0, tx],
           [0, 2 / (top - bottom), 0, ty],
           [0, 0, -2 / (zfar - znear), tz],
           [0, 0, 0, 1]]);

    return new Float32Array(result.flatten());

}


function makeTranslation(vector) {
	var result = multMatrix(Matrix.Translation($V([vector[0], vector[1], vector[2]])).ensure4x4());	
	return result.flatten();
}

function multMatrix(m) {
	var mvMatrix = Matrix.I(4);
	return  mvMatrix.x(m);
}
