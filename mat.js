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

        /*********************************************************************
        * Given a matrix rhs (right hand side)
        * Return true if this matrix is equal to rhs.
        *********************************************************************/
        equals: function(rhs) {
            if (this.m !== rhs.m || this.n !== rhs.n) return false;
            for (var i = 0; i < rhs.m; ++i)
                for (var j = 0; j < rhs.n; ++j)
                    if (this.get(i, j) !== rhs.get(i, j)) return false;
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
                    str += Math.round(100*this.get(i, j)) / 100;
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
            if (m >= this.m || m < 0) {
                console.log("Error: trying to access outside the range of matrix row.");
                return false;
            }
            if (n >= this.n || n < 0) {
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
            this.init(m,n,0);
            if (m < 1 || n < 1) return;
            for (i = 0; i < m; ++i) {
                for (j = 0; j < n; ++j) {
                    val = Math.floor(Math.random() * (max-min) + min);
                    this.set(i,j,val);
                }
            }
        },

        /*********************************************************************
         * Given the id of a table body containing a matrix.
         * Construct a matrix object.
         *
         * It's important to retrieve the table body here and not the table
         * itself, otherwise the indexing will be all wack.
         ********************************************************************/
        from_html_table: function(id) {
            id += "body";
            var nrows = document.getElementById(id).rows.length;
            var ncols = document.getElementById(id).rows[0].cells.length;
            console.log(id+"nrows: "+nrows+"ncols"+ncols);
            this.init(nrows, ncols,0);
            // var mat = matrix();
            // mat.init(nrows, ncols, 0);
            for (r = 0; r < nrows; ++r) {
                for (c = 0; c < ncols; ++c) {
                    this.set(r, c, document.getElementById(id+r+""+c).innerHTML);
                }
            }
            // return mat;
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
            str += " <tbody class='matrix' id=\""+id+"body\">";
            for (i = 0; i < this.m; ++i) {
                str += "<tr>";
                for (j = 0; j < this.n; ++j) {
                    var elemid = id+"body"+i+""+j;
                    var rounded = Math.round(100*this.get(i, j))/ 100;
                    str += "<td id="+elemid+">"+rounded+"</td>";
                }
                str += "</tr>";
            }
            str += "</tbody></table>";
            // console.log(str);
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
            console.log("RREF:");
            newmat.print();
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
                        if (columns === lead) {
                            console.log("columns equals lead.");
                        }
                    }
                }
                var irow = A[i], krow = A[k];
                A[i] = krow, A[k] = irow;

                var val = A[k][lead];

                if (typeof val === 'undefined') {
                    var tmp = A[k];
                    A[k] = A[k+1];
                    A[k+1] = tmp;
                    console.log("cant' divide by zero");
                    return this.rref();
                }
                console.log("val: " + val);
                for (var j = 0; j < columns; j++) { A[k][j] /= val; }

                for (var i = 0; i < rows; i++) {
                    if (i === k) continue;
                    val = A[i][lead];
                    for (var j = 0; j < columns; j++) {
                        A[i][j] -= val * A[k][j];
                        if (isNaN(A[i][j])) {
                            console.log("Found a NaN.");
                            console.log("val: "+val+"    A["+k+"]["+j+"]="+A[i][j]);
                        }
                    }
                }
                lead++;
            }
            return newmat;
        }
    }
}

/*****************************************************************************
 * Multiply Function
 *****************************************************************************/

function multiply(matA, matB){
  var mA = matA;
  var mB = matB;
  var mC = matrix();
  var rowsA = mA.data.length;
  var colsB = mB.data[0].length;
  var colsA = mA.data[0].length;
  mC.init(rowsA, colsB, 0);
  var total = 0;
  for (var i = 0; i < rowsA; ++i){
    for (var j = 0; j < colsB; ++j){
      total = 0;
      for (var k = 0; k < colsA; ++k){
        total += mA.get(i,k)*mB.get(k,j);
      }
      mC.set(i,j,total);
    }
  }
  mC.print();
  return(mC);
}

/*****************************************************************************
 * Highlighting function that demonstrates process of matrix multiplication
 * Pretty much lifted from the previous implementation
 *****************************************************************************/
var i_step = -1;
var j_step = -1;
var k_step = 0;
var i_last = 0;
var j_last = 0;
var k_last = 0;
var axb = 0;
var sum = 0;

function step(matA, matB, matC){
  console.log('---');
  var mA = matA;
  var mB = matB;
  var mC = matC;
  var cellAIK = '';
  var cellBKJ = '';
  var aik = '';
  var bkj = '';
  var cij = '';
  console.log(mA);
  console.log(mA.valueof(data[0]));
  // var row = mA.data.length;
  // var col = mB.data[0].length;
  // var k = mA.data[0].length;
  //
  mC.print();
  return;

}

function get_td_by_id(id) {
    return document.getElementById(id);
}

/*****************************************************************************
 **************************** BEGIN TESTS ************************************
 * When you need to test a function just add a new function called
 * test_[yourfunction] then call it in the test function at the bottom.
 * This allows us to test quickly without using the browser.
 ****************************************************************************/
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

function test_within_bounds() {
    var a1 = [[1, 2],
          [3, 4]];
    var m = matrix();
    m.fromarray(a1);

    console.log("Test within bounds works correctly: " + m.within_bounds(0,0));
    console.log("Test outside bounds works correctly: " + !m.within_bounds(2,2));
}

function test_copy_by_value() {
    var a1 = [[1, 2],
          [3, 4]];
    var orig = matrix();
    orig.fromarray(a1);
    var dup = orig.copy();
    dup.set(1, 1, 0);
    console.log("Copy didn't change original: " + !orig.equals(dup));
    orig.print();
    dup.print();
}

function test_fromarray() {
    a1 = [[1, 0, 2],
          [2, 4, 1],
          [5, 4, 2]];
    m1 = matrix();
    m1.fromarray(a1);
    m1.print();
}

function test_rref() {
    a1 = [[0, 1, 2],
          [1, 2, 3],
          [4, 5, 6]];
    var m1 = matrix();
    m1.fromarray(a1);
    m1.print();
    var rref = matrix();
    rref = m1.rref();
    rref.print();
}
function test_ludcmp() {
    a1 = [[2, 3, 2, 1],
          [4, 8, 7, 3],
          [2, 1, 0, 2],
          [-4, -4, 1, 2]];
    m1 = matrix();
    m1.fromarray(a1);
    console.log("Before LUD: ");
    m1.print();
    lud = ludcmp(m1);
    lud.init();
    console.log("LUD matrix: ");
    lud.lu.print();
    console.log("LUD permutation: "+lud.indx);
}

function test_det() {
    a1 = [[1, 2],
          [3, 4]];
    m1 = matrix();
    m1.fromarray(a1);
    lud = ludcmp(m1);
    lud.init();
    console.log("Determinant: ", lud.det());
}

function test_inverse() {
    a1 = [[4, 7],
          [2, 6]];
    mat = matrix();
    mat.fromarray(a1);
    lud = ludcmp(mat);
    lud.init(mat);
    var inv = lud.inv();
    inv.print();
}

/* Driver for all the tests */
function test() {
    //test_equals();
    //test_fromarray();
    //test_within_bounds();
    //test_copy_by_value();
    //test_ludcmp();
    //test_det();
    //test_inverse();
    test_rref();
}
//test();
