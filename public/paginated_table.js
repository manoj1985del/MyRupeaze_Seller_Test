// Basic example
$(document).ready(function () {
    $('#dtBasicExample').DataTable({
      "paging": true, // false to disable pagination (or any other option)
      "pagingType": "simple"
    });
    $('.dataTables_length').addClass('bs-select');
  });