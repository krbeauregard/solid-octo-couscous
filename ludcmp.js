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
        n: mat.n,
        lu: mat.copy(),                     // Stores the decomposition
        aref: mat.copy(),
        indx: [],                           // Stores the permutation
        d: 1.0,                             // Used by det

        init: function(mat) {
            this.n = this.lu.m;
            var tiny = 1.0e-40,             // A small number
                imax = 0,
                big = 0,
                temp = 0,
                vv = [];                    // Stores the implicit scaling of each row
            this.d = 1.0;                   // No row interchanges yet

            /* Loop of the rows to get the implicit scaling info. */
            for (var i = 0; i < this.n; ++i) {
                big = 0.0;
                for (var j = 0; j < this.n; ++j) {
                    temp = Math.abs(this.lu.get(i, j));
                    if (temp > big) big = temp;
                }
                if (big === 0.0) {
                    console.log("Singular matrix in ludcmp");
                    return;
                }
                vv[i] = 1.0 / big;      // Save the scaling
            }

            /* This is the outermost kij loop. */
            for (var k = 0; k < this.n; ++k) {
                big = 0.0;  // Initialize for search for largest pivot element.
                for (var i = k; i < this.n; ++i) {
                    temp = vv[i] * Math.abs(this.lu.get(i, k));
                    /* Is the FOM for the pivot better than the best so far? */
                    if (temp > big) {
                        big = temp;
                        imax = i;
                    }
                }
                /* Do we need to interchange rows? */
                if (k !== imax) {
                    /* Yes, do so.. */
                    for (var j = 0; j < this.n; ++j) {
                        temp = this.lu.get(imax, j);
                        this.lu.set(imax, j, this.lu.get(k, j));
                        this.lu.set(k, j, temp);
                    }
                    this.d = (-1) * this.d; // and change the parity of d:w
                    vv[imax] = vv[k];       // and interchange the scale factor
                }
                this.indx[k] = imax;

                if (this.lu.get(k, k) === 0.0) this.lu.set(k, k, tiny);

                for (var i = k+1; i < this.n; ++i) {
                    /* Divide by the pivot element. */
                    temp = this.lu.get(i, k) / this.lu.get(k, k);
                    this.lu.set(i,k,this.lu.get(i,k)/this.lu.get(k,k));

                    /* Innermost loop reduce remaining submatrix */
                    for (j = k+1; j < this.n; ++j) {
                        this.lu.set(i,j, this.lu.get(i,j) - temp*this.lu.get(k,j));
                    }
                }
            }
        }, // end ludcmp init function

        det: function() {
            var dd = this.d;
            for (var i = 0; i < this.n; ++i) {
                dd = dd * this.lu.get(i, i);
            }
            return (Math.round(100*dd)) / 100;
        },

        /*********************************************************************
         * Solve the set n of linear equations A.x = b using the stored LU
         * decomposition of A.
         ********************************************************************/
        solve: function(b) {
            var ii = 0;
            var sum = 0;
            var n = this.n;
            var x = [];
            if (b.length !== this.n) {
                console.log("Error: lucdmp.solve bad sizes()");
                return;
            }
            for (var i = 0; i < n; ++i) x[i] = b[i];
            for (var i = 0; i < n; ++i) {
                var ip = this.indx[i];
                sum = x[ip];
                x[ip] = x[i];
                if (ii != 0)
                    for (var j = ii-1; j < i; ++j) sum -= this.lu.get(i,j)*x[j];
                else if (sum !== 0.0) ii = i+1;
                x[i] = sum;
            }
            for (var i = n-1; i >= 0; --i) {
                sum = x[i];
                for (var j = i+1; j < n; ++j) sum -= this.lu.get(i,j)*x[j];
                x[i] = sum / this.lu.get(i,i);
            }
            return x;
        },

        solvemn: function(b) {
            var m = b.n;
            var n = this.n;
            var x = matrix();
            x.init(b.m, b.n, 0);
            if (b.m !== n) {
                console.log("Error: ludcmp.solve bad sizes");
                return;
            }
            var xx = [];
            for (var j = 0; j < n; ++j) {
                for (var i = 0; i < n; ++i) xx[i] = b.get(i, j);
                xx = this.solve(xx);
                for (var i = 0; i < n; ++i) x.set(i, j, xx[i]);
            }
            return x;
        },

        inv: function() {
            var ainv = matrix();
            ainv.init(this.lu.m, this.lu.n, 0);
            ainv.print();
            for (var i = 0; i < this.lu.n; ++i) {
                for (var j = 0; j < this.lu.n; ++j) {
                    ainv.set(i, i, 1);
                }
            }
            ainv = this.solvemn(ainv);
            return ainv;
        },
    }
}
