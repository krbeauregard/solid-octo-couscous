function create_matrix()  { //(id) removed. Will generate both at once
    i_step = -1;  //resets counter on generate   button press
    j_step = -1;  //so the step funcion can be used many times
    k_step = 0;   //without having to reset the page.
    i_last = 0;   //Apparently, these should be reset as well...
    j_last = 0;
    k_last = 0;
    var mtxA = '';
    var mtxB = '';
    var mat = '';
    var num = 0;
    rowsA = document.getElementById('rowsA').value ;
    colsA = document.getElementById('colsA').value ;
    rowsB = document.getElementById('rowsB').value;
    colsB = document.getElementById('colsB').value;

    for (var i = 0; i<rowsA; i++){
      mtxA += '<tr>';
      for (var j = 0; j<colsA; j++){
        num = Math.floor(Math.random()*9);
        mtxA += "<td class='text-center'>["+num+"]</td>";
      }
      mtxA += '</tr>';
    }
    document.getElementById('matA').innerHTML = mtxA;
    console.log(mtxA);

    for (var i = 0; i<rowsB; i++){
      mtxB += '<tr>';
      for (var j = 0; j<colsB; j++){
        num = Math.floor(Math.random()*9);
        mtxB += "<td class='text-center'>["+num+"]</td>";
      }
      mtxB += '</tr>';
    }
    document.getElementById('matB').innerHTML = mtxB;
}

function multiply_matrix(a, b){
    var matA = a;
    var matB = b;
    var mytable = '';
    var i_max = document.getElementById('rowsA').value;
    var j_max = document.getElementById('colsB').value;
    var k_max = document.getElementById('colsA').value;
    var cellA = '';
    var cellB = '';
    var sum = 0;
    for (var i = 0; i < i_max; i++){
      mytable += '<tr>';
      for (var j = 0; j < j_max; j++){
        sum = 0;
        for (var k = 0; k < k_max; k++){
          cellA = document.getElementById('matA').rows[i].cells[k].innerHTML.substring(1,2);
          cellB = document.getElementById('matB').rows[k].cells[j].innerHTML.substring(1,2);
          sum += parseInt(cellA)*parseInt(cellB);
        }
        mytable += "<td class='text-center'>["+sum+"]</td>";
      }
      mytable += '</td>';
    }
    document.getElementById('matC').innerHTML = mytable;
}

var i_step = -1;
var j_step = -1;
var k_step = 0;
var i_last = 0;
var j_last = 0;
var k_last = 0;

var axb = '';
var sum = 0;

function step(a, b, c){
    var matA = a;
    var matB = b;
    var matC = c;
    var cellAIK = '';
    var cellBKJ = '';
    // var cellCIJ = '';
    var aik = '';
    var bkj = '';
    var cij = '';


    var row = document.getElementById('rowsA').value;
    var col = document.getElementById('colsB').value;
    var k = document.getElementById('colsA').value;

    if (i_step < row){
      k_step = (k_step%k);
      if (j_step == col){
        j_step = j_step%col;
      }
      if (i_step >= 0){
        document.getElementById('matA').rows[i_last].cells[k_last].className = 'highlight_none';
      }
      document.getElementById('kstep').innerHTML = 'k: '+(k_step+1) ;
      if (j_step >= 0){
        j_last > col ? j_last = col : j_last = j_step;
        document.getElementById('matB').rows[k_last].cells[j_last].className = 'highlight_none';
      }
      if (k_step >=0){
        document.getElementById('matC').rows[i_last].cells[j_last].className = 'highlight_none';
      }
      if (k_step%k == 0){
        j_step = (j_step%col);
        j_step++;
        axb = '';
        sum = 0;
        // j_last > col ? j_last = col : j_last = j_step;
        j_step = (j_step%col);

        document.getElementById('jstep').innerHTML = 'j: '+(j_step+1);
      }
      if (j_step%col == 0 && k_step%k == 0){
        i_step++;
        document.getElementById('istep').innerHTML = 'i: '+(i_step+1);
      }
      document.getElementById('matA').rows[i_step].cells[k_step].className = 'highlight_y';
      document.getElementById('matB').rows[k_step].cells[j_step].className = 'highlight_g';
      document.getElementById('matC').rows[i_step].cells[j_step].className = 'highlight_b';
      k_last > k ? k_last = k-1 : k_last = k_step;
      k_step++;
      cellAIK = document.getElementById('matA').rows[i_step].cells[(k_step)-1].innerHTML.substring(1,2);
      cellBKJ = document.getElementById('matB').rows[(k_step)-1].cells[j_step].innerHTML.substring(1,2);
      if (k_step >1 && k_step < col+1){
        axb += '+'
      }
      axb += '('+cellAIK+'*'+cellBKJ+')'
      sum += parseInt(cellAIK)*parseInt(cellBKJ);
      aik += 'A('+(i_step+1)+','+k_step+')='+cellAIK;
      bkj += 'B('+k_step+','+(j_step+1)+')='+cellBKJ;
      cij += 'C('+(i_step+1)+','+(j_step+1)+')='+axb+'='+sum;
      document.getElementById('cellA').innerHTML = aik;
      document.getElementById('cellB').innerHTML = bkj;
      document.getElementById('cellC').innerHTML = cij;

    }
    i_last = i_step;
}