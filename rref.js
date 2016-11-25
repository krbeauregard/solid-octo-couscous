function rref(A) {
    var rows = A.length;
    var columns = A[0].length;

    var lead = 0;
    for (var k = 0; k < rows; k++) {
        if (columns <= lead) return;

        var i = k;
        while (A[i][lead] === 0) {
            i++;
            if (rows === i) {
                i = k;
                lead++;
                if (columns === lead) return;
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
    return A;
}

function create_matrix_r(){
  var mat = '';
  var num = 0;
  rows = document.getElementById('rows').value;
  cols = document.getElementById('cols').value;

  for (var i=0; i<rows; i++){
    mat += '<tr>';
    for (var j=0; j<cols; j++){
      num = Math.floor(Math.random()*9);
      var coord = '';
      coord += "A"+i+j;
      mat += "<td class='col-md-1 text-center' id='";
      mat += coord + "'>"+num+"</td>";
    }
    mat += '</tr>';
  }
  document.getElementById('matA').innerHTML = mat;
}
