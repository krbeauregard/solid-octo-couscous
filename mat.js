/*****************************************************************************
 * Return a matrix object that the following methods:
 *
 * init             - Initialize a matrix with a shape and initial values.
 * copy             - Copy this matrix to another matrix.
 * print            - Print this matrix to the console.
 * within_bounds    - Check that the given dimension are within the matrix.
 * get              - Return the value at matrix[m][n].
 * set              - Set matrix[m][n] to a value.
 * html_table       - Return a string containing an html table.
 * from_html_table  - Get a matrix from the DOM
 * tobrowser        - Insert the matrix into the DOM.
 * random_int_mat   - Return a matrix of random integers.
 * rref             - Return a new matrix in RREF
 ****************************************************************************/
function matrix(m, n, initial) {
    return {
        data: [],   /* an array of arrays that holds the matrix values */
        m: 0, n:0,  /* dimensions */

        /*********************************************************************
         * Given number of rows m, number of columns n, and an initial value.
         * Construct a m x n matrix with every element intialized to initial.
         ********************************************************************/
        init: function(m, n, initial) {
            this.m = m;
            this.n = n;
            for (i = 0; i < m; ++i) {
                var row = [];
                for (j = 0; j < n; ++j) {
                    row[j] = initial;
                }
                this.data[i] = row;
            }
        },

        /*********************************************************************
         * Copy this matrix to another matrix.
         ********************************************************************/
        copy: function() {
            var m = matrix();
            m.m = this.m;
            m.n = this.n;
            for (var i = 0; i < this.m; ++i) {
                var row = this.data[i].slice(0);
                m.data[i] = row;
            }
            //m.data = this.data.slice(0, -1);
            return m;
        },

        equals: function(rhs_mat) {
             if (this.m !== rhs_mat.m || this.n !== rhs_mat.n) return false;
             for (var i = 0; i < this.m; ++i) {
                for (var j = 0; j < this.n; ++j) {
                    if (this.get(i, j) !== rhs_mat.get(i, j)) return false;
                }
             }
             return true;
        },

        /*********************************************************************
         * Create a matrix from an array of arrays.
         ********************************************************************/
        fromarray: function(arr) {
            this.m = arr.length;
            this.n = arr[0].length;
            for (var i = 0; i < this.m; ++i) {
                var row = arr[i].slice(0);
                this.data[i] = row;
            }
        },

        /*********************************************************************
         * Print the matrix to the console
         ********************************************************************/
        print: function() {
            var str = "";
            for (i = 0; i < this.data.length; ++i) {
                for (j = 0; j < this.data[i].length; ++j) {
                    str += this.data[i][j];
                    str += " "
                }
                str += "\n";
            }
            console.log(str);
        },

        /*********************************************************************
         * Given m number of rows and n number of columns.
         * Check whether m and n are within the bounds of the matrix.
         ********************************************************************/
        within_bounds: function(m ,n) {
            if (m > this.m || m < 0) {
                console.log("Error: trying to access outside the range of matrix row.");
                return false;
            }
            if (n > this.n) {
                console.log("Error: Trying to access outside range of matrix row.");
                return false;
            }
            return true;
        },

        /*********************************************************************
         * Given the mth row, nth column.
         * Return the value stored at the coordinates.
         ********************************************************************/
        get: function(m, n) {
            if (this.within_bounds(m, n)) return this.data[m][n];
        },

        /********************************************************************
         * Given the mth row, nth column, and a numeric value.
         * Set Matrix[m][n] to value.
         ********************************************************************/
        set: function(m, n, val) {
            if (this.within_bounds(m, n)) this.data[m][n] = val; 
        },

        /*********************************************************************
         * Given m number of rows, n number of columns
         * Generate a matrix with elements in the range [min, max]
         ********************************************************************/
        random_int_mat: function(m, n, min, max) {
            var m = matrix();
            m.init(m, n, 0);
            if (m < 1 || n < 1) return;
            for (i = 0; i < m; ++i) {
                for (j = 0; j < n; ++j) {
                    val = Math.floor(Math.random() * (max-min) + min);
                    mat.data[i][j] = val;
                }
            }
            return mat;
        },

        /*********************************************************************
         * Given the id of a table body containing a matrix.
         * Construct a matrix object.
         *
         * It's important to retrieve the table body here and not the table 
         * itself, otherwise the indexing will be all wack.
         ********************************************************************/
        from_html_table: function(id) {
            var nrows = document.getElementById(id).rows.length;
            var ncols = document.getElementById(id).rows[0].cells.length;
            console.log("nrows: "+nrows+"ncols"+ncols);
            var mat = matrix();
            mat.init(nrows, ncols, 0);
            for (r = 0; r < nrows; ++r) {
                for (c = 0; c < ncols; ++c) {
                    mat.set(r, c, document.getElementById("A"+r+""+c).innerHTML);
                }
            }
            return mat;
        },

        /*********************************************************************
         * Given the title and DOM id of the table.
         * Return an html table string with title and id.
         *
         * This function adds the string "body" onto the id to use as an id for
         * the table body because retrieving the table values requires a unique
         * id for the table body. It also adds an id to each data element in
         * the form of *ij.
         ********************************************************************/
        html_table: function(id, title) {
            var str = "<table><th>"+title+"</th>";
            str += " <tbody id=\""+id+"body\">";
            for (i = 0; i < this.m; ++i) {
                str += "<tr>";
                for (j = 0; j < this.n; ++j) {
                    var elemid = "A"+i+""+j;
                    str += "<td id="+elemid+">"+this.get(i, j)+"</td>";
                }
                str += "</tr>";
            }
            str += "</tbody></table>";
            console.log(str);
            return str;
        },

        /*********************************************************************
         * Given a table body id and the title of the table.
         * Insert the table into the web page at id.
         *
         * This function uses html_table() to get the matrix data.
         ********************************************************************/
        tobrowser: function(id, title) {
            var table = this.html_table(id, title);
            div = document.getElementById(id);
            div.innerHTML = table;
        },

        /*********************************************************************
         * Compute the RREF of this matrix.
         *
         * This function copies the current matrix and returns a new matrix
         * containing the RREF. This way it doesn't change the current matrix.
         ********************************************************************/
        rref: function() {
            newmat = this.copy();
            var A = newmat.data;
            var rows = A.length;
            var columns = A[0].length;
            
            var lead = 0;
            for (var k = 0; k < rows; k++) {
                if (columns <= lead){ return; }

                var i = k;
                while (A[i][lead] === 0) {
                    i++;
                    if (rows === i) {
                        i = k;
                        lead++;
                        if (columns === lead) { return; }
                    }
                }
                var irow = A[i], krow = A[k];
                A[i] = krow, A[k] = irow;
                 
                var val = A[k][lead];
                for (var j = 0; j < columns; j++) { A[k][j] /= val; }
                 
                for (var i = 0; i < rows; i++) {
                    if (i === k) continue;
                    val = A[i][lead];
                    for (var j = 0; j < columns; j++) {
                        A[i][j] -= val * A[k][j];
                    }
                }
                lead++;
            }
            return newmat;
        }
    }
}


