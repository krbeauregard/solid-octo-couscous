function matrix(m, n, initial) {
    this.m = m;
    this.n = n;
    this.data = [];
    this.create(m, n, initial);
}


/* Given: m a number of rows, n a number of columns, initial an initial value
 *        for all the rows.
 * Construct: an m x n mathematical matrix.
 */
matrix.prototype.create = function(m, n, initial) {
    for (i = 0; i < m; ++i) {
        this.row = [];
        for (j = 0; j < n; ++j) {
            this.row[j] = initial;
        }
        this.data[i] = this.row;
        //console.log("creating data: " + this.data);
    }
}

/* Given: an array of arrays mat
 * Return: a new matrix with the same data as mat.
 */
matrix.prototype.copy = function() {
    newmat = new matrix(this.m, this.n, 0);
    for (i = 0; i < this.m; ++i) {
        for (j = 0; j < this.n; ++j) {
            newmat.set(i, j, this.data[i][j]);
        }
    }
    newmat.data = this.data;
    console.log("newmat: ", newmat);
    return newmat;
}


/* Given: mth row, nth col and value val
 * Set: the matrix[m][n] to val */
matrix.prototype.set = function(m, n, val) {
    if (m > this.m) {
        console.log("Error: Trying to set outside range of matrix row.");
        return;
    }
    if (n > this.n) {
        console.log("Error: Trying to set outside range of matrix row.");
        return;
    }
    this.data[m][n] = val; 
    //console.log("Set "+m+", "+n+" to "+val+".");
    //console.log("Current data: " + this.data);
}


/* Print the matrix */
matrix.prototype.print = function() {
    str = "";
    for (i = 0; i < this.data.length; ++i) {
        for (j = 0; j < this.data[i].length; ++j) {
            str += this.data[i][j];
            str += " "
        }
        str += "\n";
    }
    console.log(str);
}

matrix.prototype.html_table = function() {
    str = "<table><th>Table</th>";
    for (i = 0; i < this.m; ++i) {
        str += "<tr>";
        for (j = 0; j < this.n; ++j) {
            str += "<td>"+this.data[i][j]+"</td>";
        }
        str += "</tr>";
    }
    str += "</table>";
    return str;
}

/* Compute the reduced row echelon form of this matrix.
 * This makes use of the copy function to return a new matrix object rather
 * than modifying the current matrix.
 */
matrix.prototype.rref = function() {
    var A = this.data;
    //console.log("A:\n", A);
    var rows = A.length;
    //console.log("rows: ", rows);
    var columns = A[0].length;
    //console.log("cols: ", columns);
    
    var lead = 0;
    for (var k = 0; k < rows; k++) {
        if (columns <= lead){
            return;
            console.log("Columns < lead. Exiting");
        }

        var i = k;
        while (A[i][lead] === 0) {
            i++;
            if (rows === i) {
                i = k;
                lead++;
                if (columns === lead) {
                    console.log("Columns === lead. Exiting");
                    return;
                }
            }
        }
        var irow = A[i], krow = A[k];
        A[i] = krow, A[k] = irow;
         
        var val = A[k][lead];
        for (var j = 0; j < columns; j++) {
            A[k][j] /= val;
        }
         
        for (var i = 0; i < rows; i++) {
            if (i === k) continue;
            val = A[i][lead];
            for (var j = 0; j < columns; j++) {
                A[i][j] -= val * A[k][j];
            }
        }
        lead++;
    }
    newmat = this.copy(A);
    return newmat;
}

function ludcmp(mat) {
    n = 0;
    lu = mat.copy()                     //Stores the decompositio
    indx = new Array();                 //Stores the permutation
    d = 0.0;                            //Used by det
    this.init(mat);
    return this;
}

/* Initialize the LU decomposition object */
ludcmp.prototype.init = function(mat) {
    this.n = mat.m;
    this.indx = n;
    tiny = 1.0e-40;
    imax = 0;
    big = 0;
    temp = 0;
    vv = new Array(this.n);
    this.d = 1.0;
    
    lu.print();
    for (i = 0; i < this.n; ++i) {
        big = 0.0;
        for (j = 0; j < this.n; ++j) {
            temp = Math.abs(lu.data[i][j]);
            console.log("data: " , lu.data[i][j]);
            console.log("temp: ", temp)
            if (temp > big) {
                big = temp;
                console.log("big: " + big);
            }
        }
        if (big === 0.0) {
            console.log("Singular matrix in ludcmp");
            return
        }
        vv[i] = 1.0 / big;
    }
    for (k = 0; i < this.n; ++k) {
        big = 0.0;
        for ( i = k; i < this.n; ++i) {
            temp = vv[i] * Math.abs(lu[i][k]);
            if (temp > big) {
                big = temp;
                imax = i;
            }
        }
        if (k !== imax) {
            for (j = 0; j < this.n; ++j) {
                temp = lu[imax][j];
                lu[imax][j] = lu[k][j];
                lu[k][j] = temp;
            }
            d = -d;
            vv[imax] = vv[k];
        }
        indx[k] = imax;
        
        if (lu[k][k] === 0.0) lu[k][k] = tiny;

        for (i = k+1; i < this.n; ++i) {
            temp = lu[i][k] /= lu[k][k];
            for (j = k+1; j < n; ++j) {
                lu[i][j] -= temp * lu[k][j];
            }
        }
    }
}

/* Solve for a single right-hand side */
ludcmp.prototype.solve = function(b, x) {

}

/* Calculate the matrix inverse */
ludcmp.prototype.inverse = function() {


}

/* Return the determinant */
ludcmp.prototype.det = function() {}



m = new matrix(3, 3, 0);
m.print();
m.set(0, 0, 4);
m.set(0, 1, 3);
m.set(0, 2, 8);
m.set(1, 0, 2);
m.set(1, 1, 5);
m.set(1, 2, 8);
m.set(2, 0, 1);
m.set(2, 1, 2);
m.set(2, 2, 6);
m.print();
//n = m.rref();
//n.print();
//m.print();
lu = new ludcmp(m);

lu.lu.print();