/*****************************************************************************
 * Returns an LU decomposition object
 *
 * This function/object has the following methods:
 *  init    - Initialize the ludcmp object.
 *  solve   - Solve for a single right hand side.
 *  inv     - Compute the matrix inverse.
 *  det     - compute the matrix determinant.
 ****************************************************************************/
function ludcmp(mat) {
    return {
        n: 0,
        lu: mat.copy(),                     // Stores the decomposition
        indx: [],                           // Stores the permutation
        d: 0.0,                             // Used by det

        init: function() {
            this.n = this.lu.m;
            this.indx = this.n;
            var tiny = 1.0e-40,             // A small number
                imax = 0,
                big = 0,
                temp = 0,
                vv = [];
            this.d = 1.0;
           
            for (var i = 0; i < this.n; ++i) {
                big = 0.0;
                for (var j = 0; j < this.n; ++j) {
                    temp = Math.abs(this.lu.data[i][j]);
                    if (temp > big) big = temp;
                }
                if (big === 0.0) return;
                vv[i] = 1.0 / big;
            }
            for (var k = 0; i < this.n; ++k) {
                big = 0.0;
                for (var i = k; i < this.n; ++i) {
                    temp = vv[i] * Math.abs(this.lu[i][k]);
                    if (temp > big) {
                        big = temp;
                        imax = i;
                    }
                }
                if (k !== imax) {
                    for (var j = 0; j < this.n; ++j) {
                        temp = this.lu[imax][j];
                        this.lu[imax][j] = this.lu[k][j];
                        this.lu[k][j] = temp;
                    }
                    d = -d;
                    vv[imax] = vv[k];
                }
                indx[k] = imax;
                
                if (this.lu[k][k] === 0.0) this.lu[k][k] = tiny;

                for (var i = k+1; i < this.n; ++i) {
                    temp = this.lu[i][k] /= this.lu[k][k];
                    for (j = k+1; j < n; ++j) {
                        this.lu[i][j] -= temp * this.lu[k][j];
                    }
                }
            }
        }, // end ludcmp init function

        det: function() {},
        inv: function() {},
        solve: function() {},
    }
}

function test_equals() {
    a1 = [[1, 2],
          [3, 4]];
    a2 = [[1, 2, 0], 
          [3, 4, 1],
          [0, 2, 4]];
    m1 = matrix();
    m1.fromarray(a1);

    m2 = matrix();
    m2.fromarray(a1);

    m3 = matrix();
    m3.init(3, 3, 0);

    m4 = matrix();
    m4.init(a2);

    console.log("Test equals matrix works correctly: " + m1.equals(m2));
    console.log("Test unequal matrix works correctly: " + !m1.equals(m3));
    console.log("Test equal with wrong dimensions works correctly: " + !m1.equals(m4));
}

function test_fromarray() {
    a1 = [[4, 3],
          [6, 3]];
    m1 = matrix();
    m1.fromarray(a1);
    m1.print();
}

function test() {
    test_equals();
}
test();
